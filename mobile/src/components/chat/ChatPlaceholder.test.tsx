import React from 'react'
import { render, screen } from '@testing-library/react-native'
import { ChatPlaceholder } from './ChatPlaceholder'

jest.mock('react-native-safe-area-context', () => {
  const React = require('react')
  const { View } = require('react-native')

  return {
    SafeAreaProvider: ({ children }: { children: React.ReactNode }) => <View>{children}</View>,
    SafeAreaView: ({ children, ...props }: { children: React.ReactNode }) => (
      <View {...props}>{children}</View>
    ),
    useSafeAreaInsets: () => ({ top: 0, bottom: 34, left: 0, right: 0 }),
  }
})

describe('ChatPlaceholder', () => {
  it('renders inside a SafeAreaView and KeyboardAvoidingView', async () => {
    await render(<ChatPlaceholder />)

    expect(screen.getByTestId('chat-safe-area')).toBeTruthy()
    expect(screen.getByTestId('chat-keyboard-avoider')).toBeTruthy()
  })

  it('shows the placeholder copy and a message input', async () => {
    await render(<ChatPlaceholder />)

    expect(screen.getByText('Chat')).toBeTruthy()
    expect(screen.getByText('Las conversaciones llegarán en una próxima entrega.')).toBeTruthy()
    expect(screen.getByLabelText('Campo de mensaje')).toBeTruthy()
  })
})
