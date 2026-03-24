import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const opportunities = await db.partnershipOpportunity.findMany({
      where: {
        status: 'ACTIVE',
        OR: [
          { expiresAt: null },
          { expiresAt: { gt: new Date() } }
        ]
      },
      include: {
        partner: true,
        _count: {
          select: {
            applications: true,
            views: true
          }
        }
      },
      orderBy: { postedAt: 'desc' }
    })

    return NextResponse.json({ opportunities })
  } catch (error) {
    console.error('Error fetching opportunities:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { opportunityId } = body

    // This would be handled by the application submission endpoint
    // For now, return a success response
    return NextResponse.json({ 
      message: 'Application submitted successfully',
      opportunityId 
    }, { status: 201 })
  } catch (error) {
    console.error('Error submitting application:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}