import { breakpoints } from './tokens/breakpoints'
import { durations, easings } from './tokens/animations'
import { fontSizes, fontStacks, fontWeights } from './tokens/typography'
import { radii } from './tokens/radii'
import { rawColors } from './tokens/colors'
import { shadows } from './tokens/shadows'
import { spacing } from './tokens/spacing'
import { extractPrimaryFontFamily } from './fonts'
import { resolveColor } from './resolveColor'

const colors = {
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
