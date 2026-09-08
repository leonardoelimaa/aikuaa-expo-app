export interface AppContext {
  mode: 'event' | 'company'
  tenantId?: string
  eventId?: string
  companyId?: string
}

export interface EventAppContext extends AppContext {
  mode: 'event'
  eventId: string
}

export interface CompanyAppContext extends AppContext {
  mode: 'company'
  companyId: string
}

export function requireEventMode(context: AppContext): EventAppContext {
  if (context.mode !== 'event') {
    throw new Error(`Company mode is not operational at runtime (mode=${context.mode}).`)
  }

  if (!context.eventId) {
    throw new Error('Event context requires a valid eventId.')
  }

  return context as EventAppContext
}
