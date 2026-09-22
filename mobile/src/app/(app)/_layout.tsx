import { Pressable, Text } from 'react-native'
import { Redirect, Stack, useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StyleSheet } from 'react-native-unistyles'
import { useAppContext } from '@/context/AppContext'

export default function AppLayout() {
  const router = useRouter()
  const { bootStatus, isDemoActive } = useAppContext()

  if (bootStatus === 'resolving') {
    return (
      <SafeAreaView style={styles.centered}>
        <Text accessibilityRole="text" style={styles.body}>
          Carregando a demonstração
        </Text>
      </SafeAreaView>
    )
  }

  if (!isDemoActive) {
    return <Redirect href="/" />
  }

  return (
    <Stack>
      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: false,
          headerRight: () => (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Configurações"
              onPress={() => router.push('/(app)/settings')}
              style={styles.headerAction}
            >
              <Text style={styles.actionText}>Configurações</Text>
            </Pressable>
          ),
        }}
      />
      <Stack.Screen name="settings" options={{ headerShown: false }} />
      <Stack.Screen name="workspace/[workspaceId]" options={{ headerShown: false }} />
    </Stack>
  )
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
  headerAction: {
    minHeight: 44,
    minWidth: 44,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing[16],
  },
  actionText: {
    color: theme.colors.primary,
    fontFamily: theme.fonts.body,
    fontSize: theme.fontSizes[16],
  },
}))
