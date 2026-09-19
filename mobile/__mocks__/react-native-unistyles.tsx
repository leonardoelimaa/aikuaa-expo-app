import { type ImageStyle, type TextStyle, type ViewStyle } from 'react-native'
import { theme } from '../src/theme/theme'

export const StyleSheet = {
  configure: jest.fn(),
  create: <T extends Record<string, ViewStyle | TextStyle | ImageStyle>>(
    callback: (theme: typeof theme) => T,
  ) => callback(theme),
}

export const useUnistyles = jest.fn(() => ({
  theme,
  breakpoint: 'sm',
  runtime: {
    themeName: 'light',
    breakpoint: 'sm',
  },
}))

export const UnistylesRuntime = {
  setTheme: jest.fn(),
  themeName: 'light',
}

export const mq = {}

export const withUnistyles = (Component: unknown) => Component
