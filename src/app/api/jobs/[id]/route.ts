import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const jobId = params.id

    const job = await db.job.findUnique({
      where: { id: jobId },
      include: {
        company: true,
        _count: {
          select: {
            applications: true,
            views: true,
            saves: true
          }
        }
      }
    })

    if (!job) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      )
    }

    // Increment view count
    await db.job.update({
      where: { id: jobId },
      data: {
        views: {
          increment: 1
        }
      }
    })

    return NextResponse.json({ job })
  } catch (error) {
    console.error('Error fetching job:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const jobId = params.id
    const body = await request.json()

    const job = await db.job.update({
      where: { id: jobId },
      data: {
        ...body,
        updatedAt: new Date()
      }
    })

    return NextResponse.json({ job })
  } catch (error) {
    console.error('Error updating job:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const jobId = params.id

    await db.job.delete({
      where: { id: jobId }
    })

    return NextResponse.json({ message: 'Job deleted successfully' })
  } catch (error) {
    console.error('Error deleting job:', error)
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
    const jobId = params.id

    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'No token provided' },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7)
    const decoded = jwt.verify(token, JWT_SECRET) as any

    // Check if user has already saved this job
    const existingSave = await db.savedJob.findUnique({
      where: {
        jobId_studentId: {
          jobId: jobId,
          studentId: decoded.userId
        }
      }
    })

    if (existingSave) {
      // Remove from saved jobs
      await db.savedJob.delete({
        where: { id: existingSave.id }
      })
      
      // Decrement save count
      await db.job.update({
        where: { id: jobId },
        data: {
          saves: {
            decrement: 1
          }
        }
      })

      return NextResponse.json({ saved: false })
    } else {
      // Add to saved jobs
      await db.savedJob.create({
        data: {
          jobId: jobId,
          studentId: decoded.userId,
          savedAt: new Date()
        }
      })

      // Increment save count
      await db.job.update({
        where: { id: jobId },
        data: {
          saves: {
            increment: 1
          }
        }
      })

      return NextResponse.json({ saved: true })
    }
  } catch (error) {
    console.error('Error saving job:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}