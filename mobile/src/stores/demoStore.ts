import { EventAppContext } from '../types/app'
import { mockConversations } from '../mocks'
import { conversationStore } from './conversationStore'
import { sessionStore } from './sessionStore'

export const DEMO_TENANT_ID = 'aikuaa-demo-tenant'
export const DEMO_EVENT_ID = 'aikuaa-demo-event'

export const demoEventContext: EventAppContext = {
  mode: 'event',
  tenantId: DEMO_TENANT_ID,
  eventId: DEMO_EVENT_ID,
}

export async function resetDemoState(): Promise<EventAppContext> {
  await conversationStore.clear()
  await sessionStore.clear()
  await conversationStore.seed(mockConversations)
  return demoEventContext
}
