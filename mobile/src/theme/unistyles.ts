import { StyleSheet } from 'react-native-unistyles'
import { breakpoints } from './tokens/breakpoints'
import { theme } from './theme'

StyleSheet.configure({
  themes: {
    light: theme,
    dark: theme,
  },
  settings: {
    initialTheme: 'light',
    adaptiveThemes: false,
  },
})

export { breakpoints }
