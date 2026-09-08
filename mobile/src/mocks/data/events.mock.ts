import { Event } from '../../services/types'
import { MOCK_TENANT_ID } from './companies.mock'

export const mockEvents: Event[] = [
  {
    id: 'aikuaa-demo-event',
    tenantId: MOCK_TENANT_ID,
    name: 'Demo Event 2026',
    description: 'Evento de demostración para validar flujos de la aplicación.',
    startDate: '2026-09-08T09:00:00.000Z',
    endDate: '2026-09-08T18:00:00.000Z',
    location: 'Madrid',
  },
]
