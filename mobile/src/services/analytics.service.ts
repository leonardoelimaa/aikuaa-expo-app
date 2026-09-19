import { AnalyticsService } from './types'

export interface RecordedAnalyticsEvent {
  name: string
  properties?: Record<string, unknown>
  timestamp: number
}

const recordedEvents: RecordedAnalyticsEvent[] = []

/**
 * Returns all events recorded by the mock analytics service.
 *
 * This is intended for tests and demo diagnostics only; it does not rely on
 * any backend or secrets.
 */
export function getRecordedEvents(): readonly RecordedAnalyticsEvent[] {
  return recordedEvents
}

/**
 * Clears the in-memory event recorder.
 *
 * The service registry calls this when resetting services to keep tests
 * isolated.
 */
export function clearRecordedEvents(): void {
  recordedEvents.length = 0
}

export function createMockAnalyticsService(): AnalyticsService {
  return {
    async track(name: string, properties?: Record<string, unknown>): Promise<void> {
      recordedEvents.push({ name, properties, timestamp: Date.now() })
    },

    async trackEvent(name: string, properties?: Record<string, unknown>): Promise<void> {
      recordedEvents.push({ name, properties, timestamp: Date.now() })
    },
  }
}
