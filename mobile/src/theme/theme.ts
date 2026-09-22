import { breakpoints } from './tokens/breakpoints'
import { durations, easings } from './tokens/animations'
import { fontSizes, fontStacks, fontWeights, lineHeights } from './tokens/typography'
import { radii } from './tokens/radii'
import { rawColors } from './tokens/colors'
import { shadows } from './tokens/shadows'
import { spacing } from './tokens/spacing'
import { extractPrimaryFontFamily } from './fonts'
import { resolveColor } from './resolveColor'

const colors = {
  canvas: resolveColor(rawColors.canvas),
  surface: resolveColor(rawColors.surface),
  surfaceMuted: resolveColor(rawColors.surfaceMuted),
  surfaceSunken: resolveColor(rawColors.surfaceSunken),
  content: resolveColor(rawColors.content),
  contentSubtle: resolveColor(rawColors.contentSubtle),
  contentMuted: resolveColor(rawColors.contentMuted),
  action: resolveColor(rawColors.action),
  actionPressed: resolveColor(rawColors.actionPressed),
  actionSecondary: resolveColor(rawColors.actionSecondary),
  border: resolveColor(rawColors.border),
  focusRing: resolveColor(rawColors.focusRing),
  disabledSurface: resolveColor(rawColors.disabledSurface),
  disabledContent: resolveColor(rawColors.disabledContent),
  proofSurface: resolveColor(rawColors.proofSurface),
  onProofSurface: resolveColor(rawColors.onProofSurface),
  background: resolveColor(rawColors.background),
  backgroundSecondary: resolveColor(rawColors.backgroundSecondary),
  foreground: resolveColor(rawColors.foreground),
  primary: resolveColor(rawColors.primary),
  primaryHover: resolveColor(rawColors.primaryHover),
  secondary: resolveColor(rawColors.secondary),
  muted: resolveColor(rawColors.muted),
  overlay: resolveColor(rawColors.overlay),
  white: resolveColor(rawColors.white),
} as const

const fonts = {
  display: extractPrimaryFontFamily(fontStacks.display),
  body: extractPrimaryFontFamily(fontStacks.body),
  mono: extractPrimaryFontFamily(fontStacks.mono),
} as const

type ShadowKey = keyof typeof shadows
type ShadowValue = (typeof shadows)[ShadowKey]

const resolvedShadows = (Object.entries(shadows) as [ShadowKey, ShadowValue][]).reduce<
  Record<ShadowKey, ShadowValue>
>(
  (acc, [key, value]) => {
    if (!value) {
      acc[key] = undefined as unknown as ShadowValue
      return acc
    }

    acc[key] = {
      ...value,
      color: resolveColor(value.color),
    }
    return acc
  },
  {} as Record<ShadowKey, ShadowValue>,
)

export const theme = {
  colors,
  fonts,
  fontSizes,
  fontWeights,
  lineHeights,
  spacing,
  radii,
  shadows: resolvedShadows,
  durations,
  easings,
  breakpoints,
} as const

export type Theme = typeof theme

declare module 'react-native-unistyles' {
  interface UnistylesThemes {
    light: Theme
    dark: Theme
  }

  interface UnistylesBreakpoints {
    xs: 0
    sm: 360
    md: 768
    lg: 1024
  }
}
