'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Building, 
  Users, 
  Briefcase, 
  TrendingUp, 
  Globe, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Star, 
  CheckCircle, 
  AlertCircle, 
  Plus, 
  Edit, 
  Eye, 
  MessageSquare, 
  Award, 
  Target, 
  Handshake, 
  Settings, 
  BarChart3,
  Company,
  FileText,
  DollarSign,
  Clock,
  Search,
  Filter
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { toast } from 'sonner'

interface Partner {
  id: string
  name: string
  description: string
  logo?: string
  website?: string
  industry: string
  size: string
  location: string
  contactEmail: string
  contactPhone?: string
  foundedYear?: number
  services: string[]
  certifications: string[]
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING'
  subscriptionTier: 'BASIC' | 'PRO' | 'ENTERPRISE'
  rating: number
  reviewCount: number
  createdAt: string
  updatedAt: string
  _count?: {
    jobs: number
    students: number
    mentorshipSessions: number
  }
}

interface PartnershipOpportunity {
  id: string
  partnerId: string
  title: string
  description: string
  type: 'INTERNSHIP' | 'FULL_TIME' | 'FREELANCE' | 'MENTORSHIP' | 'TRAINING' | 'COLLABORATION'
  category: string
  requirements: string[]
  benefits: string[]
  duration?: string
  stipend?: number
  location: string
  remote: boolean
  deadline?: string
  status: 'ACTIVE' | 'CLOSED' | 'DRAFT'
  postedAt: string
  expiresAt?: string
  _count?: {
    applications: number
    views: number
  }
  partner?: Partner
}

interface PartnerNetworkProps {
  userRole?: string
}

