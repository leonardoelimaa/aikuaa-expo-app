import { chatReducer } from '../chatReducer'
import { initialChatState, ChatState } from '../../types'

describe('chatReducer', () => {
  const baseState: ChatState = {
    ...initialChatState,
    messages: [
      {
        id: 'msg-1',
        role: 'assistant',
        content: 'Hola',
        createdAt: '2026-01-01T00:00:00.000Z',
      },
    ],
  }

  it('sendMessage appends a user message and enters streaming state', () => {
    const next = chatReducer(baseState, {
      type: 'sendMessage',
      payload: { content: '¿Qué empresas están aquí?', createdAt: '2026-01-01T00:00:01.000Z' },
    })

    expect(next.messages).toHaveLength(2)
    expect(next.messages[1].role).toBe('user')
    expect(next.messages[1].content).toBe('¿Qué empresas están aquí?')
    expect(next.status).toBe('streaming')
    expect(next.streamingMessageId).not.toBeNull()
    expect(next.error).toBeNull()
  })

  it('setThinking toggles the thinking flag', () => {
    const next = chatReducer(baseState, { type: 'setThinking', payload: true })
    expect(next.isThinking).toBe(true)

    const off = chatReducer(next, { type: 'setThinking', payload: false })
    expect(off.isThinking).toBe(false)
  })

  it('appendStreaming accumulates text in the streaming buffer', () => {
    const streaming: ChatState = {
      ...baseState,
      streamingMessageId: 'stream-1',
      streamingContent: 'Hola',
    }

    const next = chatReducer(streaming, { type: 'appendStreaming', payload: ' mundo' })
    expect(next.streamingContent).toBe('Hola mundo')
  })

  it('completeStreaming flushes the streaming message into messages and clears streaming state', () => {
    const streaming: ChatState = {
      ...baseState,
      streamingMessageId: 'stream-1',
      streamingContent: 'Respuesta final',
      isThinking: true,
      status: 'streaming',
    }

    const next = chatReducer(streaming, {
      type: 'completeStreaming',
      payload: { createdAt: '2026-01-01T00:00:02.000Z' },
    })

    expect(next.messages).toHaveLength(2)
    expect(next.messages[1].role).toBe('assistant')
    expect(next.messages[1].content).toBe('Respuesta final')
    expect(next.streamingMessageId).toBeNull()
    expect(next.streamingContent).toBe('')
    expect(next.isThinking).toBe(false)
    expect(next.status).toBe('idle')
  })

  it('completeStreaming is a no-op when there is no streaming message', () => {
    const next = chatReducer(baseState, {
      type: 'completeStreaming',
      payload: { createdAt: '2026-01-01T00:00:02.000Z' },
    })

    expect(next).toEqual(baseState)
  })

  it('setError records the error and stops streaming', () => {
    const streaming: ChatState = {
      ...baseState,
      status: 'streaming',
      isThinking: true,
    }

    const next = chatReducer(streaming, {
      type: 'setError',
      payload: { code: 'AI_ERROR', message: 'Error simulado' },
    })

    expect(next.error).toEqual({ code: 'AI_ERROR', message: 'Error simulado' })
    expect(next.status).toBe('idle')
    expect(next.isThinking).toBe(false)
  })

  it('resetStream clears streaming state without adding a message', () => {
    const streaming: ChatState = {
      ...baseState,
      streamingMessageId: 'stream-1',
      streamingContent: 'Parcial',
      isThinking: true,
      status: 'streaming',
    }

    const next = chatReducer(streaming, { type: 'resetStream' })

    expect(next.messages).toHaveLength(1)
    expect(next.streamingMessageId).toBeNull()
    expect(next.streamingContent).toBe('')
    expect(next.isThinking).toBe(false)
    expect(next.status).toBe('idle')
  })
})
