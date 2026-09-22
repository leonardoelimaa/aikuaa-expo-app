import {
  createAssistantMessage,
  createUserMessage,
  initialChatState,
  type ChatAction,
  type ChatState,
} from '../types'

let streamSequence = 0
const nextStreamId = () => `stream-${++streamSequence}`

export function chatReducer(state: ChatState, action: ChatAction): ChatState {
  switch (action.type) {
    case 'sendMessage':
      return {
        ...state,
        messages: [
          ...state.messages,
          createUserMessage(action.payload.content, action.payload.createdAt),
        ],
        streamingMessageId: nextStreamId(),
        streamingContent: '',
        isThinking: false,
        error: null,
        status: 'streaming',
      }
    case 'appendStreaming':
      return {
        ...state,
        streamingContent: state.streamingContent + action.payload,
        isThinking: false,
        status: 'streaming',
      }
    case 'setThinking':
      return { ...state, isThinking: action.payload }
    case 'setError':
      return {
        ...state,
        error: action.payload,
        isThinking: false,
        status: 'idle',
        streamingMessageId: null,
        streamingContent: '',
      }
    case 'completeStreaming':
      if (state.streamingMessageId === null) {
        return state
      }
      return {
        ...state,
        messages: [
          ...state.messages,
          createAssistantMessage(
            state.streamingContent,
            state.streamingMessageId,
            action.payload.createdAt,
          ),
        ],
        streamingMessageId: null,
        streamingContent: '',
        isThinking: false,
        error: null,
        status: 'idle',
      }
    case 'resetStream':
      return {
        ...state,
        streamingMessageId: null,
        streamingContent: '',
        isThinking: false,
        error: null,
        status: 'idle',
      }
    case 'retryLastMessage':
      return {
        ...state,
        streamingMessageId: nextStreamId(),
        streamingContent: '',
        isThinking: false,
        error: null,
        status: 'streaming',
      }
    case 'reset':
      return initialChatState
    default:
      return state
  }
}
