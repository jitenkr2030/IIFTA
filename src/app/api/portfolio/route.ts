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

    let portfolio = await db.portfolio.findUnique({
      where: { userId: decoded.userId },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            avatar: true
          }
        }
      }
    })

    // If portfolio doesn't exist, create a default one
    if (!portfolio) {
      portfolio = await db.portfolio.create({
        data: {
          userId: decoded.userId,
          bio: '',
          skills: JSON.stringify([]),
          experience: JSON.stringify([]),
          education: JSON.stringify([]),
          achievements: JSON.stringify([]),
          isPublic: true
        }
      })

      // Fetch the created portfolio with user data
      portfolio = await db.portfolio.findUnique({
        where: { id: portfolio.id },
        include: {
          user: {
            select: {
              name: true,
              email: true,
              avatar: true
            }
          }
        }
      })
    }

    return NextResponse.json({ portfolio })
  } catch (error) {
    console.error('Error fetching portfolio:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { bio, skills, experience, education, achievements, isPublic, customDomain } = body

    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'No token provided' },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7)
    const decoded = jwt.verify(token, JWT_SECRET) as any

    let portfolio = await db.portfolio.findUnique({
      where: { userId: decoded.userId }
    })

    if (!portfolio) {
      // Create portfolio if it doesn't exist
      portfolio = await db.portfolio.create({
        data: {
          userId: decoded.userId,
          bio,
          skills: JSON.stringify(skills),
          experience: JSON.stringify(experience),
          education: JSON.stringify(education),
          achievements: JSON.stringify(achievements),
          isPublic,
          customDomain
        }
      })
    } else {
      // Update existing portfolio
      portfolio = await db.portfolio.update({
        where: { id: portfolio.id },
        data: {
          bio,
          skills: JSON.stringify(skills),
          experience: JSON.stringify(experience),
          education: JSON.stringify(education),
          achievements: JSON.stringify(achievements),
          isPublic,
          customDomain,
          updatedAt: new Date()
        }
      })
    }

    // Return updated portfolio with user data
    portfolio = await db.portfolio.findUnique({
      where: { id: portfolio.id },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            avatar: true
          }
        }
      }
    })

    return NextResponse.json({ portfolio })
  } catch (error) {
    console.error('Error updating portfolio:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}