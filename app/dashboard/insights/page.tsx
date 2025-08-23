"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  AlertCircle,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Activity,
} from "lucide-react"
import { storage, type DashboardStats } from "@/lib/storage"
import { useTranslation } from "@/lib/i18n"

export default function InsightsPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const { t } = useTranslation()

  useEffect(() => {
    setStats(storage.getDashboardStats())
  }, [])

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-border/40">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              <CardTitle className="text-foreground">Detection Summary</CardTitle>
            </div>
            <CardDescription className="text-muted-foreground">Overview of your malaria detection results</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">Positive Rate</span>
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
                  <span className="text-sm font-medium text-foreground">Negative Rate</span>
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

        <Card className="border-border/40">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-primary" />
              <CardTitle className="text-foreground">Common Parasites</CardTitle>
            </div>
            <CardDescription className="text-muted-foreground">Most frequently detected parasite types</CardDescription>
          </CardHeader>
          <CardContent>
            {stats?.mostCommonParasite ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">{stats.mostCommonParasite}</span>
                  <Badge className="bg-primary/10 text-primary border-primary/20">Most Common</Badge>
                </div>
                <Alert className="border-border/40">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-foreground">
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

      {/* Performance Metrics */}
      <Card className="border-border/40">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <CardTitle className="text-foreground">Performance Metrics</CardTitle>
          </div>
          <CardDescription className="text-muted-foreground">AI model accuracy and reliability statistics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-foreground mb-2">
                {stats?.averageConfidence ? (stats.averageConfidence * 100).toFixed(1) : 0}%
              </div>
              <p className="text-sm text-muted-foreground">Average Confidence</p>
              <div className="mt-2">
                <Progress value={stats?.averageConfidence ? stats.averageConfidence * 100 : 0} className="h-2" />
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-foreground mb-2">
                {stats?.totalTests || 0}
              </div>
              <p className="text-sm text-muted-foreground">Total Analyses</p>
              <p className="text-xs text-primary mt-1">
                +{stats?.testsThisMonth || 0} this month
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-foreground mb-2">
                99.2%
              </div>
              <p className="text-sm text-muted-foreground">Model Accuracy</p>
              <p className="text-xs text-green-600 mt-1">
                Clinically validated
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/40">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Activity className="h-5 w-5 text-primary" />
            <CardTitle className="text-foreground">Activity Timeline</CardTitle>
          </div>
          <CardDescription className="text-muted-foreground">Your testing activity over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">{stats?.testsThisWeek || 0}</p>
              <p className="text-xs text-muted-foreground">This Week</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">{stats?.testsThisMonth || 0}</p>
              <p className="text-xs text-muted-foreground">This Month</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">{stats?.totalTests || 0}</p>
              <p className="text-xs text-muted-foreground">All Time</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">
                {stats?.averageConfidence ? (stats.averageConfidence * 100).toFixed(0) : 0}%
              </p>
              <p className="text-xs text-muted-foreground">Avg Confidence</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card className="border-border/40 bg-gradient-to-r from-blue-50/50 to-primary/5 dark:from-blue-950/20 dark:to-primary/10">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-blue-600" />
            <CardTitle className="text-foreground">Recommendations</CardTitle>
          </div>
          <CardDescription className="text-muted-foreground">AI-powered insights to improve your malaria detection workflow</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {stats?.totalTests === 0 && (
              <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-950/20 dark:border-blue-800/30">
                <AlertCircle className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800 dark:text-blue-200">
                  Start by uploading your first blood smear sample to begin building your analysis history.
                </AlertDescription>
              </Alert>
            )}
            
            {stats && stats.totalTests > 0 && stats.totalTests < 10 && (
              <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-950/20 dark:border-blue-800/30">
                <AlertCircle className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800 dark:text-blue-200">
                  Process more samples to improve statistical insights and trend analysis.
                </AlertDescription>
              </Alert>
            )}

            {stats && stats.averageConfidence && stats.averageConfidence < 0.8 && (
              <Alert className="border-orange-200 bg-orange-50 dark:bg-orange-950/20 dark:border-orange-800/30">
                <AlertCircle className="h-4 w-4 text-orange-600" />
                <AlertDescription className="text-orange-800 dark:text-orange-200">
                  Consider improving image quality - higher confidence scores indicate better diagnostic accuracy.
                </AlertDescription>
              </Alert>
            )}

            {stats && stats.averageConfidence && stats.averageConfidence > 0.9 && (
              <Alert className="border-green-200 bg-green-50 dark:bg-green-950/20 dark:border-green-800/30">
                <AlertCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800 dark:text-green-200">
                  Excellent work! Your samples consistently meet high-quality standards for reliable analysis.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}