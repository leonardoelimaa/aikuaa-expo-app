import React from 'react'
import { View, Text, type ViewStyle, type TextStyle } from 'react-native'
import Animated, { SlideInLeft, SlideInRight } from 'react-native-reanimated'
import { StyleSheet } from 'react-native-unistyles'
import { useBreakpoint } from '@/hooks/useBreakpoint'
import { ChatMessage as ChatMessageType } from '../types'
import {
  RichMessageContent,
  SourcesCitations,
  ToolTransparency,
  StructuredResponse,
} from './response'
import { Source, StructuredResponseData, ToolStep } from './response/types'

export interface ChatMessageProps {
  message: ChatMessageType
  isStreaming?: boolean
  sources?: Source[]
  tools?: ToolStep[]
  structuredResponse?: StructuredResponseData
  testID?: string
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  isStreaming = false,
  sources,
  tools,
  structuredResponse,
  testID,
}) => {
  const isUser = message.role === 'user'
  const breakpoint = useBreakpoint()
  const isTablet = breakpoint === 'md' || breakpoint === 'lg'
  const enteringAnimation = isUser ? SlideInRight : SlideInLeft

  return (
    <View
      style={[styles.container, isUser ? styles.userContainer : styles.assistantContainer]}
      testID={testID ?? `chat-message-${message.role}`}
      accessibilityRole="text"
      accessibilityLabel={isUser ? 'Tu mensaje' : 'Respuesta de Aikuaa'}
    >
      <Animated.View
        entering={enteringAnimation}
        testID={`chat-message-bubble-${message.role}`}
        style={[
          styles.bubble,
          isUser ? styles.userBubble : styles.assistantBubble,
          isStreaming && styles.streamingBubble,
          isTablet && styles.bubbleTablet,
        ]}
      >
        {isUser ? (
          <Text
            style={[styles.text, isUser ? styles.userText : styles.assistantText]}
            testID={`chat-message-text-${message.role}`}
          >
            {message.content}
          </Text>
        ) : (
          <>
            <RichMessageContent
              content={message.content}
              testID={`chat-message-text-${message.role}`}
            />
            {structuredResponse ? <StructuredResponse response={structuredResponse} /> : null}
            {sources && sources.length > 0 ? <SourcesCitations sources={sources} /> : null}
            {tools && tools.length > 0 ? <ToolTransparency steps={tools} /> : null}
          </>
        )}
      </Animated.View>
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
  bubbleTablet: {
    maxWidth: '70%',
  } satisfies ViewStyle,
  text: {
    fontFamily: theme.fonts.body,
    fontSize: theme.fontSizes[16],
    lineHeight: theme.lineHeights[22],
  } satisfies TextStyle,
  userText: {
    color: theme.colors.white,
  } satisfies TextStyle,
  assistantText: {
    color: theme.colors.foreground,
  } satisfies TextStyle,
}))
