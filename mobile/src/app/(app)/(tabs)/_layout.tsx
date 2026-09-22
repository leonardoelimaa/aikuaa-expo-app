import { Pressable, Text } from 'react-native'
import { Tabs, useRouter } from 'expo-router'
import { StyleSheet } from 'react-native-unistyles'

export default function AppTabsLayout() {
  const router = useRouter()

  return (
    <Tabs
      initialRouteName="assistant"
      backBehavior="initialRoute"
      screenOptions={{
        headerRight: () => (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Configurações"
            onPress={() => router.push('/(app)/settings')}
            style={styles.headerAction}
          >
            <Text style={styles.headerActionText}>Configurações</Text>
          </Pressable>
        ),
      }}
    >
      <Tabs.Screen name="assistant" options={{ title: 'Assistant' }} />
      <Tabs.Screen name="conversations" options={{ title: 'Conversations' }} />
      <Tabs.Screen name="workspace" options={{ title: 'Workspace' }} />
    </Tabs>
  )
}

const styles = StyleSheet.create((theme) => ({
  headerAction: {
    minHeight: 44,
    minWidth: 44,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing[16],
  },
  headerActionText: {
    color: theme.colors.primary,
    fontFamily: theme.fonts.body,
    fontSize: theme.fontSizes[16],
  },
}))
