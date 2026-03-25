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

    // Mock subscription data - in a real app, this would come from the database
    const subscription = {
      id: 'sub_123',
      userId: decoded.userId,
      tierId: '2',
      status: 'ACTIVE',
      startDate: '2024-01-01',
      endDate: '2024-02-01',
      nextBillingDate: '2024-02-01',
      cancelAtPeriodEnd: false,
      tier: {
        id: '2',
        name: 'Professional',
        description: 'Ideal for serious finance professionals',
        price: 29.99,
        currency: 'USD',
        billingCycle: 'MONTHLY',
        features: [
          'Access to 25 courses',
          'Unlimited certificates',
          'Advanced AI Lab credits',
          'Unlimited portfolio projects',
          '1:1 mentorship sessions',
          'Priority job applications',
          'Partner network access',
          'Priority support',
          'Downloadable resources'
        ],
        limits: {
          courses: 25,
          certificates: -1,
          mentorshipSessions: 2,
          aiLabCredits: 200,
          portfolioProjects: -1,
          jobApplications: 25,
          partnerAccess: true,
          prioritySupport: true
        }
      }
    }

    return NextResponse.json({ subscription })
  } catch (error) {
    console.error('Error fetching subscription:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { tierId, billingCycle } = body

    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'No token provided' },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7)
    const decoded = jwt.verify(token, JWT_SECRET) as any

    // Mock subscription creation - in a real app, this would integrate with a payment provider
    const subscription = {
      id: 'sub_' + Date.now(),
      userId: decoded.userId,
      tierId: tierId,
      status: 'ACTIVE',
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
      nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      cancelAtPeriodEnd: false
    }

    return NextResponse.json({ subscription }, { status: 201 })
  } catch (error) {
    console.error('Error creating subscription:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
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

    // Mock subscription cancellation - in a real app, this would integrate with the payment provider
    return NextResponse.json({ 
      message: 'Subscription cancelled successfully',
      cancelAtPeriodEnd: true
    })
  } catch (error) {
    console.error('Error cancelling subscription:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}