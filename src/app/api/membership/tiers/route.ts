import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    // Mock tiers data - in a real app, this would come from the database
    const tiers = [
      {
        id: '1',
        name: 'Basic',
        description: 'Perfect for getting started with finance education',
        price: 9.99,
        currency: 'USD',
        billingCycle: 'MONTHLY',
        features: [
          'Access to 5 courses',
          '2 certificates per year',
          'Basic AI Lab credits',
          'Portfolio with 3 projects',
          'Community access',
          'Email support'
        ],
        limits: {
          courses: 5,
          certificates: 2,
          mentorshipSessions: 0,
          aiLabCredits: 50,
          portfolioProjects: 3,
          jobApplications: 5,
          partnerAccess: false,
          prioritySupport: false
        },
        color: 'green',
        icon: 'shield'
      },
      {
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
        },
        color: 'blue',
        icon: 'star',
        popular: true
      },
      {
        id: '3',
        name: 'Enterprise',
        description: 'Complete solution for teams and organizations',
        price: 99.99,
        currency: 'USD',
        billingCycle: 'MONTHLY',
        features: [
          'Unlimited access to all courses',
          'Unlimited certificates',
          'Unlimited AI Lab credits',
          'Unlimited mentorship sessions',
          'Custom branding',
          'Team management',
          'API access',
          'Dedicated support',
          'Custom integrations',
          'White-label options'
        ],
        limits: {
          courses: -1,
          certificates: -1,
          mentorshipSessions: -1,
          aiLabCredits: -1,
          portfolioProjects: -1,
          jobApplications: -1,
          partnerAccess: true,
          prioritySupport: true
        },
        color: 'purple',
        icon: 'crown'
      }
    ]

    return NextResponse.json({ tiers })
  } catch (error) {
    console.error('Error fetching tiers:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}