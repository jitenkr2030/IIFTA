'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AuthModal } from '@/components/auth/AuthModal'
import { StudentDashboard } from '@/components/dashboard/StudentDashboard'
import { useAuth } from '@/contexts/AuthContext'
import { 
  BookOpen, 
  Users, 
  Award, 
  Briefcase, 
  Brain, 
  Target, 
  Globe, 
  Shield,
  TrendingUp,
  Clock,
  CheckCircle,
  Star,
  ArrowRight,
  Zap,
  BarChart3,
  Lightbulb,
  GraduationCap,
  LogOut,
  User,
  Settings
} from 'lucide-react'

export default function Home() {
  const { user, isAuthenticated, logout, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <GraduationCap className="h-12 w-12 text-primary mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <AuthModal />
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <GraduationCap className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold">IIFTA Portal</span>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <a href="#programs" className="text-sm font-medium hover:text-primary transition-colors">Programs</a>
              <a href="#features" className="text-sm font-medium hover:text-primary transition-colors">Features</a>
              <a href="#community" className="text-sm font-medium hover:text-primary transition-colors">Community</a>
              <a href="#pricing" className="text-sm font-medium hover:text-primary transition-colors">Pricing</a>
            </nav>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm">
                  <User className="h-4 w-4 mr-2" />
                  {user?.name || user?.email}
                </Button>
                <Button variant="ghost" size="sm">
                  <Settings className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={logout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Student Dashboard for authenticated users */}
        {isAuthenticated && user?.role === 'STUDENT' && (
          <div className="container mx-auto px-4 py-8">
            <StudentDashboard />
          </div>
        )}

        {/* Default content for other roles or fallback */}
        {(!isAuthenticated || user?.role !== 'STUDENT') && (
          <>
            {/* Welcome Section */}
            <section className="relative py-20 px-4 bg-gradient-to-br from-slate-50 to-slate-100">
              <div className="container mx-auto text-center">
                <Badge className="mb-4" variant="secondary">
                  <Zap className="w-3 h-3 mr-1" />
                  Welcome back, {user?.name}!
                </Badge>
                <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
                  Continue Your Learning Journey
                </h1>
                <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
                  Track your progress, access new courses, and connect with the finance community.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary">0</div>
                    <div className="text-sm text-muted-foreground">Courses Enrolled</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary">0%</div>
                    <div className="text-sm text-muted-foreground">Completion Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary">0</div>
                    <div className="text-sm text-muted-foreground">Certificates</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary">{user?.membershipTier}</div>
                    <div className="text-sm text-muted-foreground">Membership</div>
                  </div>
                </div>
              </div>
            </section>

            {/* Quick Actions */}
            <section className="py-12 px-4">
              <div className="container mx-auto">
                <h2 className="text-2xl font-bold mb-8 text-center">Quick Actions</h2>
                <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5 text-primary" />
                        Browse Programs
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">
                        Explore our certification programs and find the right path for your career.
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Brain className="h-5 w-5 text-primary" />
                        AI Accounting Lab
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">
                        Practice with AI-powered tools and real-world scenarios.
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-primary" />
                        Community
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">
                        Connect with peers and mentors in our finance community.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </section>

            {/* Certification Programs */}
            <section id="programs" className="py-20 px-4">
              <div className="container mx-auto">
                <div className="text-center mb-16">
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">
                    Certification Programs
                  </h2>
                  <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    Choose your path to becoming a finance technology expert
                  </p>
                </div>
                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                  <Card className="relative overflow-hidden hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <Badge className="w-fit mb-2">Beginner</Badge>
                      <CardTitle className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5 text-primary" />
                        Tech Accountant
                      </CardTitle>
                      <CardDescription>
                        Master accounting fundamentals with modern technology tools
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 mb-6">
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm">Digital Accounting Basics</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm">Excel & Automation</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm">Financial Reporting</span>
                        </li>
                      </ul>
                      <Button className="w-full">Enroll Now</Button>
                    </CardContent>
                  </Card>

                  <Card className="relative overflow-hidden hover:shadow-lg transition-shadow border-primary">
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-primary text-primary-foreground">Popular</Badge>
                    </div>
                    <CardHeader>
                      <Badge className="w-fit mb-2">Intermediate</Badge>
                      <CardTitle className="flex items-center gap-2">
                        <Brain className="h-5 w-5 text-primary" />
                        FinTech Accountant
                      </CardTitle>
                      <CardDescription>
                        Advanced financial technology and blockchain integration
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 mb-6">
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm">Blockchain & Crypto</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm">API Integration</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm">Risk Management</span>
                        </li>
                      </ul>
                      <Button className="w-full">Enroll Now</Button>
                    </CardContent>
                  </Card>

                  <Card className="relative overflow-hidden hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <Badge className="w-fit mb-2">Advanced</Badge>
                      <CardTitle className="flex items-center gap-2">
                        <Target className="h-5 w-5 text-primary" />
                        AI Finance Specialist
                      </CardTitle>
                      <CardDescription>
                        Lead financial innovation with artificial intelligence
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 mb-6">
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm">Machine Learning in Finance</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm">Predictive Analytics</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm">AI Strategy Development</span>
                        </li>
                      </ul>
                      <Button className="w-full">Enroll Now</Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </section>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t bg-background mt-auto">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <GraduationCap className="h-6 w-6 text-primary" />
                <span className="text-lg font-bold">IIFTA Portal</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Empowering finance professionals with cutting-edge technology and AI-driven education.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Programs</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary">Tech Accountant</a></li>
                <li><a href="#" className="hover:text-primary">FinTech Accountant</a></li>
                <li><a href="#" className="hover:text-primary">AI Finance Specialist</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary">AI Accounting Lab</a></li>
                <li><a href="#" className="hover:text-primary">Community Forum</a></li>
                <li><a href="#" className="hover:text-primary">Career Center</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary">About Us</a></li>
                <li><a href="#" className="hover:text-primary">Partners</a></li>
                <li><a href="#" className="hover:text-primary">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 IIFTA Portal. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}