import React from 'react'
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  type ViewStyle,
  type TextStyle,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StyleSheet, useUnistyles } from 'react-native-unistyles'

const PLACEHOLDER_COLOR_KEY = 'muted' as const

export const ChatPlaceholder: React.FC = () => {
  const { theme } = useUnistyles()

  return (
    <SafeAreaView
      style={styles.safeArea}
      edges={['bottom', 'left', 'right']}
      testID="chat-safe-area"
    >
      <KeyboardAvoidingView
        style={styles.keyboardAvoider}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        testID="chat-keyboard-avoider"
      >
        <View style={styles.container}>
          <Text style={styles.title}>Chat</Text>
          <Text style={styles.subtitle}>Las conversaciones llegarán en una próxima entrega.</Text>
          <TextInput
            style={styles.input}
            placeholder="Escribe un mensaje..."
            placeholderTextColor={theme.colors[PLACEHOLDER_COLOR_KEY]}
            accessibilityLabel="Campo de mensaje"
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create((theme) => ({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  } satisfies ViewStyle,
  keyboardAvoider: {
    flex: 1,
  } satisfies ViewStyle,
  container: {
    flex: 1,
    padding: theme.spacing[6],
  } satisfies ViewStyle,
  title: {
    fontFamily: theme.fonts.display,
    fontSize: theme.fontSizes[24],
    color: theme.colors.foreground,
    marginBottom: theme.spacing[3],
  } satisfies TextStyle,
  subtitle: {
    fontFamily: theme.fonts.body,
    fontSize: theme.fontSizes[16],
    color: theme.colors.secondary,
    marginBottom: theme.spacing[6],
  } satisfies TextStyle,
  input: {
    fontFamily: theme.fonts.body,
    fontSize: theme.fontSizes[16],
    color: theme.colors.foreground,
    backgroundColor: theme.colors.white,
    borderRadius: theme.radii.md,
    padding: theme.spacing[4],
    borderWidth: 1,
    borderColor: theme.colors.overlay,
    minHeight: 48,
  } satisfies TextStyle,
}))
