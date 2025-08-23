"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Activity,
  TrendingUp,
  Microscope,
  CheckCircle2,
  Clock,
  ArrowRight,
  BarChart3,
  History,
  MapPin,
  Upload,
  FileText,
  Calendar
} from "lucide-react"
import Link from "next/link"
import { storage, type AnalysisResult, type DashboardStats } from "@/lib/storage"
import { useTranslation } from "@/lib/i18n"

export default function DashboardPage() {
  const [recentAnalyses, setRecentAnalyses] = useState<AnalysisResult[]>([])
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const { t } = useTranslation()

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = () => {
    setRecentAnalyses(storage.getRecentAnalyses(5))
    setStats(storage.getDashboardStats())
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
      case 'positive': return <Activity className="h-4 w-4" />
      case 'negative': return <CheckCircle2 className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  return (
    <>
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border/40">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{t.dashboard.totalAnalyses}</CardTitle>
            <div className="p-2 bg-primary/10 rounded-full">
              <Activity className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-bold text-foreground">{stats?.totalTests || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-primary">+{stats?.testsThisMonth || 0}</span> this month
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border/40">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{t.dashboard.positiveCases}</CardTitle>
            <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-full">
              <TrendingUp className="h-4 w-4 text-red-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-bold text-foreground">{stats?.positiveTests || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-red-600">{stats?.totalTests ? ((stats.positiveTests / stats.totalTests) * 100).toFixed(1) : 0}%</span> detection rate
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border/40">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{t.dashboard.negativeCases}</CardTitle>
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-full">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-bold text-foreground">{stats?.negativeTests || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-green-600">{stats?.totalTests ? ((stats.negativeTests / stats.totalTests) * 100).toFixed(1) : 0}%</span> healthy samples
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border/40">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{t.dashboard.avgConfidence}</CardTitle>
            <div className="p-2 bg-primary/10 rounded-full">
              <Activity className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-bold text-foreground">
              {stats?.averageConfidence ? (stats.averageConfidence * 100).toFixed(1) : 0}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-primary">High accuracy</span> model performance
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        <Link href="/dashboard/analysis">
          <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border/40 cursor-pointer group">
            <CardHeader className="text-center pb-4">
              <div className="p-3 bg-primary/10 rounded-full mx-auto mb-3 group-hover:bg-primary/20 transition-colors">
                <Microscope className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-lg text-foreground">New Analysis</CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                Upload and analyze blood samples
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center pt-0">
              <Button variant="ghost" size="sm" className="group-hover:bg-primary/5">
                Start Analysis <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/history">
          <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border/40 cursor-pointer group">
            <CardHeader className="text-center pb-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full mx-auto mb-3 group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50 transition-colors">
                <History className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle className="text-lg text-foreground">View History</CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                Browse past analysis results
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center pt-0">
              <Button variant="ghost" size="sm" className="group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20">
                View Records <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/insights">
          <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border/40 cursor-pointer group">
            <CardHeader className="text-center pb-4">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full mx-auto mb-3 group-hover:bg-green-200 dark:group-hover:bg-green-900/50 transition-colors">
                <BarChart3 className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-lg text-foreground">Analytics</CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                View insights and statistics
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center pt-0">
              <Button variant="ghost" size="sm" className="group-hover:bg-green-50 dark:group-hover:bg-green-900/20">
                View Insights <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/map">
          <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border/40 cursor-pointer group">
            <CardHeader className="text-center pb-4">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full mx-auto mb-3 group-hover:bg-purple-200 dark:group-hover:bg-purple-900/50 transition-colors">
                <MapPin className="h-8 w-8 text-purple-600" />
              </div>
              <CardTitle className="text-lg text-foreground">Global Map</CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                Malaria distribution patterns
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center pt-0">
              <Button variant="ghost" size="sm" className="group-hover:bg-purple-50 dark:group-hover:bg-purple-900/20">
                View Map <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-border/40">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <CardTitle className="text-lg text-foreground">Recent Activity</CardTitle>
              </div>
              {recentAnalyses.length > 0 && (
                <Link href="/dashboard/history">
                  <Button variant="ghost" size="sm">
                    View All <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
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
                      Analysis #{analysis.id.slice(-6)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(analysis.timestamp).toLocaleDateString()}
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
                <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">No analyses yet</p>
                <p className="text-xs text-muted-foreground">Start by uploading your first sample</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card className="border-border/40">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-muted-foreground" />
              <CardTitle className="text-lg text-foreground">Quick Overview</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <p className="text-2xl font-bold text-foreground">{stats?.testsThisWeek || 0}</p>
                <p className="text-xs text-muted-foreground">This Week</p>
              </div>
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <p className="text-2xl font-bold text-foreground">{stats?.testsThisMonth || 0}</p>
                <p className="text-xs text-muted-foreground">This Month</p>
              </div>
            </div>
            
            {stats?.mostCommonParasite && (
              <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
                <p className="text-sm font-medium text-foreground mb-1">Most Common Parasite</p>
                <p className="text-lg font-bold text-primary">{stats.mostCommonParasite}</p>
              </div>
            )}

            <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/30 rounded-lg">
              <p className="text-sm font-medium text-foreground mb-1">System Status</p>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <p className="text-sm text-green-700 dark:text-green-400">All systems operational</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}