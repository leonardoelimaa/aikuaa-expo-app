import { Stack } from 'expo-router'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { FontLoader, ThemeProvider } from '@/theme'
import { AppContextProvider } from '@/context/AppContext'
import '@/theme/unistyles'

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <FontLoader>
          <AppContextProvider>
            <Stack screenOptions={{ headerShown: false }} />
          </AppContextProvider>
        </FontLoader>
      </ThemeProvider>
    </SafeAreaProvider>
  )
}
