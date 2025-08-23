"use client"

import { useState, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Upload,
  Play,
  Pause,
  Square,
  Download,
  FileImage,
  CheckCircle2,
  AlertCircle,
  Clock,
  Trash2,
  Eye,
  RotateCcw,
  Zap,
  BarChart3,
  Users,
  Bug
} from "lucide-react"
import { storage } from "@/lib/storage"

interface BatchFile {
  id: string
  file: File
  name: string
  size: number
  status: 'pending' | 'processing' | 'completed' | 'error'
  result?: {
    status: 'positive' | 'negative' | 'inconclusive'
    confidence: number
    parasiteType?: string
    parasiteDensity?: number
  }
  error?: string
  processingTime?: number
}

interface BatchJob {
  id: string
  name: string
  files: BatchFile[]
  status: 'idle' | 'running' | 'paused' | 'completed' | 'error'
  startTime?: Date
  endTime?: Date
  progress: number
  settings: {
    autoSave: boolean
    confidenceThreshold: number
    parallelProcessing: boolean
    maxConcurrent: number
  }
}

export default function BatchProcessor() {
  const [jobs, setJobs] = useState<BatchJob[]>([])
  const [currentJob, setCurrentJob] = useState<BatchJob | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const createNewJob = useCallback(() => {
    const newJob: BatchJob = {
      id: `batch_${Date.now()}`,
      name: `Batch ${jobs.length + 1}`,
      files: [],
      status: 'idle',
      progress: 0,
      settings: {
        autoSave: true,
        confidenceThreshold: 0.8,
        parallelProcessing: true,
        maxConcurrent: 3
      }
    }
    setJobs(prev => [...prev, newJob])
    setCurrentJob(newJob)
    return newJob
  }, [jobs.length])

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    if (!files.length) return

    let job = currentJob
    if (!job) {
      job = createNewJob()
    }

    const batchFiles: BatchFile[] = files.map((file, index) => ({
      id: `file_${Date.now()}_${index}`,
      file,
      name: file.name,
      size: file.size,
      status: 'pending'
    }))

    setJobs(prev => prev.map(j => 
      j.id === job!.id 
        ? { ...j, files: [...j.files, ...batchFiles] }
        : j
    ))

    setCurrentJob(prev => prev ? { ...prev, files: [...prev.files, ...batchFiles] } : null)
  }

  const simulateAnalysis = async (file: BatchFile): Promise<BatchFile> => {
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, Math.random() * 3000 + 1000))
    
    const random = Math.random()
    let status: 'positive' | 'negative' | 'inconclusive'
    let parasiteType: string | undefined
    let parasiteDensity: number | undefined
    
    if (random < 0.3) {
      status = 'positive'
      const types = ['Plasmodium falciparum', 'Plasmodium vivax', 'Plasmodium malariae']
      parasiteType = types[Math.floor(Math.random() * types.length)]
      parasiteDensity = Math.floor(Math.random() * 10000) + 100
    } else if (random < 0.9) {
      status = 'negative'
    } else {
      status = 'inconclusive'
    }

    return {
      ...file,
      status: 'completed',
      result: {
        status,
        confidence: 0.75 + Math.random() * 0.24,
        parasiteType,
        parasiteDensity
      },
      processingTime: Math.random() * 3000 + 1000
    }
  }

  const startBatchProcessing = async (jobId: string) => {
    if (isProcessing) return

    setIsProcessing(true)
    const job = jobs.find(j => j.id === jobId)
    if (!job) return

    setJobs(prev => prev.map(j => 
      j.id === jobId 
        ? { ...j, status: 'running', startTime: new Date(), progress: 0 }
        : j
    ))

    try {
      const pendingFiles = job.files.filter(f => f.status === 'pending')
      let completedCount = job.files.filter(f => f.status === 'completed').length

      for (const file of pendingFiles) {
        if (!isProcessing) break // Check if user stopped processing

        // Update file status to processing
        setJobs(prev => prev.map(j => 
          j.id === jobId 
            ? {
                ...j,
                files: j.files.map(f => 
                  f.id === file.id ? { ...f, status: 'processing' } : f
                )
              }
            : j
        ))

        try {
          const result = await simulateAnalysis(file)
          
          // Update file with results
          setJobs(prev => prev.map(j => 
            j.id === jobId 
              ? {
                  ...j,
                  files: j.files.map(f => f.id === file.id ? result : f),
                  progress: ((completedCount + 1) / j.files.length) * 100
                }
              : j
          ))

          completedCount++

          // Save to storage if auto-save enabled
          if (job.settings.autoSave && result.result) {
            await storage.saveAnalysis(
              file.file,
              result.result
            )
          }
        } catch (error) {
          setJobs(prev => prev.map(j => 
            j.id === jobId 
              ? {
                  ...j,
                  files: j.files.map(f => 
                    f.id === file.id 
                      ? { ...f, status: 'error', error: 'Analysis failed' }
                      : f
                  )
                }
              : j
          ))
        }
      }

      // Mark job as completed
      setJobs(prev => prev.map(j => 
        j.id === jobId 
          ? { 
              ...j, 
              status: 'completed', 
              endTime: new Date(),
              progress: 100
            }
          : j
      ))
    } finally {
      setIsProcessing(false)
    }
  }

  const stopProcessing = () => {
    setIsProcessing(false)
    if (currentJob) {
      setJobs(prev => prev.map(j => 
        j.id === currentJob.id 
          ? { ...j, status: 'paused' }
          : j
      ))
    }
  }

  const removeFile = (jobId: string, fileId: string) => {
    setJobs(prev => prev.map(j => 
      j.id === jobId 
        ? { ...j, files: j.files.filter(f => f.id !== fileId) }
        : j
    ))
  }

  const exportResults = (job: BatchJob) => {
    const results = job.files
      .filter(f => f.result)
      .map(f => ({
        filename: f.name,
        status: f.result!.status,
        confidence: (f.result!.confidence * 100).toFixed(1) + '%',
        parasiteType: f.result!.parasiteType || 'N/A',
        parasiteDensity: f.result!.parasiteDensity || 'N/A',
        processingTime: f.processingTime ? (f.processingTime / 1000).toFixed(2) + 's' : 'N/A'
      }))

    const csv = [
      Object.keys(results[0]).join(','),
      ...results.map(r => Object.values(r).join(','))
    ].join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${job.name}-results.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-gray-100 text-gray-800'
      case 'processing': return 'bg-blue-100 text-blue-800'
      case 'completed': return 'bg-green-100 text-green-800'
      case 'error': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />
      case 'processing': return <Zap className="h-4 w-4 animate-pulse" />
      case 'completed': return <CheckCircle2 className="h-4 w-4" />
      case 'error': return <AlertCircle className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  const currentJobStats = currentJob ? {
    total: currentJob.files.length,
    pending: currentJob.files.filter(f => f.status === 'pending').length,
    processing: currentJob.files.filter(f => f.status === 'processing').length,
    completed: currentJob.files.filter(f => f.status === 'completed').length,
    error: currentJob.files.filter(f => f.status === 'error').length,
    positive: currentJob.files.filter(f => f.result?.status === 'positive').length,
    negative: currentJob.files.filter(f => f.result?.status === 'negative').length,
    inconclusive: currentJob.files.filter(f => f.result?.status === 'inconclusive').length,
  } : null

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Batch Image Processor
            </CardTitle>
            <CardDescription>
              Process multiple blood smear images simultaneously with AI analysis
            </CardDescription>
          </div>
          <Button onClick={createNewJob} className="gap-2">
            <Upload className="h-4 w-4" />
            New Batch
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="current" className="w-full">
          <TabsList>
            <TabsTrigger value="current">Current Batch</TabsTrigger>
            <TabsTrigger value="history">Batch History</TabsTrigger>
          </TabsList>

          <TabsContent value="current" className="space-y-6">
            {!currentJob ? (
              <div className="text-center py-12">
                <Upload className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Active Batch</h3>
                <p className="text-muted-foreground mb-4">
                  Create a new batch to start processing multiple images
                </p>
                <Button onClick={createNewJob} className="gap-2">
                  <Upload className="h-4 w-4" />
                  Create New Batch
                </Button>
              </div>
            ) : (
              <>
                {/* Batch Stats */}
                {currentJobStats && currentJobStats.total > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card className="p-4">
                      <div className="flex items-center gap-2">
                        <FileImage className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Total Files</span>
                      </div>
                      <p className="text-2xl font-bold">{currentJobStats.total}</p>
                    </Card>
                    <Card className="p-4">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-muted-foreground">Completed</span>
                      </div>
                      <p className="text-2xl font-bold text-green-600">{currentJobStats.completed}</p>
                    </Card>
                    <Card className="p-4">
                      <div className="flex items-center gap-2">
                        <Bug className="h-4 w-4 text-red-600" />
                        <span className="text-sm text-muted-foreground">Positive</span>
                      </div>
                      <p className="text-2xl font-bold text-red-600">{currentJobStats.positive}</p>
                    </Card>
                    <Card className="p-4">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-muted-foreground">Negative</span>
                      </div>
                      <p className="text-2xl font-bold text-green-600">{currentJobStats.negative}</p>
                    </Card>
                  </div>
                )}

                {/* File Upload Area */}
                <Card 
                  className="border-2 border-dashed cursor-pointer hover:border-primary/50 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Upload className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="font-semibold mb-2">Upload Blood Smear Images</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Click here or drag and drop multiple images
                    </p>
                    <Badge variant="secondary">
                      Supports JPG, PNG, TIFF • Max 10MB per file
                    </Badge>
                  </CardContent>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </Card>

                {/* Processing Controls */}
                {currentJob.files.length > 0 && (
                  <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        {currentJob.status === 'running' ? (
                          <Button onClick={stopProcessing} variant="destructive" size="sm" className="gap-2">
                            <Square className="h-4 w-4" />
                            Stop
                          </Button>
                        ) : (
                          <Button 
                            onClick={() => startBatchProcessing(currentJob.id)} 
                            disabled={isProcessing || currentJob.files.filter(f => f.status === 'pending').length === 0}
                            size="sm" 
                            className="gap-2"
                          >
                            <Play className="h-4 w-4" />
                            {currentJob.status === 'paused' ? 'Resume' : 'Start Processing'}
                          </Button>
                        )}
                      </div>
                      
                      {currentJob.progress > 0 && (
                        <div className="flex items-center gap-2 min-w-[200px]">
                          <Progress value={currentJob.progress} className="flex-1" />
                          <span className="text-sm text-muted-foreground">
                            {Math.round(currentJob.progress)}%
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {currentJob.files.filter(f => f.status === 'completed').length > 0 && (
                        <Button 
                          onClick={() => exportResults(currentJob)}
                          variant="outline" 
                          size="sm" 
                          className="gap-2"
                        >
                          <Download className="h-4 w-4" />
                          Export Results
                        </Button>
                      )}
                      <Button 
                        onClick={() => setCurrentJob(null)}
                        variant="ghost" 
                        size="sm"
                      >
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* Files Table */}
                {currentJob.files.length > 0 && (
                  <div className="border rounded-lg">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>File</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Result</TableHead>
                          <TableHead>Confidence</TableHead>
                          <TableHead>Parasite Type</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {currentJob.files.map((file) => (
                          <TableRow key={file.id}>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <FileImage className="h-4 w-4 text-muted-foreground" />
                                <span className="font-medium truncate max-w-[200px]">
                                  {file.name}
                                </span>
                                <Badge variant="outline" className="text-xs">
                                  {(file.size / 1024).toFixed(0)}KB
                                </Badge>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge className={`gap-1 ${getStatusColor(file.status)}`}>
                                {getStatusIcon(file.status)}
                                {file.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {file.result ? (
                                <Badge className={`status-${file.result.status}`}>
                                  {file.result.status}
                                </Badge>
                              ) : (
                                '-'
                              )}
                            </TableCell>
                            <TableCell>
                              {file.result?.confidence ? (
                                `${(file.result.confidence * 100).toFixed(1)}%`
                              ) : (
                                '-'
                              )}
                            </TableCell>
                            <TableCell className="max-w-[150px] truncate">
                              {file.result?.parasiteType || '-'}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                {file.result && (
                                  <Button variant="ghost" size="sm">
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                )}
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => removeFile(currentJob.id, file.id)}
                                  disabled={file.status === 'processing'}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </>
            )}
          </TabsContent>

          <TabsContent value="history">
            <div className="space-y-4">
              {jobs.filter(j => j.status === 'completed').map((job) => (
                <Card key={job.id}>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{job.name}</CardTitle>
                      <CardDescription>
                        {job.files.length} files • Completed {job.endTime ? format(job.endTime, 'PPp') : ''}
                      </CardDescription>
                    </div>
                    <Button 
                      onClick={() => exportResults(job)}
                      variant="outline" 
                      size="sm" 
                      className="gap-2"
                    >
                      <Download className="h-4 w-4" />
                      Export
                    </Button>
                  </CardHeader>
                </Card>
              ))}
              {jobs.filter(j => j.status === 'completed').length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No completed batches yet</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}