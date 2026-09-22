import { useCallback } from 'react'
import { Redirect } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Text } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'
import { useAppContext } from '@/context/AppContext'
import { Welcome } from '@/screens/welcome'

export default function EntryScreen() {
  const { bootStatus, isDemoActive, enterDemo } = useAppContext()

  const handleEnterDemo = useCallback(async () => {
    await enterDemo()
  }, [enterDemo])

  if (bootStatus === 'resolving') {
    return (
      <SafeAreaView style={styles.centered}>
        <Text accessibilityRole="text" style={styles.body}>
          Carregando a demonstração
        </Text>
      </SafeAreaView>
    )
  }

  if (isDemoActive) {
    return <Redirect href="/(app)/(tabs)/assistant" />
  }

  return <Welcome onEnterDemo={handleEnterDemo} />
}

const styles = StyleSheet.create((theme) => ({
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.background,
    padding: theme.spacing[24],
  },
  body: {
    color: theme.colors.foreground,
    fontFamily: theme.fonts.body,
    fontSize: theme.fontSizes[16],
  },
}))
