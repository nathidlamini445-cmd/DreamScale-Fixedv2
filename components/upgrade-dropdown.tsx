"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ArrowUp, Check, Crown, Zap } from "lucide-react"

export function UpgradeDropdown() {
  const handlePlanSelect = (plan: string) => {
    console.log(`Selected plan: ${plan}`)
    // Here you would typically handle the plan selection logic
    // such as redirecting to payment or updating user subscription
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="bg-[#39d2c0] hover:bg-[#2bb3a3] text-white shadow-lg hover:shadow-xl transition-all duration-300">
          <ArrowUp className="w-4 h-4 mr-2" />
          {"Upgrade"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80 p-2" align="end">
        <DropdownMenuLabel className="text-center text-lg font-semibold">
          Choose Your Plan
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {/* Free Plan */}
        <DropdownMenuItem 
          className="p-4 cursor-pointer hover:bg-gray-50 rounded-lg mb-2"
          onClick={() => handlePlanSelect('free')}
        >
          <div className="flex items-start space-x-3 w-full">
            <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
              <Check className="w-4 h-4 text-gray-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Free</h3>
                <span className="text-lg font-bold text-gray-900">$0</span>
              </div>
              <p className="text-sm text-gray-500 mt-1">Perfect for getting started</p>
              <ul className="text-xs text-gray-600 mt-2 space-y-1">
                <li>• Basic features</li>
                <li>• Limited projects</li>
                <li>• Community support</li>
              </ul>
            </div>
          </div>
        </DropdownMenuItem>

        {/* Pro Plan */}
        <DropdownMenuItem 
          className="p-4 cursor-pointer hover:bg-blue-50 rounded-lg mb-2 border border-blue-200"
          onClick={() => handlePlanSelect('pro')}
        >
          <div className="flex items-start space-x-3 w-full">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <Zap className="w-4 h-4 text-blue-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-blue-900">Pro</h3>
                <div className="text-right">
                  <span className="text-lg font-bold text-blue-900">$18</span>
                  <span className="text-sm text-blue-600">/month</span>
                </div>
              </div>
              <p className="text-sm text-blue-600 mt-1">Most popular choice</p>
              <ul className="text-xs text-blue-700 mt-2 space-y-1">
                <li>• All Free features</li>
                <li>• Unlimited projects</li>
                <li>• Priority support</li>
                <li>• Advanced analytics</li>
              </ul>
            </div>
          </div>
        </DropdownMenuItem>

        {/* Yearly Plan */}
        <DropdownMenuItem 
          className="p-4 cursor-pointer hover:bg-green-50 rounded-lg border border-green-200"
          onClick={() => handlePlanSelect('yearly')}
        >
          <div className="flex items-start space-x-3 w-full">
            <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <Crown className="w-4 h-4 text-green-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-green-900">Yearly</h3>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                    Save 30%
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold text-green-900">$150</span>
                  <span className="text-sm text-green-600">/year</span>
                  <div className="text-xs text-gray-500 line-through">$216</div>
                </div>
              </div>
              <p className="text-sm text-green-600 mt-1">Best value for teams</p>
              <ul className="text-xs text-green-700 mt-2 space-y-1">
                <li>• All Pro features</li>
                <li>• Team collaboration</li>
                <li>• Custom integrations</li>
                <li>• Dedicated support</li>
              </ul>
            </div>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
