import type { ColorToken } from '../resolveColor'

export const shadows = {
  none: undefined,
  sm: {
    offset: { x: 0, y: 1 },
    blur: 2,
    spread: 0,
    color: { color: '#111423', opacity: 0.05 } as ColorToken,
  },
  md: {
    offset: { x: 0, y: 4 },
    blur: 8,
    spread: -2,
    color: { color: '#111423', opacity: 0.08 } as ColorToken,
  },
  lg: {
    offset: { x: 0, y: 12 },
    blur: 24,
    spread: -6,
    color: { color: '#111423', opacity: 0.12 } as ColorToken,
  },
} as const

export type RawShadows = typeof shadows
