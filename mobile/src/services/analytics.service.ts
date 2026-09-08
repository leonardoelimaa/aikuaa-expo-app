import { AnalyticsService } from './types'

export function createMockAnalyticsService(): AnalyticsService {
  return {
    async trackEvent(_name: string, _properties?: Record<string, unknown>): Promise<void> {
      // Intentional no-op: analytics are mocked.
    },
  }
}
