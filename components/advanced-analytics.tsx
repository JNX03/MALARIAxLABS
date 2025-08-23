"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
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
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  ScatterPlot,
  Scatter,
  ComposedChart,
  Legend,
  Treemap,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from "recharts"
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Activity,
  Users,
  MapPin,
  Calendar,
  Clock,
  Target,
  Zap,
  Brain,
  Eye,
  Download,
  Settings,
  Filter,
  RefreshCw,
  Play,
  Pause,
  RotateCcw,
  Maximize,
  Share2
} from "lucide-react"
import { format, subDays, startOfMonth, endOfMonth } from "date-fns"

interface AnalyticsMetric {
  id: string
  name: string
  value: number
  change: number
  trend: "up" | "down" | "stable"
  category: string
}

interface ChartData {
  name: string
  [key: string]: any
}

interface PredictionModel {
  id: string
  name: string
  type: "disease_outbreak" | "resource_planning" | "quality_prediction" | "patient_flow"
  accuracy: number
  lastTrained: Date
  nextUpdate: Date
  status: "active" | "training" | "outdated"
  predictions: any[]
}

interface AdvancedAnalyticsProps {
  className?: string
}

export default function AdvancedAnalytics({ className }: AdvancedAnalyticsProps) {
  const [selectedTimeRange, setSelectedTimeRange] = useState("30d")
  const [selectedMetric, setSelectedMetric] = useState("all")
  const [selectedRegion, setSelectedRegion] = useState("all")
  const [isRealTime, setIsRealTime] = useState(false)
  const [metrics, setMetrics] = useState<AnalyticsMetric[]>([])
  const [chartData, setChartData] = useState<ChartData[]>([])
  const [predictionModels, setPredictionModels] = useState<PredictionModel[]>([])

  useEffect(() => {
    initializeAnalyticsData()
    const interval = setInterval(() => {
      if (isRealTime) {
        updateRealTimeData()
      }
    }, 10000)
    return () => clearInterval(interval)
  }, [isRealTime])

  const initializeAnalyticsData = () => {
    const metricsData: AnalyticsMetric[] = [
      { id: "total_tests", name: "Total Tests", value: 15420, change: 8.5, trend: "up", category: "Volume" },
      { id: "positive_rate", name: "Positive Rate", value: 23.4, change: -2.1, trend: "down", category: "Diagnostic" },
      { id: "avg_processing", name: "Avg Processing Time", value: 2.3, change: -15.2, trend: "down", category: "Performance" },
      { id: "accuracy", name: "Accuracy Score", value: 96.8, change: 1.2, trend: "up", category: "Quality" },
      { id: "user_engagement", name: "User Engagement", value: 87.5, change: 5.8, trend: "up", category: "Usage" },
      { id: "cost_efficiency", name: "Cost per Test", value: 12.45, change: -8.3, trend: "down", category: "Financial" }
    ]

    const chartDataPoints: ChartData[] = Array.from({ length: 30 }, (_, i) => ({
      date: format(subDays(new Date(), 29 - i), "MMM dd"),
      tests: Math.floor(Math.random() * 200 + 400),
      positive: Math.floor(Math.random() * 50 + 80),
      accuracy: Math.random() * 5 + 94,
      processing_time: Math.random() * 2 + 1.5,
      users: Math.floor(Math.random() * 50 + 150),
      revenue: Math.floor(Math.random() * 5000 + 15000)
    }))

    const modelsData: PredictionModel[] = [
      {
        id: "outbreak_model",
        name: "Disease Outbreak Predictor",
        type: "disease_outbreak",
        accuracy: 89.3,
        lastTrained: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        status: "active",
        predictions: [
          { region: "Bangkok", risk: "low", probability: 15 },
          { region: "Chiang Mai", risk: "medium", probability: 45 },
          { region: "Mae Hong Son", risk: "high", probability: 78 }
        ]
      },
      {
        id: "resource_model",
        name: "Resource Planning AI",
        type: "resource_planning",
        accuracy: 92.1,
        lastTrained: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        nextUpdate: new Date(Date.now() + 11 * 24 * 60 * 60 * 1000),
        status: "active",
        predictions: [
          { resource: "test_kits", demand: 1250, confidence: 87 },
          { resource: "staff_hours", demand: 340, confidence: 92 },
          { resource: "equipment", demand: 15, confidence: 76 }
        ]
      }
    ]

    setMetrics(metricsData)
    setChartData(chartDataPoints)
    setPredictionModels(modelsData)
  }

  const updateRealTimeData = () => {
    setMetrics(prev => prev.map(metric => ({
      ...metric,
      value: metric.value + (Math.random() - 0.5) * metric.value * 0.01,
      change: metric.change + (Math.random() - 0.5) * 2
    })))

    setChartData(prev => {
      const newData = [...prev.slice(1)]
      newData.push({
        date: format(new Date(), "MMM dd"),
        tests: Math.floor(Math.random() * 200 + 400),
        positive: Math.floor(Math.random() * 50 + 80),
        accuracy: Math.random() * 5 + 94,
        processing_time: Math.random() * 2 + 1.5,
        users: Math.floor(Math.random() * 50 + 150),
        revenue: Math.floor(Math.random() * 5000 + 15000)
      })
      return newData
    })
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

  const formatMetricValue = (value: number, category: string) => {
    switch (category) {
      case "Financial":
        return `$${value.toFixed(2)}`
      case "Diagnostic":
      case "Quality":
      case "Usage":
        return `${value.toFixed(1)}%`
      case "Performance":
        return `${value.toFixed(1)}min`
      default:
        return Math.round(value).toLocaleString()
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400"
      case "training":
        return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400"
      case "outdated":
        return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400"
    }
  }

  const pieData = [
    { name: "Bangkok", value: 35, fill: "#10b981" },
    { name: "Chiang Mai", value: 25, fill: "#3b82f6" },
    { name: "Mae Hong Son", value: 20, fill: "#f59e0b" },
    { name: "Kanchanaburi", value: 12, fill: "#ef4444" },
    { name: "Tak", value: 8, fill: "#8b5cf6" }
  ]

  const radarData = [
    { subject: "Accuracy", A: 96, B: 94, fullMark: 100 },
    { subject: "Speed", A: 89, B: 85, fullMark: 100 },
    { subject: "Reliability", A: 92, B: 88, fullMark: 100 },
    { subject: "Usability", A: 88, B: 90, fullMark: 100 },
    { subject: "Cost Efficiency", A: 85, B: 82, fullMark: 100 },
    { subject: "Scalability", A: 91, B: 87, fullMark: 100 }
  ]

  const heatmapData = [
    { hour: "00", monday: 10, tuesday: 15, wednesday: 12, thursday: 8, friday: 20, saturday: 25, sunday: 18 },
    { hour: "06", monday: 45, tuesday: 50, wednesday: 48, thursday: 42, friday: 55, saturday: 35, sunday: 30 },
    { hour: "12", monday: 80, tuesday: 85, wednesday: 82, thursday: 78, friday: 90, saturday: 60, sunday: 55 },
    { hour: "18", monday: 65, tuesday: 70, wednesday: 68, thursday: 62, friday: 75, saturday: 85, sunday: 80 }
  ]

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header Controls */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Advanced Analytics Dashboard
            </CardTitle>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
                <SelectTrigger className="w-full sm:w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 3 months</SelectItem>
                  <SelectItem value="1y">Last year</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                <SelectTrigger className="w-full sm:w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Regions</SelectItem>
                  <SelectItem value="bangkok">Bangkok</SelectItem>
                  <SelectItem value="chiangmai">Chiang Mai</SelectItem>
                  <SelectItem value="maehongson">Mae Hong Son</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant={isRealTime ? "default" : "outline"}
                size="sm"
                onClick={() => setIsRealTime(!isRealTime)}
                className="gap-2"
              >
                {isRealTime ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                Real-time
              </Button>
              <Button variant="outline" size="sm">
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {metrics.map((metric) => (
          <Card key={metric.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{metric.name}</p>
                  <p className="text-2xl font-bold">{formatMetricValue(metric.value, metric.category)}</p>
                  <div className="flex items-center gap-1 text-sm">
                    {getTrendIcon(metric.trend)}
                    <span className={metric.change > 0 ? "text-green-600" : "text-red-600"}>
                      {Math.abs(metric.change).toFixed(1)}%
                    </span>
                    <span className="text-muted-foreground">vs last period</span>
                  </div>
                </div>
                <Badge variant="outline" className="text-xs">{metric.category}</Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Analytics */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="predictions">Predictions</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Test Volume Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" fontSize={12} />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Legend />
                      <Bar yAxisId="left" dataKey="tests" fill="#10b981" name="Total Tests" />
                      <Line yAxisId="right" type="monotone" dataKey="positive" stroke="#ef4444" strokeWidth={2} name="Positive Cases" />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Regional Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={120}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={radarData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="subject" />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} />
                      <Radar name="Current" dataKey="A" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
                      <Radar name="Target" dataKey="B" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} />
                      <Legend />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>User Activity Heatmap</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={heatmapData} layout="horizontal">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis type="category" dataKey="hour" />
                      <Tooltip />
                      <Bar dataKey="monday" stackId="a" fill="#ef4444" />
                      <Bar dataKey="tuesday" stackId="a" fill="#f59e0b" />
                      <Bar dataKey="wednesday" stackId="a" fill="#10b981" />
                      <Bar dataKey="thursday" stackId="a" fill="#3b82f6" />
                      <Bar dataKey="friday" stackId="a" fill="#8b5cf6" />
                      <Bar dataKey="saturday" stackId="a" fill="#06b6d4" />
                      <Bar dataKey="sunday" stackId="a" fill="#f97316" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Trends Tab */}
        <TabsContent value="trends" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Accuracy Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" fontSize={12} />
                      <YAxis domain={[90, 100]} />
                      <Tooltip />
                      <Line type="monotone" dataKey="accuracy" stroke="#10b981" strokeWidth={3} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Processing Time Evolution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" fontSize={12} />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="processing_time" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Revenue Growth</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" fontSize={12} />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="revenue" fill="#f59e0b" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>User Engagement</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" fontSize={12} />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="users" stroke="#8b5cf6" strokeWidth={2} strokeDasharray="5 5" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Predictions Tab */}
        <TabsContent value="predictions" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5" />
                    AI Prediction Models
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {predictionModels.map((model) => (
                      <div key={model.id} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <h3 className="font-medium">{model.name}</h3>
                            <Badge className={getStatusColor(model.status)} variant="outline">
                              {model.status}
                            </Badge>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Accuracy: {model.accuracy}%
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Last Trained:</span>
                            <p className="font-medium">{format(model.lastTrained, "MMM d, yyyy")}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Next Update:</span>
                            <p className="font-medium">{format(model.nextUpdate, "MMM d, yyyy")}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Type:</span>
                            <p className="font-medium capitalize">{model.type.replace('_', ' ')}</p>
                          </div>
                        </div>
                        <div className="mt-4">
                          <h4 className="text-sm font-medium mb-2">Recent Predictions:</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                            {model.predictions.map((pred, index) => (
                              <div key={index} className="p-2 bg-muted rounded text-xs">
                                {model.type === "disease_outbreak" ? (
                                  <div>
                                    <span className="font-medium">{pred.region}:</span>
                                    <span className={`ml-1 ${
                                      pred.risk === "high" ? "text-red-600" :
                                      pred.risk === "medium" ? "text-yellow-600" : "text-green-600"
                                    }`}>
                                      {pred.risk} risk ({pred.probability}%)
                                    </span>
                                  </div>
                                ) : (
                                  <div>
                                    <span className="font-medium">{pred.resource}:</span>
                                    <span className="ml-1">{pred.demand} ({pred.confidence}%)</span>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Forecast Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-3 border rounded">
                      <h4 className="font-medium text-sm mb-2">Next Week Prediction</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Expected Tests:</span>
                          <span className="font-medium">2,850</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Positive Rate:</span>
                          <span className="font-medium text-red-600">24.5%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Resource Need:</span>
                          <span className="font-medium text-orange-600">High</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-3 border rounded">
                      <h4 className="font-medium text-sm mb-2">Risk Assessment</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Outbreak Risk:</span>
                          <span className="font-medium text-yellow-600">Medium</span>
                        </div>
                        <div className="flex justify-between">
                          <span>System Overload:</span>
                          <span className="font-medium text-green-600">Low</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Quality Risk:</span>
                          <span className="font-medium text-green-600">Low</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>AI Recommendations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { type: "warning", message: "Consider increasing staff in Bangkok region" },
                      { type: "info", message: "Stock up on test kits for next week" },
                      { type: "success", message: "Quality metrics are within target range" },
                      { type: "warning", message: "Mae Hong Son requires attention" }
                    ].map((rec, index) => (
                      <div key={index} className={`p-2 rounded text-xs ${
                        rec.type === "warning" ? "bg-yellow-100 dark:bg-yellow-900/20" :
                        rec.type === "success" ? "bg-green-100 dark:bg-green-900/20" :
                        "bg-blue-100 dark:bg-blue-900/20"
                      }`}>
                        {rec.message}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>System Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "API Response Time", value: 145, unit: "ms", status: "good" },
                    { name: "Database Query Time", value: 23, unit: "ms", status: "excellent" },
                    { name: "Image Processing", value: 2.8, unit: "s", status: "good" },
                    { name: "AI Model Inference", value: 340, unit: "ms", status: "warning" },
                    { name: "Memory Usage", value: 68, unit: "%", status: "good" },
                    { name: "CPU Usage", value: 45, unit: "%", status: "excellent" }
                  ].map((metric, index) => (
                    <div key={index} className="flex justify-between items-center p-3 border rounded">
                      <div>
                        <p className="font-medium text-sm">{metric.name}</p>
                        <p className="text-xs text-muted-foreground">{metric.value}{metric.unit}</p>
                      </div>
                      <Badge 
                        className={
                          metric.status === "excellent" ? "bg-green-100 text-green-800 border-green-200" :
                          metric.status === "good" ? "bg-blue-100 text-blue-800 border-blue-200" :
                          "bg-yellow-100 text-yellow-800 border-yellow-200"
                        }
                        variant="outline"
                      >
                        {metric.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Error Rate Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData.map(d => ({ ...d, errors: Math.random() * 5 }))}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" fontSize={12} />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="errors" stroke="#ef4444" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Insights Tab */}
        <TabsContent value="insights" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Key Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      title: "Peak Usage Hours",
                      description: "System experiences highest load between 10 AM - 2 PM",
                      impact: "high",
                      category: "Usage Pattern"
                    },
                    {
                      title: "Regional Variation",
                      description: "Bangkok shows 15% higher accuracy rates compared to rural areas",
                      impact: "medium",
                      category: "Performance"
                    },
                    {
                      title: "Seasonal Trend",
                      description: "Malaria cases increase by 40% during rainy season",
                      impact: "high",
                      category: "Epidemiology"
                    },
                    {
                      title: "User Behavior",
                      description: "Mobile users complete 23% fewer tests than desktop users",
                      impact: "medium",
                      category: "User Experience"
                    }
                  ].map((insight, index) => (
                    <div key={index} className="p-3 border rounded">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-sm">{insight.title}</h4>
                        <Badge 
                          className={insight.impact === "high" ? "bg-red-100 text-red-800" : "bg-yellow-100 text-yellow-800"}
                          variant="outline"
                        >
                          {insight.impact} impact
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">{insight.description}</p>
                      <Badge variant="outline" className="text-xs">{insight.category}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      action: "Scale Infrastructure",
                      description: "Add server capacity during peak hours (10 AM - 2 PM)",
                      priority: "high",
                      effort: "medium"
                    },
                    {
                      action: "Training Program",
                      description: "Implement regional training to improve rural area accuracy",
                      priority: "medium",
                      effort: "high"
                    },
                    {
                      action: "Mobile Optimization",
                      description: "Improve mobile interface to increase completion rates",
                      priority: "medium",
                      effort: "low"
                    },
                    {
                      action: "Seasonal Preparation",
                      description: "Stock additional resources before rainy season",
                      priority: "high",
                      effort: "low"
                    }
                  ].map((rec, index) => (
                    <div key={index} className="p-3 border rounded">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-sm">{rec.action}</h4>
                        <div className="flex gap-1">
                          <Badge 
                            className={rec.priority === "high" ? "bg-red-100 text-red-800" : "bg-yellow-100 text-yellow-800"}
                            variant="outline"
                          >
                            {rec.priority}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">{rec.description}</p>
                      <div className="text-xs text-muted-foreground">
                        Effort: <span className="font-medium">{rec.effort}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Action Bar */}
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export Report
          </Button>
          <Button variant="outline" className="gap-2">
            <Share2 className="h-4 w-4" />
            Share Dashboard
          </Button>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Settings className="h-4 w-4" />
            Configure Alerts
          </Button>
          <Button variant="outline" className="gap-2">
            <Eye className="h-4 w-4" />
            Full Screen
          </Button>
        </div>
      </div>
    </div>
  )
}