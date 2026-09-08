import { Conversation } from '../../services/types'

export const mockConversations: Conversation[] = [
  {
    id: 'conv-welcome',
    title: 'Bienvenida',
    createdAt: '2026-09-08T10:00:00.000Z',
    updatedAt: '2026-09-08T10:05:00.000Z',
    messages: [
      {
        id: 'msg-1',
        role: 'user',
        content: 'Hola',
        createdAt: '2026-09-08T10:00:00.000Z',
      },
      {
        id: 'msg-2',
        role: 'assistant',
        content: '¡Hola! Bienvenido al evento. ¿En qué puedo ayudarte?',
        createdAt: '2026-09-08T10:05:00.000Z',
      },
    ],
  },
]
