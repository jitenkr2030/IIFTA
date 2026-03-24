'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Play, 
  Pause, 
  CheckCircle, 
  Clock, 
  FileText, 
  HelpCircle,
  BookOpen,
  Award,
  BarChart3,
  Users,
  Calendar
} from 'lucide-react'
import { QuizTaker } from './QuizTaker'
import { useAuth } from '@/contexts/AuthContext'

interface Lesson {
  id: string
  title: string
  content: string
  videoUrl?: string
  duration: number
  order: number
  isPreview: boolean
  progress?: {
    completed: boolean
    watchTime: number
    completedAt?: string
  }
}

interface Quiz {
  id: string
  title: string
  description?: string
  timeLimit?: number
  maxScore: number
  passingScore: number
  questions: Array<{
    id: string
    question: string
    type: string
    options?: string[]
    order: number
    points: number
  }>
  attempts?: Array<{
    id: string
    score: number
    maxScore: number
    passed: boolean
    startedAt: string
    completedAt?: string
  }>
}

interface Assignment {
  id: string
  title: string
  description: string
  instructions: string
  dueDate?: string
  maxScore: number
}

interface CourseViewerProps {
  courseId: string
  onBack: () => void
}

export function CourseViewer({ courseId, onBack }: CourseViewerProps) {
  const [course, setCourse] = useState<any>(null)
  const [activeTab, setActiveTab] = useState('lessons')
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null)
  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null)
  const [showQuizTaker, setShowQuizTaker] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isPlaying, setIsPlaying] = useState(false)
  const [watchTime, setWatchTime] = useState(0)
  const { user } = useAuth()

  useEffect(() => {
    fetchCourse()
  }, [courseId])

  const fetchCourse = async () => {
    try {
      const token = localStorage.getItem('auth_token')
      const response = await fetch(`/api/courses/${courseId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setCourse(data.course)
      }
    } catch (error) {
      console.error('Error fetching course:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLessonClick = async (lesson: Lesson) => {
    try {
      const token = localStorage.getItem('auth_token')
      const response = await fetch(`/api/lessons/${lesson.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setCurrentLesson(data.lesson)
        setActiveTab('content')
        setWatchTime(data.progress?.watchTime || 0)
      }
    } catch (error) {
      console.error('Error loading lesson:', error)
    }
  }

  const handleQuizClick = async (quiz: Quiz) => {
    try {
      const token = localStorage.getItem('auth_token')
      const response = await fetch(`/api/quizzes/${quiz.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setCurrentQuiz(data.quiz)
        setShowQuizTaker(true)
      }
    } catch (error) {
      console.error('Error loading quiz:', error)
    }
  }

  const handleQuizComplete = (result: any) => {
    setShowQuizTaker(false)
    setCurrentQuiz(null)
    // Refresh course data to update progress
    fetchCourse()
  }

  const updateLessonProgress = async (completed: boolean = false) => {
    if (!currentLesson) return

    try {
      const token = localStorage.getItem('auth_token')
      await fetch(`/api/lessons/${currentLesson.id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          watchTime,
          completed
        })
      })

      // Refresh course data to update progress
      fetchCourse()
    } catch (error) {
      console.error('Error updating progress:', error)
    }
  }

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={onBack}>
            ← Back
          </Button>
          <div className="h-8 bg-gray-200 rounded w-64 animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="h-96 bg-gray-200 rounded-lg animate-pulse"></div>
            <div className="h-64 bg-gray-200 rounded-lg animate-pulse"></div>
          </div>
          <div className="space-y-4">
            <div className="h-32 bg-gray-200 rounded-lg animate-pulse"></div>
            <div className="h-48 bg-gray-200 rounded-lg animate-pulse"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Course not found</p>
        <Button onClick={onBack} className="mt-4">
          Go Back
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Show Quiz Taker if quiz is active */}
      {showQuizTaker && currentQuiz ? (
        <QuizTaker
          quiz={currentQuiz}
          attempts={currentQuiz.attempts}
          onComplete={handleQuizComplete}
          onBack={() => setShowQuizTaker(false)}
        />
      ) : (
        <>
          {/* Course Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="outline" onClick={onBack}>
                ← Back to Courses
              </Button>
              <div>
                <h1 className="text-2xl font-bold">{course.title}</h1>
                <p className="text-muted-foreground">{course.description}</p>
              </div>
            </div>
            <Badge variant="secondary">
              {course.program?.title}
            </Badge>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content Area */}
            <div className="lg:col-span-2">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="content">Content</TabsTrigger>
                  <TabsTrigger value="lessons">Lessons</TabsTrigger>
                  <TabsTrigger value="assignments">Assignments</TabsTrigger>
                  <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
                </TabsList>

                {/* Content Tab */}
                <TabsContent value="content" className="space-y-6">
                  {currentLesson ? (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <BookOpen className="h-5 w-5" />
                          {currentLesson.title}
                        </CardTitle>
                        <CardDescription>
                          Duration: {formatDuration(currentLesson.duration)}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {/* Video Player Placeholder */}
                        {currentLesson.videoUrl && (
                          <div className="aspect-video bg-black rounded-lg flex items-center justify-center">
                            <div className="text-center text-white">
                              <Play className="h-16 w-16 mx-auto mb-4" />
                              <p>Video Player</p>
                              <p className="text-sm opacity-75">{currentLesson.videoUrl}</p>
                            </div>
                          </div>
                        )}

                        {/* Lesson Content */}
                        <div className="prose max-w-none">
                          <div dangerouslySetInnerHTML={{ __html: currentLesson.content }} />
                        </div>

                        {/* Progress Controls */}
                        <div className="flex items-center justify-between pt-4 border-t">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">
                              Watch time: {formatDuration(watchTime)}
                            </span>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              onClick={() => setIsPlaying(!isPlaying)}
                            >
                              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                              {isPlaying ? 'Pause' : 'Play'}
                            </Button>
                            <Button
                              onClick={() => updateLessonProgress(true)}
                              disabled={currentLesson.progress?.completed}
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              {currentLesson.progress?.completed ? 'Completed' : 'Mark Complete'}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <Card>
                      <CardContent className="flex items-center justify-center py-12">
                        <div className="text-center">
                          <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                          <h3 className="text-lg font-semibold mb-2">Select a Lesson</h3>
                          <p className="text-muted-foreground">
                            Choose a lesson from the sidebar to start learning
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                {/* Lessons Tab */}
                <TabsContent value="lessons" className="space-y-4">
                  {course.lessons?.map((lesson: Lesson) => (
                    <Card 
                      key={lesson.id} 
                      className={`cursor-pointer transition-colors ${
                        currentLesson?.id === lesson.id ? 'border-primary' : ''
                      }`}
                      onClick={() => handleLessonClick(lesson)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              lesson.progress?.completed 
                                ? 'bg-green-100 text-green-600' 
                                : 'bg-gray-100 text-gray-600'
                            }`}>
                              {lesson.progress?.completed ? (
                                <CheckCircle className="h-5 w-5" />
                              ) : (
                                <BookOpen className="h-5 w-5" />
                              )}
                            </div>
                            <div>
                              <h4 className="font-medium">{lesson.title}</h4>
                              <p className="text-sm text-muted-foreground">
                                Duration: {formatDuration(lesson.duration)}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {lesson.isPreview && (
                              <Badge variant="secondary">Preview</Badge>
                            )}
                            <Play className="h-4 w-4 text-muted-foreground" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>

                {/* Assignments Tab */}
                <TabsContent value="assignments" className="space-y-4">
                  {course.assignments?.map((assignment: Assignment) => (
                    <Card key={assignment.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <FileText className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <h4 className="font-medium">{assignment.title}</h4>
                              <p className="text-sm text-muted-foreground">
                                Max Score: {assignment.maxScore} points
                              </p>
                              {assignment.dueDate && (
                                <p className="text-sm text-muted-foreground">
                                  Due: {new Date(assignment.dueDate).toLocaleDateString()}
                                </p>
                              )}
                            </div>
                          </div>
                          <Button variant="outline">
                            View Assignment
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>

                {/* Quizzes Tab */}
                <TabsContent value="quizzes" className="space-y-4">
                  {course.quizzes?.map((quiz: Quiz) => (
                    <Card key={quiz.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                              <HelpCircle className="h-5 w-5 text-purple-600" />
                            </div>
                            <div>
                              <h4 className="font-medium">{quiz.title}</h4>
                              <p className="text-sm text-muted-foreground">
                                {quiz.questions?.length || 0} questions • {quiz.maxScore} points
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Passing score: {quiz.passingScore} points
                              </p>
                              {quiz.attempts && quiz.attempts.length > 0 && (
                                <p className="text-sm text-green-600">
                                  Best score: {Math.max(...quiz.attempts.map(a => a.score))}/{quiz.maxScore}
                                </p>
                              )}
                            </div>
                          </div>
                          <Button onClick={() => handleQuizClick(quiz)}>
                            Start Quiz
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Course Progress */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Course Progress</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Overall Progress</span>
                      <span>0%</span>
                    </div>
                    <Progress value={0} />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>0 lessons completed</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <BookOpen className="h-4 w-4 text-blue-500" />
                      <span>{course.lessons?.length || 0} total lessons</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Course Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Course Info</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {course.lessons?.reduce((total: number, lesson: Lesson) => 
                        total + lesson.duration, 0) || 0} minutes total
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span>{course.assignments?.length || 0} assignments</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                    <span>{course.quizzes?.length || 0} quizzes</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Award className="h-4 w-4 text-muted-foreground" />
                    <span>Certificate upon completion</span>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    View Progress
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Users className="h-4 w-4 mr-2" />
                    Discussion Forum
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule Session
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </>
      )}
    </div>
  )
}