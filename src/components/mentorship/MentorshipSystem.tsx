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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  Users, 
  Star, 
  Calendar, 
  Clock, 
  MapPin, 
  DollarSign, 
  Video, 
  MessageSquare, 
  Award, 
  BookOpen, 
  Briefcase, 
  CheckCircle, 
  AlertCircle, 
  Search, 
  Filter, 
  Plus, 
  Play, 
  Phone, 
  Mail, 
  Globe, 
  Linkedin,
  User,
  Target,
  TrendingUp,
  BarChart3,
  Settings,
  X
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { toast } from 'sonner'

interface Mentor {
  id: string
  name: string
  email: string
  avatar?: string
  bio: string
  title: string
  company?: string
  experience: string
  expertise: string[]
  languages: string[]
  hourlyRate: number
  currency: string
  availability: string
  location: string
  timezone: string
  linkedin?: string
  website?: string
  videoIntro?: string
  rating: number
  reviewCount: number
  sessionCount: number
  status: 'ACTIVE' | 'INACTIVE' | 'BUSY'
  isVerified: boolean
  createdAt: string
  updatedAt: string
  _count?: {
    sessions: number,
    reviews: number,
    students: number
  }
}

interface MentorshipSession {
  id: string
  mentorId: string
  studentId: string
  type: 'ONE_ON_ONE' | 'GROUP' | 'WORKSHOP' | 'REVIEW'
  title: string
  description: string
  duration: number
  scheduledAt: string
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW'
  notes?: string
  recordingUrl?: string
  materials?: string[]
  price: number
  currency: string
  paid: boolean
  createdAt: string
  updatedAt: string
  mentor?: Mentor
  student?: {
    name: string
    email: string
    avatar?: string
  }
}

interface MentorshipSystemProps {
  userRole?: string
}

