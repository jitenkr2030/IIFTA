import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const courseId = params.id

    const course = await db.course.findUnique({
      where: { id: courseId },
      include: {
        program: true,
        lessons: {
          orderBy: { order: 'asc' }
        },
        assignments: {
          orderBy: { dueDate: 'asc' }
        },
        quizzes: {
          include: {
            questions: {
              orderBy: { order: 'asc' }
            }
          }
        }
      }
    })

    if (!course) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ course })
  } catch (error) {
    console.error('Error fetching course:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}