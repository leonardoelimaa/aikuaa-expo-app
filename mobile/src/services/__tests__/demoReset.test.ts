import { resetDemoState, demoEventContext } from '../../stores/demoStore'
import { sessionStore } from '../../stores/sessionStore'
import { createMockConversationService } from '../conversation.service'

describe('Demo reset integration', () => {
  beforeEach(async () => {
    await resetDemoState()
  })

  it('clears conversations and restores the initial scenario', async () => {
    const service = createMockConversationService()
    await service.createConversation({ title: 'Temp', initialMessage: 'x' })
    const before = await service.listConversations()
    expect(before.length).toBeGreaterThan(1)

    const context = await resetDemoState()

    const after = await service.listConversations()
    expect(after).toHaveLength(1)
    expect(after[0].id).toBe('conv-welcome')
    expect(context).toEqual(demoEventContext)
    expect(context.eventId).toBe('aikuaa-demo-event')
  })

  it('clears session state', async () => {
    await sessionStore.set('draft', 'value')
    expect(await sessionStore.get('draft')).toBe('value')
    await resetDemoState()
    expect(await sessionStore.get('draft')).toBeUndefined()
  })
})
