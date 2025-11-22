import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, FolderOpen, ArrowRight } from "lucide-react"

export function ProjectsPanel() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-black">{"Projects"}</h2>
        <Button size="icon" variant="ghost" className="hover:bg-primary/10 hover:text-primary">
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>

      <Card className="p-8 bg-white border border-2 border-[#39d2c0] shadow-sm hover:shadow-lg hover:shadow-[#39d2c0]/70 ring-1 ring-[#39d2c0]/20 transition-all duration-300 text-center" style={{backgroundColor: '#F5F5F5'}}>
        <div className="w-16 h-16 mx-auto mb-4 bg-[#005DFF] rounded-2xl flex items-center justify-center">
          <FolderOpen className="w-8 h-8 text-black" />
        </div>
        <h3 className="text-xl font-bold mb-2 text-black">{"No project yet"}</h3>
        <p className="text-black mb-6 text-pretty">
          {"Create your first project to get started with your creative journey"}
        </p>
        <Button className="bg-[#005DFF] hover:bg-[#005DFF]/90 text-black pulse-glow">
          <Plus className="w-4 h-4 mr-2" />
          {"Create Project"}
        </Button>
      </Card>

    </div>
  )
}
