"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { 
  Loader2, 
  Upload, 
  AlertCircle, 
  CheckCircle2, 
  Microscope,
  Bug,
  ArrowRight,
  Shield,
  Clock
} from "lucide-react"
import { storage, type AnalysisResult, type DashboardStats } from "@/lib/storage"
import { useTranslation } from "@/lib/i18n"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function AnalysisPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [showResultDialog, setShowResultDialog] = useState(false)
  const [currentResult, setCurrentResult] = useState<AnalysisResult | null>(null)
  const [recentAnalyses, setRecentAnalyses] = useState<AnalysisResult[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { t } = useTranslation()

  useEffect(() => {
    loadRecentAnalyses()
  }, [])

  const loadRecentAnalyses = () => {
    setRecentAnalyses(storage.getRecentAnalyses(5))
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
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const result = await storage.saveAnalysis(selectedFile)
      setCurrentResult(result)
      setShowResultDialog(true)
      loadRecentAnalyses()
      
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'positive': return 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/20 dark:text-red-400 dark:border-red-800/30'
      case 'negative': return 'bg-green-50 text-green-700 border-green-200 dark:bg-green-950/20 dark:text-green-400 dark:border-green-800/30'
      default: return 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950/20 dark:text-yellow-400 dark:border-yellow-800/30'
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
    <>
      {/* Analysis Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        <div className="lg:col-span-2">
          <Card className="overflow-hidden border-border/40 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 border-b border-border/40">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary/10 rounded-full">
                  <Microscope className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg sm:text-xl text-foreground">AI-Powered Blood Analysis</CardTitle>
                  <CardDescription className="text-sm sm:text-base text-muted-foreground">
                    Upload a microscopic blood smear image for instant malaria detection
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-8">
              <div
                className={`border-2 border-dashed rounded-2xl p-6 sm:p-12 text-center cursor-pointer transition-all duration-300 ${
                  previewUrl 
                    ? 'border-primary/30 bg-primary/5' 
                    : 'border-muted-foreground/30 hover:border-primary/50 hover:bg-primary/5'
                }`}
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
                  <div className="space-y-4 sm:space-y-6">
                    <div className="relative inline-block">
                      <img
                        src={previewUrl}
                        alt="Blood smear preview"
                        className="max-h-64 sm:max-h-80 max-w-full mx-auto rounded-xl shadow-lg border border-border/40"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl" />
                    </div>
                    <div className="bg-muted/50 rounded-lg p-3 inline-block">
                      <p className="text-sm font-medium text-foreground">
                        {selectedFile?.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {Math.round((selectedFile?.size || 0) / 1024)} KB • Ready for analysis
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 sm:space-y-6">
                    <div className="relative">
                      <Upload className="h-12 sm:h-16 w-12 sm:w-16 mx-auto text-primary/60" />
                      <div className="absolute inset-0 bg-primary/10 rounded-full blur-xl" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-lg sm:text-xl font-semibold text-primary">Drop your microscopic image here</p>
                      <p className="text-muted-foreground text-sm sm:text-base">or click to browse your files</p>
                    </div>
                    <div className="flex flex-wrap justify-center gap-2 text-xs text-muted-foreground">
                      <span className="bg-muted rounded-full px-3 py-1">JPG</span>
                      <span className="bg-muted rounded-full px-3 py-1">PNG</span>
                      <span className="bg-muted rounded-full px-3 py-1">TIFF</span>
                      <span className="bg-muted rounded-full px-3 py-1">Up to 10MB</span>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="p-4 sm:p-8 pt-0">
              <Button 
                onClick={handleAnalyze} 
                disabled={!selectedFile || isAnalyzing} 
                className="w-full h-12 sm:h-14 text-base sm:text-lg font-semibold bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 shadow-lg"
                size="lg"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                    <span>Analyzing Sample...</span>
                  </>
                ) : (
                  <>
                    <Microscope className="mr-3 h-5 w-5" />
                    <span>Start AI Analysis</span>
                    <ArrowRight className="ml-3 h-5 w-5" />
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg text-foreground">Sample Guidelines</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-3 p-3 bg-background/50 rounded-lg">
                <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-foreground">High Resolution</p>
                  <p className="text-sm text-muted-foreground">Clear, well-focused microscopic images</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-3 bg-background/50 rounded-lg">
                <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-foreground">100x Magnification</p>
                  <p className="text-sm text-muted-foreground">Oil immersion lens recommended</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-3 bg-background/50 rounded-lg">
                <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-foreground">Proper Staining</p>
                  <p className="text-sm text-muted-foreground">Giemsa or Wright stain preferred</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="border-border/40">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <CardTitle className="text-lg text-foreground">Recent Results</CardTitle>
                </div>
                {recentAnalyses.length > 0 && (
                  <Badge variant="outline" className="text-xs border-border/40">
                    {recentAnalyses.length} recent
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentAnalyses.slice(0, 5).map((analysis) => (
                <div key={analysis.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors border border-border/40">
                  <div className="flex items-center space-x-3">
                    <div className={`p-1.5 rounded-full ${getStatusColor(analysis.status)}`}>
                      {getStatusIcon(analysis.status)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {new Date(analysis.timestamp).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(analysis.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                  <Badge className={`${getStatusColor(analysis.status)} text-xs`}>
                    {analysis.status}
                  </Badge>
                </div>
              ))}
              {recentAnalyses.length === 0 && (
                <div className="text-center py-8">
                  <Microscope className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">No recent analyses</p>
                  <p className="text-xs text-muted-foreground">Upload your first sample to get started</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Result Dialog */}
      <Dialog open={showResultDialog} onOpenChange={setShowResultDialog}>
        <DialogContent className="max-w-sm sm:max-w-md mx-4 border-border/40">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-foreground">
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
                      <span className="text-sm font-medium text-foreground">{currentResult.parasiteType}</span>
                    </div>
                  )}
                  {currentResult.parasiteDensity && (
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Density:</span>
                      <span className="text-sm font-medium text-foreground">{currentResult.parasiteDensity}/μL</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Confidence:</span>
                    <span className="text-sm font-medium text-foreground">{(currentResult.confidence * 100).toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Cells Analyzed:</span>
                    <span className="text-sm font-medium text-foreground">{currentResult.cellsAnalyzed}</span>
                  </div>
                </div>
                
                {currentResult.status === 'positive' && (
                  <Alert className="border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-800/30">
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
    </>
  )
}