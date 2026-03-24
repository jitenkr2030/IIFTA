import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'No token provided' },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7)
    const decoded = jwt.verify(token, JWT_SECRET) as any

    const enrollments = await db.enrollment.findMany({
      where: { userId: decoded.userId },
      include: {
        program: {
          include: {
            courses: {
              where: { isPublished: true },
              orderBy: { order: 'asc' }
            }
          }
        },
        courseProgress: {
          include: {
            course: true
          }
        }
      },
      orderBy: { enrolledAt: 'desc' }
    })

    // Calculate progress for each enrollment
    const enrollmentsWithProgress = enrollments.map(enrollment => {
      const totalCourses = enrollment.program.courses.length
      const completedCourses = enrollment.courseProgress.filter(cp => cp.completed).length
      const progress = totalCourses > 0 ? (completedCourses / totalCourses) * 100 : 0

      return {
        ...enrollment,
        progress,
        completedCourses,
        totalCourses
      }
    })

    return NextResponse.json({ enrollments: enrollmentsWithProgress })
  } catch (error) {
    console.error('Error fetching enrollments:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}