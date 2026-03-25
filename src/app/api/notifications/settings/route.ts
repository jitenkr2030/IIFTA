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

    // Mock settings data - in a real app, this would come from the database
    const settings = {
      userId: decoded.userId,
      emailNotifications: true,
      pushNotifications: true,
      inAppNotifications: true,
      categories: {
        course: true,
        certification: true,
        job: true,
        mentorship: true,
        system: true,
        promotion: false,
        reminder: true
      },
      priorities: {
        low: true,
        medium: true,
        high: true,
        urgent: true
      },
      frequency: {
        immediate: true,
        daily: false,
        weekly: false,
        monthly: false
      },
      quietHours: {
        enabled: false,
        start: '22:00',
        end: '08:00',
        timezone: 'EST'
      }
    }

    return NextResponse.json({ settings })
  } catch (error) {
    console.error('Error fetching settings:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()

    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'No token provided' },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7)
    const decoded = jwt.verify(token, JWT_SECRET) as any

    // Update settings - in a real app, this would be saved to the database
    // await db.notificationSettings.upsert({
    //   where: { userId: decoded.userId },
    //   update: body,
    //   create: { userId: decoded.userId, ...body }
    // })

    return NextResponse.json({ message: 'Settings updated successfully' })
  } catch (error) {
    console.error('Error updating settings:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}