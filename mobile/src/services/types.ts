import { AppContext } from '../types/app'

export interface AIService {
  streamMessage(request: AIRequest): AsyncIterableIterator<AIChunk>
  searchCompanies(query: string): Promise<Company[]>
}

export interface AIRequest {
  message: string
  conversationId?: string
  context?: AppContext
  offline?: boolean
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

export interface ConversationService {
  listConversations(): Promise<Conversation[]>
  createConversation(params: CreateConversationParams): Promise<Conversation>
  getConversation(id: string): Promise<Conversation | null>
  saveConversation(conversation: Conversation): Promise<Conversation>
  deleteConversation(id: string): Promise<void>
}

export interface Conversation {
  id: string
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
  searchCompanies(query: string, options?: SearchOptions): Promise<Company[]>
  getCompanyById(id: string): Promise<Company | null>
}

export interface Company {
  id: string
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
  trackEvent(name: string, properties?: Record<string, unknown>): Promise<void>
}
