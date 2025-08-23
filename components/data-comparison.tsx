"use client"

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  ScatterPlot,
  Scatter
} from "recharts"
import {
  GitCompare,
  TrendingUp,
  TrendingDown,
  Equal,
  BarChart3,
  PieChart as PieChartIcon,
  Filter,
  Download,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Users,
  Activity,
  Target,
  Zap,
  Eye,
  Settings
} from "lucide-react"
import { format, subDays } from "date-fns"

interface ComparisonDataset {
  id: string
  name: string
  type: "patient_group" | "time_period" | "location" | "test_method" | "custom"
  description: string
  criteria: any
  dataPoints: DataPoint[]
  color: string
  createdAt: Date
}

interface DataPoint {
  id: string
  timestamp: Date
  value: number
  category: string
  metadata: any
}

interface ComparisonMetric {
  key: string
  name: string
  description: string
  unit: string
  format: "number" | "percentage" | "currency" | "time"
}

interface ComparisonResult {
  metric: string
  dataset1: { name: string; value: number; color: string }
  dataset2: { name: string; value: number; color: string }
  difference: {
    absolute: number
    percentage: number
    significant: boolean
    trend: "up" | "down" | "neutral"
  }
  pValue?: number
  confidence?: number
}

interface DataComparisonProps {
  className?: string
}

