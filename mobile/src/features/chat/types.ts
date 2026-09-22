import type { Message } from '@/services/types'

export type ChatMessage = Message

export interface ChatError {
  code: string
  message: string
}

export interface ChatState {
  messages: Message[]
  streamingMessageId: string | null
  streamingContent: string
  isThinking: boolean
  error: ChatError | null
  status: 'idle' | 'streaming'
}

export type ChatAction =
  | { type: 'sendMessage'; payload: { content: string; createdAt: string } }
  | { type: 'appendStreaming'; payload: string }
  | { type: 'setThinking'; payload: boolean }
  | { type: 'setError'; payload: ChatError }
  | { type: 'completeStreaming'; payload: { createdAt: string } }
  | { type: 'resetStream' }
  | { type: 'reset' }
  | { type: 'retryLastMessage' }

export const initialChatState: ChatState = {
  messages: [],
  streamingMessageId: null,
  streamingContent: '',
  isThinking: false,
  error: null,
  status: 'idle',
}

let messageSequence = 0

const nextMessageId = () => `msg-${++messageSequence}`
const timestamp = () => new Date().toISOString()

export function createUserMessage(
  content: string,
  createdAt = timestamp(),
  id = nextMessageId(),
): Message {
  return { id, role: 'user', content, createdAt }
}

export function createAssistantMessage(
  content: string,
  id = nextMessageId(),
  createdAt = timestamp(),
): Message {
  return { id, role: 'assistant', content, createdAt }
}
