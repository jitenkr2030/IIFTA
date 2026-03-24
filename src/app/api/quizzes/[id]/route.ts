import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const quizId = params.id

    const quiz = await db.quiz.findUnique({
      where: { id: quizId },
      include: {
        course: {
          include: {
            program: true
          }
        },
        questions: {
          orderBy: { order: 'asc' }
        },
        _count: {
          select: {
            attempts: true
          }
        }
      }
    })

    if (!quiz) {
      return NextResponse.json(
        { error: 'Quiz not found' },
        { status: 404 }
      )
    }

    // Check if user has access to this quiz
    const authHeader = request.headers.get('authorization')
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7)
      const decoded = jwt.verify(token, JWT_SECRET) as any

      // Check if user is enrolled in the program
      const enrollment = await db.enrollment.findUnique({
        where: {
          userId_programId: {
            userId: decoded.userId,
            programId: quiz.course.programId
          }
        }
      })

      if (!enrollment) {
        return NextResponse.json(
          { error: 'Access denied. Enrollment required.' },
          { status: 403 }
        )
      }

      // Get user's previous attempts
      const attempts = await db.quizAttempt.findMany({
        where: {
          quizId: quizId,
          studentId: decoded.userId
        },
        orderBy: { startedAt: 'desc' },
        take: 5
      })

      // Return quiz without correct answers for new attempts
      const quizForAttempt = {
        ...quiz,
        questions: quiz.questions.map(q => ({
          ...q,
          correctAnswer: undefined
        }))
      }

      return NextResponse.json({
        quiz: quizForAttempt,
        attempts,
        hasAccess: true
      })
    }

    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    )
  } catch (error) {
    console.error('Error fetching quiz:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const quizId = params.id
    const body = await request.json()
    const { answers } = body

    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7)
    const decoded = jwt.verify(token, JWT_SECRET) as any

    // Get quiz with questions
    const quiz = await db.quiz.findUnique({
      where: { id: quizId },
      include: {
        questions: {
          orderBy: { order: 'asc' }
        },
        course: {
          include: {
            program: true
          }
        }
      }
    })

    if (!quiz) {
      return NextResponse.json(
        { error: 'Quiz not found' },
        { status: 404 }
      )
    }

    // Check enrollment
    const enrollment = await db.enrollment.findUnique({
      where: {
        userId_programId: {
          userId: decoded.userId,
          programId: quiz.course.programId
        }
      }
    })

    if (!enrollment) {
      return NextResponse.json(
        { error: 'Enrollment required' },
        { status: 403 }
      )
    }

    // Create quiz attempt
    const attempt = await db.quizAttempt.create({
      data: {
        quizId: quizId,
        studentId: decoded.userId,
        score: 0, // Will be calculated
        maxScore: quiz.maxScore,
        passed: false, // Will be calculated
        startedAt: new Date(),
        completedAt: new Date()
      }
    })

    // Calculate score and create answers
    let totalScore = 0
    const answerRecords = []

    for (const question of quiz.questions) {
      const userAnswer = answers[question.id]
      const isCorrect = userAnswer === question.correctAnswer
      const points = isCorrect ? question.points : 0
      totalScore += points

      answerRecords.push({
        questionId: question.id,
        attemptId: attempt.id,
        answer: userAnswer,
        isCorrect,
        points
      })
    }

    // Save all answers
    await db.answer.createMany({
      data: answerRecords
    })

    // Update attempt with final score
    const passed = totalScore >= quiz.passingScore
    await db.quizAttempt.update({
      where: { id: attempt.id },
      data: {
        score: totalScore,
        passed
      }
    })

    return NextResponse.json({
      message: 'Quiz submitted successfully',
      attempt: {
        ...attempt,
        score: totalScore,
        passed,
        answers: answerRecords
      },
      statistics: {
        totalQuestions: quiz.questions.length,
        correctAnswers: answerRecords.filter(a => a.isCorrect).length,
        percentage: (totalScore / quiz.maxScore) * 100,
        passed
      }
    })
  } catch (error) {
    console.error('Error submitting quiz:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}