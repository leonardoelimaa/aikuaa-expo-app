import { Stack } from 'expo-router'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { FontLoader, ThemeProvider } from '@/theme'
import { AppContextProvider } from '@/context/AppContext'
import { WorkspaceQueryProvider } from '@/context/WorkspaceQueryProvider'
import '@/theme/unistyles'

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <FontLoader>
          <AppContextProvider>
            <WorkspaceQueryProvider>
              <Stack screenOptions={{ headerShown: false }} />
            </WorkspaceQueryProvider>
          </AppContextProvider>
        </FontLoader>
      </ThemeProvider>
    </SafeAreaProvider>
  )
}