export function MentorshipSystem({ userRole = 'STUDENT' }: MentorshipSystemProps) {
  const [activeTab, setActiveTab] = useState<'browse' | 'sessions' | 'requests'>('browse')
  const [mentors, setMentors] = useState<Mentor[]>([])
  const [sessions, setSessions] = useState<MentorshipSession[]>([])
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null)
  const [showBookingForm, setShowBookingForm] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { user } = useAuth()

  // Filter states
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedExpertise, setSelectedExpertise] = useState('')
  const [selectedAvailability, setSelectedAvailability] = useState('')
  const [priceRange, setPriceRange] = useState({ min: '', max: '' })
  const [selectedRating, setSelectedRating] = useState('')

  // Booking form states
  const [bookingForm, setBookingForm] = useState({
    type: 'ONE_ON_ONE' as const,
    title: '',
    description: '',
    duration: 60,
    scheduledAt: '',
    notes: ''
  })

  useEffect(() => {
    if (activeTab === 'browse') {
      fetchMentors()
    } else if (activeTab === 'sessions') {
      fetchSessions()
    }
  }, [activeTab])

  const fetchMentors = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      if (searchTerm) params.append('search', searchTerm)
      if (selectedExpertise) params.append('expertise', selectedExpertise)
      if (selectedAvailability) params.append('availability', selectedAvailability)
      if (priceRange.min) params.append('priceMin', priceRange.min)
      if (priceRange.max) params.append('priceMax', priceRange.max)
      if (selectedRating) params.append('rating', selectedRating)

      const response = await fetch(`/api/mentors?${params}`)
      if (response.ok) {
        const data = await response.json()
        setMentors(data.mentors)
      }
    } catch (error) {
      console.error('Error fetching mentors:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchSessions = async () => {
    try {
      const token = localStorage.getItem('auth_token')
      const response = await fetch('/api/mentorship/sessions', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setSessions(data.sessions)
      }
    } catch (error) {
      console.error('Error fetching sessions:', error)
    }
  }

  const handleBookSession = (mentor: Mentor) => {
    setSelectedMentor(mentor)
    setBookingForm({
      type: 'ONE_ON_ONE',
      title: `1:1 Session with ${mentor.name}`,
      description: '',
      duration: 60,
      scheduledAt: '',
      notes: ''
    })
    setShowBookingForm(true)
  }

  const handleSubmitBooking = async () => {
    if (!selectedMentor || !user) return

    setIsSubmitting(true)
    try {
      const token = localStorage.getItem('auth_token')
      const response = await fetch('/api/mentorship/sessions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          mentorId: selectedMentor.id,
          type: bookingForm.type,
          title: bookingForm.title,
          description: bookingForm.description,
          duration: bookingForm.duration,
          scheduledAt: new Date(bookingForm.scheduledAt).toISOString(),
          notes: bookingForm.notes,
          price: (selectedMentor.hourlyRate * bookingForm.duration) / 60,
          currency: selectedMentor.currency
        })
      })

      if (response.ok) {
        toast.success('Session booked successfully!')
        setShowBookingForm(false)
        setSelectedMentor(null)
        fetchSessions()
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to book session')
      }
    } catch (error) {
      console.error('Error booking session:', error)
      toast.error('Failed to book session')
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatPrice = (mentor: Mentor, duration: number = 60) => {
    const price = (mentor.hourlyRate * duration) / 60
    return `${mentor.currency}${price.toFixed(2)}`
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800'
      case 'INACTIVE': return 'bg-red-100 text-red-800'
      case 'BUSY': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getSessionStatusColor = (status: string) => {
    switch (status) {
      case 'SCHEDULED': return 'bg-blue-100 text-blue-800'
      case 'COMPLETED': return 'bg-green-100 text-green-800'
      case 'CANCELLED': return 'bg-red-100 text-red-800'
      case 'NO_SHOW': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const expertiseAreas = [
    'Accounting', 'Finance', 'Tax', 'Audit', 'Compliance', 'Risk Management',
    'Financial Planning', 'Investment Banking', 'Corporate Finance', 'FinTech',
    'Data Analysis', 'Business Analysis', 'Management Accounting', 'Cost Accounting',
    'Forensic Accounting', 'International Finance', 'Mergers & Acquisitions',
    'Portfolio Management', 'Wealth Management', 'Insurance', 'Real Estate Finance'
  ]

  const availabilityOptions = [
    { value: 'IMMEDIATE', label: 'Immediate' },
    { value: 'WEEKLY', label: 'Weekly' },
    { value: 'BIWEEKLY', label: 'Bi-weekly' },
    { value: 'MONTHLY', label: 'Monthly' },
    { value: 'LIMITED', label: 'Limited' }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Users className="h-8 w-8 text-primary" />
            Mentor & Expert System
          </h1>
          <p className="text-muted-foreground">
            Connect with industry experts and accelerate your career growth
          </p>
        </div>
        {userRole === 'MENTOR' && (
          <Button>
            <Settings className="h-4 w-4 mr-2" />
            Mentor Profile
          </Button>
        )}
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Mentors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mentors.filter(m => m.status === 'ACTIVE').length}</div>
            <p className="text-xs text-muted-foreground">Available now</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sessions.length}</div>
            <p className="text-xs text-muted-foreground">Completed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {mentors.length > 0 
                ? (mentors.reduce((sum, mentor) => sum + mentor.rating, 0) / mentors.length).toFixed(1)
                : '0.0'
              }
            </div>
            <p className="text-xs text-muted-foreground">Mentor rating</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">92%</div>
            <p className="text-xs text-muted-foreground">Student satisfaction</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="browse">Browse Mentors</TabsTrigger>
          <TabsTrigger value="sessions">My Sessions</TabsTrigger>
          <TabsTrigger value="requests">Session Requests</TabsTrigger>
        </TabsList>

        {/* Browse Mentors Tab */}
        <TabsContent value="browse" className="space-y-6">
          {/* Search and Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Find Your Mentor</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Search Bar */}
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search mentors by name, expertise, or company..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button onClick={fetchMentors}>
                  Search
                </Button>
              </div>

              {/* Filters */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div>
                  <Label>Expertise</Label>
                  <Select value={selectedExpertise} onValueChange={setSelectedExpertise}>
                    <SelectTrigger>
                      <SelectValue placeholder="All expertise" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All expertise</SelectItem>
                      {expertiseAreas.map((area) => (
                        <SelectItem key={area} value={area}>
                          {area}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Availability</Label>
                  <Select value={selectedAvailability} onValueChange={setSelectedAvailability}>
                    <SelectTrigger>
                      <SelectValue placeholder="All availability" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All availability</SelectItem>
                      {availabilityOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Min Price</Label>
                  <Input
                    type="number"
                    placeholder="Min hourly rate"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                  />
                </div>

                <div>
                  <Label>Max Price</Label>
                  <Input
                    type="number"
                    placeholder="Max hourly rate"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                  />
                </div>

                <div>
                  <Label>Min Rating</Label>
                  <Select value={selectedRating} onValueChange={setSelectedRating}>
                    <SelectTrigger>
                      <SelectValue placeholder="Any rating" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Any rating</SelectItem>
                      <SelectItem value="4">4+ Stars</SelectItem>
                      <SelectItem value="4.5">4.5+ Stars</SelectItem>
                      <SelectItem value="5">5 Stars</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" onClick={() => {
                  setSearchTerm('')
                  setSelectedExpertise('')
                  setSelectedAvailability('')
                  setPriceRange({ min: '', max: '' })
                  setSelectedRating('')
                }}>
                  Clear Filters
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Mentors List */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
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
              {mentors.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                      <Users className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">No Mentors Found</h3>
                    <p className="text-muted-foreground text-center mb-4">
                      Try adjusting your filters or check back later for new mentors
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {mentors.map((mentor) => (
                    <Card key={mentor.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader className="pb-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-4 flex-1">
                            <Avatar className="w-12 h-12">
                              <AvatarImage src={mentor.avatar} alt={mentor.name} />
                              <AvatarFallback>
                                {mentor.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-2">
                                <CardTitle className="text-lg truncate">{mentor.name}</CardTitle>
                                {mentor.isVerified && (
                                  <CheckCircle className="h-4 w-4 text-blue-500" />
                                )}
                              </div>
                              <p className="text-sm font-medium text-primary truncate">{mentor.title}</p>
                              {mentor.company && (
                                <p className="text-sm text-muted-foreground">{mentor.company}</p>
                              )}
                              <CardDescription className="line-clamp-2 mt-1">
                                {mentor.bio}
                              </CardDescription>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                              <div className="flex items-center gap-1">
                                <Star className="h-3 w-3 text-yellow-500 fill-current" />
                                <span className="text-sm font-medium">{mentor.rating.toFixed(1)}</span>
                                <span className="text-xs text-muted-foreground">({mentor.reviewCount})</span>
                              </div>
                              <Badge className={getStatusColor(mentor.status)}>
                                {mentor.status}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {/* Mentor Details */}
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-3 w-3 text-muted-foreground" />
                            <span>{mentor.location}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-3 w-3 text-muted-foreground" />
                            <span>{formatPrice(mentor)}/hour</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-3 w-3 text-muted-foreground" />
                            <span>{mentor.availability}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Target className="h-3 w-3 text-muted-foreground" />
                            <span>{mentor._count?.sessions || 0} sessions</span>
                          </div>
                        </div>

                        {/* Expertise */}
                        {mentor.expertise.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {mentor.expertise.slice(0, 3).map((skill, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                            {mentor.expertise.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{mentor.expertise.length - 3}
                              </Badge>
                            )}
                          </div>
                        )}

                        {/* Video Intro */}
                        {mentor.videoIntro && (
                          <div className="p-3 bg-blue-50 rounded-lg">
                            <div className="flex items-center gap-2 text-blue-800">
                              <Video className="h-4 w-4" />
                              <span className="text-sm font-medium">Video Intro Available</span>
                            </div>
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex gap-2 pt-4 border-t">
                          <Button size="sm" variant="outline" className="flex-1">
                            <MessageSquare className="h-3 w-3 mr-1" />
                            Message
                          </Button>
                          <Button 
                            size="sm" 
                            onClick={() => handleBookSession(mentor)}
                            disabled={mentor.status !== 'ACTIVE'}
                            className="flex-1"
                          >
                            Book Session
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

        {/* My Sessions Tab */}
        <TabsContent value="sessions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>My Mentorship Sessions</CardTitle>
              <CardDescription>
                Track your upcoming and completed mentorship sessions
              </CardDescription>
            </CardHeader>
            <CardContent>
              {sessions.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Calendar className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">No Sessions Yet</h3>
                  <p className="text-muted-foreground text-center mb-4">
                    Book your first mentorship session to get personalized guidance
                  </p>
                  <Button onClick={() => setActiveTab('browse')}>
                    Find a Mentor
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {sessions.map((session) => (
                    <Card key={session.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Avatar className="w-10 h-10">
                              <AvatarImage src={session.mentor?.avatar} alt={session.mentor?.name} />
                              <AvatarFallback>
                                {session.mentor?.name?.split(' ').map(n => n[0]).join('').toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h4 className="font-semibold">{session.title}</h4>
                              <p className="text-sm text-muted-foreground">with {session.mentor?.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {formatDate(session.scheduledAt)} • {session.duration} minutes
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge className={getSessionStatusColor(session.status)}>
                              {session.status}
                            </Badge>
                            <p className="text-sm text-muted-foreground mt-1">
                              {session.currency}{session.price}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Session Requests Tab */}
        <TabsContent value="requests" className="space-y-6">
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Session Requests</h3>
              <p className="text-muted-foreground text-center mb-4">
                Your session requests and mentor responses will appear here
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Booking Form Modal */}
      {showBookingForm && selectedMentor && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Book Session with {selectedMentor.name}</CardTitle>
                  <CardDescription>{selectedMentor.title}</CardDescription>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setShowBookingForm(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Mentor Info */}
              <div className="p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-3">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={selectedMentor.avatar} alt={selectedMentor.name} />
                    <AvatarFallback>
                      {selectedMentor.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-semibold">{selectedMentor.name}</h4>
                    <p className="text-sm text-muted-foreground">{selectedMentor.title}</p>
                    {selectedMentor.company && (
                      <p className="text-sm text-muted-foreground">{selectedMentor.company}</p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Hourly Rate:</span>
                    <p className="font-medium">{formatPrice(selectedMentor)}/hour</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Availability:</span>
                    <p className="font-medium">{selectedMentor.availability}</p>
                  </div>
                </div>
              </div>

              {/* Booking Form */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="session-type">Session Type</Label>
                  <Select 
                    value={bookingForm.type} 
                    onValueChange={(value: 'ONE_ON_ONE' | 'GROUP' | 'WORKSHOP' | 'REVIEW') => 
                      setBookingForm(prev => ({ ...prev, type: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ONE_ON_ONE">1:1 Session</SelectItem>
                      <SelectItem value="GROUP">Group Session</SelectItem>
                      <SelectItem value="WORKSHOP">Workshop</SelectItem>
                      <SelectItem value="REVIEW">Review Session</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="session-title">Session Title</Label>
                  <Input
                    id="session-title"
                    value={bookingForm.title}
                    onChange={(e) => setBookingForm(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g., Career Guidance Discussion"
                  />
                </div>

                <div>
                  <Label htmlFor="session-description">Description</Label>
                  <Textarea
                    id="session-description"
                    value={bookingForm.description}
                    onChange={(e) => setBookingForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="What would you like to discuss in this session?"
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="duration">Duration (minutes)</Label>
                    <Select 
                      value={bookingForm.duration.toString()} 
                      onValueChange={(value) => setBookingForm(prev => ({ ...prev, duration: parseInt(value) }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="60">60 minutes</SelectItem>
                        <SelectItem value="90">90 minutes</SelectItem>
                        <SelectItem value="120">120 minutes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="scheduled-at">Schedule Date & Time</Label>
                    <Input
                      id="scheduled-at"
                      type="datetime-local"
                      value={bookingForm.scheduledAt}
                      onChange={(e) => setBookingForm(prev => ({ ...prev, scheduledAt: e.target.value }))}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="notes">Additional Notes</Label>
                  <Textarea
                    id="notes"
                    value={bookingForm.notes}
                    onChange={(e) => setBookingForm(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Any specific topics or questions you'd like to cover..."
                    rows={3}
                  />
                </div>

                {/* Price Calculation */}
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-blue-800">Session Price:</span>
                    <span className="text-lg font-bold text-blue-800">
                      {formatPrice(selectedMentor, bookingForm.duration)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-4">
                <Button variant="outline" onClick={() => setShowBookingForm(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSubmitBooking} disabled={isSubmitting}>
                  {isSubmitting ? 'Booking...' : 'Book Session'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}