import { Pressable, Text, View } from 'react-native'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StyleSheet } from 'react-native-unistyles'
import { useAppContext } from '@/context/AppContext'

export default function SettingsScreen() {
  const router = useRouter()
  const { context, resetDemo } = useAppContext()

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back()
      return
    }
    router.replace('/(app)/(tabs)/assistant')
  }

  const handleExitDemo = async () => {
    await resetDemo()
    router.replace('/')
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text accessibilityRole="header" style={styles.heading}>
          Configurações
        </Text>
        <Text style={styles.body}>
          {context
            ? `Workspace selecionado: ${context.workspaceId}`
            : 'Nenhum workspace selecionado'}
        </Text>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Voltar"
          onPress={handleBack}
          style={styles.secondaryButton}
        >
          <Text style={styles.secondaryButtonText}>Voltar</Text>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Trocar workspace"
          onPress={() => router.push('/(app)/(tabs)/workspace')}
          style={styles.secondaryButton}
        >
          <Text style={styles.secondaryButtonText}>Trocar workspace</Text>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Sair da demonstração"
          onPress={() => void handleExitDemo()}
          style={styles.primaryButton}
        >
          <Text style={styles.primaryButtonText}>Sair da demonstração</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
    gap: theme.spacing[16],
    padding: theme.spacing[24],
  },
  heading: {
    color: theme.colors.foreground,
    fontFamily: theme.fonts.display,
    fontSize: theme.fontSizes[24],
  },
  body: {
    color: theme.colors.secondary,
    fontFamily: theme.fonts.body,
    fontSize: theme.fontSizes[16],
  },
  primaryButton: {
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing[16],
  },
  primaryButtonText: {
    color: theme.colors.white,
    fontFamily: theme.fonts.body,
    fontSize: theme.fontSizes[16],
  },
  secondaryButton: {
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.overlay,
    paddingHorizontal: theme.spacing[16],
  },
  secondaryButtonText: {
    color: theme.colors.foreground,
    fontFamily: theme.fonts.body,
    fontSize: theme.fontSizes[16],
  },
}))
