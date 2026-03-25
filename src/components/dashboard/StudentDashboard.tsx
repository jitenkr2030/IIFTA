'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { CertificationPrograms } from '@/components/certification/CertificationPrograms'
import { CourseViewer } from '@/components/lms/CourseViewer'
import { QuizTaker } from '@/components/lms/QuizTaker'
import { AIAccountingLab } from '@/components/ai-lab/AIAccountingLab'
import { ProjectPortfolio } from '@/components/portfolio/ProjectPortfolio'
import { CertificationVerification } from '@/components/certification/CertificationVerification'
import { JobMarketplace } from '@/components/marketplace/JobMarketplace'
import { PartnerNetwork } from '@/components/partners/PartnerNetwork'
import { MentorshipSystem } from '@/components/mentorship/MentorshipSystem'
import { MembershipSystem } from '@/components/membership/MembershipSystem'
import { AnalyticsSystem } from '@/components/analytics/AnalyticsSystem'
import { 
  BookOpen, 
  Clock, 
  Award, 
  Calendar,
  TrendingUp,
  Users,
  Target,
  Play,
  CheckCircle,
  AlertCircle,
  BarChart3,
  Brain,
  Lightbulb,
  Code,
  Briefcase,
  Handshake,
  Crown
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

interface DashboardStats {
  coursesEnrolled: number
  coursesCompleted: number
  certificates: number
  averageProgress: number
  upcomingDeadlines: number
  studyStreak: number
}

interface RecentActivity {
  id: string
  type: 'lesson' | 'assignment' | 'quiz' | 'certificate'
  title: string
  description: string
  timestamp: string
  status: 'completed' | 'in-progress' | 'upcoming'
}

interface UpcomingDeadline {
  id: string
  title: string
  type: 'assignment' | 'quiz' | 'live-session'
  dueDate: string
  course: string
  priority: 'high' | 'medium' | 'low'
}

export function StudentDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'programs' | 'ai-lab' | 'portfolio' | 'certificates' | 'jobs' | 'partners' | 'mentorship' | 'membership' | 'analytics'>('overview')
  const [enrollments, setEnrollments] = useState([])
  const [selectedCourse, setSelectedCourse] = useState<any>(null)
  const [selectedQuiz, setSelectedQuiz] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useAuth()

  // Mock data - in real app, this would come from API
  const stats: DashboardStats = {
    coursesEnrolled: 3,
    coursesCompleted: 1,
    certificates: 1,
    averageProgress: 65,
    upcomingDeadlines: 2,
    studyStreak: 7
  }

  const recentActivities: RecentActivity[] = [
    {
      id: '1',
      type: 'lesson',
      title: 'Introduction to Blockchain',
      description: 'Completed lesson 3 of FinTech Accountant course',
      timestamp: '2 hours ago',
      status: 'completed'
    },
    {
      id: '2',
      type: 'assignment',
      title: 'Financial Statement Analysis',
      description: 'Submitted assignment for Tech Accountant course',
      timestamp: '5 hours ago',
      status: 'completed'
    },
    {
      id: '3',
      type: 'quiz',
      title: 'Risk Management Quiz',
      description: 'Scored 85% on quiz 2',
      timestamp: '1 day ago',
      status: 'completed'
    },
    {
      id: '4',
      type: 'lesson',
      title: 'AI in Financial Services',
      description: 'Currently watching video lesson',
      timestamp: '2 days ago',
      status: 'in-progress'
    }
  ]

  const upcomingDeadlines: UpcomingDeadline[] = [
    {
      id: '1',
      title: 'API Integration Project',
      type: 'assignment',
      dueDate: '2024-01-15',
      course: 'FinTech Accountant',
      priority: 'high'
    },
    {
      id: '2',
      title: 'Machine Learning Basics Quiz',
      type: 'quiz',
      dueDate: '2024-01-18',
      course: 'AI Finance Specialist',
      priority: 'medium'
    }
  ]

  const enrolledCourses = [
    {
      id: '1',
      title: 'Tech Accountant',
      progress: 100,
      status: 'completed',
      thumbnail: '/api/placeholder/300/200',
      nextLesson: null
    },
    {
      id: '2',
      title: 'FinTech Accountant',
      progress: 65,
      status: 'in-progress',
      thumbnail: '/api/placeholder/300/200',
      nextLesson: 'Blockchain Fundamentals'
    },
    {
      id: '3',
      title: 'AI Finance Specialist',
      progress: 30,
      status: 'in-progress',
      thumbnail: '/api/placeholder/300/200',
      nextLesson: 'Introduction to ML in Finance'
    }
  ]

  useEffect(() => {
    fetchEnrollments()
  }, [])

  const fetchEnrollments = async () => {
    try {
      const token = localStorage.getItem('auth_token')
      if (token) {
        const response = await fetch('/api/enrollments', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        if (response.ok) {
          const data = await response.json()
          setEnrollments(data.enrollments)
        }
      }
    } catch (error) {
      console.error('Error fetching enrollments:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'lesson': return <BookOpen className="h-4 w-4" />
      case 'assignment': return <Target className="h-4 w-4" />
      case 'quiz': return <BarChart3 className="h-4 w-4" />
      case 'certificate': return <Award className="h-4 w-4" />
      default: return <Lightbulb className="h-4 w-4" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getDeadlineIcon = (type: string) => {
    switch (type) {
      case 'assignment': return <Target className="h-4 w-4" />
      case 'quiz': return <BarChart3 className="h-4 w-4" />
      case 'live-session': return <Users className="h-4 w-4" />
      default: return <Calendar className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Show Course Viewer if course is selected */}
      {selectedCourse ? (
        <CourseViewer 
          courseId={selectedCourse.id} 
          onBack={() => setSelectedCourse(null)}
        />
      ) : (
        <>
          {/* Welcome Section */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Welcome back, {user?.name}!</h1>
              <p className="text-muted-foreground">Track your progress and continue your learning journey</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-sm">
                <TrendingUp className="w-3 h-3 mr-1" />
                {stats.studyStreak} day streak
              </Badge>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex space-x-1 bg-muted p-1 rounded-lg w-fit">
            <Button
              variant={activeTab === 'overview' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('overview')}
              size="sm"
            >
              Overview
            </Button>
            <Button
              variant={activeTab === 'programs' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('programs')}
              size="sm"
            >
              Programs
            </Button>
            <Button
              variant={activeTab === 'ai-lab' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('ai-lab')}
              size="sm"
            >
              AI Lab
            </Button>
            <Button
              variant={activeTab === 'portfolio' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('portfolio')}
              size="sm"
            >
              Portfolio
            </Button>
            <Button
              variant={activeTab === 'certificates' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('certificates')}
              size="sm"
            >
              Certificates
            </Button>
            <Button
              variant={activeTab === 'jobs' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('jobs')}
              size="sm"
            >
              Jobs
            </Button>
            <Button
              variant={activeTab === 'partners' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('partners')}
              size="sm"
            >
              Partners
            </Button>
            <Button
              variant={activeTab === 'mentorship' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('mentorship')}
              size="sm"
            >
              Mentorship
            </Button>
            <Button
              variant={activeTab === 'membership' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('membership')}
              size="sm"
            >
              Membership
            </Button>
            <Button
              variant={activeTab === 'analytics' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('analytics')}
              size="sm"
            >
              Analytics
            </Button>
          </div>

          {activeTab === 'overview' && (
            <>
              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Courses Enrolled</CardTitle>
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.coursesEnrolled}</div>
                    <p className="text-xs text-muted-foreground">
                      {stats.coursesCompleted} completed
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Average Progress</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.averageProgress}%</div>
                    <Progress value={stats.averageProgress} className="mt-2" />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Certificates</CardTitle>
                    <Award className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.certificates}</div>
                    <p className="text-xs text-muted-foreground">
                      2 in progress
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Upcoming Deadlines</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.upcomingDeadlines}</div>
                    <p className="text-xs text-muted-foreground">
                      Next 7 days
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid lg:grid-cols-3 gap-6">
                {/* Enrolled Courses */}
                <div className="lg:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>My Courses</CardTitle>
                      <CardDescription>Continue your learning journey</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {enrolledCourses.map((course) => (
                        <div key={course.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                          <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center">
                            <Brain className="h-8 w-8 text-primary" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="font-semibold">{course.title}</h3>
                              <Badge variant={course.status === 'completed' ? 'default' : 'secondary'}>
                                {course.status === 'completed' ? 'Completed' : 'In Progress'}
                              </Badge>
                            </div>
                            <Progress value={course.progress} className="mb-2" />
                            <div className="flex items-center justify-between text-sm text-muted-foreground">
                              <span>{course.progress}% complete</span>
                              {course.nextLesson && (
                                <span>Next: {course.nextLesson}</span>
                              )}
                            </div>
                          </div>
                          <Button size="sm" variant="outline"
                            onClick={() => setSelectedCourse(course)}
                          >
                            {course.status === 'completed' ? (
                              <CheckCircle className="h-4 w-4" />
                            ) : (
                              <Play className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>

                {/* Recent Activity */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>Your latest learning activities</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {recentActivities.map((activity) => (
                      <div key={activity.id} className="flex items-start space-x-3">
                        <div className={`p-2 rounded-full ${
                          activity.status === 'completed' ? 'bg-green-100 text-green-600' :
                          activity.status === 'in-progress' ? 'bg-blue-100 text-blue-600' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {getActivityIcon(activity.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{activity.title}</p>
                          <p className="text-xs text-muted-foreground">{activity.description}</p>
                          <p className="text-xs text-muted-foreground mt-1">{activity.timestamp}</p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Upcoming Deadlines */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5" />
                    Upcoming Deadlines
                  </CardTitle>
                  <CardDescription>Stay on top of your assignments and quizzes</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {upcomingDeadlines.map((deadline) => (
                      <div key={deadline.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            {getDeadlineIcon(deadline.type)}
                          </div>
                          <div>
                            <h4 className="font-medium">{deadline.title}</h4>
                            <p className="text-sm text-muted-foreground">{deadline.course}</p>
                            <p className="text-xs text-muted-foreground">Due: {deadline.dueDate}</p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end space-y-2">
                          <Badge className={getPriorityColor(deadline.priority)}>
                            {deadline.priority}
                          </Badge>
                          <Button size="sm" variant="outline">
                            View
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common tasks and resources</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Button variant="outline" className="h-20 flex-col" onClick={() => setActiveTab('programs')}>
                      <BookOpen className="h-6 w-6 mb-2" />
                      Browse Courses
                    </Button>
                    <Button variant="outline" className="h-20 flex-col" onClick={() => setActiveTab('ai-lab')}>
                      <Brain className="h-6 w-6 mb-2" />
                      AI Lab
                    </Button>
                    <Button variant="outline" className="h-20 flex-col">
                      <Users className="h-6 w-6 mb-2" />
                      Community
                    </Button>
                    <Button variant="outline" className="h-20 flex-col">
                      <Award className="h-6 w-6 mb-2" />
                      Certificates
                    </Button>
                    <Button variant="outline" className="h-20 flex-col" onClick={() => setActiveTab('portfolio')}>
                      <Code className="h-6 w-6 mb-2" />
                      Portfolio
                    </Button>
                    <Button variant="outline" className="h-20 flex-col" onClick={() => setActiveTab('certificates')}>
                      <Award className="h-6 w-6 mb-2" />
                      Certificates
                    </Button>
                    <Button variant="outline" className="h-20 flex-col" onClick={() => setActiveTab('jobs')}>
                      <Briefcase className="h-6 w-6 mb-2" />
                      Jobs
                    </Button>
                    <Button variant="outline" className="h-20 flex-col" onClick={() => setActiveTab('partners')}>
                      <Handshake className="h-6 w-6 mb-2" />
                      Partners
                    </Button>
                    <Button variant="outline" className="h-20 flex-col" onClick={() => setActiveTab('mentorship')}>
                      <Users className="h-6 w-6 mb-2" />
                      Mentorship
                    </Button>
                    <Button variant="outline" className="h-20 flex-col" onClick={() => setActiveTab('membership')}>
                      <Crown className="h-6 w-6 mb-2" />
                      Membership
                    </Button>
                    <Button variant="outline" className="h-20 flex-col" onClick={() => setActiveTab('analytics')}>
                      <BarChart3 className="h-6 w-6 mb-2" />
                      Analytics
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {activeTab === 'programs' && (
            <CertificationPrograms userEnrollments={enrollments} />
          )}

          {activeTab === 'ai-lab' && (
            <AIAccountingLab />
          )}

          {activeTab === 'portfolio' && (
            <ProjectPortfolio />
          )}

          {activeTab === 'certificates' && (
            <CertificationVerification />
          )}

          {activeTab === 'jobs' && (
            <JobMarketplace userRole={user?.role} />
          )}

          {activeTab === 'partners' && (
            <PartnerNetwork userRole={user?.role} />
          )}

          {activeTab === 'mentorship' && (
            <MentorshipSystem userRole={user?.role} />
          )}

          {activeTab === 'membership' && (
            <MembershipSystem userRole={user?.role} />
          )}

          {activeTab === 'analytics' && (
            <AnalyticsSystem userRole={user?.role} />
          )}
        </>
      )}
    </div>
  )
}