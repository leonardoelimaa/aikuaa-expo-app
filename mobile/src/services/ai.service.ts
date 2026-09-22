import type { AIChunk, AIRequest, AIService } from './types'
import { mockCompanies, mockWorkspaces } from '../mocks'
import {
  isWorkspaceId,
  requireCompanyMode,
  requireWorkspaceId,
  type WorkspaceId,
} from '../types/app'

function abortError() {
  const error = new Error('The operation was aborted')
  error.name = 'AbortError'
  return error
}

function assertRequest(request: AIRequest) {
  if (request.signal?.aborted) {
    throw abortError()
  }

  const context = requireCompanyMode(request.context)
  if (!isWorkspaceId(context.workspaceId)) {
    throw new Error('A valid workspace is required')
  }

  const workspace = mockWorkspaces.find((item) => item.id === context.workspaceId)
  if (
    !workspace ||
    workspace.tenantId !== context.tenantId ||
    workspace.companyId !== context.companyId
  ) {
    throw new Error('The workspace does not belong to the active company context')
  }

  return context
}

function scopedCompanies(workspaceId: WorkspaceId) {
  return mockCompanies.filter((company) => company.workspaceId === workspaceId)
}

function normalizeMessage(message: string) {
  return message
    .trim()
    .toLocaleLowerCase('pt-BR')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

export class MockAIService implements AIService {
  async *streamMessage(request: AIRequest): AsyncIterableIterator<AIChunk> {
    const context = assertRequest(request)
    const normalized = normalizeMessage(request.message)
    const beforeYield = () => {
      if (request.signal?.aborted) {
        throw abortError()
      }
    }

    if (request.offline) {
      beforeYield()
      yield {
        type: 'error',
        code: 'OFFLINE',
        message: 'Não há conexão disponível.',
      }
      return
    }

    if (!normalized) {
      beforeYield()
      yield { type: 'text', content: 'Não tenho uma resposta para isso.' }
      beforeYield()
      yield { type: 'done' }
      return
    }

    if (normalized.includes('timeout')) {
      beforeYield()
      yield {
        type: 'error',
        code: 'TIMEOUT',
        message: 'O servidor demorou demais para responder.',
      }
      return
    }

    if (normalized.includes('backend down') || normalized.includes('servidor')) {
      beforeYield()
      yield {
        type: 'error',
        code: 'BACKEND_DOWN',
        message: 'Não foi possível conectar ao servidor.',
      }
      return
    }

    if (normalized.includes('error') || normalized.includes('erro')) {
      beforeYield()
      yield {
        type: 'error',
        code: 'AI_ERROR',
        message: 'Erro simulado do assistente.',
      }
      return
    }

    if (
      normalized.includes('no se') ||
      normalized.includes('nao se') ||
      normalized.includes('nao sei')
    ) {
      beforeYield()
      yield { type: 'done' }
      return
    }

    if (normalized.includes('thinking') || normalized.includes('pensando')) {
      beforeYield()
      yield { type: 'thinking', content: 'Analisando sua pergunta...' }
      beforeYield()
      yield {
        type: 'text',
        content: 'Esta é uma resposta determinística de demonstração.',
      }
      beforeYield()
      yield { type: 'done' }
      return
    }

    if (
      normalized.includes('companies') ||
      normalized.includes('company') ||
      normalized.includes('empresas') ||
      normalized.includes('empresa')
    ) {
      beforeYield()
      yield {
        type: 'companies',
        companies: scopedCompanies(context.workspaceId).map(({ id, name, industry }) => ({
          id,
          name,
          industry,
        })),
      }
      beforeYield()
      yield { type: 'text', content: 'Aqui estão algumas empresas relacionadas.' }
      beforeYield()
      yield { type: 'done' }
      return
    }

    beforeYield()
    yield {
      type: 'text',
      content: 'Esta é uma resposta determinística de demonstração.',
    }
    beforeYield()
    yield { type: 'done' }
  }

  async searchCompanies(workspaceId: WorkspaceId | string, query: string) {
    const owner = requireWorkspaceId(workspaceId)
    const term = query.trim().toLocaleLowerCase('pt-BR')
    return scopedCompanies(owner)
      .filter(
        (company) =>
          !term ||
          company.name.toLocaleLowerCase('pt-BR').includes(term) ||
          company.industry?.toLocaleLowerCase('pt-BR').includes(term),
      )
      .map((company) => ({ ...company }))
  }
}

export function createMockAIService(): AIService {
  return new MockAIService()
}
