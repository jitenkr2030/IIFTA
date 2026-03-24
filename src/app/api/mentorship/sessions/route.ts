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

    const sessions = await db.mentorshipSession.findMany({
      where: { studentId: decoded.userId },
      include: {
        mentor: true,
        student: {
          select: {
            name: true,
            email: true,
            avatar: true
          }
        }
      },
      orderBy: { scheduledAt: 'desc' }
    })

    return NextResponse.json({ sessions })
  } catch (error) {
    console.error('Error fetching sessions:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      mentorId,
      type,
      title,
      description,
      duration,
      scheduledAt,
      notes,
      price,
      currency
    } = body

    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'No token provided' },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7)
    const decoded = jwt.verify(token, JWT_SECRET) as any

    // Create session
    const session = await db.mentorshipSession.create({
      data: {
        mentorId,
        studentId: decoded.userId,
        type,
        title,
        description,
        duration,
        scheduledAt: new Date(scheduledAt),
        notes,
        price,
        currency,
        status: 'SCHEDULED',
        paid: false,
        createdAt: new Date()
      }
    })

    // Update mentor session count
    await db.mentor.update({
      where: { id: mentorId },
      data: {
        sessionCount: {
          increment: 1
        }
      }
    })

    // Create notification for mentor (if implemented)
    // await db.notification.create({
    //   data: {
    //     userId: mentorId,
    //     type: 'NEW_SESSION',
    //     title: 'New Session Booked',
    //     message: `${user.name} has booked a session with you`,
    //     relatedId: session.id,
    //     relatedType: 'SESSION'
    //   }
    // })

    return NextResponse.json({ session }, { status: 201 })
  } catch (error) {
    console.error('Error creating session:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}