import { Pressable, Text, View } from 'react-native'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StyleSheet } from 'react-native-unistyles'

export default function ConversationsScreen() {
  const router = useRouter()

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text accessibilityRole="header" style={styles.heading}>
          Nenhuma conversa ainda
        </Text>
        <Text style={styles.body}>
          As conversas não são salvas nesta demonstração. Comece uma nova conversa no Assistant.
        </Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Ir para o Assistant"
          onPress={() => router.push('/(app)/(tabs)/assistant')}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Ir para o Assistant</Text>
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
  button: {
    minHeight: 44,
    minWidth: 44,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing[16],
  },
  buttonText: {
    color: theme.colors.white,
    fontFamily: theme.fonts.body,
    fontSize: theme.fontSizes[16],
  },
}))
