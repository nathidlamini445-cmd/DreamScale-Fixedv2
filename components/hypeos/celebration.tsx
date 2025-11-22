'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { CheckCircle2, Sparkles, Trophy, Star, Zap } from 'lucide-react';

interface CelebrationProps {
  type: 'goal-complete' | 'skill-mastered' | 'streak-milestone' | 'task-complete' | 'level-up';
  message?: string;
  onClose?: () => void;
  duration?: number;
}

export function Celebration({
  type,
  message,
  onClose,
  duration = 3000
}: CelebrationProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [showConfetti, setShowConfetti] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const onCloseRef = useRef(onClose);

  // Update ref when onClose changes
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    // Only set up timers once on mount
    let cancelled = false;
    
    // Start fade out 500ms before closing
    const fadeTimer = setTimeout(() => {
      if (!cancelled) {
        setIsFadingOut(true);
        setShowConfetti(false);
      }
    }, duration - 500);

    // Close after fade animation completes
    const closeTimer = setTimeout(() => {
      if (!cancelled) {
        setIsClosing(true);
        setIsVisible(false);
        onCloseRef.current?.();
      }
    }, duration);

    return () => {
      cancelled = true;
      clearTimeout(fadeTimer);
      clearTimeout(closeTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [duration]); // Only depend on duration, run once per duration change

  const getConfig = () => {
    switch (type) {
      case 'goal-complete':
        return {
          icon: <CheckCircle2 className="h-16 w-16 text-green-500" />,
          bgColor: 'bg-green-500/10',
          borderColor: 'border-green-500',
          textColor: 'text-green-700 dark:text-green-300',
          title: 'Daily Goal Complete',
          defaultMessage: 'Amazing work! You\'ve hit your daily target.'
        };
      case 'skill-mastered':
        return {
          icon: <Trophy className="h-16 w-16 text-yellow-500" />,
          bgColor: 'bg-yellow-500/10',
          borderColor: 'border-yellow-500',
          textColor: 'text-yellow-700 dark:text-yellow-300',
          title: 'Skill Mastered',
          defaultMessage: 'You\'ve mastered this skill! Keep it strong.'
        };
      case 'streak-milestone':
        return {
          icon: <Zap className="h-16 w-16 text-orange-500" />,
          bgColor: 'bg-orange-500/10',
          borderColor: 'border-orange-500',
          textColor: 'text-orange-700 dark:text-orange-300',
          title: 'Streak Milestone',
          defaultMessage: 'Incredible consistency! Keep it going!'
        };
      case 'task-complete':
        return {
          icon: <CheckCircle2 className="h-16 w-16 text-blue-500" />,
          bgColor: 'bg-blue-500/10',
          borderColor: 'border-blue-500',
          textColor: 'text-blue-700 dark:text-blue-300',
          title: 'Task Complete',
          defaultMessage: 'Great job! Keep up the momentum.'
        };
      case 'level-up':
        return {
          icon: <Star className="h-16 w-16 text-purple-500" />,
          bgColor: 'bg-purple-500/10',
          borderColor: 'border-purple-500',
          textColor: 'text-purple-700 dark:text-purple-300',
          title: 'Level Up',
          defaultMessage: 'Congratulations! You\'ve leveled up!'
        };
    }
  };

  const config = getConfig();

  if (!isVisible) return null;

  const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    // Close on any click (backdrop or card)
    if (!isClosing) {
      setIsClosing(true);
      setIsVisible(false);
      setIsFadingOut(true);
      setShowConfetti(false);
      onCloseRef.current?.();
    }
  }, [isClosing]);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center pointer-events-auto cursor-pointer"
      onClick={handleClick}
    >
      {/* Confetti Effect */}
      {showConfetti && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="absolute animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
                backgroundColor: ['#39d2c0', '#f59e0b', '#ef4444', '#8b5cf6', '#3b82f6'][
                  Math.floor(Math.random() * 5)
                ],
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                transform: `rotate(${Math.random() * 360}deg)`
              }}
            />
          ))}
        </div>
      )}

      {/* Celebration Card */}
      <div
        className={`relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border-2 ${config.borderColor} p-8 max-w-md mx-4 transform transition-all duration-500 ${
          isFadingOut ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
        } pointer-events-auto cursor-pointer`}
        onClick={handleClick}
      >
        <div className="text-center">
          {/* Icon with Animation */}
          <div className="mb-4 animate-bounce">
            {config.icon}
          </div>

          {/* Title */}
          <h3 className={`text-2xl font-bold mb-2 ${config.textColor}`}>
            {config.title}
          </h3>

          {/* Message */}
          <p className={`text-lg ${config.textColor} mb-4`}>
            {message || config.defaultMessage}
          </p>

          {/* Sparkle Effect */}
          <div className="flex justify-center space-x-1">
            {[0, 1, 2].map((i) => (
              <Sparkles
                key={i}
                className="h-5 w-5 text-yellow-400 animate-pulse"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes confetti {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
        .animate-confetti {
          animation: confetti linear forwards;
        }
      `}</style>
    </div>
  );
}

// Progress Animation Component
interface ProgressAnimationProps {
  from: number;
  to: number;
  duration?: number;
  onComplete?: () => void;
  children: (value: number) => React.ReactNode;
}

export function ProgressAnimation({
  from,
  to,
  duration = 1000,
  onComplete,
  children
}: ProgressAnimationProps) {
  const [value, setValue] = useState(from);

  useEffect(() => {
    const startTime = Date.now();
    const difference = to - from;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentValue = from + difference * easeOut;
      
      setValue(currentValue);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setValue(to);
        onComplete?.();
      }
    };

    requestAnimationFrame(animate);
  }, [from, to, duration, onComplete]);

  return <>{children(Math.round(value))}</>;
}

// Number Counter Animation
interface NumberCounterProps {
  value: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

export function NumberCounter({
  value,
  duration = 1000,
  prefix = '',
  suffix = '',
  className = ''
}: NumberCounterProps) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const startValue = displayValue;
    const difference = value - startValue;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentValue = startValue + difference * easeOut;
      
      setDisplayValue(currentValue);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setDisplayValue(value);
      }
    };

    requestAnimationFrame(animate);
  }, [value, duration]);

  return (
    <span className={className}>
      {prefix}{Math.round(displayValue).toLocaleString()}{suffix}
    </span>
  );
}

