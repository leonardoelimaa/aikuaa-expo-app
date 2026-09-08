import { colors } from './colors';

/**
 * Platform-agnostic shadow tokens.
 * Each shadow is defined as a cross-platform descriptor that can be mapped to
 * React Native shadow properties or CSS box-shadow by the consuming style layer.
 */
export const shadows = {
  none: {
    offset: { x: 0, y: 0 },
    blur: 0,
    spread: 0,
    color: 'transparent',
    opacity: 0,
  },
  sm: {
    offset: { x: 0, y: 1 },
    blur: 2,
    spread: 0,
    color: colors.navy[950],
    opacity: 0.05,
  },
  md: {
    offset: { x: 0, y: 4 },
    blur: 8,
    spread: -2,
    color: colors.navy[950],
    opacity: 0.08,
  },
  lg: {
    offset: { x: 0, y: 10 },
    blur: 24,
    spread: -4,
    color: colors.navy[950],
    opacity: 0.12,
  },
  xl: {
    offset: { x: 0, y: 20 },
    blur: 40,
    spread: -8,
    color: colors.navy[950],
    opacity: 0.16,
  },
} as const;

export type Shadows = typeof shadows;
