"use client"

import { Card } from "@/components/ui/card"
import { CardContainer, CardBody, CardItem } from "@/components/ui/3d-card"
import { CheckCircle, Circle, Plus, Clock, Calendar, ChevronDown } from "lucide-react"
import { useState } from "react"

interface Task {
  id: string
  title: string
  description: string
  completed: boolean
  dueDate?: string
  priority: 'low' | 'medium' | 'high'
  howToComplete?: string[] // Step-by-step instructions
}

export function TasksPanel() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [showAddTask, setShowAddTask] = useState(false)
  const [newTask, setNewTask] = useState({ title: '', description: '' })
  const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set())

  const toggleTask = (id: string) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ))
  }

  const addTask = () => {
    if (newTask.title.trim()) {
      const task: Task = {
        id: Date.now().toString(),
        title: newTask.title,
        description: newTask.description,
        completed: false,
        dueDate: 'Today',
        priority: 'medium'
      }
      setTasks([...tasks, task])
      setNewTask({ title: '', description: '' })
      setShowAddTask(false)
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'from-red-500 to-red-700'
      case 'medium': return 'from-yellow-500 to-yellow-700'
      case 'low': return 'from-green-500 to-green-700'
      default: return 'from-blue-500 to-blue-700'
    }
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return '🔴'
      case 'medium': return '🟡'
      case 'low': return '🟢'
      default: return '⚪'
    }
  }

  return (
    <div className="tasks-panel">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-foreground">This Week's Tasks</h2>
        <button
          onClick={() => setShowAddTask(!showAddTask)}
          className="p-2 rounded-full bg-[#39d2c0] text-white hover:bg-[#2bb3a3] transition-colors duration-200"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {showAddTask && (
        <Card className="p-4 mb-6 bg-gray-50 dark:bg-gray-800 border border-[#39d2c0]/30 dark:border-gray-600">
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Task title..."
              value={newTask.title}
              onChange={(e) => setNewTask({...newTask, title: e.target.value})}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-[#39d2c0]"
            />
            <input
              type="text"
              placeholder="Description (optional)..."
              value={newTask.description}
              onChange={(e) => setNewTask({...newTask, description: e.target.value})}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-[#39d2c0]"
            />
            <div className="flex gap-2">
              <button
                onClick={addTask}
                className="px-4 py-2 bg-[#39d2c0] text-white rounded-md hover:bg-[#2bb3a3] transition-colors duration-200"
              >
                Add Task
              </button>
              <button
                onClick={() => setShowAddTask(false)}
                className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </Card>
      )}

      {tasks.length === 0 ? (
        <Card className="p-8 text-center bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <div className="flex flex-col items-center">
            <Circle className="w-16 h-16 text-gray-400 dark:text-gray-500 mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300 mb-2">No tasks yet</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">Create your first task to get started</p>
            <button
              onClick={() => setShowAddTask(true)}
              className="px-4 py-2 bg-[#39d2c0] text-white rounded-md hover:bg-[#2bb3a3] transition-colors duration-200"
            >
              Add Task
            </button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tasks.map((task) => (
            <CardContainer key={task.id} containerClassName="py-2">
              <CardBody className="h-auto w-auto group">
                <Card className="p-4 bg-white dark:bg-gray-800 border border-2 border-[#39d2c0] dark:border-gray-600 shadow-sm hover:shadow-lg hover:shadow-[#39d2c0]/70 ring-1 ring-[#39d2c0]/20 dark:ring-gray-600/20 transition-all duration-300 cursor-pointer group relative overflow-hidden h-full">
                  <CardItem translateZ="80" rotateX={5} rotateY={5}>
                    <div className="flex items-center justify-between mb-3">
                      <button
                        onClick={() => toggleTask(task.id)}
                        className="flex items-center gap-2 hover:scale-110 transition-transform duration-200"
                      >
                        {task.completed ? (
                          <CheckCircle className="w-6 h-6 text-green-600" />
                        ) : (
                          <Circle className="w-6 h-6 text-gray-400" />
                        )}
                      </button>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{getPriorityIcon(task.priority)}</span>
                        {task.dueDate && (
                          <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                            <Clock className="w-3 h-3" />
                            <span>{task.dueDate}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardItem>
                  
                  <CardItem translateZ="60" rotateX={3}>
                    <h3 className={`font-bold text-lg mb-2 transition-colors duration-300 ${
                      task.completed ? 'line-through text-gray-500 dark:text-gray-400' : 'text-foreground group-hover:text-gray-800 dark:group-hover:text-gray-200'
                    }`}>
                      {task.title}
                    </h3>
                  </CardItem>
                  
                  <CardItem translateZ="40" rotateX={2}>
                    <p className={`text-sm text-pretty transition-colors duration-300 ${
                      task.completed ? 'text-gray-400 dark:text-gray-500' : 'text-muted-foreground group-hover:text-gray-800 dark:group-hover:text-gray-200'
                    }`}>
                      {task.description}
                    </p>
                    
                    {/* How to Complete Section */}
                    {task.howToComplete && task.howToComplete.length > 0 && !task.completed && (
                      <div className="mt-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const newExpanded = new Set(expandedTasks);
                            if (newExpanded.has(task.id)) {
                              newExpanded.delete(task.id);
                            } else {
                              newExpanded.add(task.id);
                            }
                            setExpandedTasks(newExpanded);
                          }}
                          className="flex items-center gap-1.5 text-xs text-[#39d2c0] hover:text-[#2bb3a3] transition-colors font-medium"
                        >
                          <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${expandedTasks.has(task.id) ? 'rotate-180' : ''}`} />
                          <span>How to complete this task</span>
                        </button>
                        
                        {expandedTasks.has(task.id) && (
                          <div className="mt-2 pl-4 border-l-2 border-[#39d2c0]/30">
                            <ul className="space-y-1.5 text-xs text-gray-700 dark:text-gray-300">
                              {task.howToComplete.map((step, idx) => (
                                <li key={idx} className="flex items-start gap-2">
                                  <span className="text-[#39d2c0] mt-0.5 flex-shrink-0">•</span>
                                  <span className="flex-1 leading-relaxed">{step}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </CardItem>

                  <CardItem translateZ="20" rotateX={1}>
                    <div className={`w-full h-1 rounded-full mt-3 bg-gradient-to-r ${getPriorityColor(task.priority)}`}></div>
                  </CardItem>
                </Card>
              </CardBody>
            </CardContainer>
          ))}
        </div>
      )}
    </div>
  )
}
