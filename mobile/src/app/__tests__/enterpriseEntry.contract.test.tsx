import React from 'react'
import { Text } from 'react-native'
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native'
import EntryScreen from '../index'
import { AppContextProvider, useAppContext } from '@/context/AppContext'

jest.mock('expo-router', () => ({
  Redirect: ({ href }: { href: string }) => {
    const ReactModule = require('react')
    const { Text: NativeText } = require('react-native')
    return ReactModule.createElement(NativeText, { testID: 'entry-redirect' }, href)
  },
}))

function ContextProbe() {
  const { context } = useAppContext()
  return <Text testID="context-probe">{JSON.stringify(context)}</Text>
}

describe('enterprise entry contract', () => {
  it('enters the honest company-scoped demo and redirects by state', async () => {
    await render(
      <AppContextProvider>
        <EntryScreen />
        <ContextProbe />
      </AppContextProvider>,
    )

    expect(screen.getByText('Entrar na demonstração')).toBeTruthy()
    expect(screen.queryByText(/evento/i)).toBeNull()

    await fireEvent.press(screen.getByText('Entrar na demonstração'))

    await waitFor(() => {
      expect(screen.getByTestId('context-probe')).toHaveTextContent(
        JSON.stringify({
          mode: 'company',
          workspaceId: 'workspace-acme',
          companyId: 'comp-acme',
          tenantId: 'aikuaa-demo-tenant',
        }),
      )
    })

    expect(screen.queryByText(/evento/i)).toBeNull()
    expect(screen.getByTestId('entry-redirect')).toHaveTextContent('/(app)/(tabs)/assistant')
  })
})
