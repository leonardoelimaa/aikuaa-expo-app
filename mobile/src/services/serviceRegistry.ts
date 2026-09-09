import {
  AIService,
  ConversationService,
  EventService,
  CompanyService,
  AnalyticsService,
} from './types'
import { createMockAIService } from './ai.service'
import { createMockConversationService } from './conversation.service'
import { createMockEventService } from './event.service'
import { createMockCompanyService } from './company.service'
import { createMockAnalyticsService } from './analytics.service'

export interface Services {
  ai: AIService
  conversation: ConversationService
  event: EventService
  company: CompanyService
  analytics: AnalyticsService
}

export function createMockServices(): Services {
  return {
    ai: createMockAIService(),
    conversation: createMockConversationService(),
    event: createMockEventService(),
    company: createMockCompanyService(),
    analytics: createMockAnalyticsService(),
  }
}

let services: Services = createMockServices()

export function getServices(): Services {
  return services
}

export function resetServices(): void {
  services = createMockServices()
}