export default function DataComparison({ className }: DataComparisonProps) {
  const [datasets, setDatasets] = useState<ComparisonDataset[]>([])
  const [selectedDataset1, setSelectedDataset1] = useState<string>("")
  const [selectedDataset2, setSelectedDataset2] = useState<string>("")
  const [comparisonResults, setComparisonResults] = useState<ComparisonResult[]>([])
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([])
  const [isComparing, setIsComparing] = useState(false)
  const [viewMode, setViewMode] = useState<"table" | "chart" | "detailed">("table")

  const availableMetrics: ComparisonMetric[] = [
    { key: "positive_rate", name: "Positive Rate", description: "Percentage of positive test results", unit: "%", format: "percentage" },
    { key: "test_volume", name: "Test Volume", description: "Total number of tests performed", unit: "tests", format: "number" },
    { key: "avg_age", name: "Average Age", description: "Mean age of patients", unit: "years", format: "number" },
    { key: "confidence_score", name: "Confidence Score", description: "Average AI confidence score", unit: "%", format: "percentage" },
    { key: "processing_time", name: "Processing Time", description: "Average time to results", unit: "minutes", format: "time" },
    { key: "false_positive_rate", name: "False Positive Rate", description: "Rate of false positive results", unit: "%", format: "percentage" },
    { key: "sensitivity", name: "Sensitivity", description: "True positive rate", unit: "%", format: "percentage" },
    { key: "specificity", name: "Specificity", description: "True negative rate", unit: "%", format: "percentage" }
  ]

  useEffect(() => {
    generateSampleDatasets()
    setSelectedMetrics(["positive_rate", "test_volume", "confidence_score"])
  }, [])

  const generateSampleDatasets = () => {
    const colors = ["#ef4444", "#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#06b6d4"]
    
    const sampleDatasets: ComparisonDataset[] = [
      {
        id: "dataset_1",
        name: "Bangkok Region - Q4 2024",
        type: "location",
        description: "Test results from Bangkok healthcare facilities",
        criteria: { location: "Bangkok", period: "Q4 2024" },
        dataPoints: Array.from({ length: 100 }, (_, i) => ({
          id: `dp_${i}`,
          timestamp: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000),
          value: Math.random() * 100,
          category: Math.random() > 0.7 ? "positive" : "negative",
          metadata: { confidence: Math.random() * 40 + 60 }
        })),
        color: colors[0],
        createdAt: new Date()
      },
      {
        id: "dataset_2",
        name: "Chiang Mai Region - Q4 2024",
        type: "location",
        description: "Test results from Chiang Mai healthcare facilities",
        criteria: { location: "Chiang Mai", period: "Q4 2024" },
        dataPoints: Array.from({ length: 80 }, (_, i) => ({
          id: `dp_${i}`,
          timestamp: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000),
          value: Math.random() * 100,
          category: Math.random() > 0.8 ? "positive" : "negative",
          metadata: { confidence: Math.random() * 30 + 70 }
        })),
        color: colors[1],
        createdAt: new Date()
      },
      {
        id: "dataset_3",
        name: "Rural Areas - 2024",
        type: "location",
        description: "Combined data from rural healthcare centers",
        criteria: { location_type: "rural", year: 2024 },
        dataPoints: Array.from({ length: 120 }, (_, i) => ({
          id: `dp_${i}`,
          timestamp: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
          value: Math.random() * 100,
          category: Math.random() > 0.6 ? "positive" : "negative",
          metadata: { confidence: Math.random() * 50 + 50 }
        })),
        color: colors[2],
        createdAt: new Date()
      },
      {
        id: "dataset_4",
        name: "Urban Areas - 2024",
        type: "location",
        description: "Combined data from urban healthcare centers",
        criteria: { location_type: "urban", year: 2024 },
        dataPoints: Array.from({ length: 200 }, (_, i) => ({
          id: `dp_${i}`,
          timestamp: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
          value: Math.random() * 100,
          category: Math.random() > 0.75 ? "positive" : "negative",
          metadata: { confidence: Math.random() * 30 + 70 }
        })),
        color: colors[3],
        createdAt: new Date()
      },
      {
        id: "dataset_5",
        name: "Age Group 18-35 - 2024",
        type: "patient_group",
        description: "Test results for young adults",
        criteria: { age_min: 18, age_max: 35, year: 2024 },
        dataPoints: Array.from({ length: 150 }, (_, i) => ({
          id: `dp_${i}`,
          timestamp: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
          value: Math.random() * 100,
          category: Math.random() > 0.8 ? "positive" : "negative",
          metadata: { confidence: Math.random() * 40 + 60 }
        })),
        color: colors[4],
        createdAt: new Date()
      },
      {
        id: "dataset_6",
        name: "Age Group 35+ - 2024",
        type: "patient_group",
        description: "Test results for older adults",
        criteria: { age_min: 35, year: 2024 },
        dataPoints: Array.from({ length: 180 }, (_, i) => ({
          id: `dp_${i}`,
          timestamp: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
          value: Math.random() * 100,
          category: Math.random() > 0.65 ? "positive" : "negative",
          metadata: { confidence: Math.random() * 35 + 65 }
        })),
        color: colors[5],
        createdAt: new Date()
      }
    ]

    setDatasets(sampleDatasets)
  }

  const calculateMetrics = (dataset: ComparisonDataset) => {
    const positiveTests = dataset.dataPoints.filter(dp => dp.category === "positive").length
    const totalTests = dataset.dataPoints.length
    const avgConfidence = dataset.dataPoints.reduce((sum, dp) => sum + (dp.metadata.confidence || 0), 0) / totalTests
    
    return {
      positive_rate: (positiveTests / totalTests) * 100,
      test_volume: totalTests,
      avg_age: Math.random() * 30 + 35,
      confidence_score: avgConfidence,
      processing_time: Math.random() * 5 + 2,
      false_positive_rate: Math.random() * 5 + 1,
      sensitivity: Math.random() * 15 + 85,
      specificity: Math.random() * 10 + 90
    }
  }

  const performComparison = () => {
    if (!selectedDataset1 || !selectedDataset2 || selectedMetrics.length === 0) return

    setIsComparing(true)

    setTimeout(() => {
      const dataset1 = datasets.find(d => d.id === selectedDataset1)!
      const dataset2 = datasets.find(d => d.id === selectedDataset2)!
      
      const metrics1 = calculateMetrics(dataset1)
      const metrics2 = calculateMetrics(dataset2)

      const results: ComparisonResult[] = selectedMetrics.map(metricKey => {
        const value1 = metrics1[metricKey as keyof typeof metrics1]
        const value2 = metrics2[metricKey as keyof typeof metrics2]
        const diff = value2 - value1
        const percentDiff = Math.abs(diff) / value1 * 100

        return {
          metric: metricKey,
          dataset1: { name: dataset1.name, value: value1, color: dataset1.color },
          dataset2: { name: dataset2.name, value: value2, color: dataset2.color },
          difference: {
            absolute: diff,
            percentage: percentDiff,
            significant: percentDiff > 10,
            trend: diff > 0 ? "up" : diff < 0 ? "down" : "neutral"
          },
          pValue: Math.random() * 0.1,
          confidence: Math.random() * 20 + 80
        }
      })

      setComparisonResults(results)
      setIsComparing(false)
    }, 2000)
  }

  const formatValue = (value: number, format: string) => {
    switch (format) {
      case "percentage":
        return `${value.toFixed(1)}%`
      case "currency":
        return `$${value.toFixed(2)}`
      case "time":
        return `${value.toFixed(1)} min`
      default:
        return value.toFixed(1)
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-green-600" />
      case "down":
        return <TrendingDown className="h-4 w-4 text-red-600" />
      default:
        return <Equal className="h-4 w-4 text-gray-600" />
    }
  }

  const chartData = useMemo(() => {
    if (comparisonResults.length === 0) return []
    
    return comparisonResults.map(result => ({
      metric: availableMetrics.find(m => m.key === result.metric)?.name || result.metric,
      [result.dataset1.name]: result.dataset1.value,
      [result.dataset2.name]: result.dataset2.value,
      dataset1Color: result.dataset1.color,
      dataset2Color: result.dataset2.color
    }))
  }, [comparisonResults])

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Configuration Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GitCompare className="h-5 w-5" />
            Data Comparison Tool
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Dataset Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Dataset A</Label>
              <Select value={selectedDataset1} onValueChange={setSelectedDataset1}>
                <SelectTrigger>
                  <SelectValue placeholder="Select first dataset" />
                </SelectTrigger>
                <SelectContent>
                  {datasets.map((dataset) => (
                    <SelectItem key={dataset.id} value={dataset.id} disabled={dataset.id === selectedDataset2}>
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: dataset.color }} />
                        <span>{dataset.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedDataset1 && (
                <div className="text-sm text-muted-foreground">
                  {datasets.find(d => d.id === selectedDataset1)?.description}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label>Dataset B</Label>
              <Select value={selectedDataset2} onValueChange={setSelectedDataset2}>
                <SelectTrigger>
                  <SelectValue placeholder="Select second dataset" />
                </SelectTrigger>
                <SelectContent>
                  {datasets.map((dataset) => (
                    <SelectItem key={dataset.id} value={dataset.id} disabled={dataset.id === selectedDataset1}>
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: dataset.color }} />
                        <span>{dataset.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedDataset2 && (
                <div className="text-sm text-muted-foreground">
                  {datasets.find(d => d.id === selectedDataset2)?.description}
                </div>
              )}
            </div>
          </div>

          {/* Metrics Selection */}
          <div className="space-y-3">
            <Label>Metrics to Compare</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
              {availableMetrics.map((metric) => (
                <div key={metric.key} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={metric.key}
                    checked={selectedMetrics.includes(metric.key)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedMetrics([...selectedMetrics, metric.key])
                      } else {
                        setSelectedMetrics(selectedMetrics.filter(m => m !== metric.key))
                      }
                    }}
                    className="rounded"
                  />
                  <label htmlFor={metric.key} className="text-sm cursor-pointer">
                    {metric.name}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Button
                onClick={performComparison}
                disabled={!selectedDataset1 || !selectedDataset2 || selectedMetrics.length === 0 || isComparing}
                className="gap-2"
              >
                {isComparing ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <BarChart3 className="h-4 w-4" />
                    Compare Data
                  </>
                )}
              </Button>
              {isComparing && (
                <div className="flex items-center gap-2">
                  <Progress value={50} className="w-24" />
                  <span className="text-sm text-muted-foreground">Calculating...</span>
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {comparisonResults.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Comparison Results</CardTitle>
              <Tabs value={viewMode} onValueChange={(value: any) => setViewMode(value)}>
                <TabsList>
                  <TabsTrigger value="table">Table</TabsTrigger>
                  <TabsTrigger value="chart">Chart</TabsTrigger>
                  <TabsTrigger value="detailed">Detailed</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs value={viewMode} onValueChange={(value: any) => setViewMode(value)}>
              <TabsContent value="table">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Metric</TableHead>
                        <TableHead>Dataset A</TableHead>
                        <TableHead>Dataset B</TableHead>
                        <TableHead>Difference</TableHead>
                        <TableHead>Trend</TableHead>
                        <TableHead>Significance</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {comparisonResults.map((result) => {
                        const metric = availableMetrics.find(m => m.key === result.metric)!
                        return (
                          <TableRow key={result.metric}>
                            <TableCell>
                              <div>
                                <p className="font-medium">{metric.name}</p>
                                <p className="text-xs text-muted-foreground">{metric.description}</p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: result.dataset1.color }} />
                                <span>{formatValue(result.dataset1.value, metric.format)}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: result.dataset2.color }} />
                                <span>{formatValue(result.dataset2.value, metric.format)}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm">
                                <div className="flex items-center gap-1">
                                  {getTrendIcon(result.difference.trend)}
                                  <span>{formatValue(Math.abs(result.difference.absolute), metric.format)}</span>
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {result.difference.percentage.toFixed(1)}% change
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              {getTrendIcon(result.difference.trend)}
                            </TableCell>
                            <TableCell>
                              {result.difference.significant ? (
                                <Badge className="bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400">
                                  <AlertTriangle className="h-3 w-3 mr-1" />
                                  Significant
                                </Badge>
                              ) : (
                                <Badge className="bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400">
                                  <CheckCircle2 className="h-3 w-3 mr-1" />
                                  Not Significant
                                </Badge>
                              )}
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              <TabsContent value="chart">
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="metric" 
                        angle={-45}
                        textAnchor="end"
                        height={80}
                        fontSize={12}
                      />
                      <YAxis />
                      <Tooltip />
                      <Bar 
                        dataKey={comparisonResults[0]?.dataset1.name} 
                        fill={comparisonResults[0]?.dataset1.color}
                        name={comparisonResults[0]?.dataset1.name}
                      />
                      <Bar 
                        dataKey={comparisonResults[0]?.dataset2.name} 
                        fill={comparisonResults[0]?.dataset2.color}
                        name={comparisonResults[0]?.dataset2.name}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>

              <TabsContent value="detailed">
                <ScrollArea className="h-96">
                  <div className="space-y-4">
                    {comparisonResults.map((result) => {
                      const metric = availableMetrics.find(m => m.key === result.metric)!
                      return (
                        <Card key={result.metric}>
                          <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-lg">{metric.name}</CardTitle>
                              {result.difference.significant && (
                                <Badge variant="destructive">Significant Difference</Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">{metric.description}</p>
                          </CardHeader>
                          <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div className="text-center">
                                <div className="flex items-center justify-center gap-2 mb-2">
                                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: result.dataset1.color }} />
                                  <span className="font-medium">{result.dataset1.name}</span>
                                </div>
                                <p className="text-2xl font-bold">{formatValue(result.dataset1.value, metric.format)}</p>
                              </div>
                              <div className="text-center">
                                <div className="flex items-center justify-center gap-2 mb-2">
                                  {getTrendIcon(result.difference.trend)}
                                  <span className="font-medium">Difference</span>
                                </div>
                                <p className="text-2xl font-bold">{formatValue(Math.abs(result.difference.absolute), metric.format)}</p>
                                <p className="text-sm text-muted-foreground">{result.difference.percentage.toFixed(1)}% change</p>
                              </div>
                              <div className="text-center">
                                <div className="flex items-center justify-center gap-2 mb-2">
                                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: result.dataset2.color }} />
                                  <span className="font-medium">{result.dataset2.name}</span>
                                </div>
                                <p className="text-2xl font-bold">{formatValue(result.dataset2.value, metric.format)}</p>
                              </div>
                            </div>
                            {result.pValue && (
                              <div className="mt-4 pt-4 border-t">
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                  <div>
                                    <span className="text-muted-foreground">P-Value:</span>
                                    <span className="ml-2 font-medium">{result.pValue.toFixed(4)}</span>
                                  </div>
                                  <div>
                                    <span className="text-muted-foreground">Confidence:</span>
                                    <span className="ml-2 font-medium">{result.confidence?.toFixed(1)}%</span>
                                  </div>
                                </div>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}

      {/* Dataset Management */}
      <Card>
        <CardHeader>
          <CardTitle>Available Datasets</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {datasets.map((dataset) => (
              <Card key={dataset.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: dataset.color }} />
                      <Badge variant="outline" className="text-xs capitalize">{dataset.type.replace('_', ' ')}</Badge>
                    </div>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                  <h3 className="font-medium text-sm mb-2">{dataset.name}</h3>
                  <p className="text-xs text-muted-foreground mb-3">{dataset.description}</p>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{dataset.dataPoints.length} data points</span>
                    <span>{format(dataset.createdAt, "MMM d")}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}