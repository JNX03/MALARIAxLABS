"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { 
  Loader2, 
  Upload, 
  AlertCircle, 
  CheckCircle2, 
  Camera,
  Activity,
  TrendingUp,
  TrendingDown,
  FileText,
  Download,
  Microscope,
  Bug,
  Clock,
  Calendar,
  BarChart3,
  LogOut,
  User,
  Trash2
} from "lucide-react"
import Link from "next/link"
import { storage, type AnalysisResult, type DashboardStats } from "@/lib/storage"

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("analyze")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [showResultDialog, setShowResultDialog] = useState(false)
  const [currentResult, setCurrentResult] = useState<AnalysisResult | null>(null)
  const [recentAnalyses, setRecentAnalyses] = useState<AnalysisResult[]>([])
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [user, setUser] = useState(storage.getCurrentUser())
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push("/auth/login")
      return
    }
    loadDashboardData()
  }, [user, router])

  const loadDashboardData = () => {
    setRecentAnalyses(storage.getRecentAnalyses(10))
    setStats(storage.getDashboardStats())
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setSelectedFile(file)

    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string)
      }
      reader.readAsDataURL(file)
    } else {
      setPreviewUrl(null)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0] || null
    setSelectedFile(file)

    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  const handleAnalyze = async () => {
    if (!selectedFile) return

    setIsAnalyzing(true)

    try {
      // Simulate analysis with delay
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const result = await storage.saveAnalysis(selectedFile)
      setCurrentResult(result)
      setShowResultDialog(true)
      loadDashboardData()
      
      // Clear the form
      setSelectedFile(null)
      setPreviewUrl(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    } catch (error) {
      console.error("Analysis failed:", error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleLogout = () => {
    storage.signOut()
    router.push("/")
  }

  const handleExport = () => {
    storage.exportAnalysesToCSV()
  }

  const handleDeleteAnalysis = (id: string) => {
    if (confirm("Are you sure you want to delete this analysis?")) {
      storage.deleteAnalysis(id)
      loadDashboardData()
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'positive': return 'text-red-600 bg-red-100'
      case 'negative': return 'text-green-600 bg-green-100'
      default: return 'text-yellow-600 bg-yellow-100'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'positive': return <Bug className="h-4 w-4" />
      case 'negative': return <CheckCircle2 className="h-4 w-4" />
      default: return <AlertCircle className="h-4 w-4" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      {/* Navigation */}
      <nav className="bg-background/95 backdrop-blur-md shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                <Microscope className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold">Malaria Detection Lab</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">{user?.name}</span>
              </div>
              <Button onClick={handleLogout} variant="ghost" size="sm">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto py-8 px-4 max-w-7xl">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Analyses</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalTests || 0}</div>
              <p className="text-xs text-muted-foreground">
                {stats?.testsThisMonth || 0} this month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Positive Cases</CardTitle>
              <TrendingUp className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats?.positiveTests || 0}</div>
              <p className="text-xs text-muted-foreground">
                {stats?.totalTests ? ((stats.positiveTests / stats.totalTests) * 100).toFixed(1) : 0}% of total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Negative Cases</CardTitle>
              <TrendingDown className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats?.negativeTests || 0}</div>
              <p className="text-xs text-muted-foreground">
                {stats?.totalTests ? ((stats.negativeTests / stats.totalTests) * 100).toFixed(1) : 0}% of total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Confidence</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats?.averageConfidence ? (stats.averageConfidence * 100).toFixed(1) : 0}%
              </div>
              <p className="text-xs text-muted-foreground">
                Model accuracy
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="analyze">New Analysis</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>

          {/* New Analysis Tab */}
          <TabsContent value="analyze" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Blood Sample Analysis</CardTitle>
                    <CardDescription>
                      Upload a microscopic image of a blood smear for malaria detection
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div
                      className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:bg-muted/50 transition-colors"
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                      onClick={triggerFileInput}
                    >
                      <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                      {previewUrl ? (
                        <div className="space-y-4">
                          <img
                            src={previewUrl}
                            alt="Preview"
                            className="max-h-[400px] max-w-full mx-auto rounded-md"
                          />
                          <p className="text-sm text-muted-foreground">
                            {selectedFile?.name} ({Math.round((selectedFile?.size || 0) / 1024)} KB)
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <Upload className="h-12 w-12 mx-auto text-muted-foreground" />
                          <div>
                            <p className="text-lg font-medium">Drop your image here</p>
                            <p className="text-sm text-muted-foreground">or click to browse</p>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Supports JPG, PNG, TIFF up to 10MB
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      onClick={handleAnalyze} 
                      disabled={!selectedFile || isAnalyzing} 
                      className="w-full"
                      size="lg"
                    >
                      {isAnalyzing ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Analyzing Sample...
                        </>
                      ) : (
                        <>
                          <Microscope className="mr-2 h-4 w-4" />
                          Analyze Blood Sample
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              </div>

              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Sample Guidelines</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-start space-x-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Image Quality</p>
                        <p className="text-xs text-muted-foreground">Clear, well-lit microscopic images</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Magnification</p>
                        <p className="text-xs text-muted-foreground">100x oil immersion preferred</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Staining</p>
                        <p className="text-xs text-muted-foreground">Giemsa or Wright stain</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Recent Results</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {recentAnalyses.slice(0, 3).map((analysis) => (
                      <div key={analysis.id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(analysis.status)}
                          <span className="text-sm">
                            {new Date(analysis.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                        <Badge className={getStatusColor(analysis.status)}>
                          {analysis.status}
                        </Badge>
                      </div>
                    ))}
                    {recentAnalyses.length === 0 && (
                      <p className="text-sm text-muted-foreground">No analyses yet</p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Analysis History</CardTitle>
                  <CardDescription>View and manage all your past analyses</CardDescription>
                </div>
                <Button onClick={handleExport} variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
              </CardHeader>
              <CardContent>
                {recentAnalyses.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Parasite Type</TableHead>
                        <TableHead>Density</TableHead>
                        <TableHead>Confidence</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentAnalyses.map((analysis) => (
                        <TableRow key={analysis.id}>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Calendar className="h-3 w-3 text-muted-foreground" />
                              <span className="text-sm">
                                {new Date(analysis.timestamp).toLocaleString()}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(analysis.status)}>
                              {analysis.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm">
                            {analysis.parasiteType || '-'}
                          </TableCell>
                          <TableCell className="text-sm">
                            {analysis.parasiteDensity ? `${analysis.parasiteDensity}/μL` : '-'}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Progress value={analysis.confidence * 100} className="w-16" />
                              <span className="text-xs text-muted-foreground">
                                {(analysis.confidence * 100).toFixed(0)}%
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Button
                              onClick={() => handleDeleteAnalysis(analysis.id)}
                              variant="ghost"
                              size="sm"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8">
                    <Microscope className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No analyses yet</p>
                    <p className="text-sm text-muted-foreground">Upload your first blood sample to get started</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Insights Tab */}
          <TabsContent value="insights" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Detection Summary</CardTitle>
                  <CardDescription>Overview of your malaria detection results</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Positive Rate</span>
                        <span className="text-sm text-muted-foreground">
                          {stats?.totalTests ? ((stats.positiveTests / stats.totalTests) * 100).toFixed(1) : 0}%
                        </span>
                      </div>
                      <Progress 
                        value={stats?.totalTests ? (stats.positiveTests / stats.totalTests) * 100 : 0} 
                        className="h-2"
                      />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Negative Rate</span>
                        <span className="text-sm text-muted-foreground">
                          {stats?.totalTests ? ((stats.negativeTests / stats.totalTests) * 100).toFixed(1) : 0}%
                        </span>
                      </div>
                      <Progress 
                        value={stats?.totalTests ? (stats.negativeTests / stats.totalTests) * 100 : 0} 
                        className="h-2 [&>div]:bg-green-600"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Common Parasites</CardTitle>
                  <CardDescription>Most frequently detected parasite types</CardDescription>
                </CardHeader>
                <CardContent>
                  {stats?.mostCommonParasite ? (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{stats.mostCommonParasite}</span>
                        <Badge>Most Common</Badge>
                      </div>
                      <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          Early detection and treatment of {stats.mostCommonParasite} is crucial for patient recovery.
                        </AlertDescription>
                      </Alert>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No positive cases detected yet</p>
                  )}
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Activity Timeline</CardTitle>
                <CardDescription>Your testing activity over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold">{stats?.testsThisWeek || 0}</p>
                    <p className="text-xs text-muted-foreground">This Week</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">{stats?.testsThisMonth || 0}</p>
                    <p className="text-xs text-muted-foreground">This Month</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">{stats?.totalTests || 0}</p>
                    <p className="text-xs text-muted-foreground">All Time</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">
                      {stats?.averageConfidence ? (stats.averageConfidence * 100).toFixed(0) : 0}%
                    </p>
                    <p className="text-xs text-muted-foreground">Avg Confidence</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Result Dialog */}
      <Dialog open={showResultDialog} onOpenChange={setShowResultDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {currentResult?.status === 'positive' ? (
                <>
                  <Bug className="h-5 w-5 text-red-600" />
                  Malaria Detected
                </>
              ) : currentResult?.status === 'negative' ? (
                <>
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  No Malaria Detected
                </>
              ) : (
                <>
                  <AlertCircle className="h-5 w-5 text-yellow-600" />
                  Inconclusive Result
                </>
              )}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {currentResult && (
              <>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Status:</span>
                    <Badge className={getStatusColor(currentResult.status)}>
                      {currentResult.status}
                    </Badge>
                  </div>
                  {currentResult.parasiteType && (
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Parasite Type:</span>
                      <span className="text-sm font-medium">{currentResult.parasiteType}</span>
                    </div>
                  )}
                  {currentResult.parasiteDensity && (
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Density:</span>
                      <span className="text-sm font-medium">{currentResult.parasiteDensity}/μL</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Confidence:</span>
                    <span className="text-sm font-medium">{(currentResult.confidence * 100).toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Cells Analyzed:</span>
                    <span className="text-sm font-medium">{currentResult.cellsAnalyzed}</span>
                  </div>
                </div>
                
                {currentResult.status === 'positive' && (
                  <Alert className="border-red-200 bg-red-50 dark:bg-red-950/20">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-800 dark:text-red-200">
                      Immediate medical attention recommended. Consult with a healthcare provider for treatment options.
                    </AlertDescription>
                  </Alert>
                )}
              </>
            )}
          </div>
          <DialogFooter>
            <Button onClick={() => setShowResultDialog(false)} className="w-full">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}