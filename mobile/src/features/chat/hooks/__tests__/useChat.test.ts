import { renderHook, act, waitFor } from '@testing-library/react-native'
import React from 'react'
import { AppContextProvider, useAppContext } from '@/context/AppContext'
import { useChat, type UseChatOptions } from '../useChat'
import { getServices, resetServices, createMockServices } from '@/services/serviceRegistry'
import { AIChunk } from '@/services/types'

jest.mock('@/services/serviceRegistry', () => ({
  ...jest.requireActual('@/services/serviceRegistry'),
  getServices: jest.fn(),
}))

const mockedGetServices = jest.mocked(getServices)

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

async function renderDemoChat(options: UseChatOptions = {}) {
  const hook = await renderHook(
    () => ({
      ...useChat(options),
      app: useAppContext(),
    }),
    {
      wrapper: ({ children }) => React.createElement(AppContextProvider, null, children),
    },
  )

  await act(async () => {
    await hook.result.current.app.enterDemo()
  })

  return hook
}

describe('useChat', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    resetServices()
    mockedGetServices.mockReturnValue(createMockServices())
  })

  it('starts with an empty idle state', async () => {
    const { result } = await renderDemoChat()

    expect(result.current.state.messages).toEqual([])
    expect(result.current.state.status).toBe('idle')
    expect(result.current.state.error).toBeNull()
  })

  it('does nothing when sending empty or whitespace text', async () => {
    const services = createMockServices()
    mockedGetServices.mockReturnValue(services)
    const streamSpy = jest.spyOn(services.ai, 'streamMessage')

    const { result } = await renderDemoChat()

    await act(async () => {
      await result.current.sendMessage('   ')
    })

    expect(streamSpy).not.toHaveBeenCalled()
    expect(result.current.state.messages).toEqual([])
  })

  it('tracks a message_sent analytics event when a message is sent', async () => {
    const chunks: AIChunk[] = [{ type: 'text', content: 'Hola' }, { type: 'done' }]

    const services = createMockServices()
    mockedGetServices.mockReturnValue(services)
    const trackSpy = jest.spyOn(services.analytics, 'track')
    jest.spyOn(services.ai, 'streamMessage').mockImplementation(async function* () {
      for (const chunk of chunks) {
        yield chunk
      }
    })

    const { result } = await renderDemoChat()

    await act(async () => {
      await result.current.sendMessage('hola')
    })

    expect(trackSpy).toHaveBeenCalledTimes(1)
    expect(trackSpy).toHaveBeenCalledWith(
      'message_sent',
      expect.objectContaining({
        offline: false,
        messageLength: 4,
      }),
    )
  })

  it('streams text chunks into a progressive assistant message', async () => {
    const chunks: AIChunk[] = [
      { type: 'text', content: 'Hola' },
      { type: 'text', content: ' ' },
      { type: 'text', content: 'mundo' },
    ]

    const services = createMockServices()
    mockedGetServices.mockReturnValue(services)
    jest.spyOn(services.ai, 'streamMessage').mockImplementation(async function* () {
      for (const chunk of chunks) {
        await new Promise((resolve) => setTimeout(resolve, 30))
        yield chunk
      }
      await new Promise((resolve) => setTimeout(resolve, 150))
      yield { type: 'done' }
    })

    const { result } = await renderDemoChat()

    await act(async () => {
      result.current.sendMessage('hola')
    })

    await waitFor(
      () => {
        expect(result.current.state.streamingContent).toBe('Hola mundo')
        expect(result.current.state.status).toBe('streaming')
      },
      { timeout: 500 },
    )

    await waitFor(
      () => {
        expect(result.current.state.messages).toHaveLength(2)
        expect(result.current.state.messages[1].role).toBe('assistant')
        expect(result.current.state.messages[1].content).toBe('Hola mundo')
        expect(result.current.state.status).toBe('idle')
      },
      { timeout: 500 },
    )
  })

  it('shows thinking state while streaming thinking chunks', async () => {
    const services = createMockServices()
    mockedGetServices.mockReturnValue(services)
    jest.spyOn(services.ai, 'streamMessage').mockImplementation(async function* () {
      yield { type: 'thinking', content: 'Analizando...' }
      await new Promise((resolve) => setTimeout(resolve, 30))
      yield { type: 'text', content: 'Listo' }
      yield { type: 'done' }
    })

    const { result } = await renderDemoChat()

    await act(async () => {
      result.current.sendMessage('pensando')
    })

    await waitFor(
      () => {
        expect(result.current.state.isThinking).toBe(true)
      },
      { timeout: 500 },
    )

    await waitFor(
      () => {
        expect(result.current.state.isThinking).toBe(false)
        expect(result.current.state.messages).toHaveLength(2)
        expect(result.current.state.messages[1].content).toBe('Listo')
      },
      { timeout: 500 },
    )
  })

  it('sets an error when the stream emits an error chunk', async () => {
    const chunks: AIChunk[] = [{ type: 'error', code: 'AI_ERROR', message: 'Error simulado' }]

    const services = createMockServices()
    mockedGetServices.mockReturnValue(services)
    jest.spyOn(services.ai, 'streamMessage').mockImplementation(async function* () {
      for (const chunk of chunks) {
        yield chunk
      }
    })

    const { result } = await renderDemoChat()

    await act(async () => {
      await result.current.sendMessage('error')
    })

    await waitFor(() => {
      expect(result.current.state.error).toEqual({ code: 'AI_ERROR', message: 'Error simulado' })
      expect(result.current.state.status).toBe('idle')
      expect(result.current.state.streamingMessageId).toBeNull()
    })
  })

  it('sets a NO_ANSWER error for no-answer responses', async () => {
    const chunks: AIChunk[] = [{ type: 'done' }]

    const services = createMockServices()
    mockedGetServices.mockReturnValue(services)
    jest.spyOn(services.ai, 'streamMessage').mockImplementation(async function* () {
      for (const chunk of chunks) {
        yield chunk
      }
    })

    const { result } = await renderDemoChat()

    await act(async () => {
      await result.current.sendMessage('no se')
    })

    await waitFor(() => {
      expect(result.current.state.messages).toHaveLength(1)
      expect(result.current.state.streamingMessageId).toBeNull()
      expect(result.current.state.status).toBe('idle')
      expect(result.current.state.error).toEqual({
        code: 'NO_ANSWER',
        message: 'A resposta não retornou conteúdo.',
      })
    })
  })

  it('retries the last user message after a loading failure', async () => {
    const services = createMockServices()
    mockedGetServices.mockReturnValue(services)

    let attempt = 0
    jest.spyOn(services.ai, 'streamMessage').mockImplementation(async function* () {
      attempt += 1
      if (attempt === 1) {
        yield { type: 'thinking', content: 'Analizando...' }
        await delay(30)
        yield { type: 'error', code: 'TIMEOUT', message: 'Timeout' }
        return
      }
      yield { type: 'thinking', content: 'Analizando...' }
      await delay(30)
      yield { type: 'text', content: 'Respuesta tras reintento' }
      yield { type: 'done' }
    })

    const { result } = await renderDemoChat()

    await act(async () => {
      await result.current.sendMessage('hola')
    })

    await waitFor(() => {
      expect(result.current.state.error).toEqual({ code: 'TIMEOUT', message: 'Timeout' })
      expect(result.current.state.status).toBe('idle')
      expect(result.current.state.messages).toHaveLength(1)
    })

    await act(async () => {
      await result.current.retryLastMessage()
    })

    await waitFor(() => {
      expect(result.current.state.error).toBeNull()
      expect(result.current.state.messages).toHaveLength(2)
      expect(result.current.state.messages[1].role).toBe('assistant')
      expect(result.current.state.messages[1].content).toBe('Respuesta tras reintento')
      expect(result.current.state.status).toBe('idle')
    })
  })

  it('sets a TIMEOUT error for the timeout keyword', async () => {
    const { result } = await renderDemoChat()

    await act(async () => {
      await result.current.sendMessage('timeout')
    })

    await waitFor(() => {
      expect(result.current.state.error).toEqual({
        code: 'TIMEOUT',
        message: 'O servidor demorou demais para responder.',
      })
    })
  })

  it('sets a BACKEND_DOWN error for the backend keyword', async () => {
    const { result } = await renderDemoChat()

    await act(async () => {
      await result.current.sendMessage('backend down')
    })

    await waitFor(() => {
      expect(result.current.state.error).toEqual({
        code: 'BACKEND_DOWN',
        message: 'Não foi possível conectar ao servidor.',
      })
    })
  })
})
