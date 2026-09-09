import React, { useCallback } from 'react'
import {
  View,
  TextInput,
  Pressable,
  Text,
  type ViewStyle,
  type TextStyle,
  type TextInputProps,
} from 'react-native'
import { StyleSheet, useUnistyles } from 'react-native-unistyles'

export interface ChatComposerProps extends Pick<TextInputProps, 'placeholder'> {
  value: string
  onChangeText: (text: string) => void
  onSend: (text: string) => void
  disabled?: boolean
}

export const ChatComposer: React.FC<ChatComposerProps> = ({
  value,
  onChangeText,
  onSend,
  disabled = false,
  placeholder = 'Escribe un mensaje...',
}) => {
  const { theme } = useUnistyles()

  const canSend = value.trim().length > 0 && !disabled

  const handleSend = useCallback(() => {
    if (!canSend) return
    onSend(value.trim())
  }, [canSend, onSend, value])

  return (
    <View style={styles.container} testID="chat-composer">
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.muted}
          multiline
          maxLength={2000}
          accessibilityLabel="Campo de mensaje"
          accessibilityHint="Escribe tu mensaje y presiona enviar"
          testID="chat-composer-input"
          blurOnSubmit={false}
          onSubmitEditing={handleSend}
          editable={!disabled}
        />
        <Pressable
          style={[styles.sendButton, !canSend && styles.sendButtonDisabled]}
          onPress={handleSend}
          disabled={!canSend}
          accessibilityRole="button"
          accessibilityLabel="Enviar mensaje"
          accessibilityState={{ disabled: !canSend }}
          testID="chat-composer-send"
        >
          <Text style={[styles.sendIcon, !canSend && styles.sendIconDisabled]}>→</Text>
        </Pressable>
      </View>
    </View>
  )
}

const styles = StyleSheet.create((theme) => ({
  container: {
    padding: theme.spacing[4],
    backgroundColor: theme.colors.white,
    borderTopWidth: 1,
    borderTopColor: theme.colors.overlay,
  } satisfies ViewStyle,
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: theme.spacing[3],
    backgroundColor: theme.colors.background,
    borderRadius: theme.radii['2xl'],
    padding: theme.spacing[2],
    paddingLeft: theme.spacing[4],
    borderWidth: 1,
    borderColor: theme.colors.overlay,
  } satisfies ViewStyle,
  input: {
    flex: 1,
    fontFamily: theme.fonts.body,
    fontSize: theme.fontSizes[16],
    color: theme.colors.foreground,
    maxHeight: 120,
    minHeight: 44,
    paddingVertical: theme.spacing[3],
    lineHeight: 22,
  } satisfies TextStyle,
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: theme.radii.full,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  } satisfies ViewStyle,
  sendButtonDisabled: {
    backgroundColor: theme.colors.muted,
  } satisfies ViewStyle,
  sendIcon: {
    fontFamily: theme.fonts.display,
    fontSize: theme.fontSizes[20],
    color: theme.colors.white,
    fontWeight: theme.fontWeights.bold,
  } satisfies TextStyle,
  sendIconDisabled: {
    color: theme.colors.background,
  } satisfies TextStyle,
}))
