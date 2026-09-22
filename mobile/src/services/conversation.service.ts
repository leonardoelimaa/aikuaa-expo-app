import type {
  Conversation,
  ConversationMutationOptions,
  ConversationService,
  CreateConversationParams,
  Message,
} from './types'
import { conversationStore } from '../stores/conversationStore'
import { asConversationId, requireWorkspaceId, type WorkspaceId } from '../types/app'

let sequence = 0
const generateId = (prefix: string) => `${prefix}-${++sequence}`
const nowIso = () => new Date().toISOString()
const abortError = () => {
  const error = new Error('The operation was aborted.')
  error.name = 'AbortError'
  return error
}
const throwIfAborted = (signal?: AbortSignal) => {
  if (signal?.aborted) throw abortError()
}
const createMessage = (content: string): Message => ({
  id: generateId('msg'),
  role: 'user',
  content,
  createdAt: nowIso(),
})

export function createMockConversationService(): ConversationService {
  return {
    async listConversations(workspaceId: WorkspaceId | string) {
      return conversationStore.getAll(requireWorkspaceId(workspaceId))
    },
    async createConversation(
      workspaceId: WorkspaceId | string,
      params: CreateConversationParams,
      options?: ConversationMutationOptions,
    ) {
      throwIfAborted(options?.signal)
      const owner = requireWorkspaceId(workspaceId)
      const timestamp = nowIso()
      const conversation: Conversation = {
        id: params.id ?? asConversationId(generateId('conv')),
        workspaceId: owner,
        title: params.title ?? 'Nova conversa',
        createdAt: timestamp,
        updatedAt: timestamp,
        messages: params.initialMessage ? [createMessage(params.initialMessage)] : [],
      }
      throwIfAborted(options?.signal)
      return conversationStore.add(conversation)
    },
    async getConversation(workspaceId: WorkspaceId | string, id) {
      return conversationStore.getById(id, requireWorkspaceId(workspaceId))
    },
    async saveConversation(
      workspaceId: WorkspaceId | string,
      conversation: Conversation,
      options?: ConversationMutationOptions,
    ) {
      throwIfAborted(options?.signal)
      const owner = requireWorkspaceId(workspaceId)
      const existing = await conversationStore.getById(conversation.id)
      if (!existing) throw new Error(`Conversation not found: ${conversation.id}`)
      if (existing.workspaceId !== owner || conversation.workspaceId !== owner)
        throw new Error('Conversation workspace ownership is immutable.')
      throwIfAborted(options?.signal)
      return conversationStore.update({ ...conversation, workspaceId: owner, updatedAt: nowIso() })
    },
    async deleteConversation(workspaceId: WorkspaceId | string, id) {
      const owner = requireWorkspaceId(workspaceId)
      const existing = await conversationStore.getById(id)
      if (existing && existing.workspaceId !== owner)
        throw new Error('Conversation belongs to another workspace.')
      await conversationStore.remove(id, owner)
    },
  }
}
