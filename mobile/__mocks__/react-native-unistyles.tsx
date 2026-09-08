import { type ImageStyle, type TextStyle, type ViewStyle } from 'react-native'
import { theme } from '../src/theme/theme'

export const StyleSheet = {
  configure: jest.fn(),
  create: <T extends Record<string, ViewStyle | TextStyle | ImageStyle>>(
    callback: (theme: typeof theme) => T,
  ) => callback(theme),
}

export const useUnistyles = () => ({
  theme,
  runtime: {
    themeName: 'light',
  },
})

export const UnistylesRuntime = {
  setTheme: jest.fn(),
  themeName: 'light',
}

export const mq = {}

export const withUnistyles = (Component: unknown) => Component
