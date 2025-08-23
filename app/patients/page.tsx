"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Search,
  Filter,
  Download,
  Users,
  Calendar,
  Clock,
  TrendingUp,
  Bug,
  CheckCircle2,
  AlertCircle,
  MoreVertical,
  Eye,
  User,
  LogOut,
  Globe,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import Link from "next/link"
import { storage } from "@/lib/storage"
import { useTranslation } from "@/lib/i18n"

// Sample patient data that matches the image
const generateSamplePatients = () => [
  {
    id: "HN00001",
    name: "poomjai trioglao", 
    status: "positive" as const,
    date: "2025/01/01 06:00",
    parasiteType: "P. falciparum",
    confidence: 0.95,
    cellsAnalyzed: 1250,
    age: 34,
    gender: "Male",
  },
  {
    id: "HN00002", 
    name: "mana jinawa",
    status: "positive" as const,
    date: "2025/01/01 05:59",
    parasiteType: "P. vivax",
    confidence: 0.88,
    cellsAnalyzed: 980,
    age: 28,
    gender: "Female",
  },
  {
    id: "HN00003",
    name: "daichi hogthog", 
    status: "pending" as const,
    date: "2025/01/01 05:59",
    parasiteType: null,
    confidence: null,
    cellsAnalyzed: null,
    age: 45,
    gender: "Male",
  },
  {
    id: "HN00004",
    name: "sumchai pongwat",
    status: "pending" as const, 
    date: "2025/01/01 05:59",
    parasiteType: null,
    confidence: null,
    cellsAnalyzed: null,
    age: 32,
    gender: "Male",
  },
  {
    id: "HN00005",
    name: "surachi jaidee",
    status: "negative" as const,
    date: "2025/01/01 05:57",
    parasiteType: null,
    confidence: 0.92,
    cellsAnalyzed: 1100,
    age: 29,
    gender: "Female",
  },
]

