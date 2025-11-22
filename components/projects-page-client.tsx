"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { HorizontalNav } from "@/components/horizontal-nav"
import { ProjectCreationModal } from "@/components/project-creation-modal"
import { SettingsModal } from "@/components/settings-modal"
import { Search, Bell, Plus, Folder, Clock, CheckCircle, AlertTriangle, Filter, Download, HelpCircle, MessageSquare, Edit, Trash2 } from "lucide-react"
import { UpgradeDropdown } from "@/components/upgrade-dropdown"

interface Project {
  id: string
  title: string
  description: string
  priority: string
  team: string
  dueDate: string
  status: "In Progress" | "Planning" | "Completed"
  progress: number
}

export function ProjectsPageClient() {
  const [projects, setProjects] = useState<Project[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false)

  const handleCreateProject = (projectData: any) => {
    const newProject: Project = {
      id: Date.now().toString(),
      title: projectData.title,
      description: projectData.description,
      priority: projectData.priority,
      team: projectData.team,
      dueDate: projectData.dueDate,
      status: "Planning",
      progress: 0
    }
    setProjects([...projects, newProject])
  }

  const handleEditProject = (projectData: any) => {
    if (editingProject) {
      const updatedProjects = projects.map(project =>
        project.id === editingProject.id
          ? {
              ...project,
              title: projectData.title,
              description: projectData.description,
              priority: projectData.priority,
              team: projectData.team,
              dueDate: projectData.dueDate
            }
          : project
      )
      setProjects(updatedProjects)
      setEditingProject(null)
    }
  }

  const handleDeleteProject = (projectId: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      setProjects(projects.filter(project => project.id !== projectId))
    }
  }

  const openEditModal = (project: Project) => {
    setEditingProject(project)
    setIsEditModalOpen(true)
  }

  const handleSettingsSave = (settings: any) => {
    console.log('Settings saved:', settings)
    // Here you would typically save to localStorage, database, etc.
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High": return "bg-red-100 text-red-800 border-red-200"
      case "Medium": return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "Low": return "bg-green-100 text-green-800 border-green-200"
      default: return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "In Progress": return "bg-blue-100 text-blue-800 border-blue-200"
      case "Completed": return "bg-green-100 text-green-800 border-green-200"
      case "Planning": return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default: return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric' 
    })
  }

  return (
    <div className="min-h-screen bg-white text-foreground relative overflow-hidden projects-page-unique" data-page="projects" id="projects-dashboard-page">
      {/* Force Projects Page Identifier */}
      <div style={{display: 'none'}} data-route="/projects">PROJECTS_PAGE_MARKER</div>
      <div className="relative z-10 main-container">
        <HorizontalNav />
        <main className="pt-32">
          {/* Projects Header */}
          <header className="border-b border-gray-200 bg-white backdrop-blur-sm">
            <div className="flex items-center justify-between px-8 py-6 mt-4">
              <div>
                <h1 className="text-2xl font-bold text-balance text-black">
                  {"Projects "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#39d2c0] to-cyan-300 animate-pulse">{"Dashboard"}</span>
                </h1>
                <p className="text-black mt-2 text-lg">{"Manage and track your project progress"}</p>
              </div>
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" className="text-black hover:text-black hover:bg-gray-100">
                  <HelpCircle className="w-4 h-4 mr-2" />
                  {"Help"}
                </Button>
                <Button variant="ghost" size="sm" className="text-black hover:text-black hover:bg-gray-100">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  {"Contact Support"}
                </Button>
                <UpgradeDropdown />
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-8 h-8 rounded-full bg-[#39d2c0]/30 text-[#39d2c0] hover:bg-[#39d2c0]/40 hover:text-white"
                >
                  {"?"}
                </Button>
              </div>
            </div>
          </header>

          {/* Summary Cards */}
          <div className="px-8 py-10">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
              <Card className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Projects</p>
                    <p className="text-2xl font-bold text-gray-900">{projects.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Folder className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </Card>

              <Card className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">In Progress</p>
                    <p className="text-2xl font-bold text-gray-900">{projects.filter(p => p.status === "In Progress").length}</p>
                  </div>
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-6 h-6 text-yellow-600" />
                  </div>
                </div>
              </Card>

              <Card className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Completed</p>
                    <p className="text-2xl font-bold text-gray-900">{projects.filter(p => p.status === "Completed").length}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </Card>

              <Card className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Planning</p>
                    <p className="text-2xl font-bold text-gray-900">{projects.filter(p => p.status === "Planning").length}</p>
                  </div>
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                  </div>
                </div>
              </Card>
            </div>

            {/* Main Content */}
            <Card className="bg-white rounded-lg border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900">Projects</h2>
                  <Button 
                    onClick={() => setIsModalOpen(true)}
                    className="bg-[#39d2c0] hover:bg-[#2bb3a3] text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    New Project
                  </Button>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search projects..."
                      className="pl-10 bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500"
                    />
                  </div>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Filter className="w-4 h-4" />
                    Filter
                  </Button>
                </div>
              </div>

              <div className="p-6">
                {projects.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Folder className="w-12 h-12 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No projects yet</h3>
                    <p className="text-gray-500 mb-6">Get started by creating your first project</p>
                    <Button 
                      onClick={() => setIsModalOpen(true)}
                      className="bg-[#39d2c0] hover:bg-[#2bb3a3] text-white"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Create Project
                    </Button>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-bold text-gray-900">Your Projects</h2>
                      <div className="flex items-center gap-4">
                        <Button variant="outline" className="flex items-center gap-2">
                          <Filter className="w-4 h-4" />
                          Filter
                        </Button>
                        <Button variant="outline" className="flex items-center gap-2">
                          <Download className="w-4 h-4" />
                          Export
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {projects.map((project) => (
                        <Card key={project.id} className="bg-white rounded-lg p-6 hover:shadow-lg transition-shadow duration-200 relative group">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                                <span className="text-lg font-bold text-gray-600">
                                  {project.title.substring(0, 2).toUpperCase()}
                                </span>
                              </div>
                              <div>
                                <h3 className="font-semibold text-gray-900 text-lg">{project.title}</h3>
                                <p className="text-sm text-gray-500 mt-1">{project.description}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="flex gap-2">
                                <span className={`px-2 py-1 rounded-md text-xs font-medium border ${getStatusColor(project.status)}`}>
                                  {project.status}
                                </span>
                                <span className={`px-2 py-1 rounded-md text-xs font-medium border ${getPriorityColor(project.priority)}`}>
                                  {project.priority}
                                </span>
                              </div>
                              
                              {/* Action Buttons */}
                              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => openEditModal(project)}
                                  className="h-8 w-8 p-0 text-gray-500 hover:text-blue-600 hover:bg-blue-50"
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteProject(project.id)}
                                  className="h-8 w-8 p-0 text-gray-500 hover:text-red-600 hover:bg-red-50"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </div>

                          <div className="mb-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm text-gray-600">Progress</span>
                              <span className="text-sm font-medium text-gray-900">{project.progress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-[#39d2c0] h-2 rounded-full transition-all duration-300"
                                style={{ width: `${project.progress}%` }}
                              />
                            </div>
                          </div>

                          <div className="flex items-center justify-between text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              <span>Due: {formatDate(project.dueDate)}</span>
                            </div>
                            <span>{project.team}</span>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </main>
      </div>

      {/* Project Creation Modal */}
      <ProjectCreationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateProject}
      />

      {/* Project Edit Modal */}
      {editingProject && (
        <ProjectCreationModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false)
            setEditingProject(null)
          }}
          onSubmit={handleEditProject}
          initialData={{
            title: editingProject.title,
            description: editingProject.description,
            priority: editingProject.priority,
            team: editingProject.team,
            dueDate: editingProject.dueDate
          }}
          isEdit={true}
        />
      )}

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        onSave={handleSettingsSave}
      />
    </div>
  )
}
