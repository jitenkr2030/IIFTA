import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const dateRange = searchParams.get('dateRange') || '7d'

    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'No token provided' },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7)
    const decoded = jwt.verify(token, JWT_SECRET) as any

    // Mock analytics data - in a real app, this would come from the database
    const analyticsData = {
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

    return NextResponse.json({ analytics: analyticsData })
  } catch (error) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}