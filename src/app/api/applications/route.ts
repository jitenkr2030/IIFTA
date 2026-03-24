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

    const applications = await db.application.findMany({
      where: { studentId: decoded.userId },
      include: {
        job: {
          include: {
            company: true
          }
        }
      },
      orderBy: { appliedAt: 'desc' }
    })

    return NextResponse.json({ applications })
  } catch (error) {
    console.error('Error fetching applications:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { jobId, coverLetter, expectedSalary, availability } = body

    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'No token provided' },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7)
    const decoded = jwt.verify(token, JWT_SECRET) as any

    // Check if user has already applied for this job
    const existingApplication = await db.application.findUnique({
      where: {
        jobId_studentId: {
          jobId: jobId,
          studentId: decoded.userId
        }
      }
    })

    if (existingApplication) {
      return NextResponse.json(
        { error: 'You have already applied for this job' },
        { status: 400 }
      )
    }

    // Create application
    const application = await db.application.create({
      data: {
        jobId,
        studentId: decoded.userId,
        coverLetter,
        expectedSalary: expectedSalary ? parseInt(expectedSalary) : null,
        availability,
        status: 'PENDING',
        appliedAt: new Date(),
        updatedAt: new Date()
      }
    })

    // Update job application count
    await db.job.update({
      where: { id: jobId },
      data: {
        applications: {
          increment: 1
        }
      }
    })

    // Create notification for job poster (if implemented)
    // await db.notification.create({
    //   data: {
    //     userId: job.postedBy,
    //     type: 'NEW_APPLICATION',
    //     title: 'New Application Received',
    //     message: `${user.name} has applied for your job: ${job.title}`,
    //     relatedId: application.id,
    //     relatedType: 'APPLICATION'
    //   }
    // })

    return NextResponse.json({ application }, { status: 201 })
  } catch (error) {
    console.error('Error creating application:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}