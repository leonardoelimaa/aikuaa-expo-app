export const animations = {
  duration: {
    instant: 0,
    fast: 100,
    normal: 200,
    moderate: 300,
    slow: 500,
  },
  easing: {
    linear: 'linear',
    ease: 'ease',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
    spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  },
} as const;

export type Animations = typeof animations;
