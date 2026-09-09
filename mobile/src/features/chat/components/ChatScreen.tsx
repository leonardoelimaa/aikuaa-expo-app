import React, { useState, useCallback } from 'react'
import { KeyboardAvoidingView, Platform, type ViewStyle } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StyleSheet } from 'react-native-unistyles'
import { useChat } from '../hooks/useChat'
import { ChatWelcome, SuggestionPrompt } from './ChatWelcome'
import { ChatComposer } from './ChatComposer'
import { ChatMessageList } from './ChatMessageList'

export const ChatScreen: React.FC = () => {
  const { state, sendMessage } = useChat()
  const [inputValue, setInputValue] = useState('')
  const [isSending, setIsSending] = useState(false)

  const isStreaming = state.status === 'streaming'

  const handleSend = useCallback(
    async (text: string) => {
      if (isStreaming || isSending) return
      setIsSending(true)
      setInputValue('')
      await sendMessage(text)
      setIsSending(false)
    },
    [isStreaming, isSending, sendMessage],
  )

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
      <KeyboardAvoidingView
        style={styles.keyboardAvoider}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        testID="chat-keyboard-avoider"
      >
        <ChatMessageList
          messages={state.messages}
          streamingMessageId={state.streamingMessageId}
          streamingContent={state.streamingContent}
          isThinking={state.isThinking}
          error={state.error}
          ListHeaderComponent={
            showWelcome ? <ChatWelcome onSuggestionPress={handleSuggestionPress} /> : null
          }
        />
        <ChatComposer
          value={inputValue}
          onChangeText={setInputValue}
          onSend={handleSend}
          disabled={isStreaming || isSending}
        />
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
}))
