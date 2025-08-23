// Local Storage Service for Offline Functionality

export interface User {
  id: string;
  email: string;
  name: string;
  password: string; // In production, this should be hashed
  createdAt: string;
}

export interface AnalysisResult {
  id: string;
  userId: string;
  imageUrl: string;
  fileName: string;
  timestamp: string;
  status: 'positive' | 'negative' | 'inconclusive';
  parasiteType?: string;
  parasiteDensity?: number; // parasites per μL
  stage?: string;
  confidence: number;
  cellsAnalyzed: number;
  infectedCells: number;
  notes?: string;
}

export interface DashboardStats {
  totalTests: number;
  positiveTests: number;
  negativeTests: number;
  inconclusiveTests: number;
  averageConfidence: number;
  mostCommonParasite?: string;
  testsThisWeek: number;
  testsThisMonth: number;
}

class LocalStorageService {
  private readonly KEYS = {
    USERS: 'malaria_users',
    CURRENT_USER: 'malaria_current_user',
    ANALYSES: 'malaria_analyses',
  };

  private isClient(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }

  // User Management
  signUp(email: string, name: string, password: string): User {
    if (!this.isClient()) throw new Error('Storage not available');
    
    const users = this.getAllUsers();
    
    if (users.find(u => u.email === email)) {
      throw new Error('Email already registered');
    }

    const newUser: User = {
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      email,
      name,
      password, // In production, hash this
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    localStorage.setItem(this.KEYS.USERS, JSON.stringify(users));
    this.setCurrentUser(newUser);
    
    return newUser;
  }

  signIn(email: string, password: string): User {
    if (!this.isClient()) throw new Error('Storage not available');
    
    const users = this.getAllUsers();
    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
      throw new Error('Invalid email or password');
    }

    this.setCurrentUser(user);
    // Set auth cookie for middleware
    document.cookie = `malaria_auth=true; path=/; max-age=${60 * 60 * 24 * 7}`; // 7 days
    return user;
  }

