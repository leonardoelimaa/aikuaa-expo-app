import type { AIChunk } from '../../services/types'

export interface AIResponseScenario {
  input: string
  offline?: boolean
  description: string
  expectedChunks: AIChunk[]
}

export const aiResponseScenarios: Record<string, AIResponseScenario> = {
  success: {
    input: 'hola',
    description: 'Retorna uma resposta determinística de demonstração.',
    expectedChunks: [
      {
        type: 'text',
        content: 'Esta é uma resposta determinística de demonstração.',
      },
      { type: 'done' },
    ],
  },
  thinking: {
    input: 'pensando',
    description: 'Emite pensamento antes da resposta determinística.',
    expectedChunks: [
      { type: 'thinking', content: 'Analisando sua pergunta...' },
      {
        type: 'text',
        content: 'Esta é uma resposta determinística de demonstração.',
      },
      { type: 'done' },
    ],
  },
  companies: {
    input: 'empresas',
    description: 'Retorna somente as empresas do workspace ativo.',
    expectedChunks: [
      {
        type: 'companies',
        companies: [{ id: 'comp-acme', name: 'Acme', industry: 'Tecnologia' }],
      },
      {
        type: 'text',
        content: 'Aqui estão algumas empresas relacionadas.',
      },
      { type: 'done' },
    ],
  },
  error: {
    input: 'erro',
    description: 'Retorna um erro determinístico do assistente.',
    expectedChunks: [
      {
        type: 'error',
        code: 'AI_ERROR',
        message: 'Erro simulado do assistente.',
      },
    ],
  },
  empty: {
    input: '',
    description: 'Retorna a resposta vazia padrão.',
    expectedChunks: [
      { type: 'text', content: 'Não tenho uma resposta para isso.' },
      { type: 'done' },
    ],
  },
  offline: {
    input: 'hola',
    offline: true,
    description: 'Retorna erro quando não há conexão.',
    expectedChunks: [
      {
        type: 'error',
        code: 'OFFLINE',
        message: 'Não há conexão disponível.',
      },
    ],
  },
  noAnswer: {
    input: 'não sei',
    description: 'Finaliza sem conteúdo quando não há resposta.',
    expectedChunks: [{ type: 'done' }],
  },
  timeout: {
    input: 'timeout',
    description: 'Retorna erro quando o servidor demora demais.',
    expectedChunks: [
      {
        type: 'error',
        code: 'TIMEOUT',
        message: 'O servidor demorou demais para responder.',
      },
    ],
  },
  backend: {
    input: 'servidor',
    description: 'Retorna erro quando o backend está indisponível.',
    expectedChunks: [
      {
        type: 'error',
        code: 'BACKEND_DOWN',
        message: 'Não foi possível conectar ao servidor.',
      },
    ],
  },
}
