"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Cloud,
  Download,
  Upload,
  RefreshCw,
  Settings,
  Clock,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Database,
  HardDrive,
  Smartphone,
  Wifi,
  WifiOff,
  Shield,
  Key,
  Timer,
  Zap,
  Archive,
  Trash2,
  Eye,
  Play,
  Pause,
  RotateCcw
} from "lucide-react"
import { format, formatDistanceToNow } from "date-fns"

interface BackupJob {
  id: string
  name: string
  type: "full" | "incremental" | "differential"
  status: "running" | "completed" | "failed" | "scheduled" | "paused"
  progress: number
  destination: "cloud" | "local" | "external"
  size: string
  duration?: string
  startTime?: Date
  completedTime?: Date
  nextRun?: Date
  schedule: string
  includeData: string[]
  encryption: boolean
  compression: boolean
  retentionDays: number
}

interface SyncJob {
  id: string
  name: string
  source: string
  target: string
  status: "syncing" | "synced" | "failed" | "conflict" | "paused"
  lastSync?: Date
  nextSync?: Date
  syncType: "real-time" | "scheduled" | "manual"
  conflicts: number
  filesProcessed: number
  totalFiles: number
  schedule?: string
  bidirectional: boolean
}

interface StorageInfo {
  location: string
  type: "local" | "cloud" | "external"
  totalSpace: string
  usedSpace: string
  freeSpace: string
  usage: number
  status: "healthy" | "warning" | "critical"
  lastChecked: Date
}

interface BackupSyncProps {
  className?: string
}

export default function BackupSync({ className }: BackupSyncProps) {
  const [backupJobs, setBackupJobs] = useState<BackupJob[]>([])
  const [syncJobs, setSyncJobs] = useState<SyncJob[]>([])
  const [storageInfo, setStorageInfo] = useState<StorageInfo[]>([])
  const [isAutoBackupEnabled, setIsAutoBackupEnabled] = useState(true)
  const [isAutoSyncEnabled, setIsAutoSyncEnabled] = useState(true)
  const [connectionStatus, setConnectionStatus] = useState<"online" | "offline">("online")
  const [isCreateBackupOpen, setIsCreateBackupOpen] = useState(false)
  const [isCreateSyncOpen, setIsCreateSyncOpen] = useState(false)

  useEffect(() => {
    initializeData()
    const interval = setInterval(updateJobStatuses, 5000)
    return () => clearInterval(interval)
  }, [])

  const initializeData = () => {
    const backupJobsData: BackupJob[] = [
      {
        id: "backup_1",
        name: "Daily Patient Data Backup",
        type: "incremental",
        status: "completed",
        progress: 100,
        destination: "cloud",
        size: "2.4 GB",
        duration: "12 min",
        startTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
        completedTime: new Date(Date.now() - 2 * 60 * 60 * 1000 + 12 * 60 * 1000),
        nextRun: new Date(Date.now() + 22 * 60 * 60 * 1000),
        schedule: "Daily at 2:00 AM",
        includeData: ["patients", "test_results", "images"],
        encryption: true,
        compression: true,
        retentionDays: 30
      },
      {
        id: "backup_2",
        name: "Weekly Full System Backup",
        type: "full",
        status: "running",
        progress: 67,
        destination: "external",
        size: "15.2 GB",
        startTime: new Date(Date.now() - 30 * 60 * 1000),
        nextRun: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
        schedule: "Weekly on Sunday",
        includeData: ["patients", "test_results", "images", "system_config", "user_data"],
        encryption: true,
        compression: true,
        retentionDays: 90
      },
      {
        id: "backup_3",
        name: "Configuration Backup",
        type: "differential",
        status: "scheduled",
        progress: 0,
        destination: "local",
        size: "245 MB",
        nextRun: new Date(Date.now() + 4 * 60 * 60 * 1000),
        schedule: "Every 6 hours",
        includeData: ["system_config", "user_preferences"],
        encryption: false,
        compression: true,
        retentionDays: 14
      }
    ]

    const syncJobsData: SyncJob[] = [
      {
        id: "sync_1",
        name: "Cloud Data Sync",
        source: "Local Storage",
        target: "AWS S3",
        status: "synced",
        lastSync: new Date(Date.now() - 15 * 60 * 1000),
        nextSync: new Date(Date.now() + 45 * 60 * 1000),
        syncType: "scheduled",
        conflicts: 0,
        filesProcessed: 1250,
        totalFiles: 1250,
        schedule: "Every hour",
        bidirectional: false
      },
      {
        id: "sync_2",
        name: "Multi-Site Sync",
        source: "Bangkok Lab",
        target: "Chiang Mai Lab",
        status: "syncing",
        lastSync: new Date(Date.now() - 5 * 60 * 1000),
        syncType: "real-time",
        conflicts: 2,
        filesProcessed: 89,
        totalFiles: 120,
        bidirectional: true
      },
      {
        id: "sync_3",
        name: "Mobile Device Sync",
        source: "Mobile Tablets",
        target: "Central Server",
        status: "conflict",
        lastSync: new Date(Date.now() - 2 * 60 * 60 * 1000),
        nextSync: new Date(Date.now() + 30 * 60 * 1000),
        syncType: "manual",
        conflicts: 5,
        filesProcessed: 45,
        totalFiles: 67,
        bidirectional: true
      }
    ]

    const storageData: StorageInfo[] = [
      {
        location: "Local Storage",
        type: "local",
        totalSpace: "2 TB",
        usedSpace: "1.2 TB",
        freeSpace: "800 GB",
        usage: 60,
        status: "healthy",
        lastChecked: new Date()
      },
      {
        location: "AWS S3 Cloud",
        type: "cloud",
        totalSpace: "Unlimited",
        usedSpace: "4.8 TB",
        freeSpace: "Unlimited",
        usage: 0,
        status: "healthy",
        lastChecked: new Date()
      },
      {
        location: "External Drive #1",
        type: "external",
        totalSpace: "4 TB",
        usedSpace: "3.2 TB",
        freeSpace: "800 GB",
        usage: 80,
        status: "warning",
        lastChecked: new Date(Date.now() - 60 * 60 * 1000)
      },
      {
        location: "External Drive #2",
        type: "external",
        totalSpace: "4 TB",
        usedSpace: "3.8 TB",
        freeSpace: "200 GB",
        usage: 95,
        status: "critical",
        lastChecked: new Date(Date.now() - 30 * 60 * 1000)
      }
    ]

    setBackupJobs(backupJobsData)
    setSyncJobs(syncJobsData)
    setStorageInfo(storageData)
  }

  const updateJobStatuses = () => {
    setBackupJobs(prev => prev.map(job => {
      if (job.status === "running") {
        const newProgress = Math.min(job.progress + Math.random() * 5, 100)
        if (newProgress >= 100) {
          return {
            ...job,
            status: "completed" as const,
            progress: 100,
            completedTime: new Date(),
            duration: "15 min"
          }
        }
        return { ...job, progress: newProgress }
      }
      return job
    }))

    setSyncJobs(prev => prev.map(job => {
      if (job.status === "syncing") {
        const newProcessed = Math.min(job.filesProcessed + Math.floor(Math.random() * 3), job.totalFiles)
        if (newProcessed >= job.totalFiles) {
          return {
            ...job,
            status: "synced" as const,
            filesProcessed: job.totalFiles,
            lastSync: new Date()
          }
        }
        return { ...job, filesProcessed: newProcessed }
      }
      return job
    }))
  }

  const getStatusBadge = (status: string, type: "backup" | "sync" = "backup") => {
    const colors = {
      running: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400",
      syncing: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400",
      completed: "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400",
      synced: "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400",
      failed: "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400",
      scheduled: "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400",
      conflict: "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400",
      paused: "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400"
    }

    return <Badge className={colors[status as keyof typeof colors]} variant="outline">{status}</Badge>
  }

  const getStorageIcon = (type: string) => {
    switch (type) {
      case "cloud":
        return <Cloud className="h-4 w-4" />
      case "external":
        return <HardDrive className="h-4 w-4" />
      default:
        return <Database className="h-4 w-4" />
    }
  }

  const getStorageStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
        return "text-green-600"
      case "warning":
        return "text-yellow-600"
      case "critical":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  const startBackupJob = (jobId: string) => {
    setBackupJobs(prev => prev.map(job => 
      job.id === jobId 
        ? { ...job, status: "running", progress: 0, startTime: new Date() }
        : job
    ))
  }

  const pauseResumeJob = (jobId: string, type: "backup" | "sync") => {
    if (type === "backup") {
      setBackupJobs(prev => prev.map(job => 
        job.id === jobId 
          ? { ...job, status: job.status === "paused" ? "running" : "paused" }
          : job
      ))
    } else {
      setSyncJobs(prev => prev.map(job => 
        job.id === jobId 
          ? { ...job, status: job.status === "paused" ? "syncing" : "paused" }
          : job
      ))
    }
  }

  const runningJobs = backupJobs.filter(job => job.status === "running").length
  const syncingJobs = syncJobs.filter(job => job.status === "syncing").length
  const totalBackups = backupJobs.filter(job => job.status === "completed").length
  const conflictCount = syncJobs.reduce((acc, job) => acc + job.conflicts, 0)

  const stats = [
    { title: "Active Backups", value: runningJobs, icon: Download, color: "text-blue-600" },
    { title: "Active Syncs", value: syncingJobs, icon: RefreshCw, color: "text-green-600" },
    { title: "Total Backups", value: totalBackups, icon: Archive, color: "text-purple-600" },
    { title: "Sync Conflicts", value: conflictCount, icon: AlertTriangle, color: "text-orange-600" }
  ]

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Connection Status & Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Backup & Sync Control Panel
            </CardTitle>
            <div className="flex items-center gap-2">
              {connectionStatus === "online" ? (
                <div className="flex items-center gap-2 text-green-600">
                  <Wifi className="h-4 w-4" />
                  <span className="text-sm">Online</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-red-600">
                  <WifiOff className="h-4 w-4" />
                  <span className="text-sm">Offline</span>
                </div>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="text-sm font-medium">Auto Backup</p>
                <p className="text-xs text-muted-foreground">Scheduled backups</p>
              </div>
              <Switch 
                checked={isAutoBackupEnabled} 
                onCheckedChange={setIsAutoBackupEnabled} 
              />
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="text-sm font-medium">Auto Sync</p>
                <p className="text-xs text-muted-foreground">Real-time sync</p>
              </div>
              <Switch 
                checked={isAutoSyncEnabled} 
                onCheckedChange={setIsAutoSyncEnabled} 
              />
            </div>
            <Button variant="outline" className="h-auto p-3 justify-start">
              <Shield className="h-4 w-4 mr-2" />
              <div className="text-left">
                <p className="text-sm font-medium">Encryption</p>
                <p className="text-xs text-muted-foreground">AES-256 enabled</p>
              </div>
            </Button>
            <Button variant="outline" className="h-auto p-3 justify-start">
              <Zap className="h-4 w-4 mr-2" />
              <div className="text-left">
                <p className="text-sm font-medium">Quick Backup</p>
                <p className="text-xs text-muted-foreground">Start now</p>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="backups" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="backups">Backup Jobs</TabsTrigger>
              <TabsTrigger value="sync">Sync Jobs</TabsTrigger>
            </TabsList>

            {/* Backup Jobs */}
            <TabsContent value="backups">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Download className="h-5 w-5" />
                      Backup Jobs
                    </CardTitle>
                    <Dialog open={isCreateBackupOpen} onOpenChange={setIsCreateBackupOpen}>
                      <DialogTrigger asChild>
                        <Button size="sm" className="gap-2">
                          <Download className="h-4 w-4" />
                          New Backup
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Create New Backup Job</DialogTitle>
                          <DialogDescription>Configure a new backup job with custom settings</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Job Name</Label>
                              <Input placeholder="Enter backup job name" />
                            </div>
                            <div className="space-y-2">
                              <Label>Backup Type</Label>
                              <Select>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="full">Full Backup</SelectItem>
                                  <SelectItem value="incremental">Incremental</SelectItem>
                                  <SelectItem value="differential">Differential</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Destination</Label>
                              <Select>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select destination" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="cloud">Cloud Storage</SelectItem>
                                  <SelectItem value="local">Local Storage</SelectItem>
                                  <SelectItem value="external">External Drive</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label>Schedule</Label>
                              <Select>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select schedule" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="daily">Daily</SelectItem>
                                  <SelectItem value="weekly">Weekly</SelectItem>
                                  <SelectItem value="monthly">Monthly</SelectItem>
                                  <SelectItem value="manual">Manual Only</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <div className="space-y-3">
                            <Label>Data to Include</Label>
                            <div className="grid grid-cols-2 gap-2">
                              {["patients", "test_results", "images", "system_config", "user_data", "reports"].map(item => (
                                <div key={item} className="flex items-center space-x-2">
                                  <Checkbox id={item} defaultChecked />
                                  <label htmlFor={item} className="text-sm capitalize cursor-pointer">
                                    {item.replace('_', ' ')}
                                  </label>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center justify-between">
                              <Label>Enable Encryption</Label>
                              <Switch defaultChecked />
                            </div>
                            <div className="flex items-center justify-between">
                              <Label>Enable Compression</Label>
                              <Switch defaultChecked />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label>Retention Period (days)</Label>
                            <Input type="number" defaultValue="30" min="1" max="365" />
                          </div>
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" onClick={() => setIsCreateBackupOpen(false)}>
                            Cancel
                          </Button>
                          <Button onClick={() => setIsCreateBackupOpen(false)}>
                            Create Backup Job
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {backupJobs.map((job) => (
                      <div key={job.id} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <h3 className="font-medium">{job.name}</h3>
                            {getStatusBadge(job.status)}
                            <Badge variant="outline" className="text-xs capitalize">{job.type}</Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            {job.status !== "running" && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => startBackupJob(job.id)}
                                className="h-8 w-8 p-0"
                              >
                                <Play className="h-4 w-4" />
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => pauseResumeJob(job.id, "backup")}
                              className="h-8 w-8 p-0"
                            >
                              {job.status === "paused" ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                            </Button>
                            <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                              <Settings className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        
                        {job.status === "running" && (
                          <div className="mb-3">
                            <div className="flex justify-between text-sm mb-1">
                              <span>Progress</span>
                              <span>{job.progress.toFixed(0)}%</span>
                            </div>
                            <Progress value={job.progress} className="w-full" />
                          </div>
                        )}

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Size:</span>
                            <span className="ml-1 font-medium">{job.size}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Destination:</span>
                            <span className="ml-1 font-medium capitalize">{job.destination}</span>
                          </div>
                          {job.duration && (
                            <div>
                              <span className="text-muted-foreground">Duration:</span>
                              <span className="ml-1 font-medium">{job.duration}</span>
                            </div>
                          )}
                          <div>
                            <span className="text-muted-foreground">Next Run:</span>
                            <span className="ml-1 font-medium">
                              {job.nextRun ? format(job.nextRun, "MMM d, HH:mm") : "Manual"}
                            </span>
                          </div>
                        </div>

                        <div className="flex justify-between items-center mt-3 pt-3 border-t">
                          <div className="text-xs text-muted-foreground">
                            {job.completedTime ? (
                              <span>Completed {formatDistanceToNow(job.completedTime, { addSuffix: true })}</span>
                            ) : job.startTime ? (
                              <span>Started {formatDistanceToNow(job.startTime, { addSuffix: true })}</span>
                            ) : (
                              <span>Schedule: {job.schedule}</span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            {job.encryption && <Shield className="h-3 w-3" title="Encrypted" />}
                            {job.compression && <Archive className="h-3 w-3" title="Compressed" />}
                            <span>{job.includeData.length} data types</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Sync Jobs */}
            <TabsContent value="sync">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <RefreshCw className="h-5 w-5" />
                      Sync Jobs
                    </CardTitle>
                    <Dialog open={isCreateSyncOpen} onOpenChange={setIsCreateSyncOpen}>
                      <DialogTrigger asChild>
                        <Button size="sm" className="gap-2">
                          <RefreshCw className="h-4 w-4" />
                          New Sync
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Create New Sync Job</DialogTitle>
                          <DialogDescription>Configure data synchronization between locations</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label>Sync Job Name</Label>
                            <Input placeholder="Enter sync job name" />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Source</Label>
                              <Select>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select source" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="local">Local Storage</SelectItem>
                                  <SelectItem value="cloud">Cloud Storage</SelectItem>
                                  <SelectItem value="mobile">Mobile Devices</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label>Target</Label>
                              <Select>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select target" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="local">Local Storage</SelectItem>
                                  <SelectItem value="cloud">Cloud Storage</SelectItem>
                                  <SelectItem value="mobile">Mobile Devices</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Sync Type</Label>
                              <Select>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select sync type" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="real-time">Real-time</SelectItem>
                                  <SelectItem value="scheduled">Scheduled</SelectItem>
                                  <SelectItem value="manual">Manual</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label>Schedule</Label>
                              <Select>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select frequency" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="5min">Every 5 minutes</SelectItem>
                                  <SelectItem value="hourly">Every hour</SelectItem>
                                  <SelectItem value="daily">Daily</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <Label>Bidirectional Sync</Label>
                            <Switch />
                          </div>
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" onClick={() => setIsCreateSyncOpen(false)}>
                            Cancel
                          </Button>
                          <Button onClick={() => setIsCreateSyncOpen(false)}>
                            Create Sync Job
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {syncJobs.map((job) => (
                      <div key={job.id} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <h3 className="font-medium">{job.name}</h3>
                            {getStatusBadge(job.status, "sync")}
                            {job.conflicts > 0 && (
                              <Badge variant="destructive" className="text-xs">
                                {job.conflicts} conflicts
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => pauseResumeJob(job.id, "sync")}
                              className="h-8 w-8 p-0"
                            >
                              {job.status === "paused" ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                            </Button>
                            <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                              <Settings className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-sm mb-3">
                          <div className="flex items-center gap-2">
                            <span>{job.source}</span>
                            <RefreshCw className="h-3 w-3" />
                            <span>{job.target}</span>
                            {job.bidirectional && <span className="text-xs text-muted-foreground">(Bidirectional)</span>}
                          </div>
                          <Badge variant="outline" className="text-xs capitalize">{job.syncType}</Badge>
                        </div>

                        {(job.status === "syncing" || job.status === "conflict") && (
                          <div className="mb-3">
                            <div className="flex justify-between text-sm mb-1">
                              <span>Progress</span>
                              <span>{job.filesProcessed}/{job.totalFiles} files</span>
                            </div>
                            <Progress value={(job.filesProcessed / job.totalFiles) * 100} className="w-full" />
                          </div>
                        )}

                        <div className="flex justify-between items-center text-xs text-muted-foreground">
                          <div>
                            {job.lastSync ? (
                              <span>Last sync: {formatDistanceToNow(job.lastSync, { addSuffix: true })}</span>
                            ) : (
                              <span>Never synced</span>
                            )}
                          </div>
                          <div>
                            {job.nextSync && (
                              <span>Next sync: {format(job.nextSync, "HH:mm")}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Storage Info Sidebar */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HardDrive className="h-5 w-5" />
                Storage Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {storageInfo.map((storage, index) => (
                  <div key={index} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getStorageIcon(storage.type)}
                        <span className="font-medium text-sm">{storage.location}</span>
                      </div>
                      <div className={`text-xs ${getStorageStatusColor(storage.status)}`}>
                        {storage.status}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span>Used: {storage.usedSpace}</span>
                        <span>Free: {storage.freeSpace}</span>
                      </div>
                      <Progress value={storage.usage} className="h-2" />
                      <div className="text-xs text-muted-foreground">
                        Total: {storage.totalSpace}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-48">
                <div className="space-y-3">
                  {[
                    { time: "2 min ago", action: "Patient data backup completed", type: "success" },
                    { time: "15 min ago", action: "Cloud sync started", type: "info" },
                    { time: "1 hour ago", action: "Mobile device sync failed", type: "error" },
                    { time: "2 hours ago", action: "Weekly full backup started", type: "info" },
                    { time: "4 hours ago", action: "Configuration backup completed", type: "success" }
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${
                        activity.type === "success" ? "bg-green-500" :
                        activity.type === "error" ? "bg-red-500" : "bg-blue-500"
                      }`} />
                      <div className="flex-1">
                        <p className="text-xs">{activity.action}</p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                    </div>
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