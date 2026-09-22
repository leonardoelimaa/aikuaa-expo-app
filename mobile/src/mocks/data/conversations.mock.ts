import type { Conversation } from '../../services/types'
import { ACME_WORKSPACE_ID, asConversationId, BETA_WORKSPACE_ID } from '../../types/app'

export const mockConversations: Conversation[] = [
  {
    id: asConversationId('conv-acme-welcome'),
    workspaceId: ACME_WORKSPACE_ID,
    title: 'Boas-vindas à Acme',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    messages: [
      {
        id: 'msg-acme-welcome',
        role: 'assistant',
        content: 'Como posso ajudar com o conhecimento da Acme?',
        createdAt: '2026-01-01T00:00:00.000Z',
      },
    ],
  },
  {
    id: asConversationId('conv-beta-welcome'),
    workspaceId: BETA_WORKSPACE_ID,
    title: 'Boas-vindas à Beta',
    createdAt: '2026-01-02T00:00:00.000Z',
    updatedAt: '2026-01-02T00:00:00.000Z',
    messages: [
      {
        id: 'msg-beta-welcome',
        role: 'assistant',
        content: 'Como posso ajudar com as operações da Beta?',
        createdAt: '2026-01-02T00:00:00.000Z',
      },
    ],
  },
]
