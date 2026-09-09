import React from 'react'
import { View, Text, type ViewStyle, type TextStyle } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'
import { ChatMessage as ChatMessageType } from '../types'

export interface ChatMessageProps {
  message: ChatMessageType
  isStreaming?: boolean
  testID?: string
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  isStreaming = false,
  testID,
}) => {
  const isUser = message.role === 'user'

  return (
    <View
      style={[styles.container, isUser ? styles.userContainer : styles.assistantContainer]}
      testID={testID ?? `chat-message-${message.role}`}
      accessibilityRole="text"
      accessibilityLabel={isUser ? 'Tu mensaje' : 'Respuesta de Aikuaa'}
    >
      <View
        style={[
          styles.bubble,
          isUser ? styles.userBubble : styles.assistantBubble,
          isStreaming && styles.streamingBubble,
        ]}
      >
        <Text
          style={[styles.text, isUser ? styles.userText : styles.assistantText]}
          testID={`chat-message-text-${message.role}`}
        >
          {message.content}
        </Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flexDirection: 'row',
    marginVertical: theme.spacing[2],
    paddingHorizontal: theme.spacing[4],
  } satisfies ViewStyle,
  userContainer: {
    justifyContent: 'flex-end',
  } satisfies ViewStyle,
  assistantContainer: {
    justifyContent: 'flex-start',
  } satisfies ViewStyle,
  bubble: {
    maxWidth: '80%',
    paddingVertical: theme.spacing[3],
    paddingHorizontal: theme.spacing[4],
    borderRadius: theme.radii['2xl'],
  } satisfies ViewStyle,
  userBubble: {
    backgroundColor: theme.colors.primary,
    borderBottomRightRadius: theme.radii.sm,
  } satisfies ViewStyle,
  assistantBubble: {
    backgroundColor: theme.colors.backgroundSecondary,
    borderBottomLeftRadius: theme.radii.sm,
  } satisfies ViewStyle,
  streamingBubble: {
    opacity: 0.9,
  } satisfies ViewStyle,
  text: {
    fontFamily: theme.fonts.body,
    fontSize: theme.fontSizes[16],
    lineHeight: 22,
  } satisfies TextStyle,
  userText: {
    color: theme.colors.white,
  } satisfies TextStyle,
  assistantText: {
    color: theme.colors.foreground,
  } satisfies TextStyle,
}))
