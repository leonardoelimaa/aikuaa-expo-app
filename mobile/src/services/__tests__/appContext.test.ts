import {
  ACME_WORKSPACE_ID,
  requireCompanyMode,
  type AppContext,
  type CompanyAppContext,
  type EventAppContext,
} from '../../types/app'

describe('application context contracts', () => {
  const companyContext: CompanyAppContext = {
    mode: 'company',
    tenantId: 'aikuaa-demo-tenant',
    workspaceId: ACME_WORKSPACE_ID,
    companyId: 'comp-acme',
  }

  it('accepts a complete company workspace context', () => {
    expect(requireCompanyMode(companyContext)).toBe(companyContext)
  })

  it('fails closed when a company context has no workspace', () => {
    const missingWorkspace = {
      mode: 'company',
      tenantId: 'aikuaa-demo-tenant',
      companyId: 'comp-acme',
    } as unknown as AppContext

    expect(() => requireCompanyMode(missingWorkspace)).toThrow(/workspace/i)
  })

  it('rejects the legacy event compatibility shape as an operational context', () => {
    const eventContext: EventAppContext = {
      mode: 'event',
      tenantId: 'aikuaa-demo-tenant',
      eventId: 'aikuaa-demo-event',
    }

    expect(() => requireCompanyMode(eventContext as unknown as AppContext)).toThrow()
  })

  it('keeps the operational AppContext union on company workspace semantics', () => {
    const context: AppContext = companyContext

    expect(context.mode).toBe('company')
    expect(context.companyId).toBe('comp-acme')
    expect(context.workspaceId).toBe(ACME_WORKSPACE_ID)
  })
})
