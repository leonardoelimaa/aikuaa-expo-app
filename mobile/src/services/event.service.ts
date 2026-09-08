import { EventService, Event } from './types'
import { mockEvents } from '../mocks'

export function createMockEventService(): EventService {
  return {
    async getEventById(id: string): Promise<Event | null> {
      return mockEvents.find((event) => event.id === id) ?? null
    },
  }
}
