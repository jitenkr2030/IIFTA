import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const industry = searchParams.get('industry') || ''
    const size = searchParams.get('size') || ''
    const location = searchParams.get('location') || ''

    // Build where clause
    const where: any = {
      status: 'ACTIVE'
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { industry: { contains: search, mode: 'insensitive' } },
        { location: { contains: search, mode: 'insensitive' } }
      ]
    }

    if (industry) {
      where.industry = industry
    }

    if (size) {
      where.size = size
    }

    if (location) {
      where.location = { contains: location, mode: 'insensitive' }
    }

    const partners = await db.partner.findMany({
      where,
      include: {
        _count: {
          select: {
            jobs: true,
            students: true,
            mentorshipSessions: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ partners })
  } catch (error) {
    console.error('Error fetching partners:', error)
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
      name,
      description,
      logo,
      website,
      industry,
      size,
      location,
      contactEmail,
      contactPhone,
      foundedYear,
      services,
      certifications,
      subscriptionTier,
      postedBy
    } = body

    const partner = await db.partner.create({
      data: {
        name,
        description,
        logo,
        website,
        industry,
        size,
        location,
        contactEmail,
        contactPhone,
        foundedYear: foundedYear ? parseInt(foundedYear) : null,
        services: JSON.stringify(services),
        certifications: JSON.stringify(certifications),
        subscriptionTier: subscriptionTier || 'BASIC',
        rating: 0,
        reviewCount: 0,
        status: 'PENDING',
        postedBy,
        createdAt: new Date()
      }
    })

    return NextResponse.json({ partner }, { status: 201 })
  } catch (error) {
    console.error('Error creating partner:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}