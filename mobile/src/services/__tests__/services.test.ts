import { createMockAIService } from '../ai.service'
import { createMockConversationService } from '../conversation.service'
import { createMockEventService } from '../event.service'
import { createMockCompanyService } from '../company.service'
import { createMockAnalyticsService } from '../analytics.service'
import { aiResponseScenarios } from '../../mocks'
import { resetDemoState } from '../../stores/demoStore'
import type { AIChunk } from '../types'
import { ACME_WORKSPACE_ID, BETA_WORKSPACE_ID, type AppContext } from '../../types/app'

const ACME = ACME_WORKSPACE_ID
const BETA = BETA_WORKSPACE_ID
const ACME_CONTEXT: AppContext = {
  mode: 'company',
  workspaceId: ACME,
  companyId: 'comp-acme',
  tenantId: 'aikuaa-demo-tenant',
}

async function collectChunks(
  service: ReturnType<typeof createMockAIService>,
  input: string,
  offline = false,
): Promise<AIChunk[]> {
  const chunks: AIChunk[] = []
  for await (const chunk of service.streamMessage({
    message: input,
    context: ACME_CONTEXT,
    offline,
  })) {
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
      const chunks = await collectChunks(createMockAIService(), aiResponseScenarios.success.input)
      expect(chunks).toEqual(aiResponseScenarios.success.expectedChunks)
    })

    it('returns deterministic thinking chunks', async () => {
      const chunks = await collectChunks(createMockAIService(), aiResponseScenarios.thinking.input)
      expect(chunks).toEqual(aiResponseScenarios.thinking.expectedChunks)
    })

    it('returns deterministic workspace-scoped company chunks', async () => {
      const ai = createMockAIService()
      const first = await collectChunks(ai, aiResponseScenarios.companies.input)
      const second = await collectChunks(ai, aiResponseScenarios.companies.input)
      const companies = first.flatMap((chunk) =>
        chunk.type === 'companies' ? chunk.companies : [],
      )

      expect(first).toEqual(second)
      expect(companies.length).toBeGreaterThan(0)
      expect(companies.every((company) => company.id === 'comp-acme')).toBe(true)
    })

    it('returns deterministic error chunks', async () => {
      const chunks = await collectChunks(createMockAIService(), aiResponseScenarios.error.input)
      expect(chunks).toEqual(aiResponseScenarios.error.expectedChunks)
    })

    it('returns deterministic empty-query chunks', async () => {
      const chunks = await collectChunks(createMockAIService(), aiResponseScenarios.empty.input)
      expect(chunks).toEqual(aiResponseScenarios.empty.expectedChunks)
    })

    it('returns deterministic offline chunks', async () => {
      const chunks = await collectChunks(
        createMockAIService(),
        aiResponseScenarios.offline.input,
        true,
      )
      expect(chunks).toEqual(aiResponseScenarios.offline.expectedChunks)
    })

    it('returns deterministic no-answer chunks', async () => {
      const chunks = await collectChunks(createMockAIService(), aiResponseScenarios.noAnswer.input)
      expect(chunks).toEqual(aiResponseScenarios.noAnswer.expectedChunks)
    })

    it('searches only the selected workspace catalog', async () => {
      const results = await createMockAIService().searchCompanies(ACME, 'acme')
      expect(results).toHaveLength(1)
      expect(results[0].id).toBe('comp-acme')
    })
  })

  describe('ConversationService', () => {
    it('lists seeded conversations deterministically', async () => {
      const conversations = await createMockConversationService().listConversations(ACME)
      expect(conversations).toHaveLength(1)
      expect(conversations[0].id).toBe('conv-acme-welcome')
    })

    it('creates a conversation with an initial message', async () => {
      const conversation = await createMockConversationService().createConversation(ACME, {
        title: 'Test',
        initialMessage: 'Olá',
      })
      expect(conversation.title).toBe('Test')
      expect(conversation.messages).toHaveLength(1)
      expect(conversation.messages[0].role).toBe('user')
    })

    it('gets a conversation by id', async () => {
      const service = createMockConversationService()
      const conversations = await service.listConversations(ACME)
      const found = await service.getConversation(ACME, conversations[0].id)
      expect(found).not.toBeNull()
      expect(found?.id).toBe(conversations[0].id)
    })

    it('saves an updated conversation', async () => {
      const service = createMockConversationService()
      const conversation = await service.createConversation(ACME, { title: 'Before' })
      const beforeSave = conversation.updatedAt
      await new Promise((resolve) => setTimeout(resolve, 5))
      const updated = await service.saveConversation(ACME, { ...conversation, title: 'After' })
      expect(updated.title).toBe('After')
      expect(updated.updatedAt).not.toBe(beforeSave)
    })

    it('deletes a conversation', async () => {
      const service = createMockConversationService()
      const conversation = await service.createConversation(ACME, { title: 'To delete' })
      await service.deleteConversation(ACME, conversation.id)
      expect(await service.getConversation(ACME, conversation.id)).toBeNull()
    })
  })

  describe('EventService compatibility adapter', () => {
    it('returns the demo event by id', async () => {
      const event = await createMockEventService().getEventById('aikuaa-demo-event')
      expect(event).not.toBeNull()
      expect(event?.name).toBe('Demo Event 2026')
    })

    it('returns null for unknown event', async () => {
      const event = await createMockEventService().getEventById('unknown')
      expect(event).toBeNull()
    })
  })

  describe('CompanyService', () => {
    it('searches companies by name within the workspace', async () => {
      const results = await createMockCompanyService().searchCompanies(ACME, 'acme')
      expect(results).toHaveLength(1)
      expect(results[0].name).toBe('Acme')
    })

    it('does not leak another workspace company', async () => {
      const results = await createMockCompanyService().searchCompanies(BETA, '')
      expect(results).toHaveLength(1)
      expect(results[0].id).toBe('comp-beta')
    })

    it('paginates only records owned by the workspace', async () => {
      const service = createMockCompanyService()
      const page1 = await service.searchCompanies(ACME, '', { limit: 1, offset: 0 })
      const page2 = await service.searchCompanies(ACME, '', { limit: 1, offset: 1 })
      expect(page1).toHaveLength(1)
      expect(page1[0].id).toBe('comp-acme')
      expect(page2).toHaveLength(0)
    })

    it('returns a company by id inside its workspace', async () => {
      const company = await createMockCompanyService().getCompanyById(BETA, 'comp-beta')
      expect(company).not.toBeNull()
      expect(company?.name).toBe('Beta')
    })
  })

  describe('AnalyticsService', () => {
    it('trackEvent resolves without throwing', async () => {
      const service = createMockAnalyticsService()
      await expect(service.trackEvent('demo_action', { value: 1 })).resolves.toBeUndefined()
    })
  })
})
