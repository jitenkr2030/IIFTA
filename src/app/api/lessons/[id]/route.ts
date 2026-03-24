import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const lessonId = params.id

    const lesson = await db.lesson.findUnique({
      where: { id: lessonId },
      include: {
        course: {
          include: {
            program: true
          }
        }
      }
    })

    if (!lesson) {
      return NextResponse.json(
        { error: 'Lesson not found' },
        { status: 404 }
      )
    }

    // Check if user has access to this lesson
    const authHeader = request.headers.get('authorization')
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7)
      const decoded = jwt.verify(token, JWT_SECRET) as any

      // Check if user is enrolled in the program
      const enrollment = await db.enrollment.findUnique({
        where: {
          userId_programId: {
            userId: decoded.userId,
            programId: lesson.course.programId
          }
        }
      })

      if (!enrollment && !lesson.isPreview) {
        return NextResponse.json(
          { error: 'Access denied. Enrollment required.' },
          { status: 403 }
        )
      }

      // Get or create lesson progress
      const lessonProgress = await db.lessonProgress.findUnique({
        where: {
          lessonId_studentId: {
            lessonId: lessonId,
            studentId: decoded.userId
          }
        }
      })

      return NextResponse.json({
        lesson,
        progress: lessonProgress,
        hasAccess: true
      })
    }

    // Return lesson without progress for unauthenticated users (preview only)
    if (lesson.isPreview) {
      return NextResponse.json({
        lesson,
        progress: null,
        hasAccess: false,
        isPreview: true
      })
    }

    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    )
  } catch (error) {
    console.error('Error fetching lesson:', error)
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
    const lessonId = params.id
    const body = await request.json()
    const { watchTime, completed } = body

    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7)
    const decoded = jwt.verify(token, JWT_SECRET) as any

    // Get lesson and course progress
    const lesson = await db.lesson.findUnique({
      where: { id: lessonId },
      include: {
        course: true
      }
    })

    if (!lesson) {
      return NextResponse.json(
        { error: 'Lesson not found' },
        { status: 404 }
      )
    }

    // Get enrollment
    const enrollment = await db.enrollment.findUnique({
      where: {
        userId_programId: {
          userId: decoded.userId,
          programId: lesson.course.programId
        }
      },
      include: {
        courseProgress: true
      }
    })

    if (!enrollment) {
      return NextResponse.json(
        { error: 'Enrollment required' },
        { status: 403 }
      )
    }

    // Find course progress
    const courseProgress = enrollment.courseProgress.find(
      cp => cp.courseId === lesson.courseId
    )

    if (!courseProgress) {
      return NextResponse.json(
        { error: 'Course progress not found' },
        { status: 404 }
      )
    }

    // Update or create lesson progress
    const lessonProgress = await db.lessonProgress.upsert({
      where: {
        lessonId_studentId: {
          lessonId: lessonId,
          studentId: decoded.userId
        }
      },
      update: {
        watchTime: watchTime || 0,
        completed: completed || false,
        completedAt: completed ? new Date() : null
      },
      create: {
        lessonId: lessonId,
        studentId: decoded.userId,
        courseProgressId: courseProgress.id,
        watchTime: watchTime || 0,
        completed: completed || false,
        completedAt: completed ? new Date() : null
      }
    })

    // Update course progress if lesson is completed
    if (completed) {
      const totalLessons = await db.lesson.count({
        where: { courseId: lesson.courseId }
      })

      const completedLessons = await db.lessonProgress.count({
        where: {
          courseProgressId: courseProgress.id,
          completed: true
        }
      })

      const progressPercentage = (completedLessons / totalLessons) * 100
      const isCourseCompleted = progressPercentage === 100

      await db.courseProgress.update({
        where: { id: courseProgress.id },
        data: {
          progress: progressPercentage,
          completed: isCourseCompleted,
          completedAt: isCourseCompleted ? new Date() : null
        }
      })

      // Update enrollment progress if all courses are completed
      if (isCourseCompleted) {
        const totalCourses = await db.course.count({
          where: { 
            programId: lesson.course.programId,
            isPublished: true 
          }
        })

        const completedCourses = await db.courseProgress.count({
          where: {
            enrollment: {
              programId: lesson.course.programId,
              userId: decoded.userId
            },
            completed: true
          }
        })

        const enrollmentProgress = (completedCourses / totalCourses) * 100
        const isProgramCompleted = enrollmentProgress === 100

        await db.enrollment.update({
          where: { id: enrollment.id },
          data: {
            progress: enrollmentProgress,
            completedAt: isProgramCompleted ? new Date() : null,
            status: isProgramCompleted ? 'COMPLETED' : 'ACTIVE'
          }
        })
      }
    }

    return NextResponse.json({
      message: 'Lesson progress updated',
      progress: lessonProgress
    })
  } catch (error) {
    console.error('Error updating lesson progress:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}