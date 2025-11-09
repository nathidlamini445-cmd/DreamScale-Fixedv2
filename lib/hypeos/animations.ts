// HypeOS Animation Utilities
// Provides animation helpers and constants

export const ANIMATION_DURATIONS = {
  fast: 200,
  normal: 300,
  slow: 500,
  verySlow: 1000
} as const;

export const EASING_FUNCTIONS = {
  linear: (t: number) => t,
  easeIn: (t: number) => t * t,
  easeOut: (t: number) => t * (2 - t),
  easeInOut: (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
  bounce: (t: number) => {
    if (t < 1 / 2.75) {
      return 7.5625 * t * t;
    } else if (t < 2 / 2.75) {
      return 7.5625 * (t -= 1.5 / 2.75) * t + 0.75;
    } else if (t < 2.5 / 2.75) {
      return 7.5625 * (t -= 2.25 / 2.75) * t + 0.9375;
    } else {
      return 7.5625 * (t -= 2.625 / 2.75) * t + 0.984375;
    }
  }
} as const;

/**
 * Animate a value from start to end
 */
export function animateValue(
  start: number,
  end: number,
  duration: number,
  callback: (value: number) => void,
  easing: keyof typeof EASING_FUNCTIONS = 'easeOut',
  onComplete?: () => void
) {
  const startTime = Date.now();
  const difference = end - start;

  const animate = () => {
    const elapsed = Date.now() - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    const easedProgress = EASING_FUNCTIONS[easing](progress);
    const currentValue = start + difference * easedProgress;
    
    callback(currentValue);

    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      callback(end);
      onComplete?.();
    }
  };

  requestAnimationFrame(animate);
}

/**
 * Create a pulsing animation class
 */
export function getPulseClass(intensity: 'subtle' | 'normal' | 'strong' = 'normal') {
  const durations = {
    subtle: 'animate-pulse',
    normal: 'animate-pulse',
    strong: 'animate-pulse'
  };
  
  return durations[intensity];
}

/**
 * Generate confetti particles
 */
export function generateConfetti(count: number = 50) {
  const colors = ['#39d2c0', '#f59e0b', '#ef4444', '#8b5cf6', '#3b82f6', '#10b981'];
  
  return Array.from({ length: count }).map((_, i) => ({
    id: i,
    color: colors[Math.floor(Math.random() * colors.length)],
    left: Math.random() * 100,
    delay: Math.random() * 2,
    duration: 2 + Math.random() * 2,
    rotation: Math.random() * 360
  }));
}

