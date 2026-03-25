'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Bell, 
  Mail, 
  MessageSquare, 
  Calendar, 
  CheckCircle, 
  AlertCircle, 
  Info, 
  Settings, 
  User, 
  BookOpen, 
  Award, 
  Briefcase, 
  Users, 
  Clock, 
  Eye, 
  EyeOff, 
  Trash2, 
  Archive, 
  Filter,
  Search,
  Plus,
  Send,
  Smartphone,
  Globe,
  Zap,
  Target,
  TrendingUp,
  AlertTriangle,
  X,
  ChevronDown,
  ChevronUp,
  MoreHorizontal
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { toast } from 'sonner'

interface Notification {
  id: string
  userId: string
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR' | 'SYSTEM'
  title: string
  message: string
  data?: any
  read: boolean
  archived: boolean
  createdAt: string
  readAt?: string
  category: 'COURSE' | 'CERTIFICATION' | 'JOB' | 'MENTORSHIP' | 'SYSTEM' | 'PROMOTION' | 'REMINDER'
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  actionUrl?: string
  actionText?: string
  expiresAt?: string
  metadata?: {
    courseId?: string
    courseName?: string
    jobId?: string
    jobTitle?: string
    mentorId?: string
    mentorName?: string
    certificateId?: string
    certificateName?: string
  }
}

interface NotificationSettings {
  userId: string
  emailNotifications: boolean
  pushNotifications: boolean
  inAppNotifications: boolean
  categories: {
    course: boolean
    certification: boolean
    job: boolean
    mentorship: boolean
    system: boolean
    promotion: boolean
    reminder: boolean
  }
  priorities: {
    low: boolean
    medium: boolean
    high: boolean
    urgent: boolean
  }
  frequency: {
    immediate: boolean
    daily: boolean
    weekly: boolean
    monthly: boolean
  }
  quietHours: {
    enabled: boolean
    start: string
    end: string
    timezone: string
  }
}

interface NotificationSystemProps {
  userRole?: string
}

