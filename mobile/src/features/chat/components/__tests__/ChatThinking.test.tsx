import React from 'react'
import { render, screen } from '@testing-library/react-native'
import { ChatThinking } from '../ChatThinking'

describe('ChatThinking', () => {
  it('renders the thinking indicator with label', async () => {
    await render(<ChatThinking />)

    expect(screen.getByTestId('chat-thinking')).toBeTruthy()
    expect(screen.getByText('Aikuaa está analizando')).toBeTruthy()
  })
})
