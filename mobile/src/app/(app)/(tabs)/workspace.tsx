import { Pressable, Text, View } from 'react-native'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StyleSheet } from 'react-native-unistyles'
import { useAppContext } from '@/context/AppContext'
import { useWorkspaceCatalog } from '@/features/workspaces/hooks/useWorkspaceCatalog'

export default function WorkspaceScreen() {
  const router = useRouter()
  const { context, selectWorkspace } = useAppContext()
  const { data: workspaces, isLoading, isError } = useWorkspaceCatalog()

  if (isLoading) {
    return <StatusMessage message="Carregando workspaces" />
  }

  if (isError) {
    return <StatusMessage message="Não foi possível carregar os workspaces" />
  }

  if (!workspaces?.length) {
    return <StatusMessage message="Nenhum workspace disponível" />
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text accessibilityRole="header" style={styles.heading}>
          Workspace
        </Text>
        {workspaces.map((workspace) => {
          const selected = context?.workspaceId === workspace.id

          return (
            <View key={workspace.id} style={styles.card}>
              <Text style={styles.workspaceName}>{workspace.name}</Text>
              <Text style={styles.body}>
                {selected ? 'Workspace selecionado' : 'Workspace não selecionado'}
              </Text>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Selecionar workspace ${workspace.name}`}
                accessibilityState={{ selected }}
                onPress={() => void selectWorkspace(workspace.id)}
                style={styles.primaryButton}
              >
                <Text style={styles.primaryButtonText}>
                  {selected ? 'Selecionado' : 'Selecionar'}
                </Text>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Ver detalhes de ${workspace.name}`}
                onPress={() => router.push(`/(app)/workspace/${workspace.id}`)}
                style={styles.secondaryButton}
              >
                <Text style={styles.secondaryButtonText}>Ver detalhes</Text>
              </Pressable>
            </View>
          )
        })}
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
    padding: theme.spacing[24],
  },
  heading: {
    color: theme.colors.foreground,
    fontFamily: theme.fonts.display,
    fontSize: theme.fontSizes[24],
  },
  workspaceName: {
    color: theme.colors.foreground,
    fontFamily: theme.fonts.display,
    fontSize: theme.fontSizes[16],
  },
  body: {
    color: theme.colors.secondary,
    fontFamily: theme.fonts.body,
    fontSize: theme.fontSizes[16],
  },
  card: {
    gap: theme.spacing[16],
    backgroundColor: theme.colors.overlay,
    padding: theme.spacing[16],
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
    paddingHorizontal: theme.spacing[16],
  },
  secondaryButtonText: {
    color: theme.colors.primary,
    fontFamily: theme.fonts.body,
    fontSize: theme.fontSizes[16],
  },
}))
