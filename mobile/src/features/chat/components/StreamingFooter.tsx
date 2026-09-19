import React from 'react'
import { View } from 'react-native'
import { ChatMessage } from './ChatMessage'
import { ChatThinking } from './ChatThinking'
import { LoadingState } from './states'

export interface StreamingFooterProps {
  streamingMessageId: string | null
  streamingContent: string
  isThinking: boolean
}

export const StreamingFooter: React.FC<StreamingFooterProps> = ({
  streamingMessageId,
  streamingContent,
  isThinking,
}) => {
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
      {!isThinking && streamingContent === '' && <LoadingState />}
    </View>
  )
}
