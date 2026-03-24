'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Star, 
  Heart, 
  MessageCircle, 
  Share2, 
  ExternalLink, 
  Github, 
  Globe, 
  Code, 
  Image as ImageIcon,
  Upload,
  X,
  Save
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { toast } from 'sonner'

interface Project {
  id: string
  title: string
  description: string
  content: string
  imageUrl?: string
  projectUrl?: string
  githubUrl?: string
  tags: string[]
  isPublished: boolean
  featured: boolean
  studentId: string
  createdAt: string
  updatedAt: string
  _count?: {
    likes: number
    comments: number
    views: number
  }
}

interface Portfolio {
  id: string
  userId: string
  bio?: string
  skills: string[]
  experience: string[]
  education: string[]
  achievements: string[]
  isPublic: boolean
  customDomain?: string
  createdAt: string
  updatedAt: string
  user?: {
    name: string
    email: string
    avatar?: string
  }
}

export function ProjectPortfolio() {
  const [activeTab, setActiveTab] = useState<'projects' | 'portfolio'>('projects')
  const [projects, setProjects] = useState<Project[]>([])
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const { user } = useAuth()

  // Form states
  const [projectForm, setProjectForm] = useState({
    title: '',
    description: '',
    content: '',
    imageUrl: '',
    projectUrl: '',
    githubUrl: '',
    tags: '',
    isPublished: false,
    featured: false
  })

  const [portfolioForm, setPortfolioForm] = useState({
    bio: '',
    skills: '',
    experience: '',
    education: '',
    achievements: '',
    isPublic: true,
    customDomain: ''
  })

  useEffect(() => {
    fetchProjects()
    fetchPortfolio()
  }, [])

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem('auth_token')
      const response = await fetch('/api/projects', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setProjects(data.projects)
      }
    } catch (error) {
      console.error('Error fetching projects:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchPortfolio = async () => {
    try {
      const token = localStorage.getItem('auth_token')
      const response = await fetch('/api/portfolio', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setPortfolio(data.portfolio)
      }
    } catch (error) {
      console.error('Error fetching portfolio:', error)
    }
  }

  const handleCreateProject = () => {
    setEditingProject({
      id: '',
      title: '',
      description: '',
      content: '',
      imageUrl: '',
      projectUrl: '',
      githubUrl: '',
      tags: [],
      isPublished: false,
      featured: false,
      studentId: user?.id || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })
    setProjectForm({
      title: '',
      description: '',
      content: '',
      imageUrl: '',
      projectUrl: '',
      githubUrl: '',
      tags: '',
      isPublished: false,
      featured: false
    })
    setIsEditing(true)
  }

  const handleEditProject = (project: Project) => {
    setEditingProject(project)
    setProjectForm({
      title: project.title,
      description: project.description,
      content: project.content,
      imageUrl: project.imageUrl || '',
      projectUrl: project.projectUrl || '',
      githubUrl: project.githubUrl || '',
      tags: project.tags.join(', '),
      isPublished: project.isPublished,
      featured: project.featured
    })
    setIsEditing(true)
  }

  const handleSaveProject = async () => {
    if (!editingProject) return

    setIsSaving(true)
    try {
      const token = localStorage.getItem('auth_token')
      const projectData = {
        ...projectForm,
        tags: projectForm.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      }

      let response
      if (editingProject.id) {
        // Update existing project
        response = await fetch(`/api/projects/${editingProject.id}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(projectData)
        })
      } else {
        // Create new project
        response = await fetch('/api/projects', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(projectData)
        })
      }

      if (response.ok) {
        toast.success(editingProject.id ? 'Project updated successfully!' : 'Project created successfully!')
        setIsEditing(false)
        setEditingProject(null)
        fetchProjects()
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to save project')
      }
    } catch (error) {
      console.error('Error saving project:', error)
      toast.error('Failed to save project')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteProject = async (projectId: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return

    try {
      const token = localStorage.getItem('auth_token')
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        toast.success('Project deleted successfully!')
        fetchProjects()
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to delete project')
      }
    } catch (error) {
      console.error('Error deleting project:', error)
      toast.error('Failed to delete project')
    }
  }

  const handleSavePortfolio = async () => {
    setIsSaving(true)
    try {
      const token = localStorage.getItem('auth_token')
      const portfolioData = {
        ...portfolioForm,
        skills: portfolioForm.skills.split(',').map(skill => skill.trim()).filter(skill => skill),
        experience: portfolioForm.experience.split('\n').filter(exp => exp.trim()),
        education: portfolioForm.education.split('\n').filter(edu => edu.trim()),
        achievements: portfolioForm.achievements.split('\n').filter(ach => ach.trim())
      }

      const response = await fetch('/api/portfolio', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(portfolioData)
      })

      if (response.ok) {
        toast.success('Portfolio updated successfully!')
        fetchPortfolio()
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to update portfolio')
      }
    } catch (error) {
      console.error('Error updating portfolio:', error)
      toast.error('Failed to update portfolio')
    } finally {
      setIsSaving(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  if (isEditing && editingProject) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>
                {editingProject.id ? 'Edit Project' : 'Create New Project'}
              </CardTitle>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Project Title *</Label>
                  <Input
                    id="title"
                    value={projectForm.title}
                    onChange={(e) => setProjectForm(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter project title"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Short Description *</Label>
                  <Textarea
                    id="description"
                    value={projectForm.description}
                    onChange={(e) => setProjectForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Brief description of your project"
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="tags">Tags</Label>
                  <Input
                    id="tags"
                    value={projectForm.tags}
                    onChange={(e) => setProjectForm(prev => ({ ...prev, tags: e.target.value }))}
                    placeholder="React, TypeScript, Node.js (comma-separated)"
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="imageUrl">Project Image URL</Label>
                  <Input
                    id="imageUrl"
                    value={projectForm.imageUrl}
                    onChange={(e) => setProjectForm(prev => ({ ...prev, imageUrl: e.target.value }))}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                <div>
                  <Label htmlFor="projectUrl">Live Project URL</Label>
                  <Input
                    id="projectUrl"
                    value={projectForm.projectUrl}
                    onChange={(e) => setProjectForm(prev => ({ ...prev, projectUrl: e.target.value }))}
                    placeholder="https://your-project.com"
                  />
                </div>
                <div>
                  <Label htmlFor="githubUrl">GitHub URL</Label>
                  <Input
                    id="githubUrl"
                    value={projectForm.githubUrl}
                    onChange={(e) => setProjectForm(prev => ({ ...prev, githubUrl: e.target.value }))}
                    placeholder="https://github.com/username/repo"
                  />
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="content">Project Content *</Label>
                <Textarea
                  id="content"
                  value={projectForm.content}
                  onChange={(e) => setProjectForm(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Detailed description of your project, technologies used, challenges faced, etc."
                  rows={8}
                />
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isPublished"
                    checked={projectForm.isPublished}
                    onChange={(e) => setProjectForm(prev => ({ ...prev, isPublished: e.target.checked }))}
                  />
                  <Label htmlFor="isPublished">Publish Project</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={projectForm.featured}
                    onChange={(e) => setProjectForm(prev => ({ ...prev, featured: e.target.checked }))}
                  />
                  <Label htmlFor="featured">Featured Project</Label>
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-4">
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveProject} disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save Project'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Projects & Portfolio</h1>
          <p className="text-muted-foreground">
            Showcase your work and build your professional portfolio
          </p>
        </div>
        <Button onClick={handleCreateProject}>
          <Plus className="h-4 w-4 mr-2" />
          New Project
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="projects">My Projects</TabsTrigger>
          <TabsTrigger value="portfolio">My Portfolio</TabsTrigger>
        </TabsList>

        {/* Projects Tab */}
        <TabsContent value="projects" className="space-y-6">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <div className="h-48 bg-gray-200 rounded-t-lg"></div>
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
              {projects.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                      <Code className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">No Projects Yet</h3>
                    <p className="text-muted-foreground text-center mb-4">
                      Create your first project to showcase your skills and experience
                    </p>
                    <Button onClick={handleCreateProject}>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Your First Project
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {projects.map((project) => (
                    <Card key={project.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                      {project.imageUrl && (
                        <div className="h-48 bg-gray-100 relative">
                          <img
                            src={project.imageUrl}
                            alt={project.title}
                            className="w-full h-full object-cover"
                          />
                          {project.featured && (
                            <Badge className="absolute top-2 right-2 bg-yellow-100 text-yellow-800">
                              <Star className="h-3 w-3 mr-1" />
                              Featured
                            </Badge>
                          )}
                        </div>
                      )}
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-lg line-clamp-2">{project.title}</CardTitle>
                            <CardDescription className="line-clamp-3">
                              {project.description}
                            </CardDescription>
                          </div>
                          {!project.isPublished && (
                            <Badge variant="secondary">Draft</Badge>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {project.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {project.tags.slice(0, 3).map((tag, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                            {project.tags.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{project.tags.length - 3}
                              </Badge>
                            )}
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <span>{formatDate(project.createdAt)}</span>
                          <div className="flex items-center gap-3">
                            {project._count && (
                              <div className="flex items-center gap-1">
                                <Eye className="h-3 w-3" />
                                <span>{project._count.views}</span>
                              </div>
                            )}
                            {project._count && (
                              <div className="flex items-center gap-1">
                                <Heart className="h-3 w-3" />
                                <span>{project._count.likes}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex gap-2">
                            {project.projectUrl && (
                              <Button size="sm" variant="outline" asChild>
                                <a href={project.projectUrl} target="_blank" rel="noopener noreferrer">
                                  <ExternalLink className="h-3 w-3" />
                                </a>
                              </Button>
                            )}
                            {project.githubUrl && (
                              <Button size="sm" variant="outline" asChild>
                                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                                  <Github className="h-3 w-3" />
                                </a>
                              </Button>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => handleEditProject(project)}>
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => handleDeleteProject(project.id)}>
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </>
          )}
        </TabsContent>

        {/* Portfolio Tab */}
        <TabsContent value="portfolio" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Portfolio Settings</CardTitle>
              <CardDescription>
                Customize your public portfolio and professional profile
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={portfolioForm.bio}
                      onChange={(e) => setPortfolioForm(prev => ({ ...prev, bio: e.target.value }))}
                      placeholder="Tell us about yourself, your background, and what you're passionate about."
                      rows={4}
                    />
                  </div>
                  <div>
                    <Label htmlFor="skills">Skills</Label>
                    <Textarea
                      id="skills"
                      value={portfolioForm.skills}
                      onChange={(e) => setPortfolioForm(prev => ({ ...prev, skills: e.target.value }))}
                      placeholder="React, TypeScript, Node.js, Python, SQL (comma-separated)"
                      rows={3}
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="experience">Experience</Label>
                    <Textarea
                      id="experience"
                      value={portfolioForm.experience}
                      onChange={(e) => setPortfolioForm(prev => ({ ...prev, experience: e.target.value }))}
                      placeholder="Senior Developer at Tech Corp (2020-Present)&#10;Junior Developer at StartupXYZ (2018-2020)"
                      rows={4}
                    />
                  </div>
                  <div>
                    <Label htmlFor="education">Education</Label>
                    <Textarea
                      id="education"
                      value={portfolioForm.education}
                      onChange={(e) => setPortfolioForm(prev => ({ ...prev, education: e.target.value }))}
                      placeholder="Bachelor of Science in Computer Science, University Name (2014-2018)"
                      rows={3}
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <Label htmlFor="achievements">Achievements</Label>
                <Textarea
                  id="achievements"
                  value={portfolioForm.achievements}
                  onChange={(e) => setPortfolioForm(prev => ({ ...prev, achievements: e.target.value }))}
                  placeholder="Best Project Award 2023&#10;Published 3 technical articles&#10;Open source contributor"
                  rows={3}
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isPublic"
                    checked={portfolioForm.isPublic}
                    onChange={(e) => setPortfolioForm(prev => ({ ...prev, isPublic: e.target.checked }))}
                  />
                  <Label htmlFor="isPublic">Make portfolio public</Label>
                </div>
                <div>
                  <Label htmlFor="customDomain">Custom Domain (Optional)</Label>
                  <Input
                    id="customDomain"
                    value={portfolioForm.customDomain}
                    onChange={(e) => setPortfolioForm(prev => ({ ...prev, customDomain: e.target.value }))}
                    placeholder="yourname.portfolio.com"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSavePortfolio} disabled={isSaving}>
                  {isSaving ? 'Saving...' : 'Save Portfolio'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Portfolio Preview */}
          {portfolio && (
            <Card>
              <CardHeader>
                <CardTitle>Portfolio Preview</CardTitle>
                <CardDescription>
                  This is how your portfolio appears to visitors
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg p-6 bg-gray-50">
                  <div className="text-center space-y-4">
                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                      <span className="text-2xl font-bold text-primary">
                        {user?.name?.charAt(0) || 'U'}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold">{user?.name}</h3>
                    {portfolio.bio && (
                      <p className="text-muted-foreground max-w-2xl mx-auto">
                        {portfolio.bio}
                      </p>
                    )}
                    {portfolio.skills && (
                      <div className="flex flex-wrap justify-center gap-2">
                        {portfolio.skills.map((skill, index) => (
                          <Badge key={index} variant="secondary">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    )}
                    <div className="text-sm text-muted-foreground">
                      {projects.filter(p => p.isPublished).length} Published Projects
                    </div>
                    <div className="pt-4 border-t">
                      <p className="text-xs text-muted-foreground">
                        Portfolio URL: portfolio.iifta.portal.com/{user?.id}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}