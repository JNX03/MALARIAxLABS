export interface User {
  id: string;
  email: string;
  name: string;
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
  parasiteCount?: number;
  confidence: number;
  notes?: string;
}

export interface Statistics {
  totalAnalyses: number;
  positiveCount: number;
  negativeCount: number;
  inconclusiveCount: number;
  lastAnalysisDate?: string;
  weeklyAnalyses: number;
  monthlyAnalyses: number;
}

const STORAGE_KEYS = {
  CURRENT_USER: 'malaria_current_user',
  USERS: 'malaria_users',
  ANALYSES: 'malaria_analyses',
  STATISTICS: 'malaria_statistics'
};

// User Management
export const createUser = (email: string, name: string, password: string): User => {
  const users = getUsers();
  const existingUser = users.find(u => u.email === email);
  
  if (existingUser) {
    throw new Error('User already exists');
  }
  
  const newUser: User = {
    id: Date.now().toString(),
    email,
    name,
    createdAt: new Date().toISOString()
  };
  
  // Store user with password (in real app, this should be hashed)
  const userWithPassword = { ...newUser, password };
  users.push(userWithPassword);
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  
  return newUser;
};

export const loginUser = (email: string, password: string): User | null => {
  const users = getUsers();
  const user = users.find((u: any) => u.email === email && u.password === password);
  
  if (user) {
    const { password: _, ...userWithoutPassword } = user as any;
    setCurrentUser(userWithoutPassword);
    return userWithoutPassword;
  }
  
  return null;
};

export const getCurrentUser = (): User | null => {
  const userStr = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
  return userStr ? JSON.parse(userStr) : null;
};

export const setCurrentUser = (user: User | null) => {
  if (user) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  }
};

export const logoutUser = () => {
  setCurrentUser(null);
};

const getUsers = (): any[] => {
  const usersStr = localStorage.getItem(STORAGE_KEYS.USERS);
  return usersStr ? JSON.parse(usersStr) : [];
};

// Analysis Management
export const saveAnalysis = (
  imageFile: File,
  status: 'positive' | 'negative' | 'inconclusive',
  parasiteType?: string,
  parasiteCount?: number,
  confidence: number = 0.95
): AnalysisResult => {
  const user = getCurrentUser();
  if (!user) throw new Error('No user logged in');
  
  const reader = new FileReader();
  reader.readAsDataURL(imageFile);
  
  return new Promise<AnalysisResult>((resolve) => {
    reader.onloadend = () => {
      const analysis: AnalysisResult = {
        id: Date.now().toString(),
        userId: user.id,
        imageUrl: reader.result as string,
        fileName: imageFile.name,
        timestamp: new Date().toISOString(),
        status,
        parasiteType,
        parasiteCount,
        confidence
      };
      
      const analyses = getAnalyses();
      analyses.push(analysis);
      localStorage.setItem(STORAGE_KEYS.ANALYSES, JSON.stringify(analyses));
      
      updateStatistics();
      resolve(analysis);
    };
  }) as any;
};

export const getAnalyses = (): AnalysisResult[] => {
  const analysesStr = localStorage.getItem(STORAGE_KEYS.ANALYSES);
  const analyses = analysesStr ? JSON.parse(analysesStr) : [];
  const user = getCurrentUser();
  
  if (!user) return [];
  
  return analyses.filter((a: AnalysisResult) => a.userId === user.id);
};

export const getRecentAnalyses = (limit: number = 5): AnalysisResult[] => {
  const analyses = getAnalyses();
  return analyses
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, limit);
};

export const getAnalysisById = (id: string): AnalysisResult | null => {
  const analyses = getAnalyses();
  return analyses.find(a => a.id === id) || null;
};

export const deleteAnalysis = (id: string) => {
  const allAnalyses = JSON.parse(localStorage.getItem(STORAGE_KEYS.ANALYSES) || '[]');
  const filtered = allAnalyses.filter((a: AnalysisResult) => a.id !== id);
  localStorage.setItem(STORAGE_KEYS.ANALYSES, JSON.stringify(filtered));
  updateStatistics();
};

// Statistics Management
export const getStatistics = (): Statistics => {
  const analyses = getAnalyses();
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  
  const weeklyAnalyses = analyses.filter(a => new Date(a.timestamp) > weekAgo).length;
  const monthlyAnalyses = analyses.filter(a => new Date(a.timestamp) > monthAgo).length;
  
  return {
    totalAnalyses: analyses.length,
    positiveCount: analyses.filter(a => a.status === 'positive').length,
    negativeCount: analyses.filter(a => a.status === 'negative').length,
    inconclusiveCount: analyses.filter(a => a.status === 'inconclusive').length,
    lastAnalysisDate: analyses.length > 0 ? analyses[analyses.length - 1].timestamp : undefined,
    weeklyAnalyses,
    monthlyAnalyses
  };
};

const updateStatistics = () => {
  const stats = getStatistics();
  localStorage.setItem(STORAGE_KEYS.STATISTICS, JSON.stringify(stats));
};

// Export functionality
export const exportAnalysesToCSV = () => {
  const analyses = getAnalyses();
  const headers = ['Date', 'Status', 'Parasite Type', 'Parasite Count', 'Confidence', 'File Name'];
  const rows = analyses.map(a => [
    new Date(a.timestamp).toLocaleString(),
    a.status,
    a.parasiteType || 'N/A',
    a.parasiteCount?.toString() || 'N/A',
    (a.confidence * 100).toFixed(1) + '%',
    a.fileName
  ]);
  
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `malaria-analyses-${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  window.URL.revokeObjectURL(url);
};

// Mock analysis for demo
export const performMockAnalysis = (imageFile: File): Promise<AnalysisResult> => {
  // Simulate analysis delay
  return new Promise((resolve) => {
    setTimeout(() => {
      // Random analysis result for demo
      const statuses: Array<'positive' | 'negative' | 'inconclusive'> = ['positive', 'negative', 'negative', 'negative', 'inconclusive'];
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      
      const parasiteTypes = ['Plasmodium falciparum', 'Plasmodium vivax', 'Plasmodium malariae', 'Plasmodium ovale'];
      const parasiteType = status === 'positive' ? parasiteTypes[Math.floor(Math.random() * parasiteTypes.length)] : undefined;
      const parasiteCount = status === 'positive' ? Math.floor(Math.random() * 5000) + 100 : undefined;
      const confidence = 0.85 + Math.random() * 0.14; // 85-99% confidence
      
      saveAnalysis(imageFile, status, parasiteType, parasiteCount, confidence).then(resolve);
    }, 3000);
  });
};