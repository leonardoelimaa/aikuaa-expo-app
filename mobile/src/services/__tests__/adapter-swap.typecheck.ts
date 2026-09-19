/**
 * Typecheck coverage for the adapter-swap example in docs/adapter-swap.md.
 *
 * This file is not executed for behavior; it exists so that TypeScript verifies
 * the real-adapter example compiles against the public service interfaces.
 */
import { AnalyticsService } from '../types'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function createRealAnalyticsService(): AnalyticsService {
  return {
    async track(name: string, properties?: Record<string, unknown>): Promise<void> {
      await Promise.resolve({ name, properties, timestamp: Date.now() })
    },

    async trackEvent(name: string, properties?: Record<string, unknown>): Promise<void> {
      return this.track(name, properties)
    },
  }
}

it('compiles the adapter-swap example without runtime assertions', () => {
  expect(createRealAnalyticsService).toBeDefined()
})
