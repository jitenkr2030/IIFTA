import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const unreadOnly = searchParams.get('unreadOnly') === 'true'
    const category = searchParams.get('category')
    const priority = searchParams.get('priority')

    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'No token provided' },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7)
    const decoded = jwt.verify(token, JWT_SECRET) as any

    // Mock notifications data - in a real app, this would come from the database
    const notifications = [
      {
        id: '1',
        userId: decoded.userId,
        type: 'SUCCESS',
        title: 'Course Completed!',
        message: 'Congratulations! You have successfully completed the Financial Accounting Fundamentals course.',
        read: false,
        archived: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        category: 'COURSE',
        priority: 'MEDIUM',
        metadata: {
          courseId: '1',
          courseName: 'Financial Accounting Fundamentals'
        }
      },
      {
        id: '2',
        userId: decoded.userId,
        type: 'INFO',
        title: 'New Job Opportunity',
        message: 'A new Senior Accountant position has been posted that matches your profile.',
        read: false,
        archived: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        category: 'JOB',
        priority: 'HIGH',
        actionUrl: '/jobs/123',
        actionText: 'View Job',
        metadata: {
          jobId: '123',
          jobTitle: 'Senior Accountant'
        }
      },
      {
        id: '3',
        userId: decoded.userId,
        type: 'WARNING',
        title: 'Certificate Expiring Soon',
        message: 'Your Financial Accounting Certificate will expire in 30 days. Renew now to maintain your credentials.',
        read: true,
        archived: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
        category: 'CERTIFICATION',
        priority: 'HIGH',
        actionUrl: '/certificates/456',
        actionText: 'Renew Certificate',
        metadata: {
          certificateId: '456',
          certificateName: 'Financial Accounting Certificate'
        }
      },
      {
        id: '4',
        userId: decoded.userId,
        type: 'INFO',
        title: 'Mentorship Session Reminder',
        message: 'Your 1:1 mentorship session with John Doe is scheduled for tomorrow at 2:00 PM.',
        read: false,
        archived: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
        category: 'MENTORSHIP',
        priority: 'MEDIUM',
        metadata: {
          mentorId: '789',
          mentorName: 'John Doe'
        }
      },
      {
        id: '5',
        userId: decoded.userId,
        type: 'SYSTEM',
        title: 'Platform Maintenance',
        message: 'The platform will undergo scheduled maintenance on Sunday from 2:00 AM to 4:00 AM EST.',
        read: true,
        archived: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
        category: 'SYSTEM',
        priority: 'LOW'
      }
    ]

    // Filter notifications based on query parameters
    let filteredNotifications = notifications
    if (unreadOnly) {
      filteredNotifications = filteredNotifications.filter(n => !n.read)
    }
    if (category) {
      filteredNotifications = filteredNotifications.filter(n => n.category === category)
    }
    if (priority) {
      filteredNotifications = filteredNotifications.filter(n => n.priority === priority)
    }

    return NextResponse.json({ notifications: filteredNotifications })
  } catch (error) {
    console.error('Error fetching notifications:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, title, message, category, priority, data, actionUrl, actionText, metadata } = body

    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'No token provided' },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7)
    const decoded = jwt.verify(token, JWT_SECRET) as any

    // Create notification
    const notification = {
      id: 'notif_' + Date.now(),
      userId: decoded.userId,
      type,
      title,
      message,
      data,
      read: false,
      archived: false,
      createdAt: new Date().toISOString(),
      category,
      priority,
      actionUrl,
      actionText,
      metadata
    }

    // In a real app, this would be saved to the database
    // await db.notification.create({ data: notification })

    return NextResponse.json({ notification }, { status: 201 })
  } catch (error) {
    console.error('Error creating notification:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}