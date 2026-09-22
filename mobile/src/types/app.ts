export type WorkspaceId = string & { readonly __workspaceId: unique symbol }
export type ConversationId = string & { readonly __conversationId: unique symbol }

export const DEMO_TENANT_ID = 'aikuaa-demo-tenant' as const
export const ACME_WORKSPACE_ID = 'workspace-acme' as WorkspaceId
export const BETA_WORKSPACE_ID = 'workspace-beta' as WorkspaceId

const WORKSPACE_IDS = new Set<string>([ACME_WORKSPACE_ID, BETA_WORKSPACE_ID])

export function isWorkspaceId(value: unknown): value is WorkspaceId {
  return typeof value === 'string' && WORKSPACE_IDS.has(value)
}

export function requireWorkspaceId(value: unknown): WorkspaceId {
  if (!isWorkspaceId(value)) throw new Error('Unknown workspace selection.')
  return value
}

export function asConversationId(value: string): ConversationId {
  if (!value.trim()) throw new Error('Conversation ID cannot be empty.')
  return value as ConversationId
}

export interface Workspace {
  id: WorkspaceId
  tenantId: typeof DEMO_TENANT_ID
  companyId: string
  name: string
}

export interface CompanyAppContext {
  mode: 'company'
  tenantId: typeof DEMO_TENANT_ID
  workspaceId: WorkspaceId
  companyId: string
}

export type AppContext = CompanyAppContext

/** Compatibility-only shape for the retired, unreachable event adapter. */
export interface EventAppContext {
  mode: 'event'
  tenantId?: string
  eventId: string
  companyId?: string
}

export function requireEventMode(context: AppContext | EventAppContext): EventAppContext {
  if (context.mode !== 'event' || !context.eventId)
    throw new Error('Event context requires a valid eventId.')
  return context
}

export function requireCompanyMode(context: AppContext | null): CompanyAppContext {
  if (!context || context.mode !== 'company' || !isWorkspaceId(context.workspaceId)) {
    throw new Error('A valid workspace context is required.')
  }
  return context
}
