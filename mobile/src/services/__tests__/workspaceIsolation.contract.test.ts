import { createMockAIService } from '../ai.service'
import { createMockCompanyService } from '../company.service'
import { createMockConversationService } from '../conversation.service'
import type { AIChunk, AIRequest, Conversation } from '../types'
import { resetDemoState } from '../../stores/demoStore'

import { ACME_WORKSPACE_ID, BETA_WORKSPACE_ID } from '../../types/app'

const WORKSPACE_ACME = ACME_WORKSPACE_ID
const WORKSPACE_BETA = BETA_WORKSPACE_ID

async function collect(stream: AsyncIterableIterator<AIChunk>): Promise<AIChunk[]> {
  const chunks: AIChunk[] = []
  for await (const chunk of stream) chunks.push(chunk)
  return chunks
}

describe('workspace-scoped service contracts', () => {
  beforeEach(async () => {
    await resetDemoState()
  })

  it('exposes a stable workspace catalog with exact company and tenant ownership', async () => {
    const company = createMockCompanyService()

    await expect(company.listWorkspaces()).resolves.toEqual([
      expect.objectContaining({
        id: WORKSPACE_ACME,
        companyId: 'comp-acme',
        tenantId: 'aikuaa-demo-tenant',
      }),
      expect.objectContaining({
        id: WORKSPACE_BETA,
        companyId: 'comp-beta',
        tenantId: 'aikuaa-demo-tenant',
      }),
    ])
    await expect(company.getWorkspaceById('aikuaa-demo-event')).resolves.toBeNull()
  })

  it('returns differing deterministic company fixtures for each workspace', async () => {
    const company = createMockCompanyService()

    const acme = await company.searchCompanies(WORKSPACE_ACME, '')
    const beta = await company.searchCompanies(WORKSPACE_BETA, '')

    expect(acme.map(({ id }) => id)).toEqual(['comp-acme'])
    expect(beta.map(({ id }) => id)).toEqual(['comp-beta'])
  })

  it('fails closed when an AI content call has no workspace context', async () => {
    const ai = createMockAIService()
    const unscoped = { message: 'hola' } as AIRequest

    await expect(collect(ai.streamMessage(unscoped))).rejects.toThrow(/workspace|context/i)
  })

  it('partitions deterministic conversations by workspace and preserves stable IDs', async () => {
    const conversations = createMockConversationService()

    const acme = await conversations.listConversations(WORKSPACE_ACME)
    const beta = await conversations.listConversations(WORKSPACE_BETA)

    expect(acme.map(({ id }) => id)).toEqual(['conv-acme-welcome'])
    expect(beta.map(({ id }) => id)).toEqual(['conv-beta-welcome'])
    expect(acme[0].messages[0].content).not.toBe(beta[0].messages[0].content)

    const acmeAgain = await createMockConversationService().listConversations(WORKSPACE_ACME)
    expect(acmeAgain[0].id).toBe(acme[0].id)
  })

  it('returns defensive copies rather than mutable store references', async () => {
    const conversations = createMockConversationService()
    const firstRead = await conversations.listConversations(WORKSPACE_ACME)
    const originalTitle = firstRead[0].title
    const originalContent = firstRead[0].messages[0].content

    firstRead[0].title = 'mutated outside the adapter'
    firstRead[0].messages[0].content = 'mutated nested message'
    firstRead.push({} as Conversation)

    const secondRead = await conversations.listConversations(WORKSPACE_ACME)
    expect(secondRead).toHaveLength(1)
    expect(secondRead[0].title).toBe(originalTitle)
    expect(secondRead[0].messages[0].content).toBe(originalContent)
  })

  it('keeps conversation ownership immutable and rejects cross-workspace access', async () => {
    const conversations = createMockConversationService()
    const created = await conversations.createConversation(WORKSPACE_ACME, {
      title: 'Acme private thread',
      initialMessage: 'Acme only',
    })

    expect(created.workspaceId).toBe(WORKSPACE_ACME)
    await expect(conversations.getConversation(WORKSPACE_BETA, created.id)).resolves.toBeNull()
    await expect(
      conversations.saveConversation(WORKSPACE_BETA, {
        ...created,
        workspaceId: WORKSPACE_BETA,
      }),
    ).rejects.toThrow(/workspace|ownership/i)

    const persisted = await conversations.getConversation(WORKSPACE_ACME, created.id)
    expect(persisted?.id).toBe(created.id)
    expect(persisted?.workspaceId).toBe(WORKSPACE_ACME)
  })
})
