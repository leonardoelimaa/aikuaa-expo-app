import type { Company, CompanyService, SearchOptions } from './types'
import { mockCompanies, mockWorkspaces } from '../mocks'
import { requireWorkspaceId, type Workspace, type WorkspaceId } from '../types/app'

const cloneWorkspace = (workspace: Workspace): Workspace => ({ ...workspace })
const cloneCompany = (company: Company): Company => ({ ...company })

export function createMockCompanyService(): CompanyService {
  return {
    async listWorkspaces() {
      return mockWorkspaces.map(cloneWorkspace)
    },
    async getWorkspaceById(id: string) {
      const workspace = mockWorkspaces.find((candidate) => candidate.id === id)
      return workspace ? cloneWorkspace(workspace) : null
    },
    async searchCompanies(
      workspaceId: WorkspaceId | string,
      query: string,
      options?: SearchOptions,
    ) {
      const validatedWorkspaceId = requireWorkspaceId(workspaceId)
      const term = query.trim().toLocaleLowerCase('pt-BR')
      const filtered = mockCompanies.filter(
        (company) =>
          company.workspaceId === validatedWorkspaceId &&
          (!term ||
            company.name.toLocaleLowerCase('pt-BR').includes(term) ||
            company.industry?.toLocaleLowerCase('pt-BR').includes(term)),
      )
      const offset = Math.max(0, options?.offset ?? 0)
      const limit = Math.max(0, options?.limit ?? filtered.length)
      return filtered.slice(offset, offset + limit).map(cloneCompany)
    },
    async getCompanyById(workspaceId: WorkspaceId | string, companyId: string) {
      const validatedWorkspaceId = requireWorkspaceId(workspaceId)
      const company = mockCompanies.find(
        (candidate) => candidate.workspaceId === validatedWorkspaceId && candidate.id === companyId,
      )
      return company ? cloneCompany(company) : null
    },
  }
}
