import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react-native'
import { EmptyState } from '../EmptyState'
import { SuggestionPrompt } from '../../ChatWelcome'

describe('EmptyState', () => {
  it('renders empty-state copy and suggestions', async () => {
    await render(<EmptyState onSuggestionPress={jest.fn()} />)

    expect(screen.getByTestId('chat-empty-state')).toBeTruthy()
    expect(screen.getByTestId('chat-welcome-title').children[0]).toBe('¿Qué quieres descubrir?')
    expect(screen.getByText('Pregunta lo que necesites sobre el evento.')).toBeTruthy()
    expect(screen.getByTestId('chat-suggestion-0')).toBeTruthy()
    expect(screen.getByTestId('chat-suggestion-1')).toBeTruthy()
    expect(screen.getByTestId('chat-suggestion-2')).toBeTruthy()
  })

  it('calls onSuggestionPress with the selected prompt', async () => {
    const handlePress = jest.fn()
    await render(<EmptyState onSuggestionPress={handlePress} />)

    fireEvent.press(screen.getByTestId('chat-suggestion-1'))

    expect(handlePress).toHaveBeenCalledTimes(1)
    const arg = handlePress.mock.calls[0][0] as SuggestionPrompt
    expect(arg.label).toBe('¿Qué quieres descubrir?')
  })
})
