import React, { useRef, useEffect, useCallback } from 'react'
import { View, type ViewStyle } from 'react-native'
import { FlashList, FlashListRef, ListRenderItem } from '@shopify/flash-list'
import { StyleSheet } from 'react-native-unistyles'
import { ChatMessage as ChatMessageType } from '../types'
import { ChatMessage } from './ChatMessage'
import { ErrorState } from './states'
import { StreamingFooter } from './StreamingFooter'

export interface ChatMessageListProps {
  messages: ChatMessageType[]
  streamingMessageId: string | null
  streamingContent: string
  isThinking: boolean
  error: { code: string; message: string } | null
  offline?: boolean
  onRetry?: () => void
  ListHeaderComponent?: React.ReactElement | null
}

export const ChatMessageList: React.FC<ChatMessageListProps> = ({
  messages,
  streamingMessageId,
  streamingContent,
  isThinking,
  error,
  offline = false,
  onRetry,
  ListHeaderComponent,
}) => {
  const listRef = useRef<FlashListRef<ChatMessageType>>(null)
  const contentHeight = useRef(0)

  useEffect(() => {
    if (messages.length > 0) {
      listRef.current?.scrollToEnd({ animated: true })
    }
  }, [messages.length, streamingMessageId, isThinking])

  const handleContentSizeChange = useCallback(
    (_width: number, height: number) => {
      if (height > contentHeight.current && messages.length > 0) {
        listRef.current?.scrollToEnd({ animated: true })
      }
      contentHeight.current = height
    },
    [messages.length],
  )

  const renderItem: ListRenderItem<ChatMessageType> = ({ item }) => (
    <ChatMessage message={item} testID={`chat-message-${item.id}`} />
  )

  const keyExtractor = (item: ChatMessageType) => item.id

  const getItemType = (item: ChatMessageType) => item.role

  const showError = error && !(offline && error.code === 'OFFLINE')

  return (
    <View style={styles.container} testID="chat-message-list">
      <FlashList
        ref={listRef}
        data={messages}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        getItemType={getItemType}
        ListHeaderComponent={ListHeaderComponent ?? undefined}
        ListFooterComponent={
          <StreamingFooter
            streamingMessageId={streamingMessageId}
            streamingContent={streamingContent}
            isThinking={isThinking}
          />
        }
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        onContentSizeChange={handleContentSizeChange}
        accessibilityRole="list"
        accessibilityLabel="Mensajes de la conversación"
        testID="flash-list"
      />
      {showError ? (
        <ErrorState
          code={error.code}
          message={error.message}
          onRetry={onRetry}
          testID="chat-error-banner"
        />
      ) : null}
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
}))
