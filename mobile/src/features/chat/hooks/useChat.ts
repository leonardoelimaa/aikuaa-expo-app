import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react'
import { useAppContext } from '@/context/AppContext'
import { getServices } from '@/services/serviceRegistry'
import type { AIChunk, Conversation, Message } from '@/services/types'
import { asConversationId, type ConversationId } from '@/types/app'
import { chatReducer } from '../state/chatReducer'
import { initialChatState } from '../types'

export interface UseChatOptions {
  offline?: boolean
}
let conversationSequence = 0

export function useChat(options: UseChatOptions = {}) {
  const { context, revision } = useAppContext()
  const [state, dispatch] = useReducer(chatReducer, initialChatState)
  const tokenRef = useRef(0)
  const controllerRef = useRef<AbortController | null>(null)
  const [conversationId] = useState<ConversationId>(() =>
    asConversationId(`conversation-${++conversationSequence}`),
  )
  const incarnation = `${context?.workspaceId ?? 'unresolved'}:${revision}`
  const incarnationRef = useRef(incarnation)

  const invalidate = useCallback(() => {
    tokenRef.current += 1
    controllerRef.current?.abort()
    controllerRef.current = null
  }, [])

  useEffect(() => {
    invalidate()
    incarnationRef.current = incarnation
    dispatch({ type: 'reset' })
    return invalidate
  }, [incarnation, invalidate])

  const persist = useCallback(
    async (
      requestToken: number,
      requestIncarnation: string,
      conversationId: ConversationId,
      userContent: string,
      assistantContent: string,
      signal: AbortSignal,
    ) => {
      if (
        !context ||
        tokenRef.current !== requestToken ||
        incarnationRef.current !== requestIncarnation
      )
        return
      const service = getServices().conversation
      let conversation = await service.getConversation(context.workspaceId, conversationId)
      if (tokenRef.current !== requestToken || incarnationRef.current !== requestIncarnation) return
      if (!conversation) {
        conversation = await service.createConversation(
          context.workspaceId,
          {
            id: conversationId,
            title: userContent.slice(0, 60) || 'Nova conversa',
          },
          { signal },
        )
      }
      if (tokenRef.current !== requestToken || incarnationRef.current !== requestIncarnation) return
      const now = new Date().toISOString()
      const appended: Message[] = [
        ...conversation.messages,
        {
          id: `${conversationId}-user-${requestToken}`,
          role: 'user',
          content: userContent,
          createdAt: now,
        },
        {
          id: `${conversationId}-assistant-${requestToken}`,
          role: 'assistant',
          content: assistantContent,
          createdAt: now,
        },
      ]
      const updated: Conversation = {
        ...conversation,
        workspaceId: context.workspaceId,
        messages: appended,
      }
      await service.saveConversation(context.workspaceId, updated, { signal })
    },
    [context],
  )

  const streamContent = useCallback(
    async (content: string) => {
      if (!context) throw new Error('Select a workspace before sending a message.')
      invalidate()
      const requestToken = ++tokenRef.current
      const requestIncarnation = incarnation
      const requestContext = { ...context }
      const controller = new AbortController()
      controllerRef.current = controller
      const isCurrent = () =>
        tokenRef.current === requestToken &&
        incarnationRef.current === requestIncarnation &&
        !controller.signal.aborted
      let assistantContent = ''
      let terminalError = false

      try {
        await getServices().analytics.track('message_sent', {
          offline: options.offline ?? false,
          messageLength: content.length,
          workspaceId: requestContext.workspaceId,
          conversationId,
        })
        if (!isCurrent()) return
        for await (const chunk of getServices().ai.streamMessage({
          message: content,
          conversationId,
          context: requestContext,
          offline: options.offline,
          signal: controller.signal,
        })) {
          if (!isCurrent()) return
          const guardedChunk: AIChunk = chunk
          if (guardedChunk.type === 'thinking') dispatch({ type: 'setThinking', payload: true })
          if (guardedChunk.type === 'text') {
            assistantContent += guardedChunk.content
            if (!isCurrent()) return
            dispatch({ type: 'appendStreaming', payload: guardedChunk.content })
          }
          if (guardedChunk.type === 'companies') {
            const contentChunk = guardedChunk.companies.map((company) => company.name).join(', ')
            if (contentChunk) {
              assistantContent += contentChunk
              if (!isCurrent()) return
              dispatch({ type: 'appendStreaming', payload: contentChunk })
            }
          }
          if (guardedChunk.type === 'error') {
            terminalError = true
            if (!isCurrent()) return
            dispatch({
              type: 'setError',
              payload: { code: guardedChunk.code, message: guardedChunk.message },
            })
            return
          }
        }
        if (!isCurrent()) return
        if (!assistantContent) {
          dispatch({
            type: 'setError',
            payload: { code: 'NO_ANSWER', message: 'A resposta não retornou conteúdo.' },
          })
          return
        }
        dispatch({ type: 'completeStreaming', payload: { createdAt: new Date().toISOString() } })
        if (!isCurrent()) return
        await persist(
          requestToken,
          requestIncarnation,
          conversationId,
          content,
          assistantContent,
          controller.signal,
        )
      } catch (error) {
        if (!isCurrent() || (error instanceof Error && error.name === 'AbortError')) return
        dispatch({
          type: 'setError',
          payload: {
            code: 'STREAM_ERROR',
            message:
              error instanceof Error ? error.message : 'Não foi possível concluir a solicitação.',
          },
        })
      } finally {
        if (isCurrent() && !terminalError) controllerRef.current = null
      }
    },
    [context, conversationId, incarnation, invalidate, options.offline, persist],
  )

  const sendMessage = useCallback(
    async (content: string) => {
      const normalized = content.trim()
      if (!normalized) return
      dispatch({
        type: 'sendMessage',
        payload: { content: normalized, createdAt: new Date().toISOString() },
      })
      await streamContent(normalized)
    },
    [streamContent],
  )

  const retry = useCallback(async () => {
    const lastUserMessage = [...state.messages].reverse().find((message) => message.role === 'user')
    if (!lastUserMessage) return
    dispatch({ type: 'retryLastMessage' })
    await streamContent(lastUserMessage.content)
  }, [state.messages, streamContent])

  const reset = useCallback(() => {
    invalidate()
    dispatch({ type: 'reset' })
  }, [invalidate])

  return useMemo(
    () => ({
      state,
      ...state,
      isStreaming: state.status === 'streaming',
      conversationId,
      sendMessage,
      retry,
      retryLastMessage: retry,
      reset,
    }),
    [conversationId, reset, retry, sendMessage, state],
  )
}
