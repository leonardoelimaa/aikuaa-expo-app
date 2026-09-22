import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react-native'

import AppLayout from '@/app/(app)/_layout'
import TabsLayout from '@/app/(app)/(tabs)/_layout'
import ConversationsScreen from '@/app/(app)/(tabs)/conversations'
import LegacyChatRoute from '@/app/(app)/chat'
import LegacyEventRoute from '@/app/(app)/event'
import LegacyHistoryRoute from '@/app/(app)/history'
import IndexRoute from '@/app/index'

jest.disableAutomock()
jest.unmock('@testing-library/react-native')

const mockPush = jest.fn()
const mockReplace = jest.fn()
const mockBack = jest.fn()

jest.mock('expo-router', () => {
  const React = require('react')
  const { Text, View } = require('react-native')
  const createMockRouter = () => ({
    push: mockPush,
    replace: mockReplace,
    back: mockBack,
    canGoBack: jest.fn(() => true),
  })

  const makeNavigator = (kind: 'tabs' | 'stack') => {
    const Navigator = ({ children }: { children?: React.ReactNode }) =>
      React.createElement(View, { testID: `${kind}-navigator` }, children)

    Navigator.Screen = ({ name, options = {} }: any) => {
      const resolved =
        typeof options === 'function'
          ? options({ navigation: createMockRouter(), route: { key: name, name } })
          : options
      const label = resolved.title ?? resolved.tabBarLabel ?? name
      const headerRight =
        typeof resolved.headerRight === 'function'
          ? resolved.headerRight({ tintColor: '#000000' })
          : null

      return React.createElement(
        View,
        { testID: `${kind}-screen-${name}` },
        React.createElement(
          Text,
          {
            accessibilityLabel: String(label),
            accessibilityRole: kind === 'tabs' ? 'tab' : 'header',
          },
          String(label),
        ),
        kind === 'tabs'
          ? React.createElement(
              Text,
              { testID: `tab-presentation-${name}` },
              resolved.tabBarIcon ? 'icon' : 'label-only',
            )
          : null,
        headerRight,
      )
    }

    return Navigator
  }

  return {
    Redirect: ({ href }: { href: string }) =>
      React.createElement(Text, { testID: 'redirect' }, href),
    Stack: makeNavigator('stack'),
    Tabs: makeNavigator('tabs'),
    useLocalSearchParams: jest.fn(() => ({})),
    useRouter: createMockRouter,
  }
})

jest.mock('@/context/AppContext', () => ({
  useAppContext: () => ({
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
    resetDemo: jest.fn(),
  }),
}))

describe('product navigation shell contract', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('exposes exactly the three label-only product tabs', async () => {
    await render(<TabsLayout />)

    expect(screen.getAllByRole('tab')).toHaveLength(3)
    expect(screen.getByRole('tab', { name: 'Assistant' })).toBeTruthy()
    expect(screen.getByRole('tab', { name: 'Conversations' })).toBeTruthy()
    expect(screen.getByRole('tab', { name: 'Workspace' })).toBeTruthy()
    expect(screen.getByTestId('tab-presentation-assistant')).toHaveTextContent('label-only')
    expect(screen.getByTestId('tab-presentation-conversations')).toHaveTextContent('label-only')
    expect(screen.getByTestId('tab-presentation-workspace')).toHaveTextContent('label-only')
  })

  it('keeps settings outside the tabs and exposes it as a header action', async () => {
    await render(<AppLayout />)

    expect(screen.queryByRole('tab', { name: 'Configurações' })).toBeNull()
    await fireEvent.press(screen.getByRole('button', { name: 'Configurações' }))
    expect(mockPush).toHaveBeenCalledWith('/(app)/settings')
  })

  it('offers a truthful empty-conversations action to the Assistant', async () => {
    await render(<ConversationsScreen />)

    expect(screen.getByRole('header', { name: 'Nenhuma conversa ainda' })).toBeTruthy()
    await fireEvent.press(screen.getByRole('button', { name: 'Ir para o Assistant' }))
    expect(mockPush).toHaveBeenCalledWith('/(app)/(tabs)/assistant')
  })

  it.each([
    ['index', IndexRoute, '/(app)/(tabs)/assistant'],
    ['chat', LegacyChatRoute, '/(app)/(tabs)/assistant'],
    ['history', LegacyHistoryRoute, '/(app)/(tabs)/conversations'],
    ['event', LegacyEventRoute, '/(app)/(tabs)/workspace'],
  ])('redirects the %s compatibility route to its canonical path', async (_, Route, path) => {
    await render(<Route />)

    expect(screen.getByTestId('redirect')).toHaveTextContent(path)
  })
})
