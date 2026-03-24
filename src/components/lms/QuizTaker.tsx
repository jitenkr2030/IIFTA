'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  ArrowLeft, 
  ArrowRight,
  Flag,
  HelpCircle,
  BarChart3
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { toast } from 'sonner'

interface Question {
  id: string
  question: string
  type: 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'SHORT_ANSWER' | 'ESSAY'
  options?: string[]
  order: number
  points: number
}

interface QuizAttempt {
  id: string
  score: number
  maxScore: number
  passed: boolean
  startedAt: string
  completedAt?: string
}

interface QuizTakerProps {
  quiz: {
    id: string
    title: string
    description?: string
    timeLimit?: number
    maxScore: number
    passingScore: number
    questions: Question[]
  }
  attempts?: QuizAttempt[]
  onComplete: (result: any) => void
  onBack: () => void
}

export function QuizTaker({ quiz, attempts, onComplete, onBack }: QuizTakerProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<string>>(new Set())
  const [timeRemaining, setTimeRemaining] = useState(quiz.timeLimit ? quiz.timeLimit * 60 : null)
  const [isStarted, setIsStarted] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    if (isStarted && timeRemaining !== null && timeRemaining > 0) {
      const timer = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else if (timeRemaining === 0) {
      handleSubmit()
    }
  }, [isStarted, timeRemaining])

  const handleStart = () => {
    setIsStarted(true)
  }

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }))
  }

  const handleFlagQuestion = () => {
    const questionId = quiz.questions[currentQuestion].id
    const newFlagged = new Set(flaggedQuestions)
    if (newFlagged.has(questionId)) {
      newFlagged.delete(questionId)
    } else {
      newFlagged.add(questionId)
    }
    setFlaggedQuestions(newFlagged)
  }

  const handleNext = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const handleSubmit = async () => {
    if (isSubmitting) return

    setIsSubmitting(true)
    try {
      const token = localStorage.getItem('auth_token')
      const response = await fetch(`/api/quizzes/${quiz.id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ answers })
      })

      if (response.ok) {
        const result = await response.json()
        setIsSubmitted(true)
        onComplete(result)
        toast.success('Quiz submitted successfully!')
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to submit quiz')
      }
    } catch (error) {
      console.error('Error submitting quiz:', error)
      toast.error('Failed to submit quiz')
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const getAnsweredCount = () => {
    return Object.keys(answers).length
  }

  const getProgress = () => {
    return ((currentQuestion + 1) / quiz.questions.length) * 100
  }

  if (!isStarted) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <HelpCircle className="h-6 w-6" />
              {quiz.title}
            </CardTitle>
            <CardDescription>{quiz.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Quiz Info */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-primary">{quiz.questions.length}</div>
                <div className="text-sm text-muted-foreground">Questions</div>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-primary">{quiz.maxScore}</div>
                <div className="text-sm text-muted-foreground">Max Score</div>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-primary">{quiz.passingScore}</div>
                <div className="text-sm text-muted-foreground">Passing Score</div>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-primary">
                  {quiz.timeLimit ? `${quiz.timeLimit}m` : 'No Limit'}
                </div>
                <div className="text-sm text-muted-foreground">Time Limit</div>
              </div>
            </div>

            {/* Previous Attempts */}
            {attempts && attempts.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-semibold">Previous Attempts</h3>
                <div className="space-y-2">
                  {attempts.map((attempt, index) => (
                    <div key={attempt.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-2">
                        <Badge variant={attempt.passed ? 'default' : 'secondary'}>
                          Attempt {index + 1}
                        </Badge>
                        <span className="text-sm">
                          {attempt.score}/{attempt.maxScore} points
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(attempt.completedAt || attempt.startedAt).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Instructions */}
            <div className="space-y-2">
              <h3 className="font-semibold">Instructions</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Read each question carefully before answering</li>
                <li>• You can navigate between questions using the previous/next buttons</li>
                <li>• Flag questions to review them later</li>
                <li>• Make sure to answer all questions before submitting</li>
                {quiz.timeLimit && <li>• You have {quiz.timeLimit} minutes to complete the quiz</li>}
              </ul>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <Button variant="outline" onClick={onBack} className="flex-1">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Course
              </Button>
              <Button onClick={handleStart} className="flex-1">
                Start Quiz
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle>Quiz Completed!</CardTitle>
            <CardDescription>Your results have been submitted successfully.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 text-center">
            <div className="space-y-2">
              <p className="text-3xl font-bold text-primary">
                Check your results in the course dashboard
              </p>
              <p className="text-muted-foreground">
                Your score will be available once graded
              </p>
            </div>
            <Button onClick={onBack} className="w-full">
              Back to Course
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const question = quiz.questions[currentQuestion]

  return (
    <div className="max-w-4xl mx-auto">
      {/* Quiz Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={onBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Exit Quiz
            </Button>
            <div>
              <h1 className="text-2xl font-bold">{quiz.title}</h1>
              <p className="text-muted-foreground">
                Question {currentQuestion + 1} of {quiz.questions.length}
              </p>
            </div>
          </div>
          {timeRemaining !== null && (
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${
              timeRemaining < 300 ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
            }`}>
              <Clock className="h-4 w-4" />
              <span className="font-mono">{formatTime(timeRemaining)}</span>
            </div>
          )}
        </div>
        
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span>{Math.round(getProgress())}%</span>
          </div>
          <Progress value={getProgress()} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Question Area */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">Question {currentQuestion + 1}</Badge>
                    <Badge variant="secondary">{question.points} points</Badge>
                    {flaggedQuestions.has(question.id) && (
                      <Badge variant="outline" className="text-orange-600">
                        <Flag className="h-3 w-3 mr-1" />
                        Flagged
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-lg">{question.question}</CardTitle>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleFlagQuestion}
                  className={flaggedQuestions.has(question.id) ? 'text-orange-600' : ''}
                >
                  <Flag className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Question Input */}
              {question.type === 'MULTIPLE_CHOICE' && question.options && (
                <RadioGroup
                  value={answers[question.id] || ''}
                  onValueChange={(value) => handleAnswerChange(question.id, value)}
                >
                  {question.options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <RadioGroupItem value={option} id={`option-${index}`} />
                      <Label htmlFor={`option-${index}`} className="text-base">
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              )}

              {question.type === 'TRUE_FALSE' && (
                <RadioGroup
                  value={answers[question.id] || ''}
                  onValueChange={(value) => handleAnswerChange(question.id, value)}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="true" id="true" />
                    <Label htmlFor="true" className="text-base">True</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="false" id="false" />
                    <Label htmlFor="false" className="text-base">False</Label>
                  </div>
                </RadioGroup>
              )}

              {(question.type === 'SHORT_ANSWER' || question.type === 'ESSAY') && (
                <Textarea
                  placeholder={question.type === 'SHORT_ANSWER' 
                    ? "Enter your answer..." 
                    : "Write your detailed answer..."
                  }
                  value={answers[question.id] || ''}
                  onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                  rows={question.type === 'ESSAY' ? 8 : 4}
                  className="w-full"
                />
              )}

              {/* Navigation */}
              <div className="flex items-center justify-between pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentQuestion === 0}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Previous
                </Button>
                
                <div className="text-sm text-muted-foreground">
                  {getAnsweredCount()} of {quiz.questions.length} questions answered
                </div>

                {currentQuestion === quiz.questions.length - 1 ? (
                  <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting || getAnsweredCount() === 0}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Quiz'}
                    <CheckCircle className="h-4 w-4 ml-2" />
                  </Button>
                ) : (
                  <Button onClick={handleNext}>
                    Next
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Question Navigator */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Question Navigator</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-5 gap-2">
                {quiz.questions.map((q, index) => {
                  const isAnswered = answers[q.id]
                  const isFlagged = flaggedQuestions.has(q.id)
                  const isCurrent = index === currentQuestion
                  
                  return (
                    <Button
                      key={q.id}
                      variant={isCurrent ? "default" : "outline"}
                      size="sm"
                      className={`relative ${
                        isAnswered ? 'bg-green-100 border-green-300 text-green-800' : ''
                      } ${isFlagged ? 'ring-2 ring-orange-300' : ''}`}
                      onClick={() => setCurrentQuestion(index)}
                    >
                      {index + 1}
                      {isFlagged && (
                        <Flag className="h-3 w-3 absolute -top-1 -right-1 text-orange-500" />
                      )}
                    </Button>
                  )
                })}
              </div>
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
                  <span>Answered</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border rounded"></div>
                  <span>Not Answered</span>
                </div>
                <div className="flex items-center gap-2">
                  <Flag className="h-4 w-4 text-orange-500" />
                  <span>Flagged</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quiz Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Quiz Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Answered</span>
                  <span>{getAnsweredCount()}/{quiz.questions.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Flagged</span>
                  <span>{flaggedQuestions.size}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Total Points</span>
                  <span>{quiz.maxScore}</span>
                </div>
              </div>
              
              {timeRemaining && timeRemaining < 300 && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center gap-2 text-red-800">
                    <AlertCircle className="h-4 w-4" />
                    <span className="text-sm font-medium">
                      Less than 5 minutes remaining!
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}