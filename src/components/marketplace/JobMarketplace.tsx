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
  Briefcase, 
  Search, 
  Filter, 
  MapPin, 
  DollarSign, 
  Clock, 
  Calendar, 
  Building, 
  Users, 
  Star, 
  Heart, 
  MessageSquare, 
  Send, 
  Bookmark,
  ExternalLink,
  TrendingUp,
  Globe,
  Company,
  User,
  CheckCircle,
  AlertCircle,
  X
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { toast } from 'sonner'

interface Job {
  id: string
  title: string
  description: string
  type: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'FREELANCE' | 'INTERNSHIP'
  category: string
  location: string
  remote: boolean
  salaryMin?: number
  salaryMax?: number
  salaryCurrency: string
  requirements: string[]
  responsibilities: string[]
  skills: string[]
  experience: string
  deadline?: string
  status: 'ACTIVE' | 'CLOSED' | 'DRAFT'
  postedBy: string
  postedAt: string
  expiresAt?: string
  _count?: {
    applications: number
    views: number
    saves: number
  }
  company?: {
    id: string
    name: string
    logo?: string
    description: string
    industry: string
    size: string
    website?: string
    location: string
  }
}

interface Application {
  id: string
  jobId: string
  studentId: string
  coverLetter: string
  expectedSalary?: number
  availability: string
  status: 'PENDING' | 'REVIEWED' | 'ACCEPTED' | 'REJECTED' | 'WITHDRAWN'
  appliedAt: string
  updatedAt: string
  job?: Job
}

interface MarketplaceProps {
  userRole?: string
}

