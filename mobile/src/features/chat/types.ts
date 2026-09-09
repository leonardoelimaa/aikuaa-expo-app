import { Message } from '@/services/types'

export type ChatMessage = Message

export interface ChatError {
  code: string
  message: string
}

export type ChatStatus = 'idle' | 'streaming'

export interface ChatState {
  messages: ChatMessage[]
  streamingMessageId: string | null
  streamingContent: string
  isThinking: boolean
  error: ChatError | null
  status: ChatStatus
}

export type ChatAction =
  | { type: 'sendMessage'; payload: { content: string; createdAt: string } }
  | { type: 'appendStreaming'; payload: string }
  | { type: 'setThinking'; payload: boolean }
  | { type: 'setError'; payload: ChatError }
  | { type: 'completeStreaming'; payload: { createdAt: string } }
  | { type: 'resetStream' }

export const initialChatState: ChatState = {
  messages: [],
  streamingMessageId: null,
  streamingContent: '',
  isThinking: false,
  error: null,
  status: 'idle',
}

export function createUserMessage(
  content: string,
  createdAt = new Date().toISOString(),
): ChatMessage {
  return {
    id: generateMessageId(),
    role: 'user',
    content,
    createdAt,
  }
}

export function createAssistantMessage(
  content: string,
  createdAt = new Date().toISOString(),
): ChatMessage {
  return {
    id: generateMessageId(),
    role: 'assistant',
    content,
    createdAt,
  }
}

function generateMessageId(): string {
  return `msg_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
}
