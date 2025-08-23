"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Bell,
  AlertTriangle,
  CheckCircle2,
  Info,
  X,
  Settings,
  Clock,
  MapPin,
  Bug,
  Users,
  TrendingUp,
  AlertCircle
} from "lucide-react"
import { format, formatDistanceToNow } from "date-fns"

interface Notification {
  id: string
  type: 'success' | 'warning' | 'error' | 'info'
  title: string
  message: string
  timestamp: Date
  read: boolean
  actionUrl?: string
  metadata?: {
    location?: string
    patientId?: string
    analysisId?: string
    count?: number
  }
}

interface NotificationSystemProps {
  className?: string
}

export default function NotificationSystem({ className }: NotificationSystemProps) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    // Simulate real-time notifications
    const generateNotifications = () => {
      const types: Array<'success' | 'warning' | 'error' | 'info'> = ['success', 'warning', 'error', 'info']
      const locations = ['Bangkok', 'Chiang Mai', 'Mae Hong Son', 'Kanchanaburi', 'Tak']
      
      const sampleNotifications: Notification[] = [
        {
          id: '1',
          type: 'warning',
          title: 'High Positive Rate Alert',
          message: 'Unusual spike in positive malaria cases detected in Mae Hong Son region',
          timestamp: new Date(Date.now() - 30 * 60 * 1000),
          read: false,
          metadata: { location: 'Mae Hong Son', count: 15 }
        },
        {
          id: '2',
          type: 'success',
          title: 'Analysis Complete',
          message: 'Batch analysis of 50 samples completed successfully',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          read: false,
          metadata: { count: 50 }
        },
        {
          id: '3',
          type: 'info',
          title: 'System Update',
          message: 'AI model updated with improved accuracy (96.8%)',
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
          read: true
        },
        {
          id: '4',
          type: 'error',
          title: 'Quality Control Alert',
          message: 'Low confidence results detected in recent batch',
          timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
          read: false,
          metadata: { count: 3 }
        },
        {
          id: '5',
          type: 'info',
          title: 'New Patient Registration',
          message: '25 new patients registered in the system today',
          timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
          read: true,
          metadata: { count: 25 }
        },
        {
          id: '6',
          type: 'warning',
          title: 'Equipment Maintenance Due',
          message: 'Microscope calibration required for optimal results',
          timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
          read: false
        }
      ]

      setNotifications(sampleNotifications)
    }

    generateNotifications()

    // Simulate real-time updates
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const newNotification: Notification = {
          id: Math.random().toString(36).substr(2, 9),
          type: ['success', 'warning', 'info'][Math.floor(Math.random() * 3)] as any,
          title: 'New Analysis Result',
          message: `Analysis completed for patient in ${locations[Math.floor(Math.random() * locations.length)]}`,
          timestamp: new Date(),
          read: false,
          metadata: { location: locations[Math.floor(Math.random() * locations.length)] }
        }
        setNotifications(prev => [newNotification, ...prev])
      }
    }, 30000) // Every 30 seconds

    return () => clearInterval(interval)
  }, [])

  const unreadCount = notifications.filter(n => !n.read).length

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, read: true }))
    )
  }

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle2 className="h-4 w-4 text-green-500" />
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case 'error': return <AlertCircle className="h-4 w-4 text-red-500" />
      default: return <Info className="h-4 w-4 text-blue-500" />
    }
  }

  const getNotificationBgColor = (type: string, read: boolean) => {
    if (read) return 'bg-muted/30'
    
    switch (type) {
      case 'success': return 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800/30'
      case 'warning': return 'bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800/30'
      case 'error': return 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800/30'
      default: return 'bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800/30'
    }
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="relative p-2">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-96 p-0">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-semibold">Notifications</h3>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
                className="text-xs"
              >
                Mark all read
              </Button>
            )}
            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <ScrollArea className="h-96">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No notifications</p>
            </div>
          ) : (
            <div className="p-2">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 rounded-lg mb-2 border cursor-pointer transition-colors ${
                    getNotificationBgColor(notification.type, notification.read)
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-3 flex-1">
                      {getNotificationIcon(notification.type)}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className={`text-sm font-medium truncate ${
                            !notification.read ? 'font-semibold' : ''
                          }`}>
                            {notification.title}
                          </h4>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">
                          {notification.message}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
                          </div>
                          {notification.metadata?.location && (
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {notification.metadata.location}
                            </div>
                          )}
                          {notification.metadata?.count && (
                            <div className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {notification.metadata.count}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 h-auto"
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteNotification(notification.id)
                      }}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        <div className="border-t p-2">
          <Button variant="ghost" size="sm" className="w-full">
            View All Notifications
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}