export function JobMarketplace({ userRole = 'STUDENT' }: MarketplaceProps) {
  const [activeTab, setActiveTab] = useState<'browse' | 'my-applications' | 'posted'>('browse')
  const [jobs, setJobs] = useState<Job[]>([])
  const [applications, setApplications] = useState<Application[]>([])
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [showApplicationForm, setShowApplicationForm] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { user } = useAuth()

  // Filter states
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedType, setSelectedType] = useState('')
  const [selectedLocation, setSelectedLocation] = useState('')
  const [remoteOnly, setRemoteOnly] = useState(false)
  const [salaryRange, setSalaryRange] = useState({ min: '', max: '' })

  // Application form states
  const [applicationForm, setApplicationForm] = useState({
    coverLetter: '',
    expectedSalary: '',
    availability: ''
  })

  useEffect(() => {
    if (activeTab === 'browse') {
      fetchJobs()
    } else if (activeTab === 'my-applications') {
      fetchApplications()
    }
  }, [activeTab])

  const fetchJobs = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      if (searchTerm) params.append('search', searchTerm)
      if (selectedCategory) params.append('category', selectedCategory)
      if (selectedType) params.append('type', selectedType)
      if (selectedLocation) params.append('location', selectedLocation)
      if (remoteOnly) params.append('remote', 'true')
      if (salaryRange.min) params.append('salaryMin', salaryRange.min)
      if (salaryRange.max) params.append('salaryMax', salaryRange.max)

      const response = await fetch(`/api/jobs?${params}`)
      if (response.ok) {
        const data = await response.json()
        setJobs(data.jobs)
      }
    } catch (error) {
      console.error('Error fetching jobs:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem('auth_token')
      const response = await fetch('/api/applications', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setApplications(data.applications)
      }
    } catch (error) {
      console.error('Error fetching applications:', error)
    }
  }

  const handleApplyJob = (job: Job) => {
    setSelectedJob(job)
    setApplicationForm({
      coverLetter: '',
      expectedSalary: '',
      availability: ''
    })
    setShowApplicationForm(true)
  }

  const handleSubmitApplication = async () => {
    if (!selectedJob || !user) return

    setIsSubmitting(true)
    try {
      const token = localStorage.getItem('auth_token')
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          jobId: selectedJob.id,
          coverLetter: applicationForm.coverLetter,
          expectedSalary: applicationForm.expectedSalary ? parseInt(applicationForm.expectedSalary) : undefined,
          availability: applicationForm.availability
        })
      })

      if (response.ok) {
        toast.success('Application submitted successfully!')
        setShowApplicationForm(false)
        setSelectedJob(null)
        fetchApplications()
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to submit application')
      }
    } catch (error) {
      console.error('Error submitting application:', error)
      toast.error('Failed to submit application')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSaveJob = async (jobId: string) => {
    try {
      const token = localStorage.getItem('auth_token')
      const response = await fetch(`/api/jobs/${jobId}/save`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        toast.success('Job saved successfully!')
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to save job')
      }
    } catch (error) {
      console.error('Error saving job:', error)
      toast.error('Failed to save job')
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const formatSalary = (job: Job) => {
    if (job.salaryMin && job.salaryMax) {
      return `${job.salaryCurrency}${job.salaryMin.toLocaleString()} - ${job.salaryCurrency}${job.salaryMax.toLocaleString()}`
    } else if (job.salaryMin) {
      return `${job.salaryCurrency}${job.salaryMin.toLocaleString()}+`
    } else if (job.salaryMax) {
      return `Up to ${job.salaryCurrency}${job.salaryMax.toLocaleString()}`
    }
    return 'Competitive'
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'FULL_TIME': return 'bg-blue-100 text-blue-800'
      case 'PART_TIME': return 'bg-green-100 text-green-800'
      case 'CONTRACT': return 'bg-purple-100 text-purple-800'
      case 'FREELANCE': return 'bg-orange-100 text-orange-800'
      case 'INTERNSHIP': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800'
      case 'CLOSED': return 'bg-red-100 text-red-800'
      case 'DRAFT': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getApplicationStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800'
      case 'REVIEWED': return 'bg-blue-100 text-blue-800'
      case 'ACCEPTED': return 'bg-green-100 text-green-800'
      case 'REJECTED': return 'bg-red-100 text-red-800'
      case 'WITHDRAWN': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const categories = [
    'Accounting', 'Finance', 'FinTech', 'Banking', 'Audit', 'Tax', 'Compliance',
    'Data Analysis', 'Business Analysis', 'Risk Management', 'Investment Banking',
    'Corporate Finance', 'Financial Planning', 'Bookkeeping', 'Payroll'
  ]

  const jobTypes = [
    { value: 'FULL_TIME', label: 'Full Time' },
    { value: 'PART_TIME', label: 'Part Time' },
    { value: 'CONTRACT', label: 'Contract' },
    { value: 'FREELANCE', label: 'Freelance' },
    { value: 'INTERNSHIP', label: 'Internship' }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Briefcase className="h-8 w-8 text-primary" />
            Job & Freelance Marketplace
          </h1>
          <p className="text-muted-foreground">
            Connect with top employers and find your dream job in finance
          </p>
        </div>
        {userRole === 'PARTNER' && (
          <Button>
            <Building className="h-4 w-4 mr-2" />
            Post a Job
          </Button>
        )}
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{jobs.filter(j => j.status === 'ACTIVE').length}</div>
            <p className="text-xs text-muted-foreground">Available now</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Companies</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(jobs.map(j => j.company?.name).filter(Boolean)).size}
            </div>
            <p className="text-xs text-muted-foreground">Hiring now</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Applications</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{applications.length}</div>
            <p className="text-xs text-muted-foreground">Your applications</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {applications.length > 0 
                ? Math.round((applications.filter(a => a.status === 'ACCEPTED').length / applications.length) * 100)
                : 0
              }%
            </div>
            <p className="text-xs text-muted-foreground">Acceptance rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="browse">Browse Jobs</TabsTrigger>
          <TabsTrigger value="my-applications">My Applications</TabsTrigger>
          {userRole === 'PARTNER' && (
            <TabsTrigger value="posted">Posted Jobs</TabsTrigger>
          )}
        </TabsList>

        {/* Browse Jobs Tab */}
        <TabsContent value="browse" className="space-y-6">
          {/* Search and Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Search Jobs</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Search Bar */}
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search jobs by title, company, or keywords..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button onClick={fetchJobs}>
                  Search
                </Button>
              </div>

              {/* Filters */}
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <div>
                  <Label>Category</Label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="All categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All categories</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Job Type</Label>
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger>
                      <SelectValue placeholder="All types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All types</SelectItem>
                      {jobTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Location</Label>
                  <Input
                    placeholder="City or Remote"
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                  />
                </div>

                <div>
                  <Label>Min Salary</Label>
                  <Input
                    type="number"
                    placeholder="Min amount"
                    value={salaryRange.min}
                    onChange={(e) => setSalaryRange(prev => ({ ...prev, min: e.target.value }))}
                  />
                </div>

                <div>
                  <Label>Max Salary</Label>
                  <Input
                    type="number"
                    placeholder="Max amount"
                    value={salaryRange.max}
                    onChange={(e) => setSalaryRange(prev => ({ ...prev, max: e.target.value }))}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="remote-only"
                    checked={remoteOnly}
                    onChange={(e) => setRemoteOnly(e.target.checked)}
                  />
                  <Label htmlFor="remote-only">Remote only</Label>
                </div>
                <Button variant="outline" onClick={() => {
                  setSearchTerm('')
                  setSelectedCategory('')
                  setSelectedType('')
                  setSelectedLocation('')
                  setRemoteOnly(false)
                  setSalaryRange({ min: '', max: '' })
                }}>
                  Clear Filters
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Jobs List */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              {jobs.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                      <Briefcase className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">No Jobs Found</h3>
                    <p className="text-muted-foreground text-center mb-4">
                      Try adjusting your filters or check back later for new opportunities
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {jobs.map((job) => (
                    <Card key={job.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader className="pb-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <CardTitle className="text-lg line-clamp-2">{job.title}</CardTitle>
                              <Badge className={getTypeColor(job.type)}>
                                {job.type.replace('_', ' ')}
                              </Badge>
                            </div>
                            {job.company && (
                              <div className="flex items-center gap-2 mb-2">
                                {job.company.logo ? (
                                  <img
                                    src={job.company.logo}
                                    alt={job.company.name}
                                    className="w-6 h-6 rounded"
                                  />
                                ) : (
                                  <Building className="h-4 w-4 text-muted-foreground" />
                                )}
                                <span className="text-sm font-medium">{job.company.name}</span>
                              </div>
                            )}
                            <CardDescription className="line-clamp-3">
                              {job.description}
                            </CardDescription>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={getStatusColor(job.status)}>
                              {job.status}
                            </Badge>
                            {job.remote && (
                              <Badge variant="outline">
                                <Globe className="h-3 w-3 mr-1" />
                                Remote
                              </Badge>
                            )}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {/* Job Details */}
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-3 w-3 text-muted-foreground" />
                            <span>{job.location}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-3 w-3 text-muted-foreground" />
                            <span>{formatSalary(job)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-3 w-3 text-muted-foreground" />
                            <span>Posted {formatDate(job.postedAt)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="h-3 w-3 text-muted-foreground" />
                            <span>{job._count?.applications || 0} applications</span>
                          </div>
                        </div>

                        {/* Skills */}
                        {job.skills.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {job.skills.slice(0, 4).map((skill, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                            {job.skills.length > 4 && (
                              <Badge variant="outline" className="text-xs">
                                +{job.skills.length - 4}
                              </Badge>
                            )}
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex items-center justify-between pt-4 border-t">
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => handleSaveJob(job.id)}>
                              <Bookmark className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="outline" asChild>
                              <a href={job.company?.website} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            </Button>
                          </div>
                          <Button 
                            size="sm" 
                            onClick={() => handleApplyJob(job)}
                            disabled={job.status !== 'ACTIVE'}
                          >
                            Apply Now
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
              <CardTitle>My Applications</CardTitle>
              <CardDescription>
                Track the status of your job applications
              </CardDescription>
            </CardHeader>
            <CardContent>
              {applications.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Briefcase className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">No Applications Yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Start applying to jobs to track your application status
                  </p>
                  <Button onClick={() => setActiveTab('browse')}>
                    Browse Jobs
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {applications.map((application) => (
                    <Card key={application.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-semibold">{application.job?.title}</h4>
                              <Badge className={getApplicationStatusColor(application.status)}>
                                {application.status}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                              {application.job?.company && (
                                <>
                                  <Building className="h-3 w-3" />
                                  <span>{application.job.company.name}</span>
                                </>
                              )}
                              <span>•</span>
                              <MapPin className="h-3 w-3" />
                              <span>{application.job?.location}</span>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Applied: {formatDate(application.appliedAt)}
                            </div>
                          </div>
                          <div className="text-sm">
                            {application.updatedAt !== application.appliedAt && (
                              <span>Updated: {formatDate(application.updatedAt)}</span>
                            )}
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

        {/* Posted Jobs Tab (for Partners) */}
        {userRole === 'PARTNER' && (
          <TabsContent value="posted" className="space-y-6">
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Building className="h-16 w-16 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Job Posting Management</h3>
                <p className="text-muted-foreground text-center mb-4">
                  Manage your job postings and view applicant information
                </p>
                <Button>Manage Job Postings</Button>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>

      {/* Application Form Modal */}
      {showApplicationForm && selectedJob && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Apply for {selectedJob.title}</CardTitle>
                  <CardDescription>{selectedJob.company?.name}</CardDescription>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setShowApplicationForm(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-2">Job Details</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Type:</span>
                    <p className="font-medium">{selectedJob.type.replace('_', ' ')}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Location:</span>
                    <p className="font-medium">{selectedJob.location}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Salary:</span>
                    <p className="font-medium">{formatSalary(selectedJob)}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Remote:</span>
                    <p className="font-medium">{selectedJob.remote ? 'Yes' : 'No'}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="cover-letter">Cover Letter *</Label>
                  <Textarea
                    id="cover-letter"
                    placeholder="Tell us why you're interested in this position and why you'd be a great fit..."
                    value={applicationForm.coverLetter}
                    onChange={(e) => setApplicationForm(prev => ({ ...prev, coverLetter: e.target.value }))}
                    rows={6}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="expected-salary">Expected Salary</Label>
                    <Input
                      id="expected-salary"
                      type="number"
                      placeholder="Annual salary in USD"
                      value={applicationForm.expectedSalary}
                      onChange={(e) => setApplicationForm(prev => ({ ...prev, expectedSalary: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="availability">Availability</Label>
                    <Input
                      id="availability"
                      placeholder="e.g., Immediate, 2 weeks notice"
                      value={applicationForm.availability}
                      onChange={(e) => setApplicationForm(prev => ({ ...prev, availability: e.target.value }))}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-4">
                <Button variant="outline" onClick={() => setShowApplicationForm(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSubmitApplication} disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting...' : 'Submit Application'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}