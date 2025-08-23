"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  FileText,
  Download,
  Calendar as CalendarIcon,
  Filter,
  Settings,
  BarChart3,
  Users,
  Clock,
  MapPin,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Eye,
  Share2,
  Printer,
  Mail,
  FileSpreadsheet,
  Image
} from "lucide-react"
import { format, subDays, startOfMonth, endOfMonth } from "date-fns"

interface ReportConfig {
  title: string
  description: string
  dateRange: { from: Date | undefined; to: Date | undefined }
  includePatients: boolean
  includeTests: boolean
  includeStatistics: boolean
  includeCharts: boolean
  includeMap: boolean
  filterByStatus: string[]
  filterByLocation: string[]
  groupBy: string
  sortBy: string
  format: 'pdf' | 'excel' | 'word' | 'json'
}

interface ReportTemplate {
  id: string
  name: string
  description: string
  config: Partial<ReportConfig>
  category: string
  isBuiltIn: boolean
}

interface GeneratedReport {
  id: string
  title: string
  generatedAt: Date
  format: string
  size: string
  status: 'generating' | 'completed' | 'failed'
  downloadUrl?: string
}

interface ReportGeneratorProps {
  className?: string
}

export default function ReportGenerator({ className }: ReportGeneratorProps) {
  const [config, setConfig] = useState<ReportConfig>({
    title: "",
    description: "",
    dateRange: { from: subDays(new Date(), 30), to: new Date() },
    includePatients: true,
    includeTests: true,
    includeStatistics: true,
    includeCharts: true,
    includeMap: false,
    filterByStatus: [],
    filterByLocation: [],
    groupBy: "date",
    sortBy: "date_desc",
    format: "pdf"
  })

  const [templates, setTemplates] = useState<ReportTemplate[]>([])
  const [generatedReports, setGeneratedReports] = useState<GeneratedReport[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationProgress, setGenerationProgress] = useState(0)
  const [selectedTemplate, setSelectedTemplate] = useState<string>("")
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)

  useEffect(() => {
    initializeTemplates()
    loadRecentReports()
  }, [])

  const initializeTemplates = () => {
    const builtInTemplates: ReportTemplate[] = [
      {
        id: "monthly_summary",
        name: "Monthly Summary Report",
        description: "Comprehensive monthly overview of all activities",
        config: {
          title: "Monthly Summary Report",
          includePatients: true,
          includeTests: true,
          includeStatistics: true,
          includeCharts: true,
          groupBy: "month"
        },
        category: "Standard",
        isBuiltIn: true
      },
      {
        id: "patient_demographics",
        name: "Patient Demographics Report",
        description: "Detailed patient population analysis",
        config: {
          title: "Patient Demographics Report",
          includePatients: true,
          includeTests: false,
          includeStatistics: true,
          includeCharts: true,
          groupBy: "demographics"
        },
        category: "Analytics",
        isBuiltIn: true
      },
      {
        id: "test_results_summary",
        name: "Test Results Summary",
        description: "Analysis of all test results and trends",
        config: {
          title: "Test Results Summary",
          includePatients: false,
          includeTests: true,
          includeStatistics: true,
          includeCharts: true,
          groupBy: "result_type"
        },
        category: "Medical",
        isBuiltIn: true
      },
      {
        id: "regional_analysis",
        name: "Regional Analysis Report",
        description: "Geographic distribution and regional trends",
        config: {
          title: "Regional Analysis Report",
          includePatients: true,
          includeTests: true,
          includeStatistics: true,
          includeMap: true,
          groupBy: "location"
        },
        category: "Geographic",
        isBuiltIn: true
      },
      {
        id: "quality_metrics",
        name: "Quality Control Report",
        description: "Quality metrics and performance indicators",
        config: {
          title: "Quality Control Report",
          includeTests: true,
          includeStatistics: true,
          includeCharts: true,
          groupBy: "quality_metrics"
        },
        category: "Quality",
        isBuiltIn: true
      }
    ]

    setTemplates(builtInTemplates)
  }

  const loadRecentReports = () => {
    const recentReports: GeneratedReport[] = [
      {
        id: "report_1",
        title: "Monthly Summary - December 2024",
        generatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        format: "PDF",
        size: "2.4 MB",
        status: "completed",
        downloadUrl: "#"
      },
      {
        id: "report_2",
        title: "Patient Demographics Report",
        generatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
        format: "Excel",
        size: "1.8 MB",
        status: "completed",
        downloadUrl: "#"
      },
      {
        id: "report_3",
        title: "Regional Analysis - Q4 2024",
        generatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        format: "PDF",
        size: "4.2 MB",
        status: "completed",
        downloadUrl: "#"
      }
    ]

    setGeneratedReports(recentReports)
  }

  const updateConfig = (key: keyof ReportConfig, value: any) => {
    setConfig(prev => ({ ...prev, [key]: value }))
  }

  const applyTemplate = (templateId: string) => {
    const template = templates.find(t => t.id === templateId)
    if (template) {
      setConfig(prev => ({
        ...prev,
        ...template.config
      }))
      setSelectedTemplate(templateId)
    }
  }

  const generateReport = async () => {
    setIsGenerating(true)
    setGenerationProgress(0)

    const progressSteps = [
      "Collecting data...",
      "Processing statistics...",
      "Generating charts...",
      "Formatting document...",
      "Finalizing report..."
    ]

    for (let i = 0; i < progressSteps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 1000))
      setGenerationProgress((i + 1) * 20)
    }

    const newReport: GeneratedReport = {
      id: `report_${Date.now()}`,
      title: config.title || "Untitled Report",
      generatedAt: new Date(),
      format: config.format.toUpperCase(),
      size: `${(Math.random() * 3 + 1).toFixed(1)} MB`,
      status: "completed",
      downloadUrl: "#"
    }

    setGeneratedReports(prev => [newReport, ...prev])
    setIsGenerating(false)
    setGenerationProgress(0)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400">Completed</Badge>
      case "generating":
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400">Generating</Badge>
      case "failed":
        return <Badge className="bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400">Failed</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getFormatIcon = (format: string) => {
    switch (format.toLowerCase()) {
      case "pdf":
        return <FileText className="h-4 w-4 text-red-600" />
      case "excel":
        return <FileSpreadsheet className="h-4 w-4 text-green-600" />
      case "word":
        return <FileText className="h-4 w-4 text-blue-600" />
      case "json":
        return <FileText className="h-4 w-4 text-purple-600" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Reports</p>
                <p className="text-2xl font-bold">{generatedReports.length}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">This Month</p>
                <p className="text-2xl font-bold">{generatedReports.filter(r => r.generatedAt.getMonth() === new Date().getMonth()).length}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Templates</p>
                <p className="text-2xl font-bold">{templates.length}</p>
              </div>
              <Settings className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Auto Reports</p>
                <p className="text-2xl font-bold">3</p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Report Configuration */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Generate New Report
                </CardTitle>
                <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      Preview
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[90vh]">
                    <DialogHeader>
                      <DialogTitle>Report Preview</DialogTitle>
                      <DialogDescription>
                        Preview of your report configuration
                      </DialogDescription>
                    </DialogHeader>
                    <ScrollArea className="h-[70vh]">
                      <div className="space-y-4">
                        <Card>
                          <CardHeader>
                            <CardTitle>{config.title || "Untitled Report"}</CardTitle>
                            <p className="text-muted-foreground">{config.description}</p>
                          </CardHeader>
                          <CardContent>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <strong>Date Range:</strong>
                                <p>{config.dateRange.from ? format(config.dateRange.from, "PPP") : "Not set"} - {config.dateRange.to ? format(config.dateRange.to, "PPP") : "Not set"}</p>
                              </div>
                              <div>
                                <strong>Format:</strong>
                                <p className="capitalize">{config.format}</p>
                              </div>
                              <div>
                                <strong>Sections:</strong>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {config.includePatients && <Badge variant="outline">Patients</Badge>}
                                  {config.includeTests && <Badge variant="outline">Tests</Badge>}
                                  {config.includeStatistics && <Badge variant="outline">Statistics</Badge>}
                                  {config.includeCharts && <Badge variant="outline">Charts</Badge>}
                                  {config.includeMap && <Badge variant="outline">Map</Badge>}
                                </div>
                              </div>
                              <div>
                                <strong>Group By:</strong>
                                <p className="capitalize">{config.groupBy.replace('_', ' ')}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                        <div className="aspect-video bg-muted/30 rounded-lg flex items-center justify-center">
                          <div className="text-center text-muted-foreground">
                            <Image className="h-12 w-12 mx-auto mb-2" />
                            <p>Report content preview will appear here</p>
                          </div>
                        </div>
                      </div>
                    </ScrollArea>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Template Selection */}
              <div className="space-y-3">
                <Label>Quick Templates</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {templates.slice(0, 4).map((template) => (
                    <Button
                      key={template.id}
                      variant={selectedTemplate === template.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => applyTemplate(template.id)}
                      className="justify-start h-auto p-3"
                    >
                      <div className="text-left">
                        <p className="font-medium text-xs">{template.name}</p>
                        <p className="text-xs text-muted-foreground">{template.description}</p>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Basic Configuration */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Report Title</Label>
                  <Input
                    placeholder="Enter report title"
                    value={config.title}
                    onChange={(e) => updateConfig('title', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    placeholder="Brief description of the report"
                    value={config.description}
                    onChange={(e) => updateConfig('description', e.target.value)}
                    rows={2}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Format</Label>
                    <Select value={config.format} onValueChange={(value: any) => updateConfig('format', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pdf">PDF Document</SelectItem>
                        <SelectItem value="excel">Excel Spreadsheet</SelectItem>
                        <SelectItem value="word">Word Document</SelectItem>
                        <SelectItem value="json">JSON Data</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Group By</Label>
                    <Select value={config.groupBy} onValueChange={(value) => updateConfig('groupBy', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="date">Date</SelectItem>
                        <SelectItem value="location">Location</SelectItem>
                        <SelectItem value="patient">Patient</SelectItem>
                        <SelectItem value="test_type">Test Type</SelectItem>
                        <SelectItem value="result">Result</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Date Range */}
              <div className="space-y-3">
                <Label>Date Range</Label>
                <div className="flex gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="justify-start text-left">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {config.dateRange.from ? format(config.dateRange.from, "PPP") : "From date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={config.dateRange.from}
                        onSelect={(date) => updateConfig('dateRange', { ...config.dateRange, from: date })}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="justify-start text-left">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {config.dateRange.to ? format(config.dateRange.to, "PPP") : "To date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={config.dateRange.to}
                        onSelect={(date) => updateConfig('dateRange', { ...config.dateRange, to: date })}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateConfig('dateRange', { from: subDays(new Date(), 7), to: new Date() })}
                  >
                    Last 7 days
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateConfig('dateRange', { from: subDays(new Date(), 30), to: new Date() })}
                  >
                    Last 30 days
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateConfig('dateRange', { from: startOfMonth(new Date()), to: endOfMonth(new Date()) })}
                  >
                    This month
                  </Button>
                </div>
              </div>

              <Separator />

              {/* Content Sections */}
              <div className="space-y-3">
                <Label>Include Sections</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="includePatients"
                      checked={config.includePatients}
                      onCheckedChange={(checked) => updateConfig('includePatients', checked)}
                    />
                    <label htmlFor="includePatients" className="text-sm">Patient Data</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="includeTests"
                      checked={config.includeTests}
                      onCheckedChange={(checked) => updateConfig('includeTests', checked)}
                    />
                    <label htmlFor="includeTests" className="text-sm">Test Results</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="includeStatistics"
                      checked={config.includeStatistics}
                      onCheckedChange={(checked) => updateConfig('includeStatistics', checked)}
                    />
                    <label htmlFor="includeStatistics" className="text-sm">Statistics</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="includeCharts"
                      checked={config.includeCharts}
                      onCheckedChange={(checked) => updateConfig('includeCharts', checked)}
                    />
                    <label htmlFor="includeCharts" className="text-sm">Charts & Graphs</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="includeMap"
                      checked={config.includeMap}
                      onCheckedChange={(checked) => updateConfig('includeMap', checked)}
                    />
                    <label htmlFor="includeMap" className="text-sm">Geographic Map</label>
                  </div>
                </div>
              </div>

              {/* Generation */}
              <div className="pt-4 border-t">
                {isGenerating ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span>Generating report...</span>
                      <span>{generationProgress}%</span>
                    </div>
                    <Progress value={generationProgress} className="w-full" />
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Button onClick={generateReport} className="flex-1">
                      <Download className="mr-2 h-4 w-4" />
                      Generate Report
                    </Button>
                    <Button variant="outline">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Reports & Templates */}
        <div className="space-y-6">
          {/* Recent Reports */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-64">
                <div className="space-y-3">
                  {generatedReports.map((report) => (
                    <div key={report.id} className="flex items-start justify-between p-3 border rounded-lg">
                      <div className="flex items-start gap-3">
                        {getFormatIcon(report.format)}
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium truncate">{report.title}</p>
                          <div className="flex items-center gap-2 mt-1">
                            {getStatusBadge(report.status)}
                            <span className="text-xs text-muted-foreground">{report.size}</span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {format(report.generatedAt, "PPP")}
                          </p>
                        </div>
                      </div>
                      {report.status === "completed" && (
                        <div className="flex gap-1">
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* All Templates */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Report Templates</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-64">
                <div className="space-y-2">
                  {templates.map((template) => (
                    <Button
                      key={template.id}
                      variant={selectedTemplate === template.id ? "default" : "ghost"}
                      size="sm"
                      onClick={() => applyTemplate(template.id)}
                      className="w-full justify-start h-auto p-3"
                    >
                      <div className="text-left">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-sm">{template.name}</p>
                          <Badge variant="outline" className="text-xs">{template.category}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{template.description}</p>
                      </div>
                    </Button>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}