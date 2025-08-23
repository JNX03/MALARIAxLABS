"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from "recharts"
import {
  Shield,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  TrendingDown,
  Activity,
  Target,
  Clock,
  Users,
  BarChart3,
  Settings,
  Download,
  RefreshCw,
  Eye,
  Filter,
  Bell,
  Zap,
  Award,
  XCircle
} from "lucide-react"
import { format, subDays, startOfDay } from "date-fns"

interface QualityMetric {
  id: string
  name: string
  category: "accuracy" | "performance" | "reliability" | "compliance"
  currentValue: number
  targetValue: number
  unit: string
  trend: "up" | "down" | "stable"
  status: "excellent" | "good" | "warning" | "critical"
  lastUpdated: Date
  description: string
}

interface QualityAlert {
  id: string
  type: "threshold_breach" | "trend_alert" | "anomaly" | "compliance"
  severity: "low" | "medium" | "high" | "critical"
  title: string
  description: string
  metric: string
  value: number
  threshold: number
  timestamp: Date
  acknowledged: boolean
  resolvedAt?: Date
}

interface QualityTrend {
  date: string
  accuracy: number
  sensitivity: number
  specificity: number
  processing_time: number
  confidence: number
}

interface CalibrationTest {
  id: string
  type: "positive_control" | "negative_control" | "reference_sample"
  sampleId: string
  expectedResult: "positive" | "negative"
  actualResult: "positive" | "negative" | "inconclusive"
  confidence: number
  processingTime: number
  timestamp: Date
  technician: string
  passed: boolean
  notes?: string
}

interface QualityControlProps {
  className?: string
}

