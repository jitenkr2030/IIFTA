'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  BookOpen, 
  Award, 
  DollarSign, 
  Clock, 
  Eye, 
  MousePointer, 
  Target, 
  Activity, 
  Download, 
  Calendar, 
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle,
  AlertCircle,
  Zap,
  Globe,
  Smartphone,
  Monitor,
  Tablet,
  PieChart,
  LineChart,
  AreaChart,
  BarChart,
  Timer,
  Star,
  ThumbsUp,
  MessageSquare,
  Share2,
  Heart,
  Bookmark
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { toast } from 'sonner'

interface AnalyticsData {
  overview: {
    totalUsers: number
    activeUsers: number
    newUsers: number
    totalCourses: number
    activeCourses: number
    totalEnrollments: number
    completedCourses: number
    totalCertificates: number
    issuedCertificates: number
    totalRevenue: number
    monthlyRevenue: number
    conversionRate: number
    avgSessionDuration: number
    bounceRate: number
  }
  userMetrics: {
    userGrowth: Array<{ date: string; users: number; newUsers: number }>
    userActivity: Array<{ date: string; activeUsers: number; sessions: number }>
    userRetention: Array<{ period: string; retentionRate: number; churnRate: number }>
    userDemographics: {
      byRole: Array<{ role: string; count: number; percentage: number }>
      byLocation: Array<{ country: string; count: number; percentage: number }>
      byDevice: Array<{ device: string; count: number; percentage: number }>
    }
  }
  courseMetrics: {
    coursePerformance: Array<{
      id: string
      title: string
      enrollments: number
      completions: number
      avgRating: number
      revenue: number
      completionRate: number
    }>
    popularCourses: Array<{ id: string; title: string; enrollments: number; rating: number }>
    learningProgress: Array<{ date: string; avgProgress: number; completedCourses: number }>
    engagementMetrics: {
      avgTimeSpent: number
      avgLessonsCompleted: number
      avgQuizScore: number
      dropoutRate: number
    }
  }
  revenueMetrics: {
    revenueByMonth: Array<{ month: string; revenue: number; subscriptions: number; courses: number }>
    revenueBySource: Array<{ source: string; revenue: number; percentage: number }>
    subscriptionMetrics: {
      activeSubscriptions: number
      churnRate: number
      avgRevenuePerUser: number
      lifetimeValue: number
    }
  }
  engagementMetrics: {
    pageViews: Array<{ date: string; views: number; uniqueVisitors: number }>
    sessionMetrics: Array<{ date: string; sessions: number; avgDuration: number; bounceRate: number }>
    topPages: Array<{ path: string; title: string; views: number; avgTime: number }>
    userInteractions: {
      likes: number
      comments: number
      shares: number
      bookmarks: number
      downloads: number
    }
  }
}

interface AnalyticsSystemProps {
  userRole?: string
}

