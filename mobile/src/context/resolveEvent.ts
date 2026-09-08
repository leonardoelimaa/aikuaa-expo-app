import { AppContext, EventContextInput } from './AppContext'

export const DEMO_EVENT: AppContext = {
  mode: 'event',
  eventId: 'aikuaa-demo-event',
  tenantId: 'aikuaa-demo-tenant',
  companyId: 'aikuaa-demo-company',
}

/**
 * Resolves the demo event context for the app shell.
 *
 * When no input is provided, the hardcoded demo event is returned so the app
 * works fully offline without a backend.
 *
 * When an input is provided (e.g. from a future deep-link / QR scan), it is
 * injected into the same context shape without requiring architecture changes.
 */
export const resolveEventContext = (input?: EventContextInput): AppContext => {
  if (input?.eventId) {
    return {
      mode: 'event',
      eventId: input.eventId,
      tenantId: input.tenantId,
      companyId: input.companyId,
    }
  }

  return DEMO_EVENT
}
