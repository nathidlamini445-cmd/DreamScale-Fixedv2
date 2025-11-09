import { Button } from "@/components/ui/button"
import { HelpCircle, MessageSquare, Settings } from "lucide-react"
import { UpgradeDropdown } from "@/components/upgrade-dropdown"

interface HeaderProps {
  onSettingsClick?: () => void
}

export function Header({ onSettingsClick }: HeaderProps = {}) {
  
  return (
    <header className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 backdrop-blur-sm">
      <div className="flex items-center justify-between px-8 py-4 mt-1">
        <div>
          <h1 className="text-3xl font-bold text-balance text-gray-900 dark:text-white">
            {"Welcome back to "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#005DFF] to-cyan-300 animate-pulse">{"DreamScale"}</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">{"What are we creating today?"}</p>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground hover:bg-gray-100 dark:hover:bg-gray-800">
            <HelpCircle className="w-4 h-4 mr-2" />
            {"Help"}
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-muted-foreground hover:text-foreground hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={onSettingsClick}
          >
            <Settings className="w-4 h-4 mr-2" />
            {"Settings"}
          </Button>
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground hover:bg-gray-100 dark:hover:bg-gray-800">
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
  )
}
