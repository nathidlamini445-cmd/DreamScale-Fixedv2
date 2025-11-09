'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HorizontalNav } from '@/components/horizontal-nav';
import { 
  Users, 
  ArrowLeft,
  Sparkles
} from 'lucide-react';

export default function SquadsPage() {
  const router = useRouter();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <HorizontalNav />
      <div className="container mx-auto px-4 py-8 pt-24">
        <div className="max-w-2xl mx-auto">
          {/* Back Button */}
          <div className="mb-6">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => router.push('/hypeos')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </div>

          {/* Coming Soon Card */}
          <Card className="bg-white dark:bg-slate-900">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="relative">
                  <Users className="h-20 w-20 text-[#39d2c0] opacity-50" />
                  <Sparkles className="h-8 w-8 text-[#39d2c0] absolute -top-2 -right-2 animate-pulse" />
                </div>
              </div>
              <CardTitle className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Squads Coming Soon!
              </CardTitle>
              <p className="text-gray-600 dark:text-gray-400 mt-4">
                We're building an amazing accountability feature where you can join forces with like-minded entrepreneurs, 
                stay motivated together, and achieve your goals as a team.
              </p>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="bg-gradient-to-r from-[#39d2c0]/10 to-blue-500/10 dark:from-[#39d2c0]/20 dark:to-blue-500/20 rounded-lg p-6 border border-[#39d2c0]/20">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                  What to expect:
                </h3>
                <ul className="text-left space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li className="flex items-start">
                    <span className="mr-2">✨</span>
                    <span>Join or create accountability squads</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">🔥</span>
                    <span>Track squad streaks and progress together</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">💬</span>
                    <span>Chat and motivate each other</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">🏆</span>
                    <span>Compete in squad challenges</span>
                  </li>
                </ul>
              </div>

              <Button 
                className="bg-[#39d2c0] hover:bg-[#39d2c0]/90"
                onClick={() => router.push('/hypeos')}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to HypeOS
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
