export const fontStacks = {
  display: '"Manrope", system-ui, -apple-system, sans-serif',
  body: '"DM Sans", system-ui, -apple-system, sans-serif',
  mono: '"DM Mono", ui-monospace, monospace',
} as const

export type FontStacks = typeof fontStacks

export const fontWeights = {
  regular: 400,
  semibold: 600,
  bold: 700,
} as const

export type FontWeights = typeof fontWeights

export const fontSizes = {
  10: 10,
  12: 12,
  14: 14,
  16: 16,
  18: 18,
  20: 20,
  24: 24,
  32: 32,
  40: 40,
  48: 48,
  60: 60,
} as const

export type FontSizes = typeof fontSizes
