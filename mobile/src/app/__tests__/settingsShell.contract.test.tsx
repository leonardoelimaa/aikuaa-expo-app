import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react-native'

import AppLayout from '@/app/(app)/_layout'
import SettingsScreen from '@/app/(app)/settings'

jest.disableAutomock()
jest.unmock('@testing-library/react-native')

const mockPush = jest.fn()
const mockReplace = jest.fn()
const mockBack = jest.fn()
const mockResetDemo = jest.fn()
let mockCanGoBack = true
let mockAppContext: any

jest.mock('expo-router', () => {
  const React = require('react')
  const { Text, View } = require('react-native')

  const Stack = ({ children }: { children?: React.ReactNode }) =>
    React.createElement(View, { testID: 'stack-navigator' }, children)
  Stack.Screen = ({ name }: { name: string }) =>
    React.createElement(Text, { testID: `stack-screen-${name}` }, name)
  const Tabs = ({ children }: { children?: React.ReactNode }) =>
    React.createElement(View, { testID: 'tabs-navigator' }, children)
  Tabs.Screen = ({ name }: { name: string }) =>
    React.createElement(Text, { testID: `tabs-screen-${name}` }, name)

  return {
    Redirect: ({ href }: { href: string }) =>
      React.createElement(Text, { testID: 'redirect' }, href),
    Stack,
    Tabs,
    useLocalSearchParams: jest.fn(() => ({})),
    useRouter: () => ({
      push: mockPush,
      replace: mockReplace,
      back: mockBack,
      canGoBack: () => mockCanGoBack,
    }),
  }
})

jest.mock('@/context/AppContext', () => ({
  useAppContext: () => mockAppContext,
}))

function activeContext() {
  return {
    bootStatus: 'ready',
    isDemoActive: true,
    context: {
      mode: 'company',
      workspaceId: 'workspace-acme',
      companyId: 'comp-acme',
      tenantId: 'aikuaa-demo-tenant',
    },
    isResolved: true,
    revision: 1,
    enterDemo: jest.fn(),
    selectWorkspace: jest.fn(),
    resetDemo: mockResetDemo,
  }
}

describe('settings shell and direct-entry guards', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockCanGoBack = true
    mockAppContext = activeContext()
  })

  it('shows a non-navigating loading state while lifecycle restore is pending', async () => {
    mockAppContext = {
      ...activeContext(),
      bootStatus: 'resolving',
      isDemoActive: false,
      context: null,
      isResolved: false,
    }

    const view = await render(<AppLayout />)

    expect(view.getByText('Carregando a demonstração')).toBeTruthy()
    expect(view.queryByTestId('redirect')).toBeNull()
    expect(mockPush).not.toHaveBeenCalled()
    expect(mockReplace).not.toHaveBeenCalled()
  })

  it('guards direct app routes when lifecycle is ready without an active demo', async () => {
    mockAppContext = {
      ...activeContext(),
      bootStatus: 'ready',
      isDemoActive: false,
      context: null,
      isResolved: false,
    }

    const view = await render(<AppLayout />)

    expect(view.getByTestId('redirect')).toHaveTextContent('/')
  })

  it('keeps tabs, settings, and workspace details in the app stack', async () => {
    const view = await render(<AppLayout />)

    expect(view.getByTestId('stack-screen-(tabs)')).toBeTruthy()
    expect(view.getByTestId('stack-screen-settings')).toBeTruthy()
    expect(view.getByTestId('stack-screen-workspace/[workspaceId]')).toBeTruthy()
  })

  it('returns from settings through history and has a canonical fallback', async () => {
    let view = await render(<SettingsScreen />)

    await fireEvent.press(view.getByRole('button', { name: 'Voltar' }))
    expect(mockBack).toHaveBeenCalledTimes(1)

    mockCanGoBack = false
    await view.rerender(<SettingsScreen />)

    await fireEvent.press(view.getByRole('button', { name: 'Voltar' }))
    expect(mockReplace).toHaveBeenCalledWith('/(app)/(tabs)/assistant')
  })

  it('offers workspace switching from Settings on the canonical tab path', async () => {
    const view = await render(<SettingsScreen />)

    expect(view.getByRole('header', { name: 'Configurações' })).toBeTruthy()
    await fireEvent.press(view.getByRole('button', { name: 'Trocar workspace' }))
    expect(mockPush).toHaveBeenCalledWith('/(app)/(tabs)/workspace')
  })

  it('resets demo state before leaving Settings', async () => {
    const view = await render(<SettingsScreen />)

    await fireEvent.press(view.getByRole('button', { name: 'Sair da demonstração' }))
    expect(mockResetDemo).toHaveBeenCalledTimes(1)
    expect(mockReplace).toHaveBeenCalledWith('/')
  })
})
