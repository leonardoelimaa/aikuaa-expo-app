import type { AppContext, ConversationId, Workspace, WorkspaceId } from '../types/app'
export type { AppContext, ConversationId, Workspace, WorkspaceId } from '../types/app'

export interface AIService {
  streamMessage(request: AIRequest): AsyncIterableIterator<AIChunk>
  searchCompanies(workspaceId: WorkspaceId | string, query: string): Promise<Company[]>
}
export interface AIRequest {
  message: string
  conversationId?: ConversationId
  context: AppContext
  offline?: boolean
  signal?: AbortSignal
}
export type AIChunk = AIThinkingChunk | AITextChunk | AICompaniesChunk | AIErrorChunk | AIDoneChunk
export interface AIThinkingChunk {
  type: 'thinking'
  content: string
}
export interface AITextChunk {
  type: 'text'
  content: string
}
export interface AICompaniesChunk {
  type: 'companies'
  companies: CompanySummary[]
}
export interface AIErrorChunk {
  type: 'error'
  code: string
  message: string
}
export interface AIDoneChunk {
  type: 'done'
}
export interface CompanySummary {
  id: string
  name: string
  industry?: string
}

export interface ConversationMutationOptions {
  signal?: AbortSignal
}

export interface ConversationService {
  listConversations(workspaceId: WorkspaceId | string): Promise<Conversation[]>
  createConversation(
    workspaceId: WorkspaceId | string,
    params: CreateConversationParams,
    options?: ConversationMutationOptions,
  ): Promise<Conversation>
  getConversation(
    workspaceId: WorkspaceId | string,
    id: ConversationId | string,
  ): Promise<Conversation | null>
  saveConversation(
    workspaceId: WorkspaceId | string,
    conversation: Conversation,
    options?: ConversationMutationOptions,
  ): Promise<Conversation>
  deleteConversation(workspaceId: WorkspaceId | string, id: ConversationId | string): Promise<void>
}
export interface Conversation {
  id: ConversationId
  workspaceId: WorkspaceId
  title: string
  createdAt: string
  updatedAt: string
  messages: Message[]
}
export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  createdAt: string
}
export interface CreateConversationParams {
  id?: ConversationId
  title?: string
  initialMessage?: string
}

export interface EventService {
  getEventById(id: string): Promise<Event | null>
}
export interface Event {
  id: string
  tenantId: string
  name: string
  description: string
  startDate: string
  endDate: string
  location?: string
}
export interface CompanyService {
  listWorkspaces(): Promise<Workspace[]>
  getWorkspaceById(id: string): Promise<Workspace | null>
  searchCompanies(
    workspaceId: WorkspaceId | string,
    query: string,
    options?: SearchOptions,
  ): Promise<Company[]>
  getCompanyById(workspaceId: WorkspaceId | string, companyId: string): Promise<Company | null>
}
export interface Company {
  id: string
  workspaceId: WorkspaceId
  tenantId: string
  name: string
  description: string
  industry?: string
  logoUrl?: string
}
export interface SearchOptions {
  limit?: number
  offset?: number
}
export interface AnalyticsService {
  track(name: string, properties?: Record<string, unknown>): Promise<void>
  trackEvent(name: string, properties?: Record<string, unknown>): Promise<void>
}
