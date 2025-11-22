"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X, Calendar } from "lucide-react"

interface ProjectData {
  title: string
  description: string
  priority: string
  team: string
  dueDate: string
}

interface ProjectCreationModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (project: ProjectData) => void
  initialData?: ProjectData
  isEdit?: boolean
}

export function ProjectCreationModal({ isOpen, onClose, onSubmit, initialData, isEdit = false }: ProjectCreationModalProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [projectData, setProjectData] = useState<ProjectData>(
    initialData || {
      title: "",
      description: "",
      priority: "",
      team: "",
      dueDate: ""
    }
  )

  // Update project data when initialData changes (for edit mode)
  useEffect(() => {
    if (initialData) {
      setProjectData(initialData)
    }
  }, [initialData])

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = () => {
    onSubmit(projectData)
    // Reset form only if not editing
    if (!isEdit) {
      setProjectData({
        title: "",
        description: "",
        priority: "",
        team: "",
        dueDate: ""
      })
    }
    setCurrentStep(1)
    onClose()
  }

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return projectData.title.trim() !== ""
      case 2:
        return projectData.description.trim() !== ""
      case 3:
        return projectData.priority !== ""
      case 4:
        return projectData.team.trim() !== ""
      case 5:
        return projectData.dueDate !== ""
      default:
        return false
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6 relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">{isEdit ? "Edit Project" : "Create New Project"}</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Step {currentStep} of 5</span>
            <span className="text-sm text-gray-600">{Math.round((currentStep / 5) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-[#39d2c0] h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 5) * 100}%` }}
            />
          </div>
        </div>

        {/* Step Content */}
        <div className="mb-6">
          {currentStep === 1 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="title" className="text-sm font-medium text-gray-700">
                  What's the name of your project?
                </Label>
                <Input
                  id="title"
                  placeholder="e.g., Brand Identity for Artisan Coffee Co."
                  value={projectData.title}
                  onChange={(e) => setProjectData({ ...projectData, title: e.target.value })}
                  className="mt-1"
                />
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                  Describe your project
                </Label>
                <Textarea
                  id="description"
                  placeholder="Creating a cohesive visual identity including logo, color palette, and brand guidelines for a sustainable coffee brand"
                  value={projectData.description}
                  onChange={(e) => setProjectData({ ...projectData, description: e.target.value })}
                  className="mt-1 min-h-[100px]"
                />
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-gray-700">
                  What's the priority level?
                </Label>
                <Select
                  value={projectData.priority}
                  onValueChange={(value) => setProjectData({ ...projectData, priority: value })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select priority level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="team" className="text-sm font-medium text-gray-700">
                  Who's working on this project?
                </Label>
                <Input
                  id="team"
                  placeholder="e.g., Design Team, Dev Team A"
                  value={projectData.team}
                  onChange={(e) => setProjectData({ ...projectData, team: e.target.value })}
                  className="mt-1"
                />
              </div>
            </div>
          )}

          {currentStep === 5 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="dueDate" className="text-sm font-medium text-gray-700">
                  When is the due date?
                </Label>
                <div className="relative mt-1">
                  <Input
                    id="dueDate"
                    type="date"
                    value={projectData.dueDate}
                    onChange={(e) => setProjectData({ ...projectData, dueDate: e.target.value })}
                    className="pl-10"
                  />
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 1}
            className="px-6"
          >
            Back
          </Button>
          
          {currentStep < 5 ? (
            <Button
              onClick={handleNext}
              disabled={!isStepValid()}
              className="px-6 bg-[#39d2c0] hover:bg-[#2bb3a3] text-white"
            >
              Next
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={!isStepValid()}
              className="px-6 bg-[#39d2c0] hover:bg-[#2bb3a3] text-white"
            >
              {isEdit ? "Update Project" : "Create Project"}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
