'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Crown, 
  Star, 
  CheckCircle, 
  X, 
  Zap, 
  Shield, 
  Rocket, 
  CreditCard, 
  Calendar, 
  Users, 
  BookOpen, 
  Video, 
  Download, 
  Support, 
  TrendingUp, 
  Award, 
  Gift, 
  Clock, 
  DollarSign,
  Check,
  AlertCircle,
  ArrowRight,
  Settings
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { toast } from 'sonner'

interface SubscriptionTier {
  id: string
  name: string
  description: string
  price: number
  currency: string
  billingCycle: 'MONTHLY' | 'YEARLY'
  features: string[]
  limits: {
    courses: number
    certificates: number
    mentorshipSessions: number
    aiLabCredits: number
    portfolioProjects: number
    jobApplications: number
    partnerAccess: boolean
    prioritySupport: boolean
  }
  popular?: boolean
  color: string
  icon: string
}

interface UserSubscription {
  id: string
  userId: string
  tierId: string
  status: 'ACTIVE' | 'CANCELLED' | 'EXPIRED' | 'TRIAL'
  startDate: string
  endDate: string
  nextBillingDate: string
  cancelAtPeriodEnd: boolean
  trialEndsAt?: string
  tier?: SubscriptionTier
}

interface MembershipSystemProps {
  userRole?: string
}

