import React from 'react'
import { render, screen } from '@testing-library/react-native'
import { ChatMessage } from '../ChatMessage'

describe('ChatMessage', () => {
  it('renders a user message with distinct style', async () => {
    await render(
      <ChatMessage
        message={{
          id: 'msg-user-1',
          role: 'user',
          content: 'Hola',
          createdAt: '2026-01-01T00:00:00.000Z',
        }}
      />,
    )

    expect(screen.getByTestId('chat-message-user')).toBeTruthy()
    expect(screen.getByText('Hola')).toBeTruthy()
  })

  it('renders an assistant message with distinct testID', async () => {
    await render(
      <ChatMessage
        message={{
          id: 'msg-assistant-1',
          role: 'assistant',
          content: 'Hola de vuelta',
          createdAt: '2026-01-01T00:00:00.000Z',
        }}
      />,
    )

    expect(screen.getByTestId('chat-message-assistant')).toBeTruthy()
    expect(screen.getByText('Hola de vuelta')).toBeTruthy()
  })

  it('uses provided testID override', async () => {
    await render(
      <ChatMessage
        message={{
          id: 'msg-1',
          role: 'assistant',
          content: 'Texto',
          createdAt: '2026-01-01T00:00:00.000Z',
        }}
        testID="custom-message"
      />,
    )

    expect(screen.getByTestId('custom-message')).toBeTruthy()
  })
})
