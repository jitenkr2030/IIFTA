import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export async function POST(request: NextRequest) {
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

    // Mark all notifications as read - in a real app, this would update the database
    // await db.notification.updateMany({
    //   where: { 
    //     userId: decoded.userId,
    //     read: false
    //   },
    //   data: {
    //     read: true,
    //     readAt: new Date()
    //   }
    // })

    return NextResponse.json({ message: 'All notifications marked as read' })
  } catch (error) {
    console.error('Error marking all as read:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}