'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Target, 
  Calendar, 
  DollarSign, 
  Users, 
  TrendingUp,
  ArrowRight,
  Sparkles
} from 'lucide-react';

interface GoalData {
  title: string;
  description: string;
  category: string;
  timeline: string;
  targetValue: string;
  currentValue: string;
}

interface Phase {
  name: string;
  weeks: string;
  milestones: string[];
  dailyTasks: string[];
}

export default function GoalWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [goalData, setGoalData] = useState<GoalData>({
    title: '',
    description: '',
    category: '',
    timeline: '',
    targetValue: '',
    currentValue: ''
  });
  const [phases, setPhases] = useState<Phase[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const categories = [
    { value: 'revenue', label: 'Revenue Growth', icon: '' },
    { value: 'audience', label: 'Audience Building', icon: '' },
    { value: 'product', label: 'Product Launch', icon: '' },
    { value: 'marketing', label: 'Marketing Campaign', icon: '' },
    { value: 'skills', label: 'Skill Development', icon: '' },
    { value: 'fitness', label: 'Health & Fitness', icon: '' }
  ];

  const timelines = [
    { value: '1-month', label: '1 Month' },
    { value: '3-months', label: '3 Months' },
    { value: '6-months', label: '6 Months' },
    { value: '1-year', label: '1 Year' },
    { value: 'custom', label: 'Custom' }
  ];

  const generateGoalBreakdown = async () => {
    setIsGenerating(true);
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock AI-generated phases based on goal data
    const mockPhases: Phase[] = [
      {
        name: "Foundation",
        weeks: "1-4",
        milestones: [
          "Define target audience",
          "Create core value proposition",
          "Set up basic systems"
        ],
        dailyTasks: [
          "Research competitor pricing",
          "Write value proposition",
          "Design service package",
          "Create content calendar"
        ]
      },
      {
        name: "Growth",
        weeks: "5-12",
        milestones: [
          "Launch marketing campaigns",
          "Build email list",
          "Create content library"
        ],
        dailyTasks: [
          "Post on social media",
          "Email potential clients",
          "Create educational content",
          "Network with peers"
        ]
      },
      {
        name: "Scale",
        weeks: "13-24",
        milestones: [
          "Automate processes",
          "Hire team members",
          "Expand offerings"
        ],
        dailyTasks: [
          "Optimize conversion funnels",
          "Scale marketing efforts",
          "Develop new products",
          "Build partnerships"
        ]
      }
    ];
    
    setPhases(mockPhases);
    setIsGenerating(false);
    setCurrentStep(3);
  };

  const handleNext = () => {
    if (currentStep === 2) {
      generateGoalBreakdown();
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  };

  const getCategoryIcon = (category: string) => {
    return categories.find(c => c.value === category)?.icon || '';
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-semibold text-gray-900 dark:text-white mb-2 tracking-tight">
            Set Your Goal
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Let's break down your big dream into achievable daily actions
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step <= currentStep 
                    ? 'bg-[#39d2c0] text-white' 
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                }`}>
                  {step}
                </div>
                {step < 3 && (
                  <div className={`w-16 h-1 mx-2 ${
                    step < currentStep 
                      ? 'bg-[#39d2c0]' 
                      : 'bg-gray-200 dark:bg-gray-700'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="max-w-2xl mx-auto">
          {currentStep === 1 && (
            <Card className="bg-white dark:bg-slate-900 border-gray-200 dark:border-gray-700 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-6 w-6 text-[#39d2c0]" />
                  <span>What's Your Goal?</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="title">Goal Title</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Earn R10k/month in 6 months"
                    value={goalData.title}
                    onChange={(e) => setGoalData({...goalData, title: e.target.value})}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Tell us more about your goal..."
                    value={goalData.description}
                    onChange={(e) => setGoalData({...goalData, description: e.target.value})}
                    className="mt-1"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={goalData.category} onValueChange={(value) => setGoalData({...goalData, category: value})}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          <div className="flex items-center space-x-2">
                            <span>{category.icon}</span>
                            <span>{category.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          )}

          {currentStep === 2 && (
            <Card className="bg-white dark:bg-slate-900 border-gray-200 dark:border-gray-700 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-6 w-6 text-[#39d2c0]" />
                  <span>Timeline & Metrics</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="timeline">Timeline</Label>
                  <Select value={goalData.timeline} onValueChange={(value) => setGoalData({...goalData, timeline: value})}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="How long do you want to achieve this?" />
                    </SelectTrigger>
                    <SelectContent>
                      {timelines.map((timeline) => (
                        <SelectItem key={timeline.value} value={timeline.value}>
                          {timeline.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="currentValue">Current Value</Label>
                    <Input
                      id="currentValue"
                      placeholder="e.g., R2,500"
                      value={goalData.currentValue}
                      onChange={(e) => setGoalData({...goalData, currentValue: e.target.value})}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="targetValue">Target Value</Label>
                    <Input
                      id="targetValue"
                      placeholder="e.g., R10,000"
                      value={goalData.targetValue}
                      onChange={(e) => setGoalData({...goalData, targetValue: e.target.value})}
                      className="mt-1"
                    />
                  </div>
                </div>

                {/* Goal Preview */}
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <h3 className="font-medium text-gray-900 dark:text-white mb-2">Goal Preview</h3>
                  <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                    <span>{getCategoryIcon(goalData.category)}</span>
                    <span>{goalData.title}</span>
                    <span>•</span>
                    <span>{goalData.timeline}</span>
                    <span>•</span>
                    <span>{goalData.currentValue} → {goalData.targetValue}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {currentStep === 3 && (
            <Card className="bg-white dark:bg-slate-900 border-gray-200 dark:border-gray-700 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Sparkles className="h-6 w-6 text-[#39d2c0]" />
                  <span>Your Action Plan</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {phases.map((phase, index) => (
                    <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          Phase {index + 1}: {phase.name}
                        </h3>
                        <Badge className="bg-[#39d2c0] text-white">
                          Weeks {phase.weeks}
                        </Badge>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white mb-2">Key Milestones</h4>
                          <ul className="space-y-1">
                            {phase.milestones.map((milestone, i) => (
                              <li key={i} className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                                <div className="w-1.5 h-1.5 bg-[#39d2c0] rounded-full"></div>
                                <span>{milestone}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white mb-2">Daily Tasks</h4>
                          <ul className="space-y-1">
                            {phase.dailyTasks.map((task, i) => (
                              <li key={i} className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                                <span>{task}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                    <div className="flex items-center space-x-2 mb-2">
                      <TrendingUp className="h-5 w-5 text-green-600" />
                      <h3 className="font-medium text-green-800 dark:text-green-200">Ready to Start!</h3>
                    </div>
                    <p className="text-sm text-green-700 dark:text-green-300">
                      Your goal has been broken down into {phases.length} phases with clear milestones and daily tasks. 
                      You'll start with Phase 1 and progress automatically as you complete tasks.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <Button 
              variant="outline" 
              onClick={handleBack}
              disabled={currentStep === 1}
            >
              Back
            </Button>
            
            {currentStep < 3 ? (
              <Button 
                onClick={handleNext}
                disabled={!goalData.title || !goalData.category || (currentStep === 2 && !goalData.timeline)}
                className="bg-[#39d2c0] hover:bg-[#39d2c0]/90"
              >
                {currentStep === 2 ? (
                  isGenerating ? (
                    <>
                      <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                      Generating Plan...
                    </>
                  ) : (
                    <>
                      Generate Plan
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )
                ) : (
                  <>
                    Next
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            ) : (
              <Button 
                className="bg-[#39d2c0] hover:bg-[#39d2c0]/90"
                onClick={() => {
                  // Navigate to dashboard
                  window.location.href = '/hypeos';
                }}
              >
                Start My Journey
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
