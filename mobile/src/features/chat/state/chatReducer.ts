import { ChatState, ChatAction, createUserMessage, createAssistantMessage } from '../types'

export function chatReducer(state: ChatState, action: ChatAction): ChatState {
  switch (action.type) {
    case 'sendMessage': {
      const userMessage = createUserMessage(action.payload.content, action.payload.createdAt)
      return {
        ...state,
        messages: [...state.messages, userMessage],
        streamingMessageId: `stream_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
        streamingContent: '',
        isThinking: false,
        error: null,
        status: 'streaming',
      }
    }

    case 'appendStreaming':
      return {
        ...state,
        streamingContent: state.streamingContent + action.payload,
      }

    case 'setThinking':
      return {
        ...state,
        isThinking: action.payload,
      }

    case 'setError':
      return {
        ...state,
        isThinking: false,
        error: action.payload,
        status: 'idle',
      }

    case 'completeStreaming': {
      if (!state.streamingMessageId) return state
      const assistantMessage = createAssistantMessage(
        state.streamingContent,
        action.payload.createdAt,
      )
      return {
        ...state,
        messages: [...state.messages, assistantMessage],
        streamingMessageId: null,
        streamingContent: '',
        isThinking: false,
        status: 'idle',
      }
    }

    case 'resetStream':
      return {
        ...state,
        streamingMessageId: null,
        streamingContent: '',
        isThinking: false,
        status: 'idle',
      }

    default:
      return state
  }
}
