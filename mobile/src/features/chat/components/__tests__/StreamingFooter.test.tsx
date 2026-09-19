import React from 'react'
import { render, screen } from '@testing-library/react-native'
import { StreamingFooter } from '../StreamingFooter'

describe('StreamingFooter', () => {
  it('returns null when there is no streaming message id', async () => {
    await render(
      <StreamingFooter streamingMessageId={null} streamingContent="" isThinking={false} />,
    )

    expect(screen.queryByTestId('chat-streaming-message')).toBeNull()
  })

  it('renders a streaming message when content is present', async () => {
    await render(
      <StreamingFooter
        streamingMessageId="stream-1"
        streamingContent="Escribiendo..."
        isThinking={false}
      />,
    )

    expect(screen.getByTestId('chat-streaming-message')).toBeTruthy()
    expect(screen.getByTestId('chat-message-streaming')).toBeTruthy()
    expect(screen.getByText('Escribiendo...')).toBeTruthy()
  })

  it('renders the thinking indicator while thinking and there is no content', async () => {
    await render(
      <StreamingFooter streamingMessageId="stream-1" streamingContent="" isThinking={true} />,
    )

    expect(screen.getByTestId('chat-thinking')).toBeTruthy()
  })

  it('renders the loading state when streaming is active but there is no content nor thinking', async () => {
    await render(
      <StreamingFooter streamingMessageId="stream-1" streamingContent="" isThinking={false} />,
    )

    expect(screen.getByTestId('chat-loading-state')).toBeTruthy()
  })
})
