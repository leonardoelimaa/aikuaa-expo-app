import { ACME_WORKSPACE_ID } from '../../types/app'
import { resetDemoState } from '../../stores/demoStore'
import { sessionStore } from '../../stores/sessionStore'
import { createMockConversationService } from '../conversation.service'

describe('resetDemoState', () => {
  beforeEach(async () => {
    await resetDemoState()
  })

  it('restores the default conversation for the active workspace', async () => {
    const service = createMockConversationService()

    await service.createConversation(ACME_WORKSPACE_ID, {
      title: 'Temp',
      initialMessage: 'x',
    })
    expect((await service.listConversations(ACME_WORKSPACE_ID)).length).toBeGreaterThan(1)

    await resetDemoState()

    const conversations = await service.listConversations(ACME_WORKSPACE_ID)
    expect(conversations).toHaveLength(1)
    expect(conversations[0].id).toBe('conv-acme-welcome')
  })

  it('clears session state', async () => {
    await sessionStore.set('draft', 'value')
    expect(await sessionStore.get('draft')).toBe('value')
    await resetDemoState()
    expect(await sessionStore.get('draft')).toBeUndefined()
  })
})
