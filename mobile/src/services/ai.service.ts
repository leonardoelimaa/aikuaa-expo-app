import { AIService, AIChunk, AIRequest, Company } from './types'
import { mockCompanies } from '../mocks'

export function createMockAIService(): AIService {
  return {
    async *streamMessage(request: AIRequest): AsyncIterableIterator<AIChunk> {
      const normalized = request.message.trim().toLowerCase()

      if (request.offline) {
        yield { type: 'error', code: 'OFFLINE', message: 'No hay conexión disponible.' }
        return
      }

      if (normalized === '') {
        yield { type: 'text', content: 'No tengo una respuesta para eso.' }
        yield { type: 'done' }
        return
      }

      if (normalized.includes('error')) {
        yield { type: 'error', code: 'AI_ERROR', message: 'Error simulado del asistente.' }
        return
      }

      if (normalized.includes('pens') || normalized.includes('thinking')) {
        yield { type: 'thinking', content: 'Analizando tu pregunta...' }
      }

      if (
        normalized.includes('empresa') ||
        normalized.includes('empresas') ||
        normalized.includes('company') ||
        normalized.includes('companies')
      ) {
        const companies = mockCompanies.slice(0, 2).map((company) => ({
          id: company.id,
          name: company.name,
          industry: company.industry,
        }))
        yield { type: 'companies', companies }
        yield { type: 'text', content: 'Aquí tienes algunas empresas relacionadas.' }
      } else if (normalized.includes('no sé') || normalized.includes('no se')) {
        // Intentionally no text chunk: no-answer state.
      } else {
        yield { type: 'text', content: 'Esta es una respuesta determinista de demostración.' }
      }

      yield { type: 'done' }
    },

    async searchCompanies(query: string): Promise<Company[]> {
      const term = query.toLowerCase()
      return mockCompanies.filter(
        (company) =>
          company.name.toLowerCase().includes(term) ||
          (company.industry?.toLowerCase().includes(term) ?? false),
      )
    },
  }
}
