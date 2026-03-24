'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Award, 
  QrCode, 
  Download, 
  Share2, 
  CheckCircle, 
  AlertCircle, 
  Eye, 
  FileText, 
  Calendar, 
  User, 
  Building,
  Globe,
  Shield,
  Search,
  Copy,
  ExternalLink
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { toast } from 'sonner'

interface Certificate {
  id: string
  certificateId: string
  qrCodeUrl: string
  issueDate: string
  expiryDate?: string
  status: 'ACTIVE' | 'EXPIRED' | 'REVOKED'
  student: {
    name: string
    email: string
    avatar?: string
  }
  program: {
    title: string
    description: string
    level: string
    duration: number
  }
  verificationUrl: string
  pdfUrl: string
  createdAt: string
}

interface VerificationResult {
  isValid: boolean
  certificate: Certificate | null
  message: string
  verificationDate: string
}

export function CertificationVerification() {
  const [activeTab, setActiveTab] = useState<'my-certificates' | 'verify'>('my-certificates')
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [verificationCode, setVerificationCode] = useState('')
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null)
  const [isVerifying, setIsVerifying] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    fetchCertificates()
  }, [])

  const fetchCertificates = async () => {
    try {
      const token = localStorage.getItem('auth_token')
      const response = await fetch('/api/certificates', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setCertificates(data.certificates)
      }
    } catch (error) {
      console.error('Error fetching certificates:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyCertificate = async () => {
    if (!verificationCode.trim()) {
      toast.error('Please enter a certificate ID or verification code')
      return
    }

    setIsVerifying(true)
    try {
      const response = await fetch(`/api/certificates/verify/${verificationCode.trim()}`)
      const data = await response.json()

      if (response.ok) {
        setVerificationResult(data)
        toast.success('Certificate verified successfully!')
      } else {
        setVerificationResult({
          isValid: false,
          certificate: null,
          message: data.error || 'Certificate not found or invalid',
          verificationDate: new Date().toISOString()
        })
        toast.error('Certificate verification failed')
      }
    } catch (error) {
      console.error('Error verifying certificate:', error)
      setVerificationResult({
        isValid: false,
        certificate: null,
        message: 'An error occurred during verification',
        verificationDate: new Date().toISOString()
      })
      toast.error('Failed to verify certificate')
    } finally {
      setIsVerifying(false)
    }
  }

  const handleDownloadCertificate = async (certificate: Certificate) => {
    try {
      const response = await fetch(certificate.pdfUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `certificate-${certificate.certificateId}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      toast.success('Certificate downloaded successfully!')
    } catch (error) {
      console.error('Error downloading certificate:', error)
      toast.error('Failed to download certificate')
    }
  }

  const handleShareCertificate = async (certificate: Certificate) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Certificate - ${certificate.program.title}`,
          text: `I have successfully completed the ${certificate.program.title} program from IIFTA Portal.`,
          url: certificate.verificationUrl
        })
      } catch (error) {
        console.error('Error sharing certificate:', error)
      }
    } else {
      // Fallback: Copy to clipboard
      try {
        await navigator.clipboard.writeText(certificate.verificationUrl)
        toast.success('Certificate link copied to clipboard!')
      } catch (error) {
        console.error('Error copying to clipboard:', error)
        toast.error('Failed to copy certificate link')
      }
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800'
      case 'EXPIRED': return 'bg-red-100 text-red-800'
      case 'REVOKED': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const isExpired = (expiryDate?: string) => {
    if (!expiryDate) return false
    return new Date(expiryDate) < new Date()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Award className="h-8 w-8 text-primary" />
            Certification Verification
          </h1>
          <p className="text-muted-foreground">
            Verify certificates and manage your professional credentials
          </p>
        </div>
        <Badge variant="secondary" className="text-sm">
          <Shield className="w-3 h-3 mr-1" />
          Blockchain Verified
        </Badge>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Certificates</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{certificates.length}</div>
            <p className="text-xs text-muted-foreground">Issued to you</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {certificates.filter(c => c.status === 'ACTIVE' && !isExpired(c.expiryDate)).length}
            </div>
            <p className="text-xs text-muted-foreground">Currently valid</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expired</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {certificates.filter(c => c.status === 'EXPIRED' || isExpired(c.expiryDate)).length}
            </div>
            <p className="text-xs text-muted-foreground">Need renewal</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Verifications</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {certificates.reduce((total, cert) => total + (cert._count?.views || 0), 0)}
            </div>
            <p className="text-xs text-muted-foreground">Total views</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="my-certificates">My Certificates</TabsTrigger>
          <TabsTrigger value="verify">Verify Certificate</TabsTrigger>
        </TabsList>

        {/* My Certificates Tab */}
        <TabsContent value="my-certificates" className="space-y-6">
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
              {certificates.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                      <Award className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">No Certificates Yet</h3>
                    <p className="text-muted-foreground text-center mb-4">
                      Complete your certification programs to earn professional certificates
                    </p>
                    <Button onClick={() => setActiveTab('programs')}>
                      Browse Programs
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {certificates.map((certificate) => (
                    <Card key={certificate.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                      <CardHeader className="pb-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <CardTitle className="text-lg">{certificate.program.title}</CardTitle>
                              <Badge className={getStatusColor(certificate.status)}>
                                {certificate.status}
                              </Badge>
                            </div>
                            <CardDescription className="text-sm">
                              {certificate.program.description}
                            </CardDescription>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{certificate.program.level}</Badge>
                            <Badge variant="outline">{certificate.program.duration} weeks</Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {/* Certificate ID */}
                        <div className="p-3 bg-muted rounded-lg">
                          <div className="flex items-center justify-between">
                            <div>
                              <Label className="text-xs text-muted-foreground">Certificate ID</Label>
                              <p className="font-mono text-sm font-bold">{certificate.certificateId}</p>
                            </div>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => navigator.clipboard.writeText(certificate.certificateId)}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>

                        {/* Student Info */}
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                            <User className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{certificate.student.name}</p>
                            <p className="text-sm text-muted-foreground">{certificate.student.email}</p>
                          </div>
                        </div>

                        {/* Dates */}
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <Label className="text-xs text-muted-foreground">Issued</Label>
                            <p className="font-medium">{formatDate(certificate.issueDate)}</p>
                          </div>
                          <div>
                            <Label className="text-xs text-muted-foreground">Expires</Label>
                            <p className="font-medium">
                              {certificate.expiryDate ? formatDate(certificate.expiryDate) : 'Never'}
                            </p>
                          </div>
                        </div>

                        {/* Verification Status */}
                        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                          <div className="flex items-center gap-2">
                            <Shield className="h-4 w-4 text-blue-600" />
                            <div>
                              <p className="text-sm font-medium text-blue-800">Blockchain Verified</p>
                              <p className="text-xs text-blue-600">
                                {certificate._count?.views || 0} verifications
                              </p>
                            </div>
                          </div>
                          <Button size="sm" variant="outline" asChild>
                            <a href={certificate.verificationUrl} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          </Button>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDownloadCertificate(certificate)}
                            className="flex-1"
                          >
                            <Download className="h-3 w-3 mr-1" />
                            Download
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleShareCertificate(certificate)}
                            className="flex-1"
                          >
                            <Share2 className="h-3 w-3 mr-1" />
                            Share
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

        {/* Verify Certificate Tab */}
        <TabsContent value="verify" className="space-y-6">
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <QrCode className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-2xl">Verify Certificate</CardTitle>
                <CardDescription>
                  Enter the Certificate ID or scan the QR code to verify authenticity
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Verification Input */}
                <div className="space-y-4">
                  <Label htmlFor="verification-code">Certificate ID or Verification Code</Label>
                  <div className="flex gap-2">
                    <Input
                      id="verification-code"
                      placeholder="Enter certificate ID (e.g., CERT-2024-001)"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      onClick={handleVerifyCertificate}
                      disabled={isVerifying || !verificationCode.trim()}
                    >
                      {isVerifying ? 'Verifying...' : 'Verify'}
                    </Button>
                  </div>
                </div>

                {/* QR Code Instructions */}
                <div className="p-4 bg-muted rounded-lg">
                  <div className="flex items-start gap-3">
                    <QrCode className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div className="text-sm text-muted-foreground">
                      <p className="font-medium mb-2">How to verify with QR code:</p>
                      <ol className="space-y-1 text-xs">
                        <li>1. Open your smartphone camera app</li>
                        <li>2. Scan the QR code on any certificate</li>
                        <li>3. Follow the verification link to check authenticity</li>
                        <li>4. The verification page will show certificate details</li>
                      </ol>
                    </div>
                  </div>
                </div>

                {/* Verification Result */}
                {verificationResult && (
                  <div className={`p-4 rounded-lg border-2 ${
                    verificationResult.isValid 
                      ? 'border-green-200 bg-green-50' 
                      : 'border-red-200 bg-red-50'
                  }`}>
                    <div className="flex items-start gap-3">
                      {verificationResult.isValid ? (
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                      )}
                      <div className="flex-1">
                        <h4 className={`font-medium mb-1 ${
                          verificationResult.isValid ? 'text-green-800' : 'text-red-800'
                        }`}>
                          {verificationResult.isValid ? 'Certificate Verified' : 'Verification Failed'}
                        </h4>
                        <p className={`text-sm ${
                          verificationResult.isValid ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {verificationResult.message}
                        </p>
                        {verificationResult.certificate && (
                          <div className="mt-3 space-y-2 text-sm">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <span className="text-muted-foreground">Certificate ID:</span>
                                <p className="font-medium">{verificationResult.certificate.certificateId}</p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Student:</span>
                                <p className="font-medium">{verificationResult.certificate.student.name}</p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Program:</span>
                                <p className="font-medium">{verificationResult.certificate.program.title}</p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Status:</span>
                                <p className="font-medium">{verificationResult.certificate.status}</p>
                              </div>
                            </div>
                            <div className="pt-2 border-t border-green-200">
                              <p className="text-xs text-green-600">
                                Verified on: {formatDate(verificationResult.verificationDate)}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Verifications */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Verifications</CardTitle>
                <CardDescription>
                  Global certificate verification activity
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">CERT-2024-001</p>
                        <p className="text-xs text-muted-foreground">Verified 2 minutes ago</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-green-600">Valid</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">CERT-2024-002</p>
                        <p className="text-xs text-muted-foreground">Verified 5 minutes ago</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-green-600">Valid</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                        <AlertCircle className="h-4 w-4 text-red-600" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">CERT-2024-003</p>
                        <p className="text-xs text-muted-foreground">Invalid - 10 minutes ago</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-red-600">Invalid</Badge>
                  </div>
                </div>
                <div className="text-center">
                  <Button variant="outline" size="sm">
                    View All Verifications
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}