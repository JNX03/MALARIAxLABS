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
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Users,
  Shield,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Key,
  Settings,
  UserPlus,
  Crown,
  Star,
  Activity,
  Clock,
  Mail,
  Phone,
  MapPin,
  MoreHorizontal,
  Search,
  Filter,
  Download,
  RefreshCw,
  Lock,
  Unlock,
  AlertTriangle,
  CheckCircle2
} from "lucide-react"
import { format, formatDistanceToNow } from "date-fns"

interface User {
  id: string
  username: string
  email: string
  firstName: string
  lastName: string
  role: string
  status: "active" | "inactive" | "suspended" | "pending"
  lastLogin: Date | null
  createdAt: Date
  permissions: string[]
  department: string
  phoneNumber?: string
  location: string
  avatar?: string
  loginCount: number
  failedLogins: number
}

interface Role {
  id: string
  name: string
  displayName: string
  description: string
  permissions: string[]
  userCount: number
  isBuiltIn: boolean
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

interface Permission {
  id: string
  name: string
  displayName: string
  description: string
  category: string
  isCore: boolean
}

interface UserRoleManagementProps {
  className?: string
}

export default function UserRoleManagement({ className }: UserRoleManagementProps) {
  const [users, setUsers] = useState<User[]>([])
  const [roles, setRoles] = useState<Role[]>([])
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)
  const [isAddUserOpen, setIsAddUserOpen] = useState(false)
  const [isAddRoleOpen, setIsAddRoleOpen] = useState(false)
  const [isEditRoleOpen, setIsEditRoleOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [roleFilter, setRoleFilter] = useState<string>("all")

  useEffect(() => {
    initializeData()
  }, [])

  const initializeData = () => {
    const permissionData: Permission[] = [
      // Patient Management
      { id: "patient_view", name: "patient_view", displayName: "View Patients", description: "View patient records and information", category: "Patient Management", isCore: true },
      { id: "patient_create", name: "patient_create", displayName: "Create Patients", description: "Add new patient records", category: "Patient Management", isCore: false },
      { id: "patient_edit", name: "patient_edit", displayName: "Edit Patients", description: "Modify patient information", category: "Patient Management", isCore: false },
      { id: "patient_delete", name: "patient_delete", displayName: "Delete Patients", description: "Remove patient records", category: "Patient Management", isCore: false },
      
      // Test Management
      { id: "test_view", name: "test_view", displayName: "View Tests", description: "View test results and history", category: "Test Management", isCore: true },
      { id: "test_perform", name: "test_perform", displayName: "Perform Tests", description: "Run new diagnostic tests", category: "Test Management", isCore: false },
      { id: "test_approve", name: "test_approve", displayName: "Approve Tests", description: "Approve and verify test results", category: "Test Management", isCore: false },
      { id: "test_export", name: "test_export", displayName: "Export Tests", description: "Export test data and reports", category: "Test Management", isCore: false },
      
      // Reports & Analytics
      { id: "reports_view", name: "reports_view", displayName: "View Reports", description: "Access system reports", category: "Reports", isCore: true },
      { id: "reports_create", name: "reports_create", displayName: "Create Reports", description: "Generate custom reports", category: "Reports", isCore: false },
      { id: "analytics_view", name: "analytics_view", displayName: "View Analytics", description: "Access analytics dashboard", category: "Reports", isCore: false },
      
      // System Administration
      { id: "users_manage", name: "users_manage", displayName: "Manage Users", description: "Create, edit, and manage user accounts", category: "Administration", isCore: false },
      { id: "roles_manage", name: "roles_manage", displayName: "Manage Roles", description: "Create and modify user roles", category: "Administration", isCore: false },
      { id: "system_config", name: "system_config", displayName: "System Configuration", description: "Configure system settings", category: "Administration", isCore: false },
      { id: "audit_view", name: "audit_view", displayName: "View Audit Logs", description: "Access system audit logs", category: "Administration", isCore: false },
      
      // Quality Control
      { id: "quality_view", name: "quality_view", displayName: "View Quality Metrics", description: "Access quality control data", category: "Quality Control", isCore: false },
      { id: "quality_manage", name: "quality_manage", displayName: "Manage Quality Control", description: "Configure quality control settings", category: "Quality Control", isCore: false }
    ]

    const roleData: Role[] = [
      {
        id: "admin",
        name: "admin",
        displayName: "System Administrator",
        description: "Full system access with all permissions",
        permissions: permissionData.map(p => p.id),
        userCount: 2,
        isBuiltIn: true,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "doctor",
        name: "doctor",
        displayName: "Doctor",
        description: "Medical professional with diagnostic permissions",
        permissions: ["patient_view", "patient_create", "patient_edit", "test_view", "test_perform", "test_approve", "reports_view", "reports_create", "analytics_view", "quality_view"],
        userCount: 8,
        isBuiltIn: true,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "technician",
        name: "technician",
        displayName: "Lab Technician",
        description: "Laboratory staff with test execution permissions",
        permissions: ["patient_view", "test_view", "test_perform", "reports_view", "quality_view"],
        userCount: 12,
        isBuiltIn: true,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "nurse",
        name: "nurse",
        displayName: "Nurse",
        description: "Nursing staff with patient care permissions",
        permissions: ["patient_view", "patient_create", "patient_edit", "test_view", "reports_view"],
        userCount: 15,
        isBuiltIn: true,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "viewer",
        name: "viewer",
        displayName: "Viewer",
        description: "Read-only access to system data",
        permissions: ["patient_view", "test_view", "reports_view"],
        userCount: 5,
        isBuiltIn: true,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]

    const userData: User[] = [
      {
        id: "user_1",
        username: "admin",
        email: "admin@malariax.health",
        firstName: "System",
        lastName: "Administrator",
        role: "admin",
        status: "active",
        lastLogin: new Date(Date.now() - 2 * 60 * 60 * 1000),
        createdAt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
        permissions: roleData.find(r => r.id === "admin")!.permissions,
        department: "IT",
        phoneNumber: "+66123456789",
        location: "Bangkok",
        loginCount: 1250,
        failedLogins: 0
      },
      {
        id: "user_2",
        username: "dr.somchai",
        email: "somchai@malariax.health",
        firstName: "Somchai",
        lastName: "Jantanakul",
        role: "doctor",
        status: "active",
        lastLogin: new Date(Date.now() - 30 * 60 * 1000),
        createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
        permissions: roleData.find(r => r.id === "doctor")!.permissions,
        department: "Internal Medicine",
        phoneNumber: "+66987654321",
        location: "Bangkok",
        loginCount: 892,
        failedLogins: 1
      },
      {
        id: "user_3",
        username: "tech.malee",
        email: "malee@malariax.health",
        firstName: "Malee",
        lastName: "Siripong",
        role: "technician",
        status: "active",
        lastLogin: new Date(Date.now() - 4 * 60 * 60 * 1000),
        createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
        permissions: roleData.find(r => r.id === "technician")!.permissions,
        department: "Laboratory",
        phoneNumber: "+66555123456",
        location: "Chiang Mai",
        loginCount: 456,
        failedLogins: 0
      },
      {
        id: "user_4",
        username: "nurse.pensri",
        email: "pensri@malariax.health",
        firstName: "Pensri",
        lastName: "Thanakit",
        role: "nurse",
        status: "active",
        lastLogin: new Date(Date.now() - 8 * 60 * 60 * 1000),
        createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
        permissions: roleData.find(r => r.id === "nurse")!.permissions,
        department: "Patient Care",
        phoneNumber: "+66777888999",
        location: "Mae Hong Son",
        loginCount: 234,
        failedLogins: 2
      },
      {
        id: "user_5",
        username: "viewer.guest",
        email: "guest@malariax.health",
        firstName: "Guest",
        lastName: "User",
        role: "viewer",
        status: "inactive",
        lastLogin: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        permissions: roleData.find(r => r.id === "viewer")!.permissions,
        department: "External",
        location: "Remote",
        loginCount: 12,
        failedLogins: 0
      }
    ]

    setPermissions(permissionData)
    setRoles(roleData)
    setUsers(userData)
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === "all" || user.status === statusFilter
    const matchesRole = roleFilter === "all" || user.role === roleFilter
    
    return matchesSearch && matchesStatus && matchesRole
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400">Active</Badge>
      case "inactive":
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400">Inactive</Badge>
      case "suspended":
        return <Badge className="bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400">Suspended</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400">Pending</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getRoleIcon = (roleId: string) => {
    switch (roleId) {
      case "admin":
        return <Crown className="h-4 w-4 text-purple-600" />
      case "doctor":
        return <Star className="h-4 w-4 text-blue-600" />
      case "technician":
        return <Activity className="h-4 w-4 text-green-600" />
      case "nurse":
        return <Users className="h-4 w-4 text-pink-600" />
      default:
        return <Eye className="h-4 w-4 text-gray-600" />
    }
  }

  const toggleUserStatus = (userId: string) => {
    setUsers(prev => prev.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === "active" ? "inactive" : "active" }
        : user
    ))
  }

