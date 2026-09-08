export const typography = {
  family: {
    display: '"Manrope", system-ui, sans-serif',
    body: '"DM Sans", system-ui, sans-serif',
    mono: '"DM Mono", ui-monospace, monospace',
  },
  weight: {
    regular: 400,
    semibold: 600,
    bold: 700,
  },
  /**
   * Size scale in logical pixels, suitable for React Native.
   * The actual font files (Manrope, DM Sans, DM Mono) will need to be loaded
   * via expo-font or an equivalent loader before these families render.
   */
  size: {
    xs: 10,
    sm: 12,
    base: 14,
    md: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
    '5xl': 48,
    '6xl': 60,
  },
  lineHeight: {
    none: 1,
    tight: 1.25,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
  },
  letterSpacing: {
    tighter: -0.05,
    tight: -0.025,
    normal: 0,
    wide: 0.025,
    wider: 0.05,
    widest: 0.1,
  },
} as const;

export type Typography = typeof typography;
