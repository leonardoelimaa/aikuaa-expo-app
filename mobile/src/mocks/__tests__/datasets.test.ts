import { mockCompanies, mockEvents, mockConversations, aiResponseScenarios } from '..'

describe('Mock datasets', () => {
  it('exposes deterministic company cards', () => {
    expect(mockCompanies.length).toBeGreaterThan(0)
    expect(mockCompanies.every((company) => company.id && company.name && company.tenantId)).toBe(
      true,
    )
  })

  it('exposes the preconfigured demo event', () => {
    const event = mockEvents.find((e) => e.id === 'aikuaa-demo-event')
    expect(event).toBeDefined()
    expect(event?.tenantId).toBe('aikuaa-demo-tenant')
  })

  it('exposes seeded conversations', () => {
    expect(mockConversations.length).toBeGreaterThan(0)
    expect(mockConversations[0].messages.length).toBeGreaterThan(0)
  })

  it('exposes AI response scenarios for all required states', () => {
    const required = ['success', 'thinking', 'error', 'empty', 'offline', 'noAnswer']
    for (const key of required) {
      expect(aiResponseScenarios[key]).toBeDefined()
    }
  })

  it('company search dataset matches AI company chunk dataset', () => {
    const companyIds = mockCompanies.map((company) => company.id)
    const scenario = aiResponseScenarios.companies
    if (scenario.expectedChunks[0].type === 'companies') {
      for (const summary of scenario.expectedChunks[0].companies) {
        expect(companyIds).toContain(summary.id)
      }
    }
  })
})
