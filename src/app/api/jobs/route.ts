import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const category = searchParams.get('category') || ''
    const type = searchParams.get('type') || ''
    const location = searchParams.get('location') || ''
    const remote = searchParams.get('remote') === 'true'
    const salaryMin = searchParams.get('salaryMin')
    const salaryMax = searchParams.get('salaryMax')

    // Build where clause
    const where: any = {
      status: 'ACTIVE'
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { company: { name: { contains: search, mode: 'insensitive' } } }
      ]
    }

    if (category) {
      where.category = category
    }

    if (type) {
      where.type = type
    }

    if (location) {
      where.location = { contains: location, mode: 'insensitive' }
    }

    if (remote) {
      where.remote = true
    }

    if (salaryMin || salaryMax) {
      where.salary = {}
      if (salaryMin) {
        where.salary.gte = parseInt(salaryMin)
      }
      if (salaryMax) {
        where.salary.lte = parseInt(salaryMax)
      }
    }

    const jobs = await db.job.findMany({
      where,
      include: {
        company: true,
        _count: {
          select: {
            applications: true,
            views: true,
            saves: true
          }
        }
      },
      orderBy: { postedAt: 'desc' }
    })

    return NextResponse.json({ jobs })
  } catch (error) {
    console.error('Error fetching jobs:', error)
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
      title,
      description,
      type,
      category,
      location,
      remote,
      salaryMin,
      salaryMax,
      salaryCurrency,
      requirements,
      responsibilities,
      skills,
      experience,
      deadline,
      companyId,
      postedBy
    } = body

    const job = await db.job.create({
      data: {
        title,
        description,
        type,
        category,
        location,
        remote,
        salaryMin,
        salaryMax,
        salaryCurrency,
        requirements: JSON.stringify(requirements),
        responsibilities: JSON.stringify(responsibilities),
        skills: JSON.stringify(skills),
        experience,
        deadline: deadline ? new Date(deadline) : null,
        companyId,
        postedBy,
        status: 'ACTIVE',
        postedAt: new Date(),
        expiresAt: deadline ? new Date(deadline) : null
      }
    })

    return NextResponse.json({ job }, { status: 201 })
  } catch (error) {
    console.error('Error creating job:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}