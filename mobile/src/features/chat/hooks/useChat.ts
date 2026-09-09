import { useCallback, useEffect, useMemo, useRef, useReducer } from 'react'
import { getServices } from '@/services/serviceRegistry'
import { AIChunk } from '@/services/types'
import { ChatState, initialChatState } from '../types'
import { chatReducer } from '../state/chatReducer'

const BATCH_FLUSH_MS = 60

export interface UseChatOptions {
  offline?: boolean
}

export interface UseChatReturn {
  state: ChatState
  sendMessage: (content: string) => Promise<void>
  reset: () => void
}

export function useChat(options: UseChatOptions = {}): UseChatReturn {
  const { offline = false } = options
  const [state, dispatch] = useReducer(chatReducer, initialChatState)
  const bufferRef = useRef('')
  const flushIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const abortRef = useRef(false)

  const flushBuffer = useCallback(() => {
    if (bufferRef.current === '') return
    const payload = bufferRef.current
    bufferRef.current = ''
    dispatch({ type: 'appendStreaming', payload })
  }, [])

  const startBatching = useCallback(() => {
    if (flushIntervalRef.current) return
    flushIntervalRef.current = setInterval(() => {
      flushBuffer()
    }, BATCH_FLUSH_MS)
  }, [flushBuffer])

  const stopBatching = useCallback(() => {
    if (flushIntervalRef.current) {
      clearInterval(flushIntervalRef.current)
      flushIntervalRef.current = null
    }
  }, [])

  const reset = useCallback(() => {
    abortRef.current = true
    stopBatching()
    bufferRef.current = ''
    dispatch({ type: 'resetStream' })
  }, [stopBatching])

  const sendMessage = useCallback(
    async (content: string) => {
      const trimmed = content.trim()
      if (trimmed === '') return

      abortRef.current = false
      const createdAt = new Date().toISOString()
      dispatch({ type: 'sendMessage', payload: { content: trimmed, createdAt } })

      let sawThinking = false
      let sawText = false

      try {
        const stream = getServices().ai.streamMessage({ message: trimmed, offline })

        for await (const chunk of stream) {
          if (abortRef.current) break
          handleChunk(chunk)
        }

        if (abortRef.current) return

        flushBuffer()
        stopBatching()

        if (!sawText && !sawThinking) {
          dispatch({ type: 'resetStream' })
        } else {
          dispatch({ type: 'completeStreaming', payload: { createdAt: new Date().toISOString() } })
        }
      } catch (error) {
        flushBuffer()
        stopBatching()
        dispatch({
          type: 'setError',
          payload: {
            code: 'STREAM_ERROR',
            message: error instanceof Error ? error.message : 'Error desconocido.',
          },
        })
        dispatch({ type: 'resetStream' })
      }

      function handleChunk(chunk: AIChunk) {
        switch (chunk.type) {
          case 'thinking':
            sawThinking = true
            dispatch({ type: 'setThinking', payload: true })
            break
          case 'text':
            sawText = true
            bufferRef.current += chunk.content
            startBatching()
            break
          case 'error':
            flushBuffer()
            stopBatching()
            dispatch({ type: 'setError', payload: { code: chunk.code, message: chunk.message } })
            dispatch({ type: 'resetStream' })
            break
          case 'done':
            break
          case 'companies':
          default:
            break
        }
      }
    },
    [offline, flushBuffer, startBatching, stopBatching],
  )

  useEffect(() => {
    return () => {
      abortRef.current = true
      stopBatching()
    }
  }, [stopBatching])

  return useMemo(
    () => ({
      state,
      sendMessage,
      reset,
    }),
    [state, sendMessage, reset],
  )
}
