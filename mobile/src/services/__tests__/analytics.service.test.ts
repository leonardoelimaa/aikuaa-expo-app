import {
  createMockAnalyticsService,
  getRecordedEvents,
  clearRecordedEvents,
} from '../analytics.service'

describe('AnalyticsService — mock adapter', () => {
  beforeEach(() => {
    clearRecordedEvents()
  })

  it('track records an in-memory event without external calls', async () => {
    const service = createMockAnalyticsService()

    await service.track('message_sent', { offline: false, messageLength: 12 })

    const events = getRecordedEvents()
    expect(events).toHaveLength(1)
    expect(events[0].name).toBe('message_sent')
    expect(events[0].properties).toEqual({ offline: false, messageLength: 12 })
    expect(typeof events[0].timestamp).toBe('number')
  })

  it('trackEvent records an in-memory event as a backward-compatible alias', async () => {
    const service = createMockAnalyticsService()

    await service.trackEvent('demo_reset', { eventId: 'aikuaa-demo-event' })

    expect(getRecordedEvents()).toHaveLength(1)
    expect(getRecordedEvents()[0].name).toBe('demo_reset')
  })

  it('tracks multiple events in order', async () => {
    const service = createMockAnalyticsService()

    await service.track('first')
    await service.track('second')

    const events = getRecordedEvents()
    expect(events).toHaveLength(2)
    expect(events.map((event) => event.name)).toEqual(['first', 'second'])
  })

  it('clearRecordedEvents removes all recorded events', async () => {
    const service = createMockAnalyticsService()
    await service.track('to_be_cleared')

    expect(getRecordedEvents()).toHaveLength(1)

    clearRecordedEvents()

    expect(getRecordedEvents()).toHaveLength(0)
  })

  it('does not throw when called without properties', async () => {
    const service = createMockAnalyticsService()

    await expect(service.track('no_props')).resolves.toBeUndefined()

    expect(getRecordedEvents()[0].properties).toBeUndefined()
  })
})
