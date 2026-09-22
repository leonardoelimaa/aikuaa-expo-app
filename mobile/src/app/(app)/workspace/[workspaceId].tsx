import { Pressable, Text, View } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StyleSheet } from 'react-native-unistyles'
import { useAppContext } from '@/context/AppContext'
import { useWorkspaceCatalog } from '@/features/workspaces/hooks/useWorkspaceCatalog'

const WORKSPACE_ROUTE = '/(app)/(tabs)/workspace' as const

export default function WorkspaceDetailScreen() {
  const router = useRouter()
  const params = useLocalSearchParams<{ workspaceId?: string | string[] }>()
  const { selectWorkspace } = useAppContext()
  const { data: workspaces, isLoading, isError } = useWorkspaceCatalog()
  const workspaceId = typeof params.workspaceId === 'string' ? params.workspaceId : null
  const workspace = workspaces?.find((item) => item.id === workspaceId)

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back()
      return
    }
    router.replace(WORKSPACE_ROUTE)
  }

  if (isLoading) {
    return <StatusMessage message="Carregando workspace" />
  }

  if (isError) {
    return <StatusMessage message="Não foi possível carregar o workspace" />
  }

  if (!workspace) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <Text accessibilityRole="header" style={styles.heading}>
            Workspace não encontrado
          </Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Voltar para Workspace"
            onPress={() => router.replace(WORKSPACE_ROUTE)}
            style={styles.secondaryButton}
          >
            <Text style={styles.secondaryButtonText}>Voltar para Workspace</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text accessibilityRole="header" style={styles.heading}>
          {workspace.name}
        </Text>
        <Text style={styles.body}>Empresa de demonstração: {workspace.companyId}</Text>
        <Text style={styles.body}>Tenant de demonstração: {workspace.tenantId}</Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Usar este workspace"
          onPress={() => void selectWorkspace(workspace.id)}
          style={styles.primaryButton}
        >
          <Text style={styles.primaryButtonText}>Usar este workspace</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Voltar"
          onPress={handleBack}
          style={styles.secondaryButton}
        >
          <Text style={styles.secondaryButtonText}>Voltar</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  )
}

function StatusMessage({ message }: { message: string }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.centered}>
        <Text accessibilityRole="text" style={styles.body}>
          {message}
        </Text>
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
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
    minWidth: 44,
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
    minWidth: 44,
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
