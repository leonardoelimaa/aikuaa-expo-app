import type { Company } from '../../services/types'
import {
  ACME_WORKSPACE_ID,
  BETA_WORKSPACE_ID,
  DEMO_TENANT_ID,
  type Workspace,
} from '../../types/app'

export const MOCK_TENANT_ID = DEMO_TENANT_ID
export const mockWorkspaces: Workspace[] = [
  { id: ACME_WORKSPACE_ID, tenantId: DEMO_TENANT_ID, companyId: 'comp-acme', name: 'Acme' },
  { id: BETA_WORKSPACE_ID, tenantId: DEMO_TENANT_ID, companyId: 'comp-beta', name: 'Beta' },
]
export const mockCompanies: Company[] = [
  {
    id: 'comp-acme',
    workspaceId: ACME_WORKSPACE_ID,
    tenantId: DEMO_TENANT_ID,
    name: 'Acme',
    description: 'Conhecimento operacional da Acme para equipes e processos internos.',
    industry: 'Tecnologia',
  },
  {
    id: 'comp-beta',
    workspaceId: BETA_WORKSPACE_ID,
    tenantId: DEMO_TENANT_ID,
    name: 'Beta',
    description: 'Base de conhecimento da Beta para operações empresariais.',
    industry: 'Serviços',
  },
]