type Patient = {
  id: string
  name: string
  status: "positive" | "negative" | "pending" | "inconclusive"
  date: string
  parasiteType?: string | null
  confidence?: number | null
  cellsAnalyzed?: number | null
  age?: number
  gender?: string
}

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([])
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [user, setUser] = useState(storage.getCurrentUser())
  const router = useRouter()
  
  // For demo purposes, we'll use static translation instead of hook
  // const { t, locale, setLocale } = useTranslation()
  const t = {
    patients: {
      title: 'Patient Management',
      subtitle: 'Manage patient records and analysis results',
      patientID: 'Patient ID',
      name: 'Name', 
      status: 'Status',
      date: 'Date',
      details: 'Details',
      positive: 'Positive',
      negative: 'Negative',
      inconclusive: 'Inconclusive',
      pending: 'Pending',
      search: 'Search patients...',
      filter: 'Filter by status',
      all: 'All',
      export: 'Export',
      viewDetails: 'View Details',
      totalPatients: 'Total Patients',
      today: 'Today',
      thisWeek: 'This Week', 
      thisMonth: 'This Month',
      noResults: 'No patients found',
    },
    common: {
      logout: 'Logout',
      language: 'Language',
    }
  }
  
  const locale = 'en'
  const setLocale = () => {}

  useEffect(() => {
    if (!user) {
      router.push("/auth/login")
      return
    }
    
    // Load sample data
    setPatients(generateSamplePatients())
  }, [user, router])

  useEffect(() => {
    let filtered = patients

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (patient) =>
          patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          patient.id.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter((patient) => patient.status === statusFilter)
    }

    setFilteredPatients(filtered)
    setCurrentPage(1)
  }, [patients, searchTerm, statusFilter])

  const handleLogout = () => {
    storage.signOut()
    router.push("/")
  }

  const handleExport = () => {
    const csvContent = [
      ['Patient ID', 'Name', 'Status', 'Date', 'Parasite Type', 'Confidence', 'Cells Analyzed'],
      ...filteredPatients.map(p => [
        p.id,
        p.name,
        p.status,
        p.date,
        p.parasiteType || '',
        p.confidence ? (p.confidence * 100).toFixed(1) + '%' : '',
        p.cellsAnalyzed?.toString() || ''
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `patients-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      positive: "bg-red-100 text-red-800 hover:bg-red-200",
      negative: "bg-green-100 text-green-800 hover:bg-green-200", 
      pending: "bg-orange-100 text-orange-800 hover:bg-orange-200",
      inconclusive: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
    }
    
    const labels = {
      positive: t.patients.positive,
      negative: t.patients.negative,
      pending: t.patients.pending,
      inconclusive: t.patients.inconclusive,
    }

    return (
      <Badge className={styles[status as keyof typeof styles] || styles.inconclusive}>
        {labels[status as keyof typeof labels] || status}
      </Badge>
    )
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'positive': return <Bug className="h-4 w-4 text-red-600" />
      case 'negative': return <CheckCircle2 className="h-4 w-4 text-green-600" />
      case 'pending': return <Clock className="h-4 w-4 text-orange-600" />
      default: return <AlertCircle className="h-4 w-4 text-yellow-600" />
    }
  }

  // Pagination
  const totalPages = Math.ceil(filteredPatients.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentPatients = filteredPatients.slice(startIndex, endIndex)

  // Stats
  const stats = {
    total: patients.length,
    positive: patients.filter(p => p.status === 'positive').length,
    negative: patients.filter(p => p.status === 'negative').length,
    pending: patients.filter(p => p.status === 'pending').length,
    today: patients.filter(p => new Date(p.date).toDateString() === new Date().toDateString()).length
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-sky-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-lg border-b border-blue-200/20 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/dashboard" className="flex items-center space-x-3 group">
                <div className="relative">
                  <img src="/favicon.png" alt="MalariaX" className="h-8 w-8 transition-transform group-hover:scale-110" />
                  <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-sky-600 bg-clip-text text-transparent">
                  MalariaX
                </span>
              </Link>
              <div className="ml-8 flex space-x-6">
                <Link href="/dashboard" className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-lg transition-colors">
                  แดชบอร์ด
                </Link>
                <Link href="/patients" className="text-blue-600 bg-blue-50 px-3 py-2 rounded-lg font-medium">
                  ผู้ป่วย
                </Link>
                <Link href="/map" className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-lg transition-colors">
                  แผนที่
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Select value={locale} onValueChange={setLocale}>
                <SelectTrigger className="w-20 border-0 bg-transparent">
                  <Globe className="h-4 w-4" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">EN</SelectItem>
                  <SelectItem value="th">ไทย</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex items-center space-x-3 bg-gray-50 rounded-full px-4 py-2">
                <div className="h-8 w-8 bg-gradient-to-br from-blue-500 to-sky-600 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
                <span className="text-sm font-medium">{user?.name}</span>
              </div>
              <Button onClick={handleLogout} variant="ghost" size="sm" className="hover:bg-red-50 hover:text-red-600">
                <LogOut className="h-4 w-4 mr-2" />
                {t.common.logout}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-sky-600 bg-clip-text text-transparent">
                {t.patients.title}
              </h1>
              <p className="text-gray-600 mt-2">{t.patients.subtitle}</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-700">{t.patients.totalPatients}</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900">{stats.total}</div>
              <p className="text-xs text-blue-600">{t.patients.today}: {stats.today}</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-red-700">{t.patients.positive}</CardTitle>
              <Bug className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-900">{stats.positive}</div>
              <p className="text-xs text-red-600">
                {((stats.positive / stats.total) * 100).toFixed(1)}% of total
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-700">{t.patients.negative}</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-900">{stats.negative}</div>
              <p className="text-xs text-green-600">
                {((stats.negative / stats.total) * 100).toFixed(1)}% of total
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-orange-700">{t.patients.pending}</CardTitle>
              <Clock className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-900">{stats.pending}</div>
              <p className="text-xs text-orange-600">
                {((stats.pending / stats.total) * 100).toFixed(1)}% of total
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-4 w-full">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder={t.patients.search}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-gray-200 focus:border-blue-500"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-48">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder={t.patients.filter} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t.patients.all}</SelectItem>
                    <SelectItem value="positive">{t.patients.positive}</SelectItem>
                    <SelectItem value="negative">{t.patients.negative}</SelectItem>
                    <SelectItem value="pending">{t.patients.pending}</SelectItem>
                    <SelectItem value="inconclusive">{t.patients.inconclusive}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleExport} className="bg-blue-600 hover:bg-blue-700">
                <Download className="h-4 w-4 mr-2" />
                {t.patients.export}
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Patients Table */}
        <Card>
          <CardContent className="p-0">
            {currentPatients.length > 0 ? (
              <>
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50/50">
                      <TableHead className="font-semibold">{t.patients.patientID}</TableHead>
                      <TableHead className="font-semibold">{t.patients.name}</TableHead>
                      <TableHead className="font-semibold">{t.patients.status}</TableHead>
                      <TableHead className="font-semibold">{t.patients.date}</TableHead>
                      <TableHead className="font-semibold text-center">{t.patients.details}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentPatients.map((patient) => (
                      <TableRow key={patient.id} className="hover:bg-blue-50/30 transition-colors">
                        <TableCell className="font-medium text-blue-600">{patient.id}</TableCell>
                        <TableCell className="font-medium">{patient.name}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(patient.status)}
                            {getStatusBadge(patient.status)}
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-600">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-3 w-3" />
                            {patient.date}
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            {t.patients.viewDetails}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between px-6 py-4 border-t bg-gray-50/30">
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-gray-600">
                        Showing {startIndex + 1} to {Math.min(endIndex, filteredPatients.length)} of {filteredPatients.length} results
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <div className="flex gap-1">
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          const page = i + 1
                          return (
                            <Button
                              key={page}
                              variant={currentPage === page ? "default" : "outline"}
                              size="sm"
                              onClick={() => setCurrentPage(page)}
                              className="w-8 h-8"
                            >
                              {page}
                            </Button>
                          )
                        })}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600 text-lg">{t.patients.noResults}</p>
                <p className="text-gray-500 text-sm mt-2">Try adjusting your search or filter criteria</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}