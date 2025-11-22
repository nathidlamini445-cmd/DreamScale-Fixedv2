'use client';

import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { type SkillStrengthLevel } from '@/lib/hypeos/spaced-repetition';

interface SkillStrengthIndicatorProps {
  strength: number; // 0-100
  level: SkillStrengthLevel;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  showTooltip?: boolean;
  daysUntilDecay?: number;
  isOverdue?: boolean;
}

export function SkillStrengthIndicator({
  strength,
  level,
  size = 'md',
  showLabel = false,
  showTooltip = true,
  daysUntilDecay,
  isOverdue
}: SkillStrengthIndicatorProps) {
  // Get color and icon based on level
  const getLevelStyles = (level: SkillStrengthLevel): {
    color: string;
    bgColor: string;
    icon: string;
    label: string;
  } => {
    switch (level) {
      case 'mastered':
        return {
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-100 border-yellow-300',
          icon: '',
          label: 'Mastered'
        };
      case 'practiced':
        return {
          color: 'text-green-600',
          bgColor: 'bg-green-100 border-green-300',
          icon: '',
          label: 'Strong'
        };
      case 'learning':
        return {
          color: 'text-blue-600',
          bgColor: 'bg-blue-100 border-blue-300',
          icon: '',
          label: 'Learning'
        };
      case 'weakened':
        return {
          color: 'text-orange-600',
          bgColor: 'bg-orange-100 border-orange-300',
          icon: '',
          label: 'Weakened'
        };
      case 'new':
      default:
        return {
          color: 'text-gray-600',
          bgColor: 'bg-gray-100 border-gray-300',
          icon: '🔁',
          label: 'New'
        };
    }
  };

  const styles = getLevelStyles(level);
  
  // Size classes
  const sizeClasses = {
    sm: 'text-xs px-1.5 py-0.5',
    md: 'text-sm px-2 py-1',
    lg: 'text-base px-3 py-1.5'
  };

  const strengthBarHeight = size === 'sm' ? 'h-1' : size === 'md' ? 'h-1.5' : 'h-2';
  
  // Tooltip content
  const tooltipContent = (
    <div className="text-sm">
      <div className="font-semibold mb-1">{styles.label} ({strength}%)</div>
      {daysUntilDecay !== undefined && daysUntilDecay > 0 && !isOverdue && (
        <div className="text-xs text-gray-400">
          Review in {daysUntilDecay} {daysUntilDecay === 1 ? 'day' : 'days'}
        </div>
      )}
      {isOverdue && (
        <div className="text-xs text-orange-400">
          Overdue - needs review!
        </div>
      )}
      {level === 'mastered' && (
        <div className="text-xs text-gray-400 mt-1">
          Keep reviewing to maintain mastery
        </div>
      )}
      {level === 'weakened' && (
        <div className="text-xs text-orange-400 mt-1">
          Skill has decayed - review to restore
        </div>
      )}
    </div>
  );

  const indicatorContent = (
    <div className="flex items-center gap-1.5">
      {/* Icon */}
      <span className={`${size === 'sm' ? 'text-xs' : size === 'md' ? 'text-sm' : 'text-base'}`}>
        {styles.icon}
      </span>
      
      {/* Strength bar */}
      <div className="flex-1 min-w-[60px]">
        <div className="w-full bg-gray-200 rounded-full overflow-hidden" style={{ height: size === 'sm' ? '4px' : size === 'md' ? '6px' : '8px' }}>
          <div
            className={`${styles.bgColor.replace('bg-', 'bg-').replace('-100', '-500')} transition-all duration-300`}
            style={{
              width: `${strength}%`,
              height: '100%'
            }}
          />
        </div>
      </div>
      
      {/* Label if enabled */}
      {showLabel && (
        <span className={`${styles.color} font-medium ${sizeClasses[size]}`}>
          {styles.label}
        </span>
      )}
      
      {/* Badge for overdue */}
      {isOverdue && (
        <Badge variant="destructive" className="text-xs">
          Review
        </Badge>
      )}
    </div>
  );

  if (showTooltip) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="cursor-help">
            {indicatorContent}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          {tooltipContent}
        </TooltipContent>
      </Tooltip>
    );
  }

  return indicatorContent;
}

// Compact badge version for task lists
export function SkillStrengthBadge({
  strength,
  level,
  daysUntilDecay,
  isOverdue
}: {
  strength: number;
  level: SkillStrengthLevel;
  daysUntilDecay?: number;
  isOverdue?: boolean;
}) {
  const getLevelConfig = (level: SkillStrengthLevel) => {
    switch (level) {
      case 'mastered':
        return { icon: '', color: 'bg-yellow-500 text-yellow-900', label: 'Mastered' };
      case 'practiced':
        return { icon: '', color: 'bg-green-500 text-green-900', label: 'Strong' };
      case 'learning':
        return { icon: '', color: 'bg-blue-500 text-blue-900', label: 'Learning' };
      case 'weakened':
        return { icon: '⚠️', color: 'bg-orange-500 text-orange-900', label: 'Weakened' };
      default:
        return { icon: '🔁', color: 'bg-gray-500 text-gray-900', label: 'New' };
    }
  };

  const config = getLevelConfig(level);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
          <Badge
            variant="outline"
            className={`${config.color} border-0 cursor-help text-xs px-2 py-0.5 transition-all duration-300 hover:scale-105`}
          >
            <span className="mr-1">{config.icon}</span>
            {config.label}
            {isOverdue && <span className="ml-1 animate-pulse">!</span>}
          </Badge>
      </TooltipTrigger>
      <TooltipContent>
        <div className="text-sm">
          <div className="font-semibold">{config.label} ({strength}%)</div>
          {daysUntilDecay !== undefined && daysUntilDecay > 0 && !isOverdue && (
            <div className="text-xs text-gray-400 mt-1">
              Review in {daysUntilDecay} {daysUntilDecay === 1 ? 'day' : 'days'}
            </div>
          )}
          {isOverdue && (
            <div className="text-xs text-orange-400 mt-1">
              Overdue - needs review!
            </div>
          )}
        </div>
      </TooltipContent>
    </Tooltip>
  );
}

