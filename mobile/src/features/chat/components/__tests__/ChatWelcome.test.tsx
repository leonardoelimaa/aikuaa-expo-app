import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react-native'
import { ChatWelcome, SuggestionPrompt } from '../ChatWelcome'

describe('ChatWelcome', () => {
  it('renders title, subtitle and default suggestions', async () => {
    await render(<ChatWelcome onSuggestionPress={jest.fn()} />)

    expect(screen.getByTestId('chat-welcome')).toBeTruthy()
    expect(screen.getByTestId('chat-welcome-title').children[0]).toBe('Chat')
    expect(screen.getByTestId('chat-welcome-subtitle')).toBeTruthy()
    expect(screen.getByTestId('chat-suggestion-0')).toBeTruthy()
    expect(screen.getByTestId('chat-suggestion-1')).toBeTruthy()
    expect(screen.getByTestId('chat-suggestion-2')).toBeTruthy()
  })

  it('calls onSuggestionPress with the selected prompt', async () => {
    const handlePress = jest.fn()
    await render(<ChatWelcome onSuggestionPress={handlePress} />)

    fireEvent.press(screen.getByTestId('chat-suggestion-1'))

    expect(handlePress).toHaveBeenCalledTimes(1)
    const arg = handlePress.mock.calls[0][0] as SuggestionPrompt
    expect(arg.label).toBe('¿Qué quieres descubrir?')
  })

  it('renders custom suggestions when provided', async () => {
    const suggestions: SuggestionPrompt[] = [{ id: 'custom', label: 'Sugerencia personalizada' }]
    await render(<ChatWelcome suggestions={suggestions} onSuggestionPress={jest.fn()} />)

    expect(screen.getByText('Sugerencia personalizada')).toBeTruthy()
  })
})
