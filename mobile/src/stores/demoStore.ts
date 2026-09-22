import { mockConversations } from '../mocks'
import { conversationStore } from './conversationStore'
import { sessionStore } from './sessionStore'
import { ACME_WORKSPACE_ID, DEMO_TENANT_ID, type EventAppContext } from '../types/app'

/** Compatibility constants only. Event mode is not an operational context. */
export { DEMO_TENANT_ID }
export const DEMO_EVENT_ID = 'aikuaa-demo-event'
export const DEMO_WORKSPACE_ID = ACME_WORKSPACE_ID
export const demoEventContext: EventAppContext = {
  mode: 'event',
  tenantId: DEMO_TENANT_ID,
  eventId: DEMO_EVENT_ID,
}

export async function resetDemoState(): Promise<void> {
  await conversationStore.clear()
  await sessionStore.clear()
  await conversationStore.seed(mockConversations)
}
