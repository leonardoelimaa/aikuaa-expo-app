import React from 'react'
import { View, Text } from 'react-native'
import { render, screen } from '@testing-library/react-native'
import { ChatMessageList } from '../ChatMessageList'
import { ChatMessage } from '../../types'

describe('ChatMessageList', () => {
  const messages: ChatMessage[] = [
    {
      id: 'msg-1',
      role: 'user',
      content: 'Hola',
      createdAt: '2026-01-01T00:00:00.000Z',
    },
    {
      id: 'msg-2',
      role: 'assistant',
      content: '¡Hola!',
      createdAt: '2026-01-01T00:00:01.000Z',
    },
  ]

  it('renders the list and all messages', async () => {
    await render(
      <ChatMessageList
        messages={messages}
        streamingMessageId={null}
        streamingContent=""
        isThinking={false}
        error={null}
      />,
    )

    expect(screen.getByTestId('chat-message-list')).toBeTruthy()
    expect(screen.getByTestId('chat-message-msg-1')).toBeTruthy()
    expect(screen.getByTestId('chat-message-msg-2')).toBeTruthy()
  })

  it('renders a streaming message when active', async () => {
    await render(
      <ChatMessageList
        messages={messages}
        streamingMessageId="stream-1"
        streamingContent="Escribiendo..."
        isThinking={false}
        error={null}
      />,
    )

    expect(screen.getByTestId('chat-message-streaming')).toBeTruthy()
    expect(screen.getByText('Escribiendo...')).toBeTruthy()
  })

  it('renders thinking indicator during thinking state', async () => {
    await render(
      <ChatMessageList
        messages={messages}
        streamingMessageId="stream-1"
        streamingContent=""
        isThinking={true}
        error={null}
      />,
    )

    expect(screen.getByTestId('chat-thinking')).toBeTruthy()
  })

  it('renders error banner when error is present', async () => {
    await render(
      <ChatMessageList
        messages={messages}
        streamingMessageId={null}
        streamingContent=""
        isThinking={false}
        error={{ code: 'AI_ERROR', message: 'Error simulado' }}
      />,
    )

    expect(screen.getByTestId('chat-error-banner')).toBeTruthy()
    expect(screen.getByText('Error simulado')).toBeTruthy()
  })

  it('renders ListHeaderComponent', async () => {
    await render(
      <ChatMessageList
        messages={[]}
        streamingMessageId={null}
        streamingContent=""
        isThinking={false}
        error={null}
        ListHeaderComponent={
          <View testID="custom-header">
            <Text>Welcome</Text>
          </View>
        }
      />,
    )

    expect(screen.getByTestId('custom-header')).toBeTruthy()
  })
})
