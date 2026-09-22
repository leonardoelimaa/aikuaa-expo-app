import type { Conversation } from '../services/types'
import type { ConversationId, WorkspaceId } from '../types/app'

let conversations: Conversation[] = []

const cloneConversation = (conversation: Conversation): Conversation => ({
  ...conversation,
  messages: conversation.messages.map((message) => ({ ...message })),
})

export const conversationStore = {
  async getAll(workspaceId?: WorkspaceId) {
    return conversations
      .filter(
        (conversation) => workspaceId === undefined || conversation.workspaceId === workspaceId,
      )
      .map(cloneConversation)
  },
  async getById(id: ConversationId | string, workspaceId?: WorkspaceId) {
    const conversation = conversations.find(
      (candidate) =>
        candidate.id === id && (workspaceId === undefined || candidate.workspaceId === workspaceId),
    )
    return conversation ? cloneConversation(conversation) : null
  },
  async add(conversation: Conversation) {
    if (conversations.some((candidate) => candidate.id === conversation.id))
      throw new Error(`Conversation already exists: ${conversation.id}`)
    const owned = cloneConversation(conversation)
    conversations.push(owned)
    return cloneConversation(owned)
  },
  async update(conversation: Conversation) {
    const index = conversations.findIndex((candidate) => candidate.id === conversation.id)
    if (index === -1) throw new Error(`Conversation not found: ${conversation.id}`)
    if (conversations[index].workspaceId !== conversation.workspaceId)
      throw new Error('Conversation workspace ownership is immutable.')
    conversations[index] = cloneConversation(conversation)
    return cloneConversation(conversations[index])
  },
  async remove(id: ConversationId | string, workspaceId?: WorkspaceId) {
    conversations = conversations.filter(
      (candidate) =>
        candidate.id !== id || (workspaceId !== undefined && candidate.workspaceId !== workspaceId),
    )
  },
  async clear() {
    conversations = []
  },
  async seed(seed: Conversation[]) {
    conversations = seed.map(cloneConversation)
  },
}
