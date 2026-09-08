import { createMockAIService } from '../ai.service'
import { createMockConversationService } from '../conversation.service'
import { createMockEventService } from '../event.service'
import { createMockCompanyService } from '../company.service'
import { createMockAnalyticsService } from '../analytics.service'
import { aiResponseScenarios } from '../../mocks'
import { resetDemoState } from '../../stores/demoStore'
import { AIChunk } from '../types'

async function collectChunks(
  service: ReturnType<typeof createMockAIService>,
  input: string,
  offline = false,
): Promise<AIChunk[]> {
  const chunks: AIChunk[] = []
  for await (const chunk of service.streamMessage({ message: input, offline })) {
    chunks.push(chunk)
  }
  return chunks
}

describe('Service interfaces — mock adapters', () => {
  beforeEach(async () => {
    await resetDemoState()
  })

  describe('AIService', () => {
    it('is satisfied structurally by createMockAIService', () => {
      const ai = createMockAIService()
      expect(typeof ai.streamMessage).toBe('function')
      expect(typeof ai.searchCompanies).toBe('function')
    })

    it('returns deterministic success chunks', async () => {
      const ai = createMockAIService()
      const chunks = await collectChunks(ai, aiResponseScenarios.success.input)
      expect(chunks).toEqual(aiResponseScenarios.success.expectedChunks)
    })

    it('returns deterministic thinking chunks', async () => {
      const ai = createMockAIService()
      const chunks = await collectChunks(ai, aiResponseScenarios.thinking.input)
      expect(chunks).toEqual(aiResponseScenarios.thinking.expectedChunks)
    })

    it('returns deterministic company chunks', async () => {
      const ai = createMockAIService()
      const chunks = await collectChunks(ai, aiResponseScenarios.companies.input)
      expect(chunks).toEqual(aiResponseScenarios.companies.expectedChunks)
    })

    it('returns deterministic error chunks', async () => {
      const ai = createMockAIService()
      const chunks = await collectChunks(ai, aiResponseScenarios.error.input)
      expect(chunks).toEqual(aiResponseScenarios.error.expectedChunks)
    })

    it('returns deterministic empty-query chunks', async () => {
      const ai = createMockAIService()
      const chunks = await collectChunks(ai, aiResponseScenarios.empty.input)
      expect(chunks).toEqual(aiResponseScenarios.empty.expectedChunks)
    })

    it('returns deterministic offline chunks', async () => {
      const ai = createMockAIService()
      const chunks = await collectChunks(ai, aiResponseScenarios.offline.input, true)
      expect(chunks).toEqual(aiResponseScenarios.offline.expectedChunks)
    })

    it('returns deterministic no-answer chunks', async () => {
      const ai = createMockAIService()
      const chunks = await collectChunks(ai, aiResponseScenarios.noAnswer.input)
      expect(chunks).toEqual(aiResponseScenarios.noAnswer.expectedChunks)
    })

    it('searchCompanies returns filtered deterministic results', async () => {
      const ai = createMockAIService()
      const results = await ai.searchCompanies('gamma')
      expect(results.length).toBe(1)
      expect(results[0].id).toBe('comp-gamma')
    })
  })

  describe('ConversationService', () => {
    it('lists seeded conversations deterministically', async () => {
      const service = createMockConversationService()
      const conversations = await service.listConversations()
      expect(conversations.length).toBe(1)
      expect(conversations[0].id).toBe('conv-welcome')
    })

    it('creates a conversation with an initial message', async () => {
      const service = createMockConversationService()
      const conversation = await service.createConversation({
        title: 'Test',
        initialMessage: 'Hola',
      })
      expect(conversation.title).toBe('Test')
      expect(conversation.messages).toHaveLength(1)
      expect(conversation.messages[0].role).toBe('user')
    })

    it('gets a conversation by id', async () => {
      const service = createMockConversationService()
      const conversations = await service.listConversations()
      const found = await service.getConversation(conversations[0].id)
      expect(found).not.toBeNull()
      expect(found?.id).toBe(conversations[0].id)
    })

    it('saves an updated conversation', async () => {
      const service = createMockConversationService()
      const conversation = await service.createConversation({ title: 'Before' })
      const beforeSave = conversation.updatedAt
      await new Promise((resolve) => setTimeout(resolve, 5))
      const updated = await service.saveConversation({ ...conversation, title: 'After' })
      expect(updated.title).toBe('After')
      expect(updated.updatedAt).not.toBe(beforeSave)
    })

    it('deletes a conversation', async () => {
      const service = createMockConversationService()
      const conversation = await service.createConversation({ title: 'To delete' })
      await service.deleteConversation(conversation.id)
      expect(await service.getConversation(conversation.id)).toBeNull()
    })
  })

  describe('EventService', () => {
    it('returns the demo event by id', async () => {
      const service = createMockEventService()
      const event = await service.getEventById('aikuaa-demo-event')
      expect(event).not.toBeNull()
      expect(event?.name).toBe('Demo Event 2026')
    })

    it('returns null for unknown event', async () => {
      const service = createMockEventService()
      const event = await service.getEventById('unknown')
      expect(event).toBeNull()
    })
  })

  describe('CompanyService', () => {
    it('searches companies by name', async () => {
      const service = createMockCompanyService()
      const results = await service.searchCompanies('acme')
      expect(results.length).toBe(1)
      expect(results[0].name).toBe('Acme Corp')
    })

    it('searches companies by industry', async () => {
      const service = createMockCompanyService()
      const results = await service.searchCompanies('salud')
      expect(results.length).toBe(1)
      expect(results[0].industry).toBe('Salud')
    })

    it('respects limit and offset', async () => {
      const service = createMockCompanyService()
      const page1 = await service.searchCompanies('', { limit: 2, offset: 0 })
      const page2 = await service.searchCompanies('', { limit: 2, offset: 2 })
      expect(page1.length).toBe(2)
      expect(page2.length).toBe(2)
      expect(page1[0].id).not.toBe(page2[0].id)
    })

    it('returns a company by id', async () => {
      const service = createMockCompanyService()
      const company = await service.getCompanyById('comp-beta')
      expect(company).not.toBeNull()
      expect(company?.name).toBe('Beta Labs')
    })
  })

  describe('AnalyticsService', () => {
    it('trackEvent resolves without throwing', async () => {
      const service = createMockAnalyticsService()
      await expect(service.trackEvent('demo_action', { value: 1 })).resolves.toBeUndefined()
    })
  })
})