  const deleteUser = (userId: string) => {
    setUsers(prev => prev.filter(user => user.id !== userId))
  }

  const updateRole = (roleId: string, updates: Partial<Role>) => {
    setRoles(prev => prev.map(role => 
      role.id === roleId 
        ? { ...role, ...updates, updatedAt: new Date() }
        : role
    ))
  }

  const stats = [
    { title: "Total Users", value: users.length, icon: Users, color: "text-blue-600" },
    { title: "Active Users", value: users.filter(u => u.status === "active").length, icon: CheckCircle2, color: "text-green-600" },
    { title: "Total Roles", value: roles.length, icon: Shield, color: "text-purple-600" },
    { title: "Pending Users", value: users.filter(u => u.status === "pending").length, icon: Clock, color: "text-orange-600" }
  ]

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Stats */}
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

      {/* Main Content */}
      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="roles">Roles</TabsTrigger>
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
        </TabsList>

        {/* Users Tab */}
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  User Management
                </CardTitle>
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                  <div className="relative flex-1 sm:flex-none">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 min-w-[250px]"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full sm:w-[120px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={roleFilter} onValueChange={setRoleFilter}>
                    <SelectTrigger className="w-full sm:w-[120px]">
                      <SelectValue placeholder="Role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Roles</SelectItem>
                      {roles.map(role => (
                        <SelectItem key={role.id} value={role.id}>{role.displayName}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
                    <DialogTrigger asChild>
                      <Button className="gap-2">
                        <Plus className="h-4 w-4" />
                        Add User
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Add New User</DialogTitle>
                        <DialogDescription>Create a new user account with role and permissions</DialogDescription>
                      </DialogHeader>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Username</Label>
                          <Input placeholder="Enter username" />
                        </div>
                        <div className="space-y-2">
                          <Label>Email</Label>
                          <Input type="email" placeholder="user@email.com" />
                        </div>
                        <div className="space-y-2">
                          <Label>First Name</Label>
                          <Input placeholder="First name" />
                        </div>
                        <div className="space-y-2">
                          <Label>Last Name</Label>
                          <Input placeholder="Last name" />
                        </div>
                        <div className="space-y-2">
                          <Label>Role</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent>
                              {roles.filter(r => r.isActive).map(role => (
                                <SelectItem key={role.id} value={role.id}>
                                  {role.displayName}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Department</Label>
                          <Input placeholder="Department" />
                        </div>
                        <div className="space-y-2 col-span-2">
                          <Label>Location</Label>
                          <Input placeholder="Location" />
                        </div>
                        <div className="space-y-2">
                          <Label>Phone Number</Label>
                          <Input placeholder="+66 XX XXX XXXX" />
                        </div>
                        <div className="space-y-2">
                          <Label>Status</Label>
                          <Select defaultValue="pending">
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="active">Active</SelectItem>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="inactive">Inactive</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="flex justify-end gap-2 mt-6">
                        <Button variant="outline" onClick={() => setIsAddUserOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={() => setIsAddUserOpen(false)}>
                          Create User
                        </Button>
                      </div>
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
                      <TableHead>User</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Login</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                              <span className="text-sm font-medium">
                                {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium">{user.firstName} {user.lastName}</p>
                              <p className="text-sm text-muted-foreground">{user.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getRoleIcon(user.role)}
                            <span className="capitalize">{roles.find(r => r.id === user.role)?.displayName}</span>
                          </div>
                        </TableCell>
                        <TableCell>{user.department}</TableCell>
                        <TableCell>{getStatusBadge(user.status)}</TableCell>
                        <TableCell>
                          {user.lastLogin ? (
                            <div className="text-sm">
                              <p>{formatDistanceToNow(user.lastLogin, { addSuffix: true })}</p>
                              <p className="text-muted-foreground">{format(user.lastLogin, "MMM d, HH:mm")}</p>
                            </div>
                          ) : (
                            <span className="text-muted-foreground">Never</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm">
                            <MapPin className="h-3 w-3 text-muted-foreground" />
                            {user.location}
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
                              <DropdownMenuItem onClick={() => setSelectedUser(user)}>
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit User
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => toggleUserStatus(user.id)}>
                                {user.status === "active" ? (
                                  <>
                                    <Lock className="h-4 w-4 mr-2" />
                                    Deactivate
                                  </>
                                ) : (
                                  <>
                                    <Unlock className="h-4 w-4 mr-2" />
                                    Activate
                                  </>
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>
                                <Key className="h-4 w-4 mr-2" />
                                Reset Password
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => deleteUser(user.id)}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete User
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Roles Tab */}
        <TabsContent value="roles">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Role Management
                </CardTitle>
                <Dialog open={isAddRoleOpen} onOpenChange={setIsAddRoleOpen}>
                  <DialogTrigger asChild>
                    <Button className="gap-2">
                      <Plus className="h-4 w-4" />
                      Add Role
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl max-h-[90vh]">
                    <DialogHeader>
                      <DialogTitle>Create New Role</DialogTitle>
                      <DialogDescription>Define a new role with specific permissions</DialogDescription>
                    </DialogHeader>
                    <ScrollArea className="h-[60vh] pr-4">
                      <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Role Name</Label>
                            <Input placeholder="role_name" />
                          </div>
                          <div className="space-y-2">
                            <Label>Display Name</Label>
                            <Input placeholder="Display Name" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Description</Label>
                          <Textarea placeholder="Role description..." />
                        </div>
                        <div className="space-y-4">
                          <Label>Permissions</Label>
                          {Object.entries(
                            permissions.reduce((acc, perm) => {
                              if (!acc[perm.category]) acc[perm.category] = []
                              acc[perm.category].push(perm)
                              return acc
                            }, {} as Record<string, Permission[]>)
                          ).map(([category, perms]) => (
                            <div key={category} className="space-y-3">
                              <h4 className="font-medium text-sm">{category}</h4>
                              <div className="grid grid-cols-2 gap-2 pl-4">
                                {perms.map((perm) => (
                                  <div key={perm.id} className="flex items-center space-x-2">
                                    <Checkbox id={perm.id} />
                                    <label htmlFor={perm.id} className="text-sm cursor-pointer">
                                      {perm.displayName}
                                    </label>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </ScrollArea>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setIsAddRoleOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={() => setIsAddRoleOpen(false)}>
                        Create Role
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {roles.map((role) => (
                  <Card key={role.id} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getRoleIcon(role.id)}
                          <div>
                            <h3 className="font-medium">{role.displayName}</h3>
                            <p className="text-sm text-muted-foreground">{role.name}</p>
                          </div>
                        </div>
                        {role.isBuiltIn && (
                          <Badge variant="outline" className="text-xs">Built-in</Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">{role.description}</p>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Users:</span>
                          <span className="font-medium">{role.userCount}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Permissions:</span>
                          <span className="font-medium">{role.permissions.length}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Status:</span>
                          {role.isActive ? (
                            <Badge className="bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 text-xs">
                              Active
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="text-xs">Inactive</Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2 mt-4">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => {
                            setSelectedRole(role)
                            setIsEditRoleOpen(true)
                          }}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Permissions Tab */}
        <TabsContent value="permissions">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                System Permissions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {Object.entries(
                  permissions.reduce((acc, perm) => {
                    if (!acc[perm.category]) acc[perm.category] = []
                    acc[perm.category].push(perm)
                    return acc
                  }, {} as Record<string, Permission[]>)
                ).map(([category, perms]) => (
                  <div key={category}>
                    <h3 className="font-semibold mb-3">{category}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {perms.map((perm) => (
                        <div key={perm.id} className="p-3 border rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-sm">{perm.displayName}</h4>
                            {perm.isCore && (
                              <Badge variant="outline" className="text-xs">Core</Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mb-2">{perm.description}</p>
                          <p className="text-xs font-mono text-muted-foreground">{perm.name}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* User Details Dialog */}
      <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-xl font-medium">
                    {selectedUser.firstName.charAt(0)}{selectedUser.lastName.charAt(0)}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-medium">{selectedUser.firstName} {selectedUser.lastName}</h3>
                  <p className="text-muted-foreground">{selectedUser.email}</p>
                  {getStatusBadge(selectedUser.status)}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Username</Label>
                  <p className="font-mono text-sm">{selectedUser.username}</p>
                </div>
                <div>
                  <Label>Role</Label>
                  <div className="flex items-center gap-2">
                    {getRoleIcon(selectedUser.role)}
                    <span>{roles.find(r => r.id === selectedUser.role)?.displayName}</span>
                  </div>
                </div>
                <div>
                  <Label>Department</Label>
                  <p>{selectedUser.department}</p>
                </div>
                <div>
                  <Label>Location</Label>
                  <p>{selectedUser.location}</p>
                </div>
                <div>
                  <Label>Phone Number</Label>
                  <p>{selectedUser.phoneNumber || "Not provided"}</p>
                </div>
                <div>
                  <Label>Member Since</Label>
                  <p>{format(selectedUser.createdAt, "PPP")}</p>
                </div>
                <div>
                  <Label>Total Logins</Label>
                  <p>{selectedUser.loginCount}</p>
                </div>
                <div>
                  <Label>Failed Logins</Label>
                  <p className={selectedUser.failedLogins > 0 ? "text-red-600" : ""}>
                    {selectedUser.failedLogins}
                  </p>
                </div>
              </div>

              <div>
                <Label>Permissions ({selectedUser.permissions.length})</Label>
                <ScrollArea className="h-32 mt-2">
                  <div className="flex flex-wrap gap-1">
                    {selectedUser.permissions.map(permId => {
                      const perm = permissions.find(p => p.id === permId)
                      return perm ? (
                        <Badge key={permId} variant="outline" className="text-xs">
                          {perm.displayName}
                        </Badge>
                      ) : null
                    })}
                  </div>
                </ScrollArea>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}