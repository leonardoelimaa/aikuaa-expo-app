import React from 'react'
import { render, screen } from '@testing-library/react-native'
import { useUnistyles } from 'react-native-unistyles'
import { ChatMessage } from '../ChatMessage'
import { mockCompanies } from '@/mocks/data/companies.mock'

const mockUseUnistyles = useUnistyles as jest.Mock

const flattenStyle = (style: unknown): Record<string, unknown> =>
  [style]
    .flat(Infinity)
    .reduce<Record<string, unknown>>(
      (acc, s) => (s ? { ...acc, ...(s as Record<string, unknown>) } : acc),
      {},
    )

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

  it('renders an assistant message with rich content', async () => {
    await render(
      <ChatMessage
        message={{
          id: 'msg-assistant-1',
          role: 'assistant',
          content: 'Hola de vuelta con **negrita**.',
          createdAt: '2026-01-01T00:00:00.000Z',
        }}
      />,
    )

    expect(screen.getByTestId('chat-message-assistant')).toBeTruthy()
    expect(screen.getByText('Hola de vuelta con')).toBeTruthy()
    expect(screen.getByText('negrita')).toBeTruthy()
  })

  it('renders an assistant message with sources, tools and structured response', async () => {
    await render(
      <ChatMessage
        message={{
          id: 'msg-assistant-2',
          role: 'assistant',
          content: 'Aquí tienes la empresa que buscabas.',
          createdAt: '2026-01-01T00:00:00.000Z',
        }}
        sources={[{ id: 'src-1', title: 'Base de empresas', url: 'https://aikuaa.example' }]}
        tools={[{ id: 't1', label: 'Busqué empresas', description: 'Revisé la base de datos.' }]}
        structuredResponse={{ type: 'company', company: mockCompanies[0] }}
      />,
    )

    expect(screen.getByTestId('chat-message-assistant')).toBeTruthy()
    expect(screen.getByText('Aquí tienes la empresa que buscabas.')).toBeTruthy()
    expect(screen.getByTestId('sources-citations')).toBeTruthy()
    expect(screen.getByTestId('tool-transparency')).toBeTruthy()
    expect(screen.getByTestId('structured-response-company')).toBeTruthy()
    expect(screen.getByText(mockCompanies[0].name)).toBeTruthy()
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

  it('uses a Reanimated entering animation on the message bubble', async () => {
    await render(
      <ChatMessage
        message={{
          id: 'msg-1',
          role: 'user',
          content: 'Hola',
          createdAt: '2026-01-01T00:00:00.000Z',
        }}
      />,
    )

    const bubble = screen.getByTestId('chat-message-bubble-user')
    expect(bubble).toBeTruthy()
    expect(bubble.props.entering).toBeDefined()
  })

  it('announces assistant and user messages with distinct accessibility labels', async () => {
    const { unmount } = await render(
      <ChatMessage
        message={{
          id: 'msg-user',
          role: 'user',
          content: 'Hola',
          createdAt: '2026-01-01T00:00:00.000Z',
        }}
      />,
    )

    expect(screen.getByLabelText('Tu mensaje')).toBeTruthy()
    await unmount()

    await render(
      <ChatMessage
        message={{
          id: 'msg-assistant',
          role: 'assistant',
          content: 'Hola',
          createdAt: '2026-01-01T00:00:00.000Z',
        }}
      />,
    )

    expect(screen.getByLabelText('Respuesta de Aikuaa')).toBeTruthy()
  })

  it('uses a wider bubble on phones and narrows it on tablet breakpoints', async () => {
    const { theme } = jest.requireActual('@/theme/theme')

    mockUseUnistyles.mockReturnValue({
      theme,
      breakpoint: 'sm',
      runtime: { themeName: 'light', breakpoint: 'sm' },
    })

    const { rerender, getByTestId } = await render(
      <ChatMessage
        message={{
          id: 'msg-1',
          role: 'user',
          content: 'Hola',
          createdAt: '2026-01-01T00:00:00.000Z',
        }}
      />,
    )

    const phoneStyle = flattenStyle(getByTestId('chat-message-bubble-user').props.style)
    expect(phoneStyle.maxWidth).toBe('80%')

    mockUseUnistyles.mockReturnValue({
      theme,
      breakpoint: 'md',
      runtime: { themeName: 'light', breakpoint: 'md' },
    })

    await rerender(
      <ChatMessage
        message={{
          id: 'msg-1',
          role: 'user',
          content: 'Hola',
          createdAt: '2026-01-01T00:00:00.000Z',
        }}
      />,
    )

    const tabletStyle = flattenStyle(getByTestId('chat-message-bubble-user').props.style)
    expect(tabletStyle.maxWidth).toBe('70%')
  })
})
