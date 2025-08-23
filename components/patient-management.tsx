"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Users,
  Plus,
  Search,
  Filter,
  Edit,
  Eye,
  FileText,
  Calendar,
  MapPin,
  Phone,
  Mail,
  MoreHorizontal,
  Download,
  Archive,
  AlertTriangle,
  User,
  Activity,
  Clock,
  Hash
} from "lucide-react"
import { format, formatDistanceToNow } from "date-fns"

interface Patient {
  id: string
  firstName: string
  lastName: string
  age: number
  gender: "male" | "female"
  contactNumber: string
  email?: string
  address: string
  province: string
  registrationDate: Date
  lastVisit?: Date
  status: "active" | "inactive" | "archived"
  medicalHistory: string[]
  testResults: TestResult[]
  notes: string
}

interface TestResult {
  id: string
  date: Date
  type: "blood_smear" | "rapid_test"
  result: "positive" | "negative" | "inconclusive"
  parasiteType?: string
  parasiteCount?: number
  confidence: number
  technician: string
  notes?: string
}

interface PatientManagementProps {
  className?: string
}

export default function PatientManagement({ className }: PatientManagementProps) {
  const [patients, setPatients] = useState<Patient[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [isAddPatientOpen, setIsAddPatientOpen] = useState(false)
  const [isViewPatientOpen, setIsViewPatientOpen] = useState(false)

  useEffect(() => {
    generateSamplePatients()
  }, [])

  const generateSamplePatients = () => {
    const firstNames = ["Somchai", "Malee", "Piyawat", "Sunan", "Kamon", "Niran", "Pensri", "Warit", "Suda", "Chakrit"]
    const lastNames = ["Jantanakul", "Siripong", "Thanakit", "Wongsawat", "Kulrattana", "Suwannakit", "Phongphaiboon", "Rattanavong", "Sooksawat", "Theerawut"]
    const provinces = ["Bangkok", "Chiang Mai", "Mae Hong Son", "Kanchanaburi", "Tak"]
    const medicalConditions = ["Diabetes", "Hypertension", "Asthma", "Allergies", "Heart Disease"]
    
    const samplePatients: Patient[] = Array.from({ length: 25 }, (_, i) => {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)]
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)]
      const registrationDate = new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000)
      const lastVisit = Math.random() > 0.3 ? new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000) : undefined
      
      const testResults: TestResult[] = Array.from({ length: Math.floor(Math.random() * 5) + 1 }, (_, j) => ({
        id: `test_${i}_${j}`,
        date: new Date(registrationDate.getTime() + Math.random() * 90 * 24 * 60 * 60 * 1000),
        type: Math.random() > 0.5 ? "blood_smear" : "rapid_test",
        result: Math.random() > 0.7 ? "positive" : Math.random() > 0.5 ? "negative" : "inconclusive",
        parasiteType: Math.random() > 0.5 ? "Plasmodium falciparum" : "Plasmodium vivax",
        parasiteCount: Math.floor(Math.random() * 1000) + 10,
        confidence: Math.floor(Math.random() * 40) + 60,
        technician: "Dr. " + firstNames[Math.floor(Math.random() * firstNames.length)],
        notes: Math.random() > 0.7 ? "Follow-up recommended" : undefined
      }))

      return {
        id: `patient_${i}`,
        firstName,
        lastName,
        age: Math.floor(Math.random() * 60) + 18,
        gender: Math.random() > 0.5 ? "male" : "female",
        contactNumber: `+66${Math.floor(Math.random() * 90000000) + 10000000}`,
        email: Math.random() > 0.3 ? `${firstName.toLowerCase()}@email.com` : undefined,
        address: `${Math.floor(Math.random() * 999) + 1} Moo ${Math.floor(Math.random() * 10) + 1}`,
        province: provinces[Math.floor(Math.random() * provinces.length)],
        registrationDate,
        lastVisit,
        status: Math.random() > 0.8 ? "inactive" : Math.random() > 0.95 ? "archived" : "active",
        medicalHistory: Array.from({ length: Math.floor(Math.random() * 3) }, () => 
          medicalConditions[Math.floor(Math.random() * medicalConditions.length)]
        ),
        testResults,
        notes: Math.random() > 0.5 ? "Regular patient, responds well to treatment" : ""
      }
    })

    setPatients(samplePatients)
  }

  const filteredPatients = patients.filter(patient => {
    const matchesSearch = 
      patient.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.contactNumber.includes(searchTerm)
    
    const matchesStatus = statusFilter === "all" || patient.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400">Active</Badge>
      case "inactive":
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400">Inactive</Badge>
      case "archived":
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400">Archived</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getTestResultBadge = (result: string) => {
    switch (result) {
      case "positive":
        return <Badge className="bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400">Positive</Badge>
      case "negative":
        return <Badge className="bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400">Negative</Badge>
      case "inconclusive":
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400">Inconclusive</Badge>
      default:
        return <Badge variant="secondary">{result}</Badge>
    }
  }

  const stats = [
    {
      title: "Total Patients",
      value: patients.length,
      icon: Users,
      color: "text-blue-600"
    },
    {
      title: "Active Patients",
      value: patients.filter(p => p.status === "active").length,
      icon: Activity,
      color: "text-green-600"
    },
    {
      title: "Recent Tests",
      value: patients.reduce((acc, p) => acc + p.testResults.length, 0),
      icon: FileText,
      color: "text-purple-600"
    },
    {
      title: "Positive Cases",
      value: patients.reduce((acc, p) => 
        acc + p.testResults.filter(r => r.result === "positive").length, 0
      ),
      icon: AlertTriangle,
      color: "text-red-600"
    }
  ]

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <CardTitle>Patient Management</CardTitle>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-none">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search patients..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 min-w-[250px]"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[150px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
              <Dialog open={isAddPatientOpen} onOpenChange={setIsAddPatientOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Patient
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh]">
                  <DialogHeader>
                    <DialogTitle>Add New Patient</DialogTitle>
                  </DialogHeader>
                  <ScrollArea className="h-[70vh] pr-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>First Name</Label>
                        <Input placeholder="Enter first name" />
                      </div>
                      <div className="space-y-2">
                        <Label>Last Name</Label>
                        <Input placeholder="Enter last name" />
                      </div>
                      <div className="space-y-2">
                        <Label>Age</Label>
                        <Input type="number" placeholder="Age" />
                      </div>
                      <div className="space-y-2">
                        <Label>Gender</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2 col-span-2">
                        <Label>Contact Number</Label>
                        <Input placeholder="+66 XX XXX XXXX" />
                      </div>
                      <div className="space-y-2 col-span-2">
                        <Label>Email (Optional)</Label>
                        <Input type="email" placeholder="patient@email.com" />
                      </div>
                      <div className="space-y-2 col-span-2">
                        <Label>Address</Label>
                        <Input placeholder="Full address" />
                      </div>
                      <div className="space-y-2">
                        <Label>Province</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select province" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="bangkok">Bangkok</SelectItem>
                            <SelectItem value="chiangmai">Chiang Mai</SelectItem>
                            <SelectItem value="maehongson">Mae Hong Son</SelectItem>
                            <SelectItem value="kanchanaburi">Kanchanaburi</SelectItem>
                            <SelectItem value="tak">Tak</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Status</Label>
                        <Select defaultValue="active">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2 col-span-2">
                        <Label>Medical History</Label>
                        <Textarea placeholder="Enter any relevant medical history..." />
                      </div>
                      <div className="space-y-2 col-span-2">
                        <Label>Notes</Label>
                        <Textarea placeholder="Additional notes..." />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 mt-6">
                      <Button variant="outline" onClick={() => setIsAddPatientOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={() => setIsAddPatientOpen(false)}>
                        Add Patient
                      </Button>
                    </div>
                  </ScrollArea>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Age/Gender</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Visit</TableHead>
                  <TableHead>Tests</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPatients.map((patient) => (
                  <TableRow key={patient.id}>
                    <TableCell className="font-mono text-sm">
                      <div className="flex items-center gap-2">
                        <Hash className="h-3 w-3 text-muted-foreground" />
                        {patient.id.split('_')[1]}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{patient.firstName} {patient.lastName}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p>{patient.age} years</p>
                        <p className="text-muted-foreground capitalize">{patient.gender}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm space-y-1">
                        <div className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          <span className="font-mono">{patient.contactNumber}</span>
                        </div>
                        {patient.email && (
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Mail className="h-3 w-3" />
                            <span className="text-xs">{patient.email}</span>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        {patient.province}
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(patient.status)}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {patient.lastVisit ? (
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3 text-muted-foreground" />
                            <span title={format(patient.lastVisit, "PPP")}>
                              {formatDistanceToNow(patient.lastVisit, { addSuffix: true })}
                            </span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">No visits</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {patient.testResults.length} tests
                        </Badge>
                        {patient.testResults.some(t => t.result === "positive") && (
                          <Badge className="bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400 text-xs">
                            +
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedPatient(patient)
                              setIsViewPatientOpen(true)
                            }}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Patient
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <FileText className="h-4 w-4 mr-2" />
                            Generate Report
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Download className="h-4 w-4 mr-2" />
                            Export Data
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-yellow-600">
                            <Archive className="h-4 w-4 mr-2" />
                            Archive Patient
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredPatients.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No patients found</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Patient Details Dialog */}
      <Dialog open={isViewPatientOpen} onOpenChange={setIsViewPatientOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Patient Details: {selectedPatient?.firstName} {selectedPatient?.lastName}
            </DialogTitle>
          </DialogHeader>
          {selectedPatient && (
            <ScrollArea className="h-[70vh] pr-4">
              <div className="space-y-6">
                {/* Basic Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Basic Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-muted-foreground">Patient ID</Label>
                        <p className="font-mono">{selectedPatient.id}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Status</Label>
                        <div className="mt-1">{getStatusBadge(selectedPatient.status)}</div>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Age</Label>
                        <p>{selectedPatient.age} years</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Gender</Label>
                        <p className="capitalize">{selectedPatient.gender}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Registration Date</Label>
                        <p>{format(selectedPatient.registrationDate, "PPP")}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Last Visit</Label>
                        <p>{selectedPatient.lastVisit ? format(selectedPatient.lastVisit, "PPP") : "No visits"}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Contact Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span className="font-mono">{selectedPatient.contactNumber}</span>
                      </div>
                      {selectedPatient.email && (
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span>{selectedPatient.email}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{selectedPatient.address}, {selectedPatient.province}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Test Results */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Test Results</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedPatient.testResults.length > 0 ? (
                      <div className="space-y-4">
                        {selectedPatient.testResults.map((test) => (
                          <div key={test.id} className="border rounded-lg p-4">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <p className="font-medium">{test.type.replace('_', ' ').toUpperCase()}</p>
                                <p className="text-sm text-muted-foreground">
                                  {format(test.date, "PPP")} by {test.technician}
                                </p>
                              </div>
                              {getTestResultBadge(test.result)}
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              {test.parasiteType && (
                                <div>
                                  <span className="text-muted-foreground">Parasite:</span>
                                  <span className="ml-1">{test.parasiteType}</span>
                                </div>
                              )}
                              {test.parasiteCount && (
                                <div>
                                  <span className="text-muted-foreground">Count:</span>
                                  <span className="ml-1">{test.parasiteCount}/µL</span>
                                </div>
                              )}
                              <div>
                                <span className="text-muted-foreground">Confidence:</span>
                                <span className="ml-1">{test.confidence}%</span>
                              </div>
                            </div>
                            {test.notes && (
                              <p className="text-sm text-muted-foreground mt-2">{test.notes}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground">No test results available</p>
                    )}
                  </CardContent>
                </Card>

                {/* Medical History & Notes */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Medical History & Notes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <Label className="text-muted-foreground">Medical History</Label>
                        {selectedPatient.medicalHistory.length > 0 ? (
                          <div className="flex flex-wrap gap-2 mt-1">
                            {selectedPatient.medicalHistory.map((condition, index) => (
                              <Badge key={index} variant="outline">{condition}</Badge>
                            ))}
                          </div>
                        ) : (
                          <p className="text-muted-foreground text-sm">No medical history recorded</p>
                        )}
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Notes</Label>
                        <p className="text-sm mt-1">{selectedPatient.notes || "No notes"}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}