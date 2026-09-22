import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native'
import { DemoResetButton } from '../DemoResetButton'
import { getServices, resetServices, createMockServices } from '@/services/serviceRegistry'
import { createMockConversationService } from '@/services/conversation.service'
import { resetDemoState } from '@/stores/demoStore'

jest.mock('@/services/serviceRegistry', () => ({
  ...jest.requireActual('@/services/serviceRegistry'),
  getServices: jest.fn(),
}))

const mockedGetServices = jest.mocked(getServices)

jest.mock('react-native-unistyles')

describe('DemoResetButton', () => {
  beforeEach(async () => {
    jest.clearAllMocks()
    resetServices()
    mockedGetServices.mockReturnValue(createMockServices())
    await resetDemoState()
  })

  it('renders the operator action warning and reset button', async () => {
    await render(<DemoResetButton />)

    expect(screen.getByText('Ação do operador da demonstração')).toBeTruthy()
    expect(screen.getByText('Restaurar demonstração')).toBeTruthy()
  })

  it('resets demo state and records a demo_reset analytics event when pressed', async () => {
    const services = createMockServices()
    mockedGetServices.mockReturnValue(services)
    const trackSpy = jest.spyOn(services.analytics, 'track')

    const service = createMockConversationService()
    await service.createConversation('workspace-acme', { title: 'Temp', initialMessage: 'x' })
    expect((await service.listConversations('workspace-acme')).length).toBeGreaterThan(1)

    await render(<DemoResetButton />)

    fireEvent.press(screen.getByTestId('demo-reset-pressable'))

    await waitFor(() => {
      expect(screen.getByTestId('demo-reset-confirmation').props.children).toBe(
        'Demonstração restaurada',
      )
    })

    const conversations = await service.listConversations('workspace-acme')
    expect(conversations).toHaveLength(1)
    expect(conversations[0].id).toBe('conv-acme-welcome')

    expect(trackSpy).toHaveBeenCalledTimes(1)
    expect(trackSpy).toHaveBeenCalledWith(
      'demo_reset',
      expect.objectContaining({
        workspaceId: 'workspace-acme',
        tenantId: 'aikuaa-demo-tenant',
      }),
    )
  })

  it('calls onReset callback after a successful reset', async () => {
    const onReset = jest.fn()

    await render(<DemoResetButton onReset={onReset} />)

    fireEvent.press(screen.getByTestId('demo-reset-pressable'))

    await waitFor(() => {
      expect(onReset).toHaveBeenCalled()
    })
  })
})
