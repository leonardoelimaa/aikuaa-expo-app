import { AIChunk } from '../../services/types'

export interface AIResponseScenario {
  input: string
  offline?: boolean
  description: string
  expectedChunks: AIChunk[]
}

export const aiResponseScenarios: Record<string, AIResponseScenario> = {
  success: {
    input: 'hola',
    description: 'Respuesta de texto simple exitosa.',
    expectedChunks: [
      { type: 'text', content: 'Esta es una respuesta determinista de demostración.' },
      { type: 'done' },
    ],
  },
  thinking: {
    input: 'pensando',
    description: 'Emite un chunk de pensamiento antes de responder.',
    expectedChunks: [
      { type: 'thinking', content: 'Analizando tu pregunta...' },
      { type: 'text', content: 'Esta es una respuesta determinista de demostración.' },
      { type: 'done' },
    ],
  },
  companies: {
    input: 'empresas',
    description: 'Devuelve tarjetas de empresa y un texto.',
    expectedChunks: [
      {
        type: 'companies',
        companies: [
          { id: 'comp-acme', name: 'Acme Corp', industry: 'Manufactura' },
          { id: 'comp-beta', name: 'Beta Labs', industry: 'Salud' },
        ],
      },
      { type: 'text', content: 'Aquí tienes algunas empresas relacionadas.' },
      { type: 'done' },
    ],
  },
  error: {
    input: 'error',
    description: 'Simula un error del asistente.',
    expectedChunks: [{ type: 'error', code: 'AI_ERROR', message: 'Error simulado del asistente.' }],
  },
  empty: {
    input: '',
    description: 'Mensaje vacío: no-answer genérico.',
    expectedChunks: [
      { type: 'text', content: 'No tengo una respuesta para eso.' },
      { type: 'done' },
    ],
  },
  offline: {
    input: 'hola',
    offline: true,
    description: 'Simula falta de conexión.',
    expectedChunks: [{ type: 'error', code: 'OFFLINE', message: 'No hay conexión disponible.' }],
  },
  noAnswer: {
    input: 'no se',
    description: 'Consulta sin respuesta conocida.',
    expectedChunks: [{ type: 'done' }],
  },
}