export default function QualityControl({ className }: QualityControlProps) {
  const [metrics, setMetrics] = useState<QualityMetric[]>([])
  const [alerts, setAlerts] = useState<QualityAlert[]>([])
  const [trends, setTrends] = useState<QualityTrend[]>([])
  const [calibrationTests, setCalibrationTests] = useState<CalibrationTest[]>([])
  const [selectedTimeRange, setSelectedTimeRange] = useState("7d")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [isRefreshing, setIsRefreshing] = useState(false)

  useEffect(() => {
    generateQualityData()
    const interval = setInterval(() => {
      updateRealTimeData()
    }, 30000)
    return () => clearInterval(interval)
  }, [])

  const generateQualityData = () => {
    const qualityMetrics: QualityMetric[] = [
      {
        id: "accuracy",
        name: "Overall Accuracy",
        category: "accuracy",
        currentValue: 96.8,
        targetValue: 95.0,
        unit: "%",
        trend: "up",
        status: "excellent",
        lastUpdated: new Date(),
        description: "Overall diagnostic accuracy across all test types"
      },
      {
        id: "sensitivity",
        name: "Sensitivity",
        category: "accuracy",
        currentValue: 94.2,
        targetValue: 90.0,
        unit: "%",
        trend: "stable",
        status: "good",
        lastUpdated: new Date(),
        description: "Ability to correctly identify positive cases"
      },
      {
        id: "specificity",
        name: "Specificity",
        category: "accuracy",
        currentValue: 98.1,
        targetValue: 95.0,
        unit: "%",
        trend: "up",
        status: "excellent",
        lastUpdated: new Date(),
        description: "Ability to correctly identify negative cases"
      },
      {
        id: "processing_time",
        name: "Average Processing Time",
        category: "performance",
        currentValue: 2.3,
        targetValue: 3.0,
        unit: "min",
        trend: "down",
        status: "excellent",
        lastUpdated: new Date(),
        description: "Average time from image upload to result"
      },
      {
        id: "confidence_score",
        name: "Average Confidence",
        category: "reliability",
        currentValue: 87.5,
        targetValue: 80.0,
        unit: "%",
        trend: "up",
        status: "good",
        lastUpdated: new Date(),
        description: "Average AI confidence in predictions"
      },
      {
        id: "false_positive_rate",
        name: "False Positive Rate",
        category: "accuracy",
        currentValue: 1.9,
        targetValue: 5.0,
        unit: "%",
        trend: "down",
        status: "excellent",
        lastUpdated: new Date(),
        description: "Rate of incorrectly identified positive cases"
      },
      {
        id: "uptime",
        name: "System Uptime",
        category: "reliability",
        currentValue: 99.7,
        targetValue: 99.5,
        unit: "%",
        trend: "stable",
        status: "excellent",
        lastUpdated: new Date(),
        description: "System availability and reliability"
      },
      {
        id: "compliance_score",
        name: "Compliance Score",
        category: "compliance",
        currentValue: 94.0,
        targetValue: 90.0,
        unit: "%",
        trend: "up",
        status: "good",
        lastUpdated: new Date(),
        description: "Adherence to quality standards and protocols"
      }
    ]

    const qualityAlerts: QualityAlert[] = [
      {
        id: "alert_1",
        type: "threshold_breach",
        severity: "medium",
        title: "Processing Time Spike",
        description: "Average processing time exceeded 5 minutes in the last hour",
        metric: "processing_time",
        value: 5.2,
        threshold: 5.0,
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        acknowledged: false
      },
      {
        id: "alert_2",
        type: "anomaly",
        severity: "high",
        title: "Unusual Confidence Pattern",
        description: "Confidence scores showing irregular patterns for Bangkok region",
        metric: "confidence_score",
        value: 72.1,
        threshold: 80.0,
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        acknowledged: true
      },
      {
        id: "alert_3",
        type: "compliance",
        severity: "low",
        title: "Calibration Due",
        description: "Weekly calibration test due for microscope unit #3",
        metric: "compliance_score",
        value: 92.0,
        threshold: 95.0,
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
        acknowledged: false
      }
    ]

    const qualityTrends: QualityTrend[] = Array.from({ length: 30 }, (_, i) => ({
      date: format(subDays(new Date(), 29 - i), "MMM dd"),
      accuracy: 94 + Math.random() * 4,
      sensitivity: 90 + Math.random() * 8,
      specificity: 95 + Math.random() * 4,
      processing_time: 2 + Math.random() * 2,
      confidence: 80 + Math.random() * 15
    }))

    const controlTests: CalibrationTest[] = Array.from({ length: 20 }, (_, i) => ({
      id: `test_${i}`,
      type: i % 3 === 0 ? "positive_control" : i % 3 === 1 ? "negative_control" : "reference_sample",
      sampleId: `CTRL_${String(i).padStart(3, '0')}`,
      expectedResult: Math.random() > 0.6 ? "positive" : "negative",
      actualResult: Math.random() > 0.1 ? (Math.random() > 0.6 ? "positive" : "negative") : "inconclusive",
      confidence: Math.random() * 30 + 70,
      processingTime: Math.random() * 3 + 1,
      timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
      technician: `Tech ${Math.floor(Math.random() * 5) + 1}`,
      passed: Math.random() > 0.1,
      notes: Math.random() > 0.7 ? "Standard control test" : undefined
    }))

    controlTests.forEach(test => {
      test.passed = test.expectedResult === test.actualResult
    })

    setMetrics(qualityMetrics)
    setAlerts(qualityAlerts)
    setTrends(qualityTrends)
    setCalibrationTests(controlTests)
  }

  const updateRealTimeData = () => {
    setMetrics(prev => prev.map(metric => ({
      ...metric,
      currentValue: metric.currentValue + (Math.random() - 0.5) * 2,
      lastUpdated: new Date()
    })))
  }

  const refreshData = async () => {
    setIsRefreshing(true)
    await new Promise(resolve => setTimeout(resolve, 2000))
    generateQualityData()
    setIsRefreshing(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "excellent":
        return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400"
      case "good":
        return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400"
      case "warning":
        return "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400"
      case "critical":
        return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400"
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400"
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400"
      case "low":
        return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400"
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-green-600" />
      case "down":
        return <TrendingDown className="h-4 w-4 text-red-600" />
      default:
        return <Activity className="h-4 w-4 text-gray-600" />
    }
  }

  const acknowledgeAlert = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, acknowledged: true } : alert
    ))
  }

  const filteredMetrics = selectedCategory === "all" 
    ? metrics 
    : metrics.filter(m => m.category === selectedCategory)

  const unacknowledgedAlerts = alerts.filter(a => !a.acknowledged).length
  const criticalAlerts = alerts.filter(a => a.severity === "critical" && !a.acknowledged).length
  const passedTests = calibrationTests.filter(t => t.passed).length
  const testPassRate = (passedTests / calibrationTests.length) * 100

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header with Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">System Health</p>
                <p className="text-2xl font-bold">96.8%</p>
              </div>
              <Shield className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Alerts</p>
                <p className="text-2xl font-bold text-orange-600">{unacknowledgedAlerts}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Test Pass Rate</p>
                <p className="text-2xl font-bold">{testPassRate.toFixed(1)}%</p>
              </div>
              <Target className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Compliance</p>
                <p className="text-2xl font-bold">94.0%</p>
              </div>
              <Award className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quality Metrics */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Quality Metrics
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="accuracy">Accuracy</SelectItem>
                      <SelectItem value="performance">Performance</SelectItem>
                      <SelectItem value="reliability">Reliability</SelectItem>
                      <SelectItem value="compliance">Compliance</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={refreshData}
                    disabled={isRefreshing}
                  >
                    <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredMetrics.map((metric) => (
                  <div key={metric.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <h3 className="font-medium">{metric.name}</h3>
                        <Badge className={getStatusColor(metric.status)} variant="outline">
                          {metric.status}
                        </Badge>
                        {getTrendIcon(metric.trend)}
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold">
                          {metric.currentValue.toFixed(1)}{metric.unit}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Target: {metric.targetValue}{metric.unit}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{metric.description}</p>
                    <Progress 
                      value={Math.min((metric.currentValue / metric.targetValue) * 100, 100)} 
                      className="h-2"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>0{metric.unit}</span>
                      <span>{metric.targetValue}{metric.unit}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Alerts Panel */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Quality Alerts
                {unacknowledgedAlerts > 0 && (
                  <Badge variant="destructive" className="ml-2">
                    {unacknowledgedAlerts}
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-80">
                <div className="space-y-3">
                  {alerts.map((alert) => (
                    <div key={alert.id} className={`p-3 rounded-lg border ${!alert.acknowledged ? 'bg-muted/30' : ''}`}>
                      <div className="flex items-start justify-between mb-2">
                        <Badge className={getSeverityColor(alert.severity)} variant="outline">
                          {alert.severity}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {format(alert.timestamp, "MMM d, HH:mm")}
                        </span>
                      </div>
                      <h4 className="font-medium text-sm mb-1">{alert.title}</h4>
                      <p className="text-xs text-muted-foreground mb-2">{alert.description}</p>
                      <div className="flex justify-between items-center">
                        <div className="text-xs">
                          <span className="text-muted-foreground">Value:</span>
                          <span className="ml-1 font-medium">{alert.value}</span>
                          <span className="text-muted-foreground ml-1">
                            (Threshold: {alert.threshold})
                          </span>
                        </div>
                        {!alert.acknowledged && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => acknowledgeAlert(alert.id)}
                            className="h-6 px-2 text-xs"
                          >
                            Ack
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Trends and Calibration */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quality Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Quality Trends (Last 30 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="accuracy">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="accuracy">Accuracy</TabsTrigger>
                <TabsTrigger value="performance">Performance</TabsTrigger>
                <TabsTrigger value="reliability">Reliability</TabsTrigger>
              </TabsList>
              
              <TabsContent value="accuracy" className="mt-4">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={trends}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" fontSize={12} />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="accuracy" stroke="#10b981" strokeWidth={2} />
                      <Line type="monotone" dataKey="sensitivity" stroke="#3b82f6" strokeWidth={2} />
                      <Line type="monotone" dataKey="specificity" stroke="#f59e0b" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>
              
              <TabsContent value="performance" className="mt-4">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={trends}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" fontSize={12} />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="processing_time" stroke="#ef4444" fill="#ef4444" fillOpacity={0.3} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>
              
              <TabsContent value="reliability" className="mt-4">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={trends}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" fontSize={12} />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="confidence" stroke="#8b5cf6" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Calibration Tests */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Calibration Tests</span>
              <Badge className={getStatusColor(testPassRate > 90 ? "excellent" : testPassRate > 80 ? "good" : "warning")}>
                {testPassRate.toFixed(1)}% Pass Rate
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-64">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Sample</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Result</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {calibrationTests.slice(0, 10).map((test) => (
                    <TableRow key={test.id}>
                      <TableCell className="font-mono text-xs">{test.sampleId}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs capitalize">
                          {test.type.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs">
                        <div>
                          <span>Exp: {test.expectedResult}</span><br />
                          <span>Act: {test.actualResult}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {test.passed ? (
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-600" />
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Settings className="h-4 w-4" />
            Configure Thresholds
          </Button>
          <Button variant="outline" className="gap-2">
            <Zap className="h-4 w-4" />
            Run Calibration
          </Button>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export Report
          </Button>
          <Button variant="outline" className="gap-2">
            <Eye className="h-4 w-4" />
            View Details
          </Button>
        </div>
      </div>
    </div>
  )
}