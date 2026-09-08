import { resolveEventContext, DEMO_EVENT } from './resolveEvent'
import { EventContextInput } from './AppContext'

describe('resolveEventContext', () => {
  it('returns the preconfigured demo event when no input is provided', () => {
    const context = resolveEventContext()

    expect(context).toEqual(DEMO_EVENT)
  })

  it('resolves an event from a deep-link / QR input using the same signature', () => {
    const input = {
      eventId: 'external-event-id',
      tenantId: 'external-tenant-id',
      companyId: 'external-company-id',
    }

    const context = resolveEventContext(input)

    expect(context).toEqual({
      mode: 'event',
      ...input,
    })
  })

  it('falls back to the demo event when input has no eventId', () => {
    const context = resolveEventContext({} as EventContextInput)

    expect(context).toEqual(DEMO_EVENT)
  })
})
