import { renderHook, act, waitFor } from '@testing-library/react-native'
import { useChat } from '../useChat'
import { getServices, resetServices, createMockServices } from '@/services/serviceRegistry'
import { AIChunk } from '@/services/types'

jest.mock('@/services/serviceRegistry', () => ({
  ...jest.requireActual('@/services/serviceRegistry'),
  getServices: jest.fn(),
}))

const mockedGetServices = jest.mocked(getServices)

describe('useChat', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    resetServices()
    mockedGetServices.mockReturnValue(createMockServices())
  })

  it('starts with an empty idle state', async () => {
    const { result } = await renderHook(() => useChat())

    expect(result.current.state.messages).toEqual([])
    expect(result.current.state.status).toBe('idle')
    expect(result.current.state.error).toBeNull()
  })

  it('does nothing when sending empty or whitespace text', async () => {
    const services = createMockServices()
    mockedGetServices.mockReturnValue(services)
    const streamSpy = jest.spyOn(services.ai, 'streamMessage')

    const { result } = await renderHook(() => useChat())

    await act(async () => {
      await result.current.sendMessage('   ')
    })

    expect(streamSpy).not.toHaveBeenCalled()
    expect(result.current.state.messages).toEqual([])
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

    const { result } = await renderHook(() => useChat())

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

    const { result } = await renderHook(() => useChat())

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

    const { result } = await renderHook(() => useChat())

    await act(async () => {
      await result.current.sendMessage('error')
    })

    await waitFor(() => {
      expect(result.current.state.error).toEqual({ code: 'AI_ERROR', message: 'Error simulado' })
      expect(result.current.state.status).toBe('idle')
      expect(result.current.state.streamingMessageId).toBeNull()
    })
  })

  it('resets the stream for no-answer responses', async () => {
    const chunks: AIChunk[] = [{ type: 'done' }]

    const services = createMockServices()
    mockedGetServices.mockReturnValue(services)
    jest.spyOn(services.ai, 'streamMessage').mockImplementation(async function* () {
      for (const chunk of chunks) {
        yield chunk
      }
    })

    const { result } = await renderHook(() => useChat())

    await act(async () => {
      await result.current.sendMessage('no se')
    })

    await waitFor(() => {
      expect(result.current.state.messages).toHaveLength(1)
      expect(result.current.state.streamingMessageId).toBeNull()
      expect(result.current.state.status).toBe('idle')
    })
  })
})