export function PartnerNetwork({ userRole = 'STUDENT' }: PartnerNetworkProps) {
  const [activeTab, setActiveTab] = useState<'browse' | 'opportunities' | 'my-applications'>('browse')
  const [partners, setPartners] = useState<Partner[]>([])
  const [opportunities, setOpportunities] = useState<PartnershipOpportunity[]>([])
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null)
  const [selectedOpportunity, setSelectedOpportunity] = useState<PartnershipOpportunity | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useAuth()

  // Filter states
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedIndustry, setSelectedIndustry] = useState('')
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedLocation, setSelectedLocation] = useState('')

  useEffect(() => {
    if (activeTab === 'browse') {
      fetchPartners()
    } else if (activeTab === 'opportunities') {
      fetchOpportunities()
    }
  }, [activeTab])

  const fetchPartners = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      if (searchTerm) params.append('search', searchTerm)
      if (selectedIndustry) params.append('industry', selectedIndustry)
      if (selectedSize) params.append('size', selectedSize)
      if (selectedLocation) params.append('location', selectedLocation)

      const response = await fetch(`/api/partners?${params}`)
      if (response.ok) {
        const data = await response.json()
        setPartners(data.partners)
      }
    } catch (error) {
      console.error('Error fetching partners:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchOpportunities = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/partners/opportunities')
      if (response.ok) {
        const data = await response.json()
        setOpportunities(data.opportunities)
      }
    } catch (error) {
      console.error('Error fetching opportunities:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleApplyOpportunity = async (opportunityId: string) => {
    try {
      const token = localStorage.getItem('auth_token')
      const response = await fetch('/api/partners/opportunities/apply', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ opportunityId })
      })

      if (response.ok) {
        toast.success('Application submitted successfully!')
        fetchOpportunities()
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to submit application')
      }
    } catch (error) {
      console.error('Error submitting application:', error)
      toast.error('Failed to submit application')
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'BASIC': return 'bg-gray-100 text-gray-800'
      case 'PRO': return 'bg-blue-100 text-blue-800'
      case 'ENTERPRISE': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800'
      case 'INACTIVE': return 'bg-red-100 text-red-800'
      case 'PENDING': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'INTERNSHIP': return 'bg-blue-100 text-blue-800'
      case 'FULL_TIME': return 'bg-green-100 text-green-800'
      case 'FREELANCE': return 'bg-purple-100 text-purple-800'
      case 'MENTORSHIP': return 'bg-orange-100 text-orange-800'
      case 'TRAINING': return 'bg-yellow-100 text-yellow-800'
      case 'COLLABORATION': return 'bg-pink-100 text-pink-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const industries = [
    'Accounting', 'Finance', 'Banking', 'Insurance', 'Investment', 'FinTech',
    'Tax', 'Audit', 'Consulting', 'Legal', 'Real Estate', 'Healthcare',
    'Technology', 'E-commerce', 'Manufacturing', 'Retail', 'Education'
  ]

  const sizes = [
    { value: 'STARTUP', label: 'Startup (1-10)' },
    { value: 'SMALL', label: 'Small (11-50)' },
    { value: 'MEDIUM', label: 'Medium (51-200)' },
    { value: 'LARGE', label: 'Large (201-1000)' },
    { value: 'ENTERPRISE', label: 'Enterprise (1000+)' }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Handshake className="h-8 w-8 text-primary" />
            Partner Network
          </h1>
          <p className="text-muted-foreground">
            Connect with CA firms, FinTech startups, and industry leaders
          </p>
        </div>
        {userRole === 'PARTNER' && (
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Post Opportunity
          </Button>
        )}
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Partners</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{partners.filter(p => p.status === 'ACTIVE').length}</div>
            <p className="text-xs text-muted-foreground">Network members</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Opportunities</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{opportunities.filter(o => o.status === 'ACTIVE').length}</div>
            <p className="text-xs text-muted-foreground">Available now</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Students Placed</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {partners.reduce((total, partner) => total + (partner._count?.students || 0), 0)}
            </div>
            <p className="text-xs text-muted-foreground">Career placements</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">87%</div>
            <p className="text-xs text-muted-foreground">Placement rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="browse">Browse Partners</TabsTrigger>
          <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
          <TabsTrigger value="my-applications">My Applications</TabsTrigger>
        </TabsList>

        {/* Browse Partners Tab */}
        <TabsContent value="browse" className="space-y-6">
          {/* Search and Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Search Partners</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Search Bar */}
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search partners by name, industry, or location..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button onClick={fetchPartners}>
                  Search
                </Button>
              </div>

              {/* Filters */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label>Industry</Label>
                  <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
                    <SelectTrigger>
                      <SelectValue placeholder="All industries" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All industries</SelectItem>
                      {industries.map((industry) => (
                        <SelectItem key={industry} value={industry}>
                          {industry}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Company Size</Label>
                  <Select value={selectedSize} onValueChange={setSelectedSize}>
                    <SelectTrigger>
                      <SelectValue placeholder="All sizes" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All sizes</SelectItem>
                      {sizes.map((size) => (
                        <SelectItem key={size.value} value={size.value}>
                          {size.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Location</Label>
                  <Input
                    placeholder="City or Country"
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                  />
                </div>

                <div className="flex items-end">
                  <Button variant="outline" onClick={() => {
                    setSearchTerm('')
                    setSelectedIndustry('')
                    setSelectedSize('')
                    setSelectedLocation('')
                  }}>
                    Clear Filters
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Partners List */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="h-3 bg-gray-200 rounded"></div>
                      <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <>
              {partners.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                      <Building className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">No Partners Found</h3>
                    <p className="text-muted-foreground text-center mb-4">
                      Try adjusting your filters or check back later for new partners
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {partners.map((partner) => (
                    <Card key={partner.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader className="pb-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              {partner.logo ? (
                                <img
                                  src={partner.logo}
                                  alt={partner.name}
                                  className="w-8 h-8 rounded"
                                />
                              ) : (
                                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                  <Building className="h-4 w-4 text-primary" />
                                </div>
                              )}
                              <CardTitle className="text-lg line-clamp-1">{partner.name}</CardTitle>
                              <Badge className={getTierColor(partner.subscriptionTier)}>
                                {partner.subscriptionTier}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge className={getStatusColor(partner.status)}>
                                {partner.status}
                              </Badge>
                              <div className="flex items-center gap-1">
                                <Star className="h-3 w-3 text-yellow-500 fill-current" />
                                <span className="text-sm font-medium">{partner.rating.toFixed(1)}</span>
                                <span className="text-xs text-muted-foreground">({partner.reviewCount})</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <CardDescription className="line-clamp-3">
                          {partner.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {/* Partner Details */}
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <Globe className="h-3 w-3 text-muted-foreground" />
                            <span>{partner.industry}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="h-3 w-3 text-muted-foreground" />
                            <span>{partner.size}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-3 w-3 text-muted-foreground" />
                            <span>{partner.location}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-3 w-3 text-muted-foreground" />
                            <span>Founded {partner.foundedYear}</span>
                          </div>
                        </div>

                        {/* Services */}
                        {partner.services.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {partner.services.slice(0, 3).map((service, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {service}
                              </Badge>
                            ))}
                            {partner.services.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{partner.services.length - 3}
                              </Badge>
                            )}
                          </div>
                        )}

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-4 text-center text-sm">
                          <div>
                            <div className="font-bold text-blue-600">{partner._count?.jobs || 0}</div>
                            <div className="text-xs text-muted-foreground">Jobs</div>
                          </div>
                          <div>
                            <div className="font-bold text-green-600">{partner._count?.students || 0}</div>
                            <div className="text-xs text-muted-foreground">Students</div>
                          </div>
                          <div>
                            <div className="font-bold text-purple-600">{partner._count?.mentorshipSessions || 0}</div>
                            <div className="text-xs text-muted-foreground">Sessions</div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 pt-4 border-t">
                          <Button size="sm" variant="outline" className="flex-1">
                            <Eye className="h-3 w-3 mr-1" />
                            View
                          </Button>
                          <Button size="sm" variant="outline" className="flex-1">
                            <MessageSquare className="h-3 w-3 mr-1" />
                            Contact
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </>
          )}
        </TabsContent>

        {/* Opportunities Tab */}
        <TabsContent value="opportunities" className="space-y-6">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(4)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="h-3 bg-gray-200 rounded"></div>
                      <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <>
              {opportunities.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                      <Briefcase className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">No Opportunities Available</h3>
                    <p className="text-muted-foreground text-center mb-4">
                      Check back later for new partnership opportunities
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {opportunities.map((opportunity) => (
                    <Card key={opportunity.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader className="pb-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <CardTitle className="text-lg line-clamp-2">{opportunity.title}</CardTitle>
                              <Badge className={getTypeColor(opportunity.type)}>
                                {opportunity.type}
                              </Badge>
                            </div>
                            {opportunity.partner && (
                              <div className="flex items-center gap-2 mb-2">
                                {opportunity.partner.logo ? (
                                  <img
                                    src={opportunity.partner.logo}
                                    alt={opportunity.partner.name}
                                    className="w-6 h-6 rounded"
                                  />
                                ) : (
                                  <Building className="h-4 w-4 text-muted-foreground" />
                                )}
                                <span className="text-sm font-medium">{opportunity.partner.name}</span>
                              </div>
                            )}
                            <CardDescription className="line-clamp-3">
                              {opportunity.description}
                            </CardDescription>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={getStatusColor(opportunity.status)}>
                              {opportunity.status}
                            </Badge>
                            {opportunity.remote && (
                              <Badge variant="outline">
                                <Globe className="h-3 w-3 mr-1" />
                                Remote
                              </Badge>
                            )}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {/* Opportunity Details */}
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-3 w-3 text-muted-foreground" />
                            <span>{opportunity.location}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-3 w-3 text-muted-foreground" />
                            <span>{opportunity.duration || 'Flexible'}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-3 w-3 text-muted-foreground" />
                            <span>{opportunity.stipend ? `$${opportunity.stipend}/month` : 'Unpaid'}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="h-3 w-3 text-muted-foreground" />
                            <span>{opportunity._count?.applications || 0} applications</span>
                          </div>
                        </div>

                        {/* Requirements */}
                        {opportunity.requirements.length > 0 && (
                          <div>
                            <h4 className="font-medium text-sm mb-2">Requirements:</h4>
                            <ul className="text-sm text-muted-foreground space-y-1">
                              {opportunity.requirements.slice(0, 3).map((req, index) => (
                                <li key={index} className="flex items-start gap-2">
                                  <CheckCircle className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                                  <span>{req}</span>
                                </li>
                              ))}
                              {opportunity.requirements.length > 3 && (
                                <li className="text-xs text-muted-foreground">
                                  +{opportunity.requirements.length - 3} more
                                </li>
                              )}
                            </ul>
                          </div>
                        )}

                        {/* Benefits */}
                        {opportunity.benefits.length > 0 && (
                          <div>
                            <h4 className="font-medium text-sm mb-2">Benefits:</h4>
                            <ul className="text-sm text-muted-foreground space-y-1">
                              {opportunity.benefits.slice(0, 3).map((benefit, index) => (
                                <li key={index} className="flex items-start gap-2">
                                  <Award className="h-3 w-3 text-blue-500 mt-0.5 flex-shrink-0" />
                                  <span>{benefit}</span>
                                </li>
                              ))}
                              {opportunity.benefits.length > 3 && (
                                <li className="text-xs text-muted-foreground">
                                  +{opportunity.benefits.length - 3} more
                                </li>
                              )}
                            </ul>
                          </div>
                        )}

                        {/* Deadline */}
                        {opportunity.deadline && (
                          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <div className="flex items-center gap-2 text-yellow-800">
                              <AlertCircle className="h-4 w-4" />
                              <div>
                                <p className="font-medium text-sm">Application Deadline</p>
                                <p className="text-xs">{formatDate(opportunity.deadline)}</p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex gap-2 pt-4 border-t">
                          <Button 
                            size="sm" 
                            onClick={() => handleApplyOpportunity(opportunity.id)}
                            disabled={opportunity.status !== 'ACTIVE'}
                            className="flex-1"
                          >
                            Apply Now
                          </Button>
                          <Button size="sm" variant="outline" className="flex-1">
                            <MessageSquare className="h-3 w-3 mr-1" />
                            Inquire
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </>
          )}
        </TabsContent>

        {/* My Applications Tab */}
        <TabsContent value="my-applications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>My Partnership Applications</CardTitle>
              <CardDescription>
                Track the status of your partnership applications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Application Tracking</h3>
                <p className="text-muted-foreground mb-4">
                  Your partnership applications will appear here once submitted
                </p>
                <Button onClick={() => setActiveTab('opportunities')}>
                  Browse Opportunities
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}