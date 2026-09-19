import React, { useState, useCallback } from 'react'
import { KeyboardAvoidingView, Platform, type ViewStyle } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Animated, { FadeIn, LinearTransition } from 'react-native-reanimated'
import { StyleSheet } from 'react-native-unistyles'
import { useBreakpoint } from '@/hooks/useBreakpoint'
import { useChat } from '../hooks/useChat'
import { EmptyState } from './states'
import { SuggestionPrompt } from './ChatWelcome'
import { ChatComposer } from './ChatComposer'
import { ChatMessageList } from './ChatMessageList'
import { OfflineIndicator } from './states'

export interface ChatScreenProps {
  offline?: boolean
}

export const ChatScreen: React.FC<ChatScreenProps> = ({ offline = false }) => {
  const { state, sendMessage, retryLastMessage } = useChat({ offline })
  const [inputValue, setInputValue] = useState('')
  const [isSending, setIsSending] = useState(false)
  const breakpoint = useBreakpoint()
  const isTablet = breakpoint === 'md' || breakpoint === 'lg'

  const isStreaming = state.status === 'streaming'

  const handleSend = useCallback(
    async (text: string) => {
      if (isStreaming || isSending) return
      setIsSending(true)
      setInputValue('')
      try {
        await sendMessage(text)
      } finally {
        setIsSending(false)
      }
    },
    [isStreaming, isSending, sendMessage],
  )

  const handleRetry = useCallback(async () => {
    if (isStreaming || isSending) return
    setIsSending(true)
    try {
      await retryLastMessage()
    } finally {
      setIsSending(false)
    }
  }, [isStreaming, isSending, retryLastMessage])

  const handleSuggestionPress = useCallback(
    (suggestion: SuggestionPrompt) => {
      setInputValue('')
      handleSend(suggestion.label)
    },
    [handleSend],
  )

  const showWelcome = state.messages.length === 0 && !isStreaming

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom', 'left', 'right']} testID="chat-screen">
      {offline ? <OfflineIndicator /> : null}
      <KeyboardAvoidingView
        style={styles.keyboardAvoider}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        testID="chat-keyboard-avoider"
      >
        <Animated.View
          entering={FadeIn}
          layout={LinearTransition}
          style={[styles.content, isTablet && styles.contentTablet]}
          testID="chat-animated-content"
        >
          <ChatMessageList
            messages={state.messages}
            streamingMessageId={state.streamingMessageId}
            streamingContent={state.streamingContent}
            isThinking={state.isThinking}
            error={state.error}
            offline={offline}
            onRetry={handleRetry}
            ListHeaderComponent={
              showWelcome ? <EmptyState onSuggestionPress={handleSuggestionPress} /> : null
            }
          />
          <ChatComposer
            value={inputValue}
            onChangeText={setInputValue}
            onSend={handleSend}
            disabled={isStreaming || isSending || offline}
            placeholder={offline ? 'No hay conexión disponible' : 'Escribe un mensaje...'}
          />
        </Animated.View>
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
  content: {
    flex: 1,
  } satisfies ViewStyle,
  contentTablet: {
    maxWidth: theme.breakpoints.md,
    alignSelf: 'center',
    width: '100%',
  } satisfies ViewStyle,
}))
