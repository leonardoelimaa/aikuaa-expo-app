import type { EventAppContext } from '../types/app'
import { DEMO_TENANT_ID } from '../types/app'

/** Compatibility-only input for the retired event adapter. */
export interface EventContextInput {
  eventId?: string
  tenantId?: string
  companyId?: string
}
export const DEMO_EVENT: EventAppContext = {
  mode: 'event',
  tenantId: DEMO_TENANT_ID,
  eventId: 'aikuaa-demo-event',
  companyId: 'aikuaa-demo-company',
}

/** @deprecated Event contexts are not accepted by the operational AppContext. */
export function resolveEventContext(input: EventContextInput = {}): EventAppContext {
  const eventId = input.eventId?.trim() || DEMO_EVENT.eventId
  if (!eventId) throw new Error('Event context requires a valid eventId.')
  return { ...DEMO_EVENT, ...input, mode: 'event', eventId }
}
