import { Conversation } from '../services/types'

// NOTE: Module-level mutable state below is temporary demo infrastructure
// and will be replaced by persistent stores in a later PR.

let conversations: Conversation[] = []

export const conversationStore = {
  async getAll(): Promise<Conversation[]> {
    return [...conversations]
  },

  async getById(id: string): Promise<Conversation | null> {
    return conversations.find((conversation) => conversation.id === id) ?? null
  },

  async add(conversation: Conversation): Promise<Conversation> {
    conversations.push(conversation)
    return conversation
  },

  async update(conversation: Conversation): Promise<Conversation> {
    const index = conversations.findIndex((c) => c.id === conversation.id)
    if (index === -1) {
      throw new Error(`Conversation not found: ${conversation.id}`)
    }
    conversations[index] = conversation
    return conversation
  },

  async remove(id: string): Promise<void> {
    conversations = conversations.filter((conversation) => conversation.id !== id)
  },

  async clear(): Promise<void> {
    conversations = []
  },

  async seed(seed: Conversation[]): Promise<void> {
    conversations = [...seed]
  },
}
