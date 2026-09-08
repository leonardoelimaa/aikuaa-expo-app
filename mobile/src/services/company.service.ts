import { CompanyService, Company, SearchOptions } from './types'
import { mockCompanies } from '../mocks'

export function createMockCompanyService(): CompanyService {
  return {
    async searchCompanies(query: string, options?: SearchOptions): Promise<Company[]> {
      const term = query.toLowerCase()
      const filtered = mockCompanies.filter(
        (company) =>
          company.name.toLowerCase().includes(term) ||
          (company.industry?.toLowerCase().includes(term) ?? false),
      )
      const offset = options?.offset ?? 0
      const limit = options?.limit ?? filtered.length
      return filtered.slice(offset, offset + limit)
    },

    async getCompanyById(id: string): Promise<Company | null> {
      return mockCompanies.find((company) => company.id === id) ?? null
    },
  }
}
