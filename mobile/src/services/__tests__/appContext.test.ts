import { AppContext, EventAppContext, CompanyAppContext, requireEventMode } from '../../types/app'

describe('AppContext multi-tenancy', () => {
  it('event mode is operational', () => {
    const context: EventAppContext = {
      mode: 'event',
      tenantId: 'aikuaa-demo-tenant',
      eventId: 'aikuaa-demo-event',
    }
    expect(requireEventMode(context)).toBe(context)
  })

  it('event mode without eventId throws', () => {
    const context: AppContext = { mode: 'event', tenantId: 'tenant-demo' }
    expect(() => requireEventMode(context)).toThrow('Event context requires a valid eventId')
  })

  it('company mode is typed but non-operational at runtime', () => {
    const context: CompanyAppContext = {
      mode: 'company',
      tenantId: 'tenant-demo',
      companyId: 'comp-acme',
    }
    expect(() => requireEventMode(context)).toThrow('Company mode is not operational')
  })

  it('mode union accepts both shapes at compile time', () => {
    const event: AppContext = { mode: 'event', eventId: 'aikuaa-demo-event' }
    const company: AppContext = { mode: 'company', companyId: 'comp-acme' }
    expect(event.mode).toBe('event')
    expect(company.mode).toBe('company')
  })
})
