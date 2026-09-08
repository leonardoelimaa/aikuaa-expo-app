import { Company } from '../../services/types'

export const MOCK_TENANT_ID = 'aikuaa-demo-tenant'

export const mockCompanies: Company[] = [
  {
    id: 'comp-acme',
    tenantId: MOCK_TENANT_ID,
    name: 'Acme Corp',
    description: 'Soluciones industriales y fabricación avanzada.',
    industry: 'Manufactura',
  },
  {
    id: 'comp-beta',
    tenantId: MOCK_TENANT_ID,
    name: 'Beta Labs',
    description: 'Investigación y desarrollo en biotecnología.',
    industry: 'Salud',
  },
  {
    id: 'comp-gamma',
    tenantId: MOCK_TENANT_ID,
    name: 'GammaSoft',
    description: 'Desarrollo de software a medida para eventos.',
    industry: 'Tecnología',
  },
  {
    id: 'comp-delta',
    tenantId: MOCK_TENANT_ID,
    name: 'Delta Logistics',
    description: 'Transporte y logística integral.',
    industry: 'Logística',
  },
]
