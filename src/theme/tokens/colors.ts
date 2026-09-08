const palette = {
  cream: {
    50: '#faf9f6',
    100: '#f5f3ed',
    200: '#ebe8df',
  },
  navy: {
    950: '#0a1628',
    900: '#0f1f38',
    800: '#162b4a',
    700: '#1e3a61',
    600: '#2a4d7a',
    500: '#4a6b96',
    400: '#7a96b8',
    300: '#a8bdd4',
  },
  white: '#ffffff',
} as const;

export type ColorPalette = typeof palette;

export const colors = {
  ...palette,
  semantic: {
    light: {
      paper: palette.cream[50],
      surface: palette.white,
      ink: palette.navy[950],
      muted: palette.navy[500],
      line: palette.cream[200],
      proof: palette.navy[900],
      navyText: palette.navy[500],
      // Header background with alpha observed in CSS: #faf9f6eb
      // Stored as {color, opacity} so React Native / Unistyles can consume it safely.
      headerBg: { color: palette.cream[50], opacity: 0.92 },
      focus: palette.navy[900],
    },
    dark: {
      paper: palette.navy[900],
      surface: palette.navy[800],
      ink: palette.cream[50],
      muted: palette.cream[100],
      line: palette.navy[700],
      proof: palette.navy[800],
      navyText: palette.cream[100],
      // Dark headerBg observed/inferred: solid navy-900 (no translucide alias found on site).
      headerBg: { color: palette.navy[900], opacity: 1 },
      focus: palette.cream[50],
    },
  },
} as const;

export type Colors = typeof colors;