export function MembershipSystem({ userRole = 'STUDENT' }: MembershipSystemProps) {
  const [activeTab, setActiveTab] = useState<'plans' | 'subscription' | 'billing'>('plans')
  const [tiers, setTiers] = useState<SubscriptionTier[]>([])
  const [userSubscription, setUserSubscription] = useState<UserSubscription | null>(null)
  const [selectedTier, setSelectedTier] = useState<SubscriptionTier | null>(null)
  const [billingCycle, setBillingCycle] = useState<'MONTHLY' | 'YEARLY'>('MONTHLY')
  const [isUpgrading, setIsUpgrading] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    fetchTiers()
    fetchUserSubscription()
  }, [])

  const fetchTiers = async () => {
    try {
      const response = await fetch('/api/membership/tiers')
      if (response.ok) {
        const data = await response.json()
        setTiers(data.tiers)
      }
    } catch (error) {
      console.error('Error fetching tiers:', error)
    }
  }

  const fetchUserSubscription = async () => {
    try {
      const token = localStorage.getItem('auth_token')
      const response = await fetch('/api/membership/subscription', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setUserSubscription(data.subscription)
      }
    } catch (error) {
      console.error('Error fetching subscription:', error)
    }
  }

  const handleSubscribe = async (tierId: string) => {
    setIsUpgrading(true)
    try {
      const token = localStorage.getItem('auth_token')
      const response = await fetch('/api/membership/subscribe', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          tierId,
          billingCycle
        })
      })

      if (response.ok) {
        const data = await response.json()
        toast.success('Subscription successful! Welcome to your new plan.')
        setUserSubscription(data.subscription)
        setSelectedTier(null)
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to subscribe')
      }
    } catch (error) {
      console.error('Error subscribing:', error)
      toast.error('Failed to subscribe')
    } finally {
      setIsUpgrading(false)
    }
  }

  const handleCancelSubscription = async () => {
    if (!confirm('Are you sure you want to cancel your subscription? You will continue to have access until the end of your billing period.')) {
      return
    }

    try {
      const token = localStorage.getItem('auth_token')
      const response = await fetch('/api/membership/cancel', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        toast.success('Subscription cancelled. You will continue to have access until the end of your billing period.')
        fetchUserSubscription()
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to cancel subscription')
      }
    } catch (error) {
      console.error('Error cancelling subscription:', error)
      toast.error('Failed to cancel subscription')
    }
  }

  const handleReactivateSubscription = async () => {
    try {
      const token = localStorage.getItem('auth_token')
      const response = await fetch('/api/membership/reactivate', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        toast.success('Subscription reactivated successfully!')
        fetchUserSubscription()
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to reactivate subscription')
      }
    } catch (error) {
      console.error('Error reactivating subscription:', error)
      toast.error('Failed to reactivate subscription')
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const getTierIcon = (iconName: string) => {
    switch (iconName) {
      case 'crown': return <Crown className="h-6 w-6" />
      case 'star': return <Star className="h-6 w-6" />
      case 'zap': return <Zap className="h-6 w-6" />
      case 'shield': return <Shield className="h-6 w-6" />
      case 'rocket': return <Rocket className="h-6 w-6" />
      default: return <Crown className="h-6 w-6" />
    }
  }

  const getTierColor = (color: string) => {
    switch (color) {
      case 'blue': return 'border-blue-500 bg-blue-50'
      case 'purple': return 'border-purple-500 bg-purple-50'
      case 'gold': return 'border-yellow-500 bg-yellow-50'
      case 'green': return 'border-green-500 bg-green-50'
      default: return 'border-gray-500 bg-gray-50'
    }
  }

  const getSubscriptionStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800'
      case 'CANCELLED': return 'bg-red-100 text-red-800'
      case 'EXPIRED': return 'bg-orange-100 text-orange-800'
      case 'TRIAL': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const calculateYearlySavings = (tier: SubscriptionTier) => {
    const monthlyTotal = tier.price * 12
    const yearlyPrice = monthlyTotal * 0.8 // 20% discount for yearly
    return monthlyTotal - yearlyPrice
  }

  const displayPrice = (tier: SubscriptionTier) => {
    const price = billingCycle === 'YEARLY' ? tier.price * 12 * 0.8 : tier.price
    return `$${price.toFixed(2)}/${billingCycle === 'YEARLY' ? 'year' : 'month'}`
  }

  // Mock tiers data
  const mockTiers: SubscriptionTier[] = [
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

  const displayTiers = tiers.length > 0 ? tiers : mockTiers

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Crown className="h-8 w-8 text-primary" />
            Membership System
          </h1>
          <p className="text-muted-foreground">
            Choose the perfect plan for your learning journey
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-sm">
            <Gift className="w-3 h-3 mr-1" />
            20% off yearly plans
          </Badge>
        </div>
      </div>

      {/* Current Subscription Status */}
      {userSubscription && userSubscription.status === 'ACTIVE' && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-green-800">
                    {userSubscription.tier?.name} Plan Active
                  </h3>
                  <p className="text-sm text-green-600">
                    Next billing: {formatDate(userSubscription.nextBillingDate)}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleCancelSubscription}>
                  Cancel
                </Button>
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-1" />
                  Manage
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {userSubscription && userSubscription.status === 'CANCELLED' && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                  <AlertCircle className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-orange-800">
                    Subscription Cancelled
                  </h3>
                  <p className="text-sm text-orange-600">
                    Access ends: {formatDate(userSubscription.endDate)}
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={handleReactivateSubscription}>
                Reactivate
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Billing Cycle Toggle */}
      <div className="flex items-center justify-center gap-4">
        <span className={`text-sm ${billingCycle === 'MONTHLY' ? 'font-medium' : 'text-muted-foreground'}`}>
          Monthly
        </span>
        <div className="relative">
          <input
            type="checkbox"
            id="billing-cycle"
            checked={billingCycle === 'YEARLY'}
            onChange={(e) => setBillingCycle(e.target.checked ? 'YEARLY' : 'MONTHLY')}
            className="sr-only"
          />
          <label
            htmlFor="billing-cycle"
            className={`block w-14 h-8 rounded-full cursor-pointer transition-colors ${
              billingCycle === 'YEARLY' ? 'bg-primary' : 'bg-gray-200'
            }`}
          >
            <div
              className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                billingCycle === 'YEARLY' ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </label>
        </div>
        <span className={`text-sm ${billingCycle === 'YEARLY' ? 'font-medium' : 'text-muted-foreground'}`}>
          Yearly
          {billingCycle === 'YEARLY' && (
            <Badge variant="secondary" className="ml-2 text-xs">
              Save 20%
            </Badge>
          )}
        </span>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="plans">Membership Plans</TabsTrigger>
          <TabsTrigger value="subscription">My Subscription</TabsTrigger>
          <TabsTrigger value="billing">Billing History</TabsTrigger>
        </TabsList>

        {/* Plans Tab */}
        <TabsContent value="plans" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {displayTiers.map((tier) => (
              <Card 
                key={tier.id} 
                className={`relative ${tier.popular ? 'border-2 border-primary shadow-lg' : ''} ${
                  userSubscription?.tierId === tier.id ? 'ring-2 ring-green-500' : ''
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground">
                      Most Popular
                    </Badge>
                  </div>
                )}
                {userSubscription?.tierId === tier.id && (
                  <div className="absolute -top-3 right-4">
                    <Badge className="bg-green-500 text-white">
                      Current Plan
                    </Badge>
                  </div>
                )}
                <CardHeader className="text-center pb-4">
                  <div className="flex justify-center mb-4">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center ${getTierColor(tier.color)}`}>
                      {getTierIcon(tier.icon)}
                    </div>
                  </div>
                  <CardTitle className="text-xl">{tier.name}</CardTitle>
                  <CardDescription className="text-sm">
                    {tier.description}
                  </CardDescription>
                  <div className="mt-4">
                    <div className="flex items-baseline justify-center">
                      <span className="text-3xl font-bold">
                        ${billingCycle === 'YEARLY' ? (tier.price * 12 * 0.8).toFixed(0) : tier.price}
                      </span>
                      <span className="text-muted-foreground">
                        /{billingCycle === 'YEARLY' ? 'year' : 'month'}
                      </span>
                    </div>
                    {billingCycle === 'YEARLY' && (
                      <p className="text-sm text-green-600 mt-1">
                        Save ${calculateYearlySavings(tier).toFixed(0)} per year
                      </p>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-3">
                    {tier.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className="w-full" 
                    onClick={() => handleSubscribe(tier.id)}
                    disabled={isUpgrading || userSubscription?.tierId === tier.id}
                    variant={tier.popular ? 'default' : 'outline'}
                  >
                    {userSubscription?.tierId === tier.id ? 'Current Plan' : 
                     isUpgrading ? 'Processing...' : 'Subscribe'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Subscription Tab */}
        <TabsContent value="subscription" className="space-y-6">
          {userSubscription ? (
            <Card>
              <CardHeader>
                <CardTitle>Your Subscription Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-4">Plan Information</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Plan:</span>
                        <span className="font-medium">{userSubscription.tier?.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Status:</span>
                        <Badge className={getSubscriptionStatusColor(userSubscription.status)}>
                          {userSubscription.status}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Started:</span>
                        <span className="font-medium">{formatDate(userSubscription.startDate)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Next Billing:</span>
                        <span className="font-medium">{formatDate(userSubscription.nextBillingDate)}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-4">Usage Limits</h3>
                    <div className="space-y-3">
                      {userSubscription.tier && Object.entries(userSubscription.tier.limits).map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span className="text-muted-foreground capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}:
                          </span>
                          <span className="font-medium">
                            {value === -1 ? 'Unlimited' : value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex gap-4 pt-4 border-t">
                  <Button variant="outline" onClick={() => setActiveTab('plans')}>
                    Change Plan
                  </Button>
                  {userSubscription.status === 'ACTIVE' && (
                    <Button variant="outline" onClick={handleCancelSubscription}>
                      Cancel Subscription
                    </Button>
                  )}
                  {userSubscription.status === 'CANCELLED' && (
                    <Button onClick={handleReactivateSubscription}>
                      Reactivate
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Crown className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No Active Subscription</h3>
                <p className="text-muted-foreground text-center mb-4">
                  Choose a membership plan to unlock premium features
                </p>
                <Button onClick={() => setActiveTab('plans')}>
                  Browse Plans
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Billing Tab */}
        <TabsContent value="billing" className="space-y-6">
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <CreditCard className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Billing History</h3>
              <p className="text-muted-foreground text-center mb-4">
                Your billing history and payment methods will appear here
              </p>
              <Button>
                <CreditCard className="h-4 w-4 mr-2" />
                Add Payment Method
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}