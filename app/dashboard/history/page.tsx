"use client"

import { useState, useEffect, useMemo, memo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { 
  FileText,
  Download,
  Microscope,
  Calendar,
  Trash2,
} from "lucide-react"
import { storage, type AnalysisResult } from "@/lib/storage"
import { useTranslation } from "@/lib/i18n"

function HistoryPage() {
  const [recentAnalyses, setRecentAnalyses] = useState<AnalysisResult[]>([])
  const { t } = useTranslation()

  useEffect(() => {
    setRecentAnalyses(storage.getRecentAnalyses(50)) // Get more for history page
  }, [])

  const handleExport = () => {
    storage.exportAnalysesToCSV()
  }

  const handleDeleteAnalysis = (id: string) => {
    if (confirm("Are you sure you want to delete this analysis?")) {
      storage.deleteAnalysis(id)
      setRecentAnalyses(storage.getRecentAnalyses(50))
    }
  }

  const getStatusColor = useMemo(() => (status: string) => {
    switch (status) {
      case 'positive': return 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/20 dark:text-red-400 dark:border-red-800/30'
      case 'negative': return 'bg-green-50 text-green-700 border-green-200 dark:bg-green-950/20 dark:text-green-400 dark:border-green-800/30'
      default: return 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950/20 dark:text-yellow-400 dark:border-yellow-800/30'
    }
  }, [])

  return (
    <Card className="overflow-hidden border-border/40 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-muted/30 to-muted/10 flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0 border-b border-border/40">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-primary/10 rounded-full">
            <FileText className="h-6 w-6 text-primary" />
          </div>
          <div>
            <CardTitle className="text-xl text-foreground">Analysis History</CardTitle>
            <CardDescription className="text-base text-muted-foreground">Comprehensive view of all your analyses</CardDescription>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
            {recentAnalyses.length} Records
          </Badge>
          <Button onClick={handleExport} variant="outline" size="sm" className="hover:bg-primary/5 hover:border-primary/30">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {recentAnalyses.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border/40">
                  <TableHead className="text-foreground">Date</TableHead>
                  <TableHead className="text-foreground">Status</TableHead>
                  <TableHead className="hidden sm:table-cell text-foreground">Parasite Type</TableHead>
                  <TableHead className="hidden md:table-cell text-foreground">Density</TableHead>
                  <TableHead className="text-foreground">Confidence</TableHead>
                  <TableHead className="text-foreground">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentAnalyses.map((analysis) => (
                  <TableRow key={analysis.id} className="border-border/40 hover:bg-muted/30">
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm text-foreground">
                          {new Date(analysis.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(analysis.status)}>
                        {analysis.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-sm text-foreground">
                      {analysis.parasiteType || '-'}
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-sm text-foreground">
                      {analysis.parasiteDensity ? `${analysis.parasiteDensity}/μL` : '-'}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Progress value={analysis.confidence * 100} className="w-12 sm:w-16" />
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
                        className="hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/20 dark:hover:text-red-400"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-12">
            <Microscope className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-lg">No analyses yet</p>
            <p className="text-sm text-muted-foreground">Upload your first blood sample to get started</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default memo(HistoryPage)