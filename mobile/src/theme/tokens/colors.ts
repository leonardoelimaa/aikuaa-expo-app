export const palette = {
  cream: {
    50: '#FAF9F6',
    100: '#F2F0EB',
    200: '#E8E5DE',
  },
  navy: {
    300: '#8A94A6',
    400: '#6B7688',
    500: '#4C566B',
    600: '#3D4659',
    700: '#2E3447',
    800: '#1F2435',
    900: '#111423',
    950: '#0A0C18',
  },
  white: '#FFFFFF',
} as const

export type Palette = typeof palette

export const rawColors = {
  background: palette.cream[50],
  backgroundSecondary: palette.cream[100],
  foreground: palette.navy[950],
  primary: palette.navy[700],
  primaryHover: palette.navy[800],
  secondary: palette.navy[500],
  muted: palette.navy[300],
  overlay: { color: palette.navy[950], opacity: 0.4 },
  white: palette.white,
} as const

export type RawColors = typeof rawColors