  signOut(): void {
    if (!this.isClient()) return;
    localStorage.removeItem(this.KEYS.CURRENT_USER);
    // Clear auth cookie
    document.cookie = 'malaria_auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  }

  getCurrentUser(): User | null {
    if (!this.isClient()) return null;
    const userStr = localStorage.getItem(this.KEYS.CURRENT_USER);
    return userStr ? JSON.parse(userStr) : null;
  }

  private setCurrentUser(user: User): void {
    if (!this.isClient()) return;
    localStorage.setItem(this.KEYS.CURRENT_USER, JSON.stringify(user));
  }

  private getAllUsers(): User[] {
    if (!this.isClient()) return [];
    const usersStr = localStorage.getItem(this.KEYS.USERS);
    return usersStr ? JSON.parse(usersStr) : [];
  }

  // Analysis Management
  async saveAnalysis(
    imageFile: File,
    analysisResult?: Partial<AnalysisResult>
  ): Promise<AnalysisResult> {
    const user = this.getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    // Convert image to base64
    const imageUrl = await this.fileToBase64(imageFile);

    // Simulate analysis if not provided
    const mockResult = this.generateMockAnalysis();
    
    const analysis: AnalysisResult = {
      id: `analysis_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: user.id,
      imageUrl,
      fileName: imageFile.name,
      timestamp: new Date().toISOString(),
      status: analysisResult?.status || mockResult.status,
      parasiteType: analysisResult?.parasiteType || mockResult.parasiteType,
      parasiteDensity: analysisResult?.parasiteDensity || mockResult.parasiteDensity,
      stage: analysisResult?.stage || mockResult.stage,
      confidence: analysisResult?.confidence || mockResult.confidence,
      cellsAnalyzed: analysisResult?.cellsAnalyzed || mockResult.cellsAnalyzed,
      infectedCells: analysisResult?.infectedCells || mockResult.infectedCells,
      notes: analysisResult?.notes,
    };

    const analyses = this.getAllAnalyses();
    analyses.push(analysis);
    if (this.isClient()) {
      localStorage.setItem(this.KEYS.ANALYSES, JSON.stringify(analyses));
    }

    return analysis;
  }

  getUserAnalyses(): AnalysisResult[] {
    const user = this.getCurrentUser();
    if (!user) return [];

    const allAnalyses = this.getAllAnalyses();
    return allAnalyses
      .filter(a => a.userId === user.id)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  getAnalysisById(id: string): AnalysisResult | null {
    const analyses = this.getUserAnalyses();
    return analyses.find(a => a.id === id) || null;
  }

  getRecentAnalyses(limit: number = 5): AnalysisResult[] {
    return this.getUserAnalyses().slice(0, limit);
  }

  getDashboardStats(): DashboardStats {
    const analyses = this.getUserAnalyses();
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const positiveTests = analyses.filter(a => a.status === 'positive');
    const negativeTests = analyses.filter(a => a.status === 'negative');
    const inconclusiveTests = analyses.filter(a => a.status === 'inconclusive');

    const parasiteTypes = positiveTests
      .map(a => a.parasiteType)
      .filter(Boolean) as string[];
    
    const parasiteFrequency = parasiteTypes.reduce((acc, type) => {
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const mostCommonParasite = Object.entries(parasiteFrequency)
      .sort(([, a], [, b]) => b - a)[0]?.[0];

    const totalConfidence = analyses.reduce((sum, a) => sum + a.confidence, 0);

    return {
      totalTests: analyses.length,
      positiveTests: positiveTests.length,
      negativeTests: negativeTests.length,
      inconclusiveTests: inconclusiveTests.length,
      averageConfidence: analyses.length > 0 ? totalConfidence / analyses.length : 0,
      mostCommonParasite,
      testsThisWeek: analyses.filter(a => new Date(a.timestamp) > weekAgo).length,
      testsThisMonth: analyses.filter(a => new Date(a.timestamp) > monthAgo).length,
    };
  }

  deleteAnalysis(id: string): void {
    if (!this.isClient()) return;
    const allAnalyses = this.getAllAnalyses();
    const filtered = allAnalyses.filter(a => a.id !== id);
    localStorage.setItem(this.KEYS.ANALYSES, JSON.stringify(filtered));
  }

  exportAnalysesToCSV(): void {
    const analyses = this.getUserAnalyses();
    const headers = [
      'Date',
      'Time',
      'Status',
      'Parasite Type',
      'Density (per μL)',
      'Stage',
      'Confidence (%)',
      'Cells Analyzed',
      'Infected Cells',
      'File Name',
    ];

    const rows = analyses.map(a => [
      new Date(a.timestamp).toLocaleDateString(),
      new Date(a.timestamp).toLocaleTimeString(),
      a.status,
      a.parasiteType || '-',
      a.parasiteDensity?.toString() || '-',
      a.stage || '-',
      (a.confidence * 100).toFixed(1),
      a.cellsAnalyzed.toString(),
      a.infectedCells.toString(),
      a.fileName,
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `malaria-analyses-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  private getAllAnalyses(): AnalysisResult[] {
    if (!this.isClient()) return [];
    const analysesStr = localStorage.getItem(this.KEYS.ANALYSES);
    return analysesStr ? JSON.parse(analysesStr) : [];
  }

  private async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  }

  private generateMockAnalysis(): Partial<AnalysisResult> {
    const random = Math.random();
    let status: 'positive' | 'negative' | 'inconclusive';
    let parasiteType: string | undefined;
    let parasiteDensity: number | undefined;
    let stage: string | undefined;
    let infectedCells: number;
    
    const cellsAnalyzed = Math.floor(Math.random() * 500) + 500; // 500-1000 cells

    if (random < 0.7) {
      // 70% negative
      status = 'negative';
      infectedCells = 0;
    } else if (random < 0.95) {
      // 25% positive
      status = 'positive';
      const parasiteTypes = [
        'Plasmodium falciparum',
        'Plasmodium vivax',
        'Plasmodium malariae',
        'Plasmodium ovale',
        'Plasmodium knowlesi',
      ];
      parasiteType = parasiteTypes[Math.floor(Math.random() * parasiteTypes.length)];
      
      const stages = ['Ring', 'Trophozoite', 'Schizont', 'Gametocyte'];
      stage = stages[Math.floor(Math.random() * stages.length)];
      
      // Density: 50-50,000 parasites per μL
      parasiteDensity = Math.floor(Math.random() * 49950) + 50;
      
      // Infected cells: 1-10% of analyzed cells
      infectedCells = Math.floor(cellsAnalyzed * (Math.random() * 0.09 + 0.01));
    } else {
      // 5% inconclusive
      status = 'inconclusive';
      infectedCells = Math.floor(Math.random() * 5);
    }

    const confidence = 0.75 + Math.random() * 0.24; // 75-99% confidence

    return {
      status,
      parasiteType,
      parasiteDensity,
      stage,
      confidence,
      cellsAnalyzed,
      infectedCells,
    };
  }

  // Clear all data (for testing/reset)
  clearAllData(): void {
    if (!this.isClient()) return;
    localStorage.removeItem(this.KEYS.USERS);
    localStorage.removeItem(this.KEYS.CURRENT_USER);
    localStorage.removeItem(this.KEYS.ANALYSES);
  }

  // Initialize demo account if no users exist
  initializeDemoAccount(): void {
    if (!this.isClient()) return;
    const users = this.getAllUsers();
    if (users.length === 0) {
      const demoUser: User = {
        id: 'demo_user',
        email: 'demo@malaria.health',
        name: 'Demo User',
        password: 'demo123',
        createdAt: new Date().toISOString(),
      };
      users.push(demoUser);
      localStorage.setItem(this.KEYS.USERS, JSON.stringify(users));
    }
  }
}

export const storage = new LocalStorageService();

// Initialize demo account on first load
if (typeof window !== 'undefined') {
  storage.initializeDemoAccount();
}