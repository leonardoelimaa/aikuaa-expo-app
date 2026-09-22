export const palette = {
  cream: {
    50: '#FAF9F6',
    100: '#F5F3ED',
    200: '#EBE8DF',
  },
  navy: {
    300: '#A8BDD4',
    400: '#7A96B8',
    500: '#4A6B96',
    600: '#2A4D7A',
    700: '#1E3A61',
    800: '#162B4A',
    900: '#0F1F38',
    950: '#0A1628',
  },
  white: '#FFFFFF',
} as const

export type Palette = typeof palette

export const rawColors = {
  canvas: palette.cream[50],
  surface: palette.white,
  surfaceMuted: palette.cream[100],
  surfaceSunken: palette.cream[200],
  content: palette.navy[950],
  contentSubtle: palette.navy[600],
  contentMuted: palette.navy[500],
  action: palette.navy[900],
  actionPressed: palette.navy[950],
  actionSecondary: palette.cream[50],
  border: palette.navy[400],
  focusRing: palette.navy[500],
  disabledSurface: palette.cream[200],
  disabledContent: palette.navy[600],
  proofSurface: palette.navy[950],
  onProofSurface: palette.cream[50],
  background: palette.cream[50],
  backgroundSecondary: palette.cream[100],
  foreground: palette.navy[950],
  primary: palette.navy[900],
  primaryHover: palette.navy[950],
  secondary: palette.navy[600],
  muted: palette.navy[500],
  overlay: { color: palette.navy[950], opacity: 0.4 },
  white: palette.white,
} as const

export type RawColors = typeof rawColors