export function AnalyticsSystem({ userRole = 'ADMIN' }: AnalyticsSystemProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'courses' | 'revenue' | 'engagement'>('overview')
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [dateRange, setDateRange] = useState('7d')
  const { user } = useAuth()

  useEffect(() => {
    fetchAnalyticsData()
  }, [dateRange])

  const fetchAnalyticsData = async () => {
    setIsLoading(true)
    try {
      const token = localStorage.getItem('auth_token')
      const response = await fetch(`/api/analytics?dateRange=${dateRange}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setAnalyticsData(data)
      }
    } catch (error) {
      console.error('Error fetching analytics:', error)
      toast.error('Failed to fetch analytics data')
    } finally {
      setIsLoading(false)
    }
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`
  }

  const getTrendIcon = (trend: 'up' | 'down' | 'neutral') => {
    switch (trend) {
      case 'up': return <ArrowUpRight className="h-4 w-4 text-green-500" />
      case 'down': return <ArrowDownRight className="h-4 w-4 text-red-500" />
      default: return <div className="h-4 w-4" />
    }
  }

  const getTrendColor = (trend: 'up' | 'down' | 'neutral') => {
    switch (trend) {
      case 'up': return 'text-green-500'
      case 'down': return 'text-red-500'
      default: return 'text-gray-500'
    }
  }

  // Mock data for demonstration
  const mockAnalyticsData: AnalyticsData = {
    overview: {
      totalUsers: 15420,
      activeUsers: 8934,
      newUsers: 1247,
      totalCourses: 45,
      activeCourses: 38,
      totalEnrollments: 23456,
      completedCourses: 18765,
      totalCertificates: 12456,
      issuedCertificates: 9876,
      totalRevenue: 456789,
      monthlyRevenue: 45678,
      conversionRate: 12.5,
      avgSessionDuration: 845,
      bounceRate: 34.2
    },
    userMetrics: {
      userGrowth: [
        { date: '2024-01-01', users: 12000, newUsers: 234 },
        { date: '2024-01-02', users: 12234, newUsers: 456 },
        { date: '2024-01-03', users: 12690, newUsers: 678 },
        { date: '2024-01-04', users: 13123, newUsers: 890 },
        { date: '2024-01-05', users: 13567, newUsers: 567 },
        { date: '2024-01-06', users: 14012, newUsers: 789 },
        { date: '2024-01-07', users: 14456, newUsers: 901 }
      ],
      userActivity: [
        { date: '2024-01-01', activeUsers: 8934, sessions: 12456 },
        { date: '2024-01-02', activeUsers: 9123, sessions: 13456 },
        { date: '2024-01-03', activeUsers: 9234, sessions: 14567 },
        { date: '2024-01-04', activeUsers: 9456, sessions: 15678 },
        { date: '2024-01-05', activeUsers: 9123, sessions: 14789 },
        { date: '2024-01-06', activeUsers: 9345, sessions: 15890 },
        { date: '2024-01-07', activeUsers: 9567, sessions: 16789 }
      ],
      userRetention: [
        { period: 'Week 1', retentionRate: 85.2, churnRate: 14.8 },
        { period: 'Week 2', retentionRate: 87.5, churnRate: 12.5 },
        { period: 'Week 3', retentionRate: 89.1, churnRate: 10.9 },
        { period: 'Week 4', retentionRate: 91.3, churnRate: 8.7 }
      ],
      userDemographics: {
        byRole: [
          { role: 'STUDENT', count: 12345, percentage: 80.1 },
          { role: 'MENTOR', count: 2345, percentage: 15.2 },
          { role: 'PARTNER', count: 567, percentage: 3.7 },
          { role: 'ADMIN', count: 163, percentage: 1.0 }
        ],
        byLocation: [
          { country: 'United States', count: 6789, percentage: 44.0 },
          { country: 'India', count: 3456, percentage: 22.4 },
          { country: 'United Kingdom', count: 2345, percentage: 15.2 },
          { country: 'Canada', count: 1234, percentage: 8.0 },
          { country: 'Australia', count: 987, percentage: 6.4 },
          { country: 'Others', count: 609, percentage: 4.0 }
        ],
        byDevice: [
          { device: 'Desktop', count: 8901, percentage: 57.7 },
          { device: 'Mobile', count: 4567, percentage: 29.6 },
          { device: 'Tablet', count: 1952, percentage: 12.7 }
        ]
      }
    },
    courseMetrics: {
      coursePerformance: [
        { id: '1', title: 'Financial Accounting Fundamentals', enrollments: 3456, completions: 2890, avgRating: 4.5, revenue: 34560, completionRate: 83.6 },
        { id: '2', title: 'Advanced Financial Management', enrollments: 2345, completions: 1876, avgRating: 4.3, revenue: 23450, completionRate: 80.0 },
        { id: '3', title: 'Tax Planning Strategies', enrollments: 1876, completions: 1567, avgRating: 4.6, revenue: 18760, completionRate: 83.5 },
        { id: '4', title: 'Investment Banking Essentials', enrollments: 1654, completions: 1234, avgRating: 4.4, revenue: 16540, completionRate: 74.6 },
        { id: '5', title: 'Corporate Finance Analysis', enrollments: 1432, completions: 1098, avgRating: 4.2, revenue: 14320, completionRate: 76.7 }
      ],
      popularCourses: [
        { id: '1', title: 'Financial Accounting Fundamentals', enrollments: 3456, rating: 4.5 },
        { id: '3', title: 'Tax Planning Strategies', enrollments: 1876, rating: 4.6 },
        { id: '2', title: 'Advanced Financial Management', enrollments: 2345, rating: 4.3 },
        { id: '5', title: 'Corporate Finance Analysis', enrollments: 1432, rating: 4.2 },
        { id: '4', title: 'Investment Banking Essentials', enrollments: 1654, rating: 4.4 }
      ],
      learningProgress: [
        { date: '2024-01-01', avgProgress: 65.4, completedCourses: 234 },
        { date: '2024-01-02', avgProgress: 67.8, completedCourses: 256 },
        { date: '2024-01-03', avgProgress: 70.2, completedCourses: 278 },
        { date: '2024-01-04', avgProgress: 72.6, completedCourses: 289 },
        { date: '2024-01-05', avgProgress: 74.3, completedCourses: 301 },
        { date: '2024-01-06', avgProgress: 76.1, completedCourses: 312 },
        { date: '2024-01-07', avgProgress: 77.8, completedCourses: 323 }
      ],
      engagementMetrics: {
        avgTimeSpent: 245,
        avgLessonsCompleted: 12.3,
        avgQuizScore: 85.6,
        dropoutRate: 18.4
      }
    },
    revenueMetrics: {
      revenueByMonth: [
        { month: '2024-01', revenue: 45678, subscriptions: 12345, courses: 23456 },
        { month: '2023-12', revenue: 42345, subscriptions: 11234, courses: 22345 },
        { month: '2023-11', revenue: 39876, subscriptions: 10987, courses: 21234 },
        { month: '2023-10', revenue: 37654, subscriptions: 10765, courses: 20123 },
        { month: '2023-09', revenue: 35432, subscriptions: 10543, courses: 19876 },
        { month: '2023-08', revenue: 33210, subscriptions: 10321, courses: 19234 }
      ],
      revenueBySource: [
        { source: 'Subscriptions', revenue: 234567, percentage: 51.4 },
        { source: 'Course Sales', revenue: 156789, percentage: 34.3 },
        { source: 'Certifications', revenue: 45678, percentage: 10.0 },
        { source: 'Partner Programs', revenue: 19876, percentage: 4.3 }
      ],
      subscriptionMetrics: {
        activeSubscriptions: 5678,
        churnRate: 3.2,
        avgRevenuePerUser: 45.67,
        lifetimeValue: 547.89
      }
    },
    engagementMetrics: {
      pageViews: [
        { date: '2024-01-01', views: 45678, uniqueVisitors: 12345 },
        { date: '2024-01-02', views: 47890, uniqueVisitors: 13456 },
        { date: '2024-01-03', views: 50123, uniqueVisitors: 14567 },
        { date: '2024-01-04', views: 52345, uniqueVisitors: 15678 },
        { date: '2024-01-05', views: 54567, uniqueVisitors: 16789 },
        { date: '2024-01-06', views: 56789, uniqueVisitors: 17890 },
        { date: '2024-01-07', views: 59012, uniqueVisitors: 18901 }
      ],
      sessionMetrics: [
        { date: '2024-01-01', sessions: 23456, avgDuration: 845, bounceRate: 34.2 },
        { date: '2024-01-02', sessions: 24567, avgDuration: 867, bounceRate: 32.8 },
        { date: '2024-01-03', sessions: 25678, avgDuration: 889, bounceRate: 31.5 },
        { date: '2024-01-04', sessions: 26789, avgDuration: 912, bounceRate: 30.2 },
        { date: '2024-01-05', sessions: 27890, avgDuration: 934, bounceRate: 28.9 },
        { date: '2024-01-06', sessions: 29012, avgDuration: 956, bounceRate: 27.6 },
        { date: '2024-01-07', sessions: 30123, avgDuration: 978, bounceRate: 26.3 }
      ],
      topPages: [
        { path: '/dashboard', title: 'Student Dashboard', views: 12345, avgTime: 245 },
        { path: '/courses', title: 'Course Catalog', views: 9876, avgTime: 189 },
        { path: '/programs', title: 'Certification Programs', views: 7654, avgTime: 167 },
        { path: '/ai-lab', title: 'AI Accounting Lab', views: 6543, avgTime: 234 },
        { path: '/jobs', title: 'Job Marketplace', views: 5432, avgTime: 156 }
      ],
      userInteractions: {
        likes: 45678,
        comments: 23456,
        shares: 12345,
        bookmarks: 34567,
        downloads: 19876
      }
    }
  }

  const displayData = analyticsData || mockAnalyticsData

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <BarChart3 className="h-8 w-8 text-primary" />
            Analytics & Performance Tracking
          </h1>
          <p className="text-muted-foreground">
            Comprehensive insights into platform performance and user engagement
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 border rounded-md bg-background"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(displayData.overview.totalUsers)}</div>
            <p className="text-xs text-muted-foreground">
              +{formatNumber(displayData.overview.newUsers)} this period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(displayData.overview.activeUsers)}</div>
            <p className="text-xs text-muted-foreground">
              {formatPercentage(displayData.overview.activeUsers / displayData.overview.totalUsers * 100)} of total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(displayData.overview.totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">
              {formatCurrency(displayData.overview.monthlyRevenue)} this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPercentage(displayData.overview.conversionRate)}</div>
            <p className="text-xs text-muted-foreground">
              +2.3% from last period
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="courses">Courses</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Course Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {displayData.courseMetrics.coursePerformance.slice(0, 5).map((course) => (
                    <div key={course.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm line-clamp-1">{course.title}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 text-yellow-500 fill-current" />
                            <span className="text-xs">{course.avgRating}</span>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {course.completionRate}% complete
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">{formatNumber(course.enrollments)}</div>
                        <div className="text-xs text-muted-foreground">enrollments</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>User Growth</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
                  <LineChart className="h-8 w-8 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">User Growth Chart</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Revenue Sources</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {displayData.revenueMetrics.revenueBySource.map((source) => (
                    <div key={source.source} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{source.source}</span>
                      <div className="text-right">
                        <div className="text-sm font-bold">{formatCurrency(source.revenue)}</div>
                        <div className="text-xs text-muted-foreground">{source.percentage}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Key Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{displayData.overview.totalCourses}</div>
                  <div className="text-sm text-muted-foreground">Total Courses</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{displayData.overview.completedCourses}</div>
                  <div className="text-sm text-muted-foreground">Completed</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{displayData.overview.totalCertificates}</div>
                  <div className="text-sm text-muted-foreground">Certificates</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">{formatNumber(displayData.overview.avgSessionDuration / 60)}m</div>
                  <div className="text-sm text-muted-foreground">Avg Session</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>User Demographics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium mb-3">By Role</h4>
                    <div className="space-y-2">
                      {displayData.userMetrics.userDemographics.byRole.map((role) => (
                        <div key={role.role} className="flex items-center justify-between">
                          <span className="text-sm">{role.role}</span>
                          <div className="flex items-center gap-2">
                            <div className="w-24 bg-gray-200 rounded-full h-2">
                              <div 
                                className="h-2 bg-blue-500 rounded-full" 
                                style={{ width: `${role.percentage}%` }}
                              />
                            </div>
                            <span className="text-sm text-muted-foreground">{role.percentage}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3">By Location</h4>
                    <div className="space-y-2">
                      {displayData.userMetrics.userDemographics.byLocation.slice(0, 5).map((location) => (
                        <div key={location.country} className="flex items-center justify-between">
                          <span className="text-sm">{location.country}</span>
                          <div className="flex items-center gap-2">
                            <div className="w-24 bg-gray-200 rounded-full h-2">
                              <div 
                                className="h-2 bg-green-500 rounded-full" 
                                style={{ width: `${location.percentage}%` }}
                              />
                            </div>
                            <span className="text-sm text-muted-foreground">{location.percentage}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3">By Device</h4>
                    <div className="space-y-2">
                      {displayData.userMetrics.userDemographics.byDevice.map((device) => (
                        <div key={device.device} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {device.device === 'Desktop' && <Monitor className="h-4 w-4" />}
                            {device.device === 'Mobile' && <Smartphone className="h-4 w-4" />}
                            {device.device === 'Tablet' && <Tablet className="h-4 w-4" />}
                            <span className="text-sm">{device.device}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-24 bg-gray-200 rounded-full h-2">
                              <div 
                                className="h-2 bg-purple-500 rounded-full" 
                                style={{ width: `${device.percentage}%` }}
                              />
                            </div>
                            <span className="text-sm text-muted-foreground">{device.percentage}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>User Retention</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {displayData.userMetrics.userRetention.map((period) => (
                    <div key={period.period} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{period.period}</h4>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm text-green-600">{period.retentionRate}%</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Churn Rate</span>
                        <span className="text-sm text-red-600">{period.churnRate}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Courses Tab */}
        <TabsContent value="courses" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Popular Courses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {displayData.courseMetrics.popularCourses.map((course) => (
                    <div key={course.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium">{course.title}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 text-yellow-500 fill-current" />
                            <span className="text-xs">{course.rating}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">{formatNumber(course.enrollments)}</div>
                        <div className="text-xs text-muted-foreground">enrollments</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Learning Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
                  <AreaChart className="h-8 w-8 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Learning Progress Chart</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Course Engagement Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{displayData.courseMetrics.engagementMetrics.avgTimeSpent}m</div>
                  <div className="text-sm text-muted-foreground">Avg Time Spent</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{displayData.courseMetrics.engagementMetrics.avgLessonsCompleted}</div>
                  <div className="text-sm text-muted-foreground">Avg Lessons</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{displayData.courseMetrics.engagementMetrics.avgQuizScore}%</div>
                  <div className="text-sm text-muted-foreground">Avg Quiz Score</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">{displayData.courseMetrics.engagementMetrics.dropoutRate}%</div>
                  <div className="text-sm text-muted-foreground">Dropout Rate</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Revenue Tab */}
        <TabsContent value="revenue" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue by Month</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
                  <BarChart className="h-8 w-8 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Revenue Chart</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Subscription Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Active Subscriptions</span>
                    <span className="text-sm font-bold">{formatNumber(displayData.revenueMetrics.subscriptionMetrics.activeSubscriptions)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Churn Rate</span>
                    <span className="text-sm font-bold text-red-600">{displayData.revenueMetrics.subscriptionMetrics.churnRate}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Avg Revenue/User</span>
                    <span className="text-sm font-bold">{formatCurrency(displayData.revenueMetrics.subscriptionMetrics.avgRevenuePerUser)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Lifetime Value</span>
                    <span className="text-sm font-bold">{formatCurrency(displayData.revenueMetrics.subscriptionMetrics.lifetimeValue)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Engagement Tab */}
        <TabsContent value="engagement" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Page Views & Sessions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
                  <LineChart className="h-8 w-8 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Engagement Chart</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Pages</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {displayData.engagementMetrics.topPages.map((page, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{page.title}</h4>
                        <p className="text-xs text-muted-foreground">{page.path}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">{formatNumber(page.views)}</div>
                        <div className="text-xs text-muted-foreground">{page.avgTime}s</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>User Interactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <Heart className="h-8 w-8 text-red-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{formatNumber(displayData.engagementMetrics.userInteractions.likes)}</div>
                  <div className="text-sm text-muted-foreground">Likes</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <MessageSquare className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{formatNumber(displayData.engagementMetrics.userInteractions.comments)}</div>
                  <div className="text-sm text-muted-foreground">Comments</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <Share2 className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{formatNumber(displayData.engagementMetrics.userInteractions.shares)}</div>
                  <div className="text-sm text-muted-foreground">Shares</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <Bookmark className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{formatNumber(displayData.engagementMetrics.userInteractions.bookmarks)}</div>
                  <div className="text-sm text-muted-foreground">Bookmarks</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <Download className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{formatNumber(displayData.engagementMetrics.userInteractions.downloads)}</div>
                  <div className="text-sm text-muted-foreground">Downloads</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}