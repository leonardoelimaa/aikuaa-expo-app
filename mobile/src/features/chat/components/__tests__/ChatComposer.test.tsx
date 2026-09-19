import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react-native'
import { ChatComposer } from '../ChatComposer'

describe('ChatComposer', () => {
  it('renders input and disabled send button when empty', async () => {
    await render(<ChatComposer value="" onChangeText={jest.fn()} onSend={jest.fn()} />)

    expect(screen.getByTestId('chat-composer-input')).toBeTruthy()
    const sendButton = screen.getByTestId('chat-composer-send')
    expect(sendButton).toBeTruthy()
    expect(sendButton.props.accessibilityState.disabled).toBe(true)
  })

  it('enables send button when input has non-whitespace text', async () => {
    const { rerender } = await render(
      <ChatComposer value="" onChangeText={jest.fn()} onSend={jest.fn()} />,
    )

    expect(screen.getByTestId('chat-composer-send').props.accessibilityState.disabled).toBe(true)

    await rerender(<ChatComposer value="Hola" onChangeText={jest.fn()} onSend={jest.fn()} />)

    expect(screen.getByTestId('chat-composer-send').props.accessibilityState.disabled).toBe(false)
  })

  it('calls onSend with trimmed text when send button is pressed', async () => {
    const handleSend = jest.fn()
    await render(
      <ChatComposer value="  Hola mundo  " onChangeText={jest.fn()} onSend={handleSend} />,
    )

    fireEvent.press(screen.getByTestId('chat-composer-send'))

    expect(handleSend).toHaveBeenCalledTimes(1)
    expect(handleSend).toHaveBeenCalledWith('Hola mundo')
  })

  it('does not call onSend when button is disabled', async () => {
    const handleSend = jest.fn()
    await render(<ChatComposer value="   " onChangeText={jest.fn()} onSend={handleSend} />)

    fireEvent.press(screen.getByTestId('chat-composer-send'))

    expect(handleSend).not.toHaveBeenCalled()
  })

  it('calls onSend on native submit', async () => {
    const handleSend = jest.fn()
    await render(<ChatComposer value="Hola" onChangeText={jest.fn()} onSend={handleSend} />)

    fireEvent(screen.getByTestId('chat-composer-input'), 'submitEditing')

    expect(handleSend).toHaveBeenCalledWith('Hola')
  })

  it('exposes touch targets of at least 44 dp', async () => {
    await render(<ChatComposer value="Hola" onChangeText={jest.fn()} onSend={jest.fn()} />)

    const input = screen.getByTestId('chat-composer-input')
    const sendButton = screen.getByTestId('chat-composer-send')

    const flattenStyle = (style: unknown): Record<string, unknown> =>
      [style]
        .flat(Infinity)
        .reduce<Record<string, unknown>>(
          (acc, s) => (s ? { ...acc, ...(s as Record<string, unknown>) } : acc),
          {},
        )

    const inputStyle = flattenStyle(input.props.style)
    const sendStyle = flattenStyle(sendButton.props.style)

    expect(Number(inputStyle.minHeight)).toBeGreaterThanOrEqual(44)
    expect(Number(sendStyle.width)).toBeGreaterThanOrEqual(44)
    expect(Number(sendStyle.height)).toBeGreaterThanOrEqual(44)
  })
})
