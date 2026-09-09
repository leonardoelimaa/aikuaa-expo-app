import React, { useRef, useEffect } from 'react'
import { FlatList, View, Text, type ViewStyle, type TextStyle } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'
import { ChatMessage as ChatMessageType } from '../types'
import { ChatMessage } from './ChatMessage'
import { ChatThinking } from './ChatThinking'

export interface ChatMessageListProps {
  messages: ChatMessageType[]
  streamingMessageId: string | null
  streamingContent: string
  isThinking: boolean
  error: { code: string; message: string } | null
  ListHeaderComponent?: React.ReactElement | null
}

export const ChatMessageList: React.FC<ChatMessageListProps> = ({
  messages,
  streamingMessageId,
  streamingContent,
  isThinking,
  error,
  ListHeaderComponent,
}) => {
  const listRef = useRef<FlatList<ChatMessageType>>(null)

  useEffect(() => {
    if (messages.length > 0) {
      listRef.current?.scrollToEnd({ animated: true })
    }
  }, [messages.length, streamingContent, isThinking])

  const renderItem = ({ item }: { item: ChatMessageType }) => (
    <ChatMessage message={item} testID={`chat-message-${item.id}`} />
  )

  const keyExtractor = (item: ChatMessageType) => item.id

  const footer = () => {
    if (!streamingMessageId) return null
    return (
      <View testID="chat-streaming-message">
        {streamingContent !== '' && (
          <ChatMessage
            message={{
              id: streamingMessageId,
              role: 'assistant',
              content: streamingContent,
              createdAt: new Date().toISOString(),
            }}
            isStreaming
            testID="chat-message-streaming"
          />
        )}
        {isThinking && <ChatThinking />}
      </View>
    )
  }

  return (
    <View style={styles.container} testID="chat-message-list">
      <FlatList
        ref={listRef}
        data={messages}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListHeaderComponent={ListHeaderComponent ?? undefined}
        ListFooterComponent={footer}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        accessibilityRole="list"
        accessibilityLabel="Mensajes de la conversación"
      />
      {error && (
        <View style={styles.errorBanner} testID="chat-error-banner" accessibilityRole="alert">
          <Text style={styles.errorText}>{error.message}</Text>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
  } satisfies ViewStyle,
  content: {
    paddingVertical: theme.spacing[4],
  } satisfies ViewStyle,
  errorBanner: {
    margin: theme.spacing[4],
    padding: theme.spacing[4],
    borderRadius: theme.radii.md,
    backgroundColor: theme.colors.backgroundSecondary,
    borderWidth: 1,
    borderColor: theme.colors.overlay,
  } satisfies ViewStyle,
  errorText: {
    fontFamily: theme.fonts.body,
    fontSize: theme.fontSizes[14],
    color: theme.colors.foreground,
  } satisfies TextStyle,
}))
