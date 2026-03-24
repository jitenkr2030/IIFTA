import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const programId = params.id
    
    // Get user from token
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'No token provided' },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7)
    const decoded = jwt.verify(token, JWT_SECRET) as any
    
    // Check if user is already enrolled
    const existingEnrollment = await db.enrollment.findUnique({
      where: {
        userId_programId: {
          userId: decoded.userId,
          programId: programId
        }
      }
    })

    if (existingEnrollment) {
      return NextResponse.json(
        { error: 'Already enrolled in this program' },
        { status: 400 }
      )
    }

    // Get program details
    const program = await db.certificationProgram.findUnique({
      where: { id: programId },
      include: {
        courses: {
          where: { isPublished: true },
          orderBy: { order: 'asc' }
        }
      }
    })

    if (!program) {
      return NextResponse.json(
        { error: 'Program not found' },
        { status: 404 }
      )
    }

    // Create enrollment
    const enrollment = await db.enrollment.create({
      data: {
        userId: decoded.userId,
        programId: programId,
        status: 'ACTIVE',
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 year from now
      }
    })

    // Create course progress entries
    const courseProgress = await Promise.all(
      program.courses.map(course =>
        db.courseProgress.create({
          data: {
            enrollmentId: enrollment.id,
            courseId: course.id,
            studentId: decoded.userId
          }
        })
      )
    )

    return NextResponse.json({
      enrollment,
      courseProgress,
      message: 'Successfully enrolled in program'
    })
  } catch (error) {
    console.error('Error enrolling in program:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}