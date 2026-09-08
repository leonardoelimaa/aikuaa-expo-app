export const durations = {
  instant: 0,
  fast: 100,
  normal: 200,
  slow: 300,
} as const

export type Durations = typeof durations

export const easings = {
  linear: 'linear',
  easeIn: 'ease-in',
  easeOut: 'ease-out',
  easeInOut: 'ease-in-out',
} as const

export type Easings = typeof easings