export function NotificationSystem({ userRole = 'STUDENT' }: NotificationSystemProps) {
  const [activeTab, setActiveTab] = useState<'notifications' | 'settings'>('notifications')
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [settings, setSettings] = useState<NotificationSettings | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedPriority, setSelectedPriority] = useState('')
  const [showUnreadOnly, setShowUnreadOnly] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    fetchNotifications()
    fetchSettings()
  }, [])

  const fetchNotifications = async () => {
    setIsLoading(true)
    try {
      const token = localStorage.getItem('auth_token')
      const response = await fetch('/api/notifications', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setNotifications(data.notifications)
      }
    } catch (error) {
      console.error('Error fetching notifications:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchSettings = async () => {
    try {
      const token = localStorage.getItem('auth_token')
      const response = await fetch('/api/notifications/settings', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setSettings(data.settings)
      }
    } catch (error) {
      console.error('Error fetching settings:', error)
    }
  }

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      const token = localStorage.getItem('auth_token')
      const response = await fetch(`/api/notifications/${notificationId}/read`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        setNotifications(prev => 
          prev.map(n => n.id === notificationId ? { ...n, read: true, readAt: new Date().toISOString() } : n)
        )
      }
    } catch (error) {
      console.error('Error marking as read:', error)
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      const token = localStorage.getItem('auth_token')
      const response = await fetch('/api/notifications/read-all', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        setNotifications(prev => 
          prev.map(n => ({ ...n, read: true, readAt: new Date().toISOString() }))
        )
      }
    } catch (error) {
      console.error('Error marking all as read:', error)
    }
  }

  const handleArchive = async (notificationId: string) => {
    try {
      const token = localStorage.getItem('auth_token')
      const response = await fetch(`/api/notifications/${notificationId}/archive`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        setNotifications(prev => 
          prev.filter(n => n.id !== notificationId)
        )
      }
    } catch (error) {
      console.error('Error archiving notification:', error)
    }
  }

  const handleDelete = async (notificationId: string) => {
    if (!confirm('Are you sure you want to delete this notification?')) return

    try {
      const token = localStorage.getItem('auth_token')
      const response = await fetch(`/api/notifications/${notificationId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        setNotifications(prev => 
          prev.filter(n => n.id !== notificationId)
        )
      }
    } catch (error) {
      console.error('Error deleting notification:', error)
    }
  }

  const handleUpdateSettings = async (newSettings: Partial<NotificationSettings>) => {
    try {
      const token = localStorage.getItem('auth_token')
      const response = await fetch('/api/notifications/settings', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newSettings)
      })

      if (response.ok) {
        setSettings(prev => prev ? { ...prev, ...newSettings } : null)
        toast.success('Settings updated successfully!')
      }
    } catch (error) {
      console.error('Error updating settings:', error)
      toast.error('Failed to update settings')
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
      return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} hour${Math.floor(diffInHours) !== 1 ? 's' : ''} ago`
    } else if (diffInHours < 24 * 7) {
      return `${Math.floor(diffInHours / 24)} day${Math.floor(diffInHours / 24) !== 1 ? 's' : ''} ago`
    } else {
      return date.toLocaleDateString()
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'INFO': return <Info className="h-4 w-4 text-blue-500" />
      case 'SUCCESS': return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'WARNING': return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case 'ERROR': return <AlertCircle className="h-4 w-4 text-red-500" />
      case 'SYSTEM': return <Settings className="h-4 w-4 text-gray-500" />
      default: return <Bell className="h-4 w-4 text-gray-500" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'INFO': return 'border-blue-200 bg-blue-50'
      case 'SUCCESS': return 'border-green-200 bg-green-50'
      case 'WARNING': return 'border-yellow-200 bg-yellow-50'
      case 'ERROR': return 'border-red-200 bg-red-50'
      case 'SYSTEM': return 'border-gray-200 bg-gray-50'
      default: return 'border-gray-200 bg-gray-50'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'COURSE': return <BookOpen className="h-4 w-4" />
      case 'CERTIFICATION': return <Award className="h-4 w-4" />
      case 'JOB': return <Briefcase className="h-4 w-4" />
      case 'MENTORSHIP': return <Users className="h-4 w-4" />
      case 'SYSTEM': return <Settings className="h-4 w-4" />
      case 'PROMOTION': return <Zap className="h-4 w-4" />
      case 'REMINDER': return <Calendar className="h-4 w-4" />
      default: return <Bell className="h-4 w-4" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'LOW': return 'bg-gray-100 text-gray-800'
      case 'MEDIUM': return 'bg-blue-100 text-blue-800'
      case 'HIGH': return 'bg-orange-100 text-orange-800'
      case 'URGENT': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  // Mock notifications data
  const mockNotifications: Notification[] = [
    {
      id: '1',
      userId: user?.id || '',
      type: 'SUCCESS',
      title: 'Course Completed!',
      message: 'Congratulations! You have successfully completed the Financial Accounting Fundamentals course.',
      read: false,
      archived: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      category: 'COURSE',
      priority: 'MEDIUM',
      metadata: {
        courseId: '1',
        courseName: 'Financial Accounting Fundamentals'
      }
    },
    {
      id: '2',
      userId: user?.id || '',
      type: 'INFO',
      title: 'New Job Opportunity',
      message: 'A new Senior Accountant position has been posted that matches your profile.',
      read: false,
      archived: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      category: 'JOB',
      priority: 'HIGH',
      actionUrl: '/jobs/123',
      actionText: 'View Job',
      metadata: {
        jobId: '123',
        jobTitle: 'Senior Accountant'
      }
    },
    {
      id: '3',
      userId: user?.id || '',
      type: 'WARNING',
      title: 'Certificate Expiring Soon',
      message: 'Your Financial Accounting Certificate will expire in 30 days. Renew now to maintain your credentials.',
      read: true,
      archived: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
      category: 'CERTIFICATION',
      priority: 'HIGH',
      actionUrl: '/certificates/456',
      actionText: 'Renew Certificate',
      metadata: {
        certificateId: '456',
        certificateName: 'Financial Accounting Certificate'
      }
    },
    {
      id: '4',
      userId: user?.id || '',
      type: 'INFO',
      title: 'Mentorship Session Reminder',
      message: 'Your 1:1 mentorship session with John Doe is scheduled for tomorrow at 2:00 PM.',
      read: false,
      archived: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
      category: 'MENTORSHIP',
      priority: 'MEDIUM',
      metadata: {
        mentorId: '789',
        mentorName: 'John Doe'
      }
    },
    {
      id: '5',
      userId: user?.id || '',
      type: 'SYSTEM',
      title: 'Platform Maintenance',
      message: 'The platform will undergo scheduled maintenance on Sunday from 2:00 AM to 4:00 AM EST.',
      read: true,
      archived: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
      category: 'SYSTEM',
      priority: 'LOW'
    }
  ]

  const displayNotifications = notifications.length > 0 ? notifications : mockNotifications
  const filteredNotifications = displayNotifications.filter(n => {
    const matchesSearch = n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         n.message.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !selectedCategory || n.category === selectedCategory
    const matchesPriority = !selectedPriority || n.priority === selectedPriority
    const matchesRead = !showUnreadOnly || !n.read
    const matchesArchived = !n.archived
    return matchesSearch && matchesCategory && matchesPriority && matchesRead && matchesArchived
  })

  const unreadCount = displayNotifications.filter(n => !n.read && !n.archived).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Bell className="h-8 w-8 text-primary" />
            Smart Alerts & Notifications
          </h1>
          <p className="text-muted-foreground">
            Stay informed with intelligent notifications and alerts
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-sm">
            {unreadCount} unread
          </Badge>
          <Button variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Create Alert
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          {/* Search and Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Search Bar */}
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search notifications..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button variant="outline" onClick={handleMarkAllAsRead}>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Mark All Read
                </Button>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-2">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="unread-only"
                    checked={showUnreadOnly}
                    onCheckedChange={setShowUnreadOnly}
                  />
                  <Label htmlFor="unread-only" className="text-sm">Unread only</Label>
                </div>
                
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="All categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All categories</SelectItem>
                    <SelectItem value="COURSE">Courses</SelectItem>
                    <SelectItem value="CERTIFICATION">Certifications</SelectItem>
                    <SelectItem value="JOB">Jobs</SelectItem>
                    <SelectItem value="MENTORSHIP">Mentorship</SelectItem>
                    <SelectItem value="SYSTEM">System</SelectItem>
                    <SelectItem value="PROMOTION">Promotions</SelectItem>
                    <SelectItem value="REMINDER">Reminders</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={selectedPriority} onValueChange={setSelectedPriority}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="All priorities" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All priorities</SelectItem>
                    <SelectItem value="LOW">Low</SelectItem>
                    <SelectItem value="MEDIUM">Medium</SelectItem>
                    <SelectItem value="HIGH">High</SelectItem>
                    <SelectItem value="URGENT">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Notifications List */}
          <div className="space-y-3">
            {filteredNotifications.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <Bell className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">No Notifications</h3>
                  <p className="text-muted-foreground text-center">
                    You're all caught up! Check back later for new notifications.
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredNotifications.map((notification) => (
                <Card 
                  key={notification.id} 
                  className={`transition-all hover:shadow-md ${!notification.read ? 'border-l-4 border-l-blue-500' : ''}`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <div className={`p-2 rounded-full ${getTypeColor(notification.type)}`}>
                          {getTypeIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className={`font-semibold text-sm ${!notification.read ? 'text-gray-900' : 'text-gray-600'}`}>
                              {notification.title}
                            </h3>
                            <Badge className={getPriorityColor(notification.priority)}>
                              {notification.priority}
                            </Badge>
                            <div className="flex items-center gap-1">
                              {getCategoryIcon(notification.category)}
                              <span className="text-xs text-muted-foreground">
                                {notification.category}
                              </span>
                            </div>
                          </div>
                          <p className={`text-sm ${!notification.read ? 'text-gray-700' : 'text-gray-500'} mb-2`}>
                            {notification.message}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">
                              {formatDate(notification.createdAt)}
                            </span>
                            {notification.actionUrl && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => window.open(notification.actionUrl, '_blank')}
                              >
                                {notification.actionText || 'View'}
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        {!notification.read && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleMarkAsRead(notification.id)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleArchive(notification.id)}
                        >
                          <Archive className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(notification.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          {settings ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Notification Channels */}
              <Card>
                <CardHeader>
                  <CardTitle>Notification Channels</CardTitle>
                  <CardDescription>
                    Choose how you want to receive notifications
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Email Notifications</p>
                        <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                      </div>
                    </div>
                    <Switch
                      checked={settings.emailNotifications}
                      onCheckedChange={(checked) => handleUpdateSettings({ emailNotifications: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Smartphone className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Push Notifications</p>
                        <p className="text-sm text-muted-foreground">Receive push notifications on mobile</p>
                      </div>
                    </div>
                    <Switch
                      checked={settings.pushNotifications}
                      onCheckedChange={(checked) => handleUpdateSettings({ pushNotifications: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bell className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">In-App Notifications</p>
                        <p className="text-sm text-muted-foreground">See notifications in the app</p>
                      </div>
                    </div>
                    <Switch
                      checked={settings.inAppNotifications}
                      onCheckedChange={(checked) => handleUpdateSettings({ inAppNotifications: checked })}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Categories */}
              <Card>
                <CardHeader>
                  <CardTitle>Notification Categories</CardTitle>
                  <CardDescription>
                    Select which categories you want to receive notifications from
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Course Updates</span>
                    </div>
                    <Switch
                      checked={settings.categories.course}
                      onCheckedChange={(checked) => handleUpdateSettings({ 
                        categories: { ...settings.categories, course: checked }
                      })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Award className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Certifications</span>
                    </div>
                    <Switch
                      checked={settings.categories.certification}
                      onCheckedChange={(checked) => handleUpdateSettings({ 
                        categories: { ...settings.categories, certification: checked }
                      })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Job Opportunities</span>
                    </div>
                    <Switch
                      checked={settings.categories.job}
                      onCheckedChange={(checked) => handleUpdateSettings({ 
                        categories: { ...settings.categories, job: checked }
                      })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Mentorship</span>
                    </div>
                    <Switch
                      checked={settings.categories.mentorship}
                      onCheckedChange={(checked) => handleUpdateSettings({ 
                        categories: { ...settings.categories, mentorship: checked }
                      })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Settings className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">System Updates</span>
                    </div>
                    <Switch
                      checked={settings.categories.system}
                      onCheckedChange={(checked) => handleUpdateSettings({ 
                        categories: { ...settings.categories, system: checked }
                      })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Promotions</span>
                    </div>
                    <Switch
                      checked={settings.categories.promotion}
                      onCheckedChange={(checked) => handleUpdateSettings({ 
                        categories: { ...settings.categories, promotion: checked }
                      })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Reminders</span>
                    </div>
                    <Switch
                      checked={settings.categories.reminder}
                      onCheckedChange={(checked) => handleUpdateSettings({ 
                        categories: { ...settings.categories, reminder: checked }
                      })}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Priority Levels */}
              <Card>
                <CardHeader>
                  <CardTitle>Priority Levels</CardTitle>
                  <CardDescription>
                    Choose which priority levels you want to be notified about
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Badge className="bg-gray-100 text-gray-800">Low</Badge>
                    <Switch
                      checked={settings.priorities.low}
                      onCheckedChange={(checked) => handleUpdateSettings({ 
                        priorities: { ...settings.priorities, low: checked }
                      })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Badge className="bg-blue-100 text-blue-800">Medium</Badge>
                    <Switch
                      checked={settings.priorities.medium}
                      onCheckedChange={(checked) => handleUpdateSettings({ 
                        priorities: { ...settings.priorities, medium: checked }
                      })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Badge className="bg-orange-100 text-orange-800">High</Badge>
                    <Switch
                      checked={settings.priorities.high}
                      onCheckedChange={(checked) => handleUpdateSettings({ 
                        priorities: { ...settings.priorities, high: checked }
                      })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Badge className="bg-red-100 text-red-800">Urgent</Badge>
                    <Switch
                      checked={settings.priorities.urgent}
                      onCheckedChange={(checked) => handleUpdateSettings({ 
                        priorities: { ...settings.priorities, urgent: checked }
                      })}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Quiet Hours */}
              <Card>
                <CardHeader>
                  <CardTitle>Quiet Hours</CardTitle>
                  <CardDescription>
                    Set quiet hours to avoid notifications during specific times
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Enable Quiet Hours</span>
                    <Switch
                      checked={settings.quietHours.enabled}
                      onCheckedChange={(checked) => handleUpdateSettings({ 
                        quietHours: { ...settings.quietHours, enabled: checked }
                      })}
                    />
                  </div>
                  {settings.quietHours.enabled && (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm">Start Time</Label>
                          <Input
                            type="time"
                            value={settings.quietHours.start}
                            onChange={(e) => handleUpdateSettings({ 
                              quietHours: { ...settings.quietHours, start: e.target.value }
                            })}
                          />
                        </div>
                        <div>
                          <Label className="text-sm">End Time</Label>
                          <Input
                            type="time"
                            value={settings.quietHours.end}
                            onChange={(e) => handleUpdateSettings({ 
                              quietHours: { ...settings.quietHours, end: e.target.value }
                            })}
                          />
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm">Timezone</Label>
                        <Select
                          value={settings.quietHours.timezone}
                          onValueChange={(value) => handleUpdateSettings({ 
                            quietHours: { ...settings.quietHours, timezone: value }
                          })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="UTC">UTC</SelectItem>
                            <SelectItem value="EST">EST</SelectItem>
                            <SelectItem value="PST">PST</SelectItem>
                            <SelectItem value="CST">CST</SelectItem>
                            <SelectItem value="MST">MST</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Settings className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Loading Settings</h3>
                <p className="text-muted-foreground">
                  Please wait while we load your notification settings...
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}