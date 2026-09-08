import { ConversationService, Conversation, CreateConversationParams, Message } from './types'
import { conversationStore } from '../stores/conversationStore'

function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

function nowIso(): string {
  return new Date().toISOString()
}

function createMessage(content: string): Message {
  return {
    id: generateId('msg'),
    role: 'user',
    content,
    createdAt: nowIso(),
  }
}

export function createMockConversationService(): ConversationService {
  return {
    async listConversations(): Promise<Conversation[]> {
      return conversationStore.getAll()
    },

    async createConversation(params: CreateConversationParams): Promise<Conversation> {
      const conversation: Conversation = {
        id: generateId('conv'),
        title: params.title ?? 'Nueva conversación',
        createdAt: nowIso(),
        updatedAt: nowIso(),
        messages: params.initialMessage ? [createMessage(params.initialMessage)] : [],
      }
      await conversationStore.add(conversation)
      return conversation
    },

    async getConversation(id: string): Promise<Conversation | null> {
      return conversationStore.getById(id)
    },

    async saveConversation(conversation: Conversation): Promise<Conversation> {
      const updated: Conversation = {
        ...conversation,
        updatedAt: nowIso(),
      }
      return conversationStore.update(updated)
    },

    async deleteConversation(id: string): Promise<void> {
      await conversationStore.remove(id)
    },
  }
}
