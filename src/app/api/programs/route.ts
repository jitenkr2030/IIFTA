import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const programs = await db.certificationProgram.findMany({
      where: { isActive: true },
      include: {
        courses: {
          where: { isPublished: true },
          orderBy: { order: 'asc' }
        },
        _count: {
          select: {
            enrollments: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ programs })
  } catch (error) {
    console.error('Error fetching programs:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, level, duration, price, thumbnail, requirements, learningPath } = body

    const program = await db.certificationProgram.create({
      data: {
        title,
        description,
        level,
        duration,
        price,
        thumbnail,
        requirements: JSON.stringify(requirements),
        learningPath: JSON.stringify(learningPath)
      }
    })

    return NextResponse.json({ program }, { status: 201 })
  } catch (error) {
    console.error('Error creating program:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}