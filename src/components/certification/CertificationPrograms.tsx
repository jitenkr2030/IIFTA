'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { 
  BookOpen, 
  Clock, 
  Users, 
  Star,
  Play,
  CheckCircle,
  Calendar,
  DollarSign,
  Award,
  Brain,
  Target
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { toast } from 'sonner'

interface Program {
  id: string
  title: string
  description: string
  level: string
  duration: number
  price: number
  thumbnail?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
  courses: any[]
  _count: {
    enrollments: number
  }
}

interface CertificationProgramsProps {
  userEnrollments?: any[]
}

export function CertificationPrograms({ userEnrollments = [] }: CertificationProgramsProps) {
  const [programs, setPrograms] = useState<Program[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [enrolling, setEnrolling] = useState<string | null>(null)
  const { user, isAuthenticated } = useAuth()

  useEffect(() => {
    fetchPrograms()
  }, [])

  const fetchPrograms = async () => {
    try {
      const response = await fetch('/api/programs')
      if (response.ok) {
        const data = await response.json()
        setPrograms(data.programs)
      }
    } catch (error) {
      console.error('Error fetching programs:', error)
      toast.error('Failed to load programs')
    } finally {
      setIsLoading(false)
    }
  }

  const handleEnroll = async (programId: string) => {
    if (!isAuthenticated) {
      toast.error('Please login to enroll')
      return
    }

    setEnrolling(programId)
    try {
      const token = localStorage.getItem('auth_token')
      const response = await fetch(`/api/programs/${programId}/enroll`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        toast.success('Successfully enrolled in program!')
        // Refresh programs or update UI
        fetchPrograms()
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to enroll')
      }
    } catch (error) {
      console.error('Error enrolling:', error)
      toast.error('Failed to enroll')
    } finally {
      setEnrolling(null)
    }
  }

  const isEnrolled = (programId: string) => {
    return userEnrollments.some(enrollment => enrollment.programId === programId)
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'BEGINNER': return 'bg-green-100 text-green-800'
      case 'INTERMEDIATE': return 'bg-yellow-100 text-yellow-800'
      case 'ADVANCED': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'BEGINNER': return <BookOpen className="h-4 w-4" />
      case 'INTERMEDIATE': return <Brain className="h-4 w-4" />
      case 'ADVANCED': return <Target className="h-4 w-4" />
      default: return <Award className="h-4 w-4" />
    }
  }

  if (isLoading) {
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <div className="h-48 bg-gray-200 rounded-t-lg"></div>
            <CardHeader>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded w-5/6"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">Certification Programs</h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Choose your path to becoming a finance technology expert
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {programs.map((program) => {
          const enrolled = isEnrolled(program.id)
          
          return (
            <Card key={program.id} className="relative overflow-hidden hover:shadow-lg transition-shadow">
              {/* Program Header */}
              <div className="relative">
                <div className="h-48 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                  <div className="p-4 bg-primary/10 rounded-full">
                    {getLevelIcon(program.level)}
                  </div>
                </div>
                
                {enrolled && (
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-green-100 text-green-800 border-green-200">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Enrolled
                    </Badge>
                  </div>
                )}
                
                <div className="absolute top-4 left-4">
                  <Badge className={getLevelColor(program.level)}>
                    {program.level}
                  </Badge>
                </div>
              </div>

              <CardHeader>
                <CardTitle className="line-clamp-2">{program.title}</CardTitle>
                <CardDescription className="line-clamp-3">
                  {program.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Program Stats */}
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="flex flex-col items-center">
                    <Clock className="h-4 w-4 text-muted-foreground mb-1" />
                    <span className="text-sm font-medium">{program.duration}w</span>
                    <span className="text-xs text-muted-foreground">Duration</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <BookOpen className="h-4 w-4 text-muted-foreground mb-1" />
                    <span className="text-sm font-medium">{program.courses.length}</span>
                    <span className="text-xs text-muted-foreground">Courses</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <Users className="h-4 w-4 text-muted-foreground mb-1" />
                    <span className="text-sm font-medium">{program._count.enrollments}</span>
                    <span className="text-xs text-muted-foreground">Students</span>
                  </div>
                </div>

                {/* Price */}
                <div className="flex items-center justify-center py-2 border-y">
                  <DollarSign className="h-4 w-4 text-muted-foreground mr-1" />
                  <span className="text-2xl font-bold">
                    {program.price === 0 ? 'Free' : `$${program.price}`}
                  </span>
                  {program.price > 0 && (
                    <span className="text-sm text-muted-foreground ml-1">/program</span>
                  )}
                </div>

                {/* Course Preview */}
                {program.courses.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">What you'll learn:</h4>
                    <div className="space-y-1">
                      {program.courses.slice(0, 3).map((course) => (
                        <div key={course.id} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                          <span className="line-clamp-1">{course.title}</span>
                        </div>
                      ))}
                      {program.courses.length > 3 && (
                        <div className="text-xs text-muted-foreground">
                          +{program.courses.length - 3} more courses
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Action Button */}
                <Button 
                  className="w-full" 
                  disabled={enrolled || enrolling === program.id}
                  onClick={() => handleEnroll(program.id)}
                >
                  {enrolled ? (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Enrolled
                    </>
                  ) : enrolling === program.id ? (
                    'Enrolling...'
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Enroll Now
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {programs.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <BookOpen className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No programs available</h3>
          <p className="text-muted-foreground">
            Check back later for new certification programs.
          </p>
        </div>
      )}
    </div>
  )
}