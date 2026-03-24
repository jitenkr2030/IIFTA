import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const expertise = searchParams.get('expertise') || ''
    const availability = searchParams.get('availability') || ''
    const priceMin = searchParams.get('priceMin')
    const priceMax = searchParams.get('priceMax')
    const rating = searchParams.get('rating')

    // Build where clause
    const where: any = {
      status: 'ACTIVE'
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { bio: { contains: search, mode: 'insensitive' } },
        { title: { contains: search, mode: 'insensitive' } },
        { company: { contains: search, mode: 'insensitive' } },
        { expertise: { has: search } }
      ]
    }

    if (expertise) {
      where.expertise = { has: expertise }
    }

    if (availability) {
      where.availability = availability
    }

    if (priceMin || priceMax) {
      where.hourlyRate = {}
      if (priceMin) {
        where.hourlyRate.gte = parseInt(priceMin)
      }
      if (priceMax) {
        where.hourlyRate.lte = parseInt(priceMax)
      }
    }

    if (rating) {
      where.rating = { gte: parseFloat(rating) }
    }

    const mentors = await db.mentor.findMany({
      where,
      include: {
        _count: {
          select: {
            sessions: true,
            reviews: true,
            students: true
          }
        }
      },
      orderBy: { rating: 'desc' }
    })

    return NextResponse.json({ mentors })
  } catch (error) {
    console.error('Error fetching mentors:', error)
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
      email,
      avatar,
      bio,
      title,
      company,
      experience,
      expertise,
      languages,
      hourlyRate,
      currency,
      availability,
      location,
      timezone,
      linkedin,
      website,
      videoIntro,
      userId
    } = body

    const mentor = await db.mentor.create({
      data: {
        name,
        email,
        avatar,
        bio,
        title,
        company,
        experience,
        expertise: JSON.stringify(expertise),
        languages: JSON.stringify(languages),
        hourlyRate,
        currency,
        availability,
        location,
        timezone,
        linkedin,
        website,
        videoIntro,
        userId,
        rating: 0,
        reviewCount: 0,
        sessionCount: 0,
        status: 'PENDING',
        isVerified: false,
        createdAt: new Date()
      }
    })

    return NextResponse.json({ mentor }, { status: 201 })
  } catch (error) {
    console.error('Error creating mentor:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}