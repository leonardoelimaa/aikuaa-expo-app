import React from 'react'
import { render, screen } from '@testing-library/react-native'
import AppCompatibilityRoute from '../index'

jest.mock('expo-router', () => ({
  Redirect: ({ href }: { href: string }) => {
    const ReactModule = require('react')
    const { Text } = require('react-native')
    return ReactModule.createElement(Text, { testID: 'redirect' }, href)
  },
}))

describe('app compatibility route', () => {
  it('redirects to the canonical assistant route', async () => {
    await render(<AppCompatibilityRoute />)

    expect(screen.getByTestId('redirect')).toHaveTextContent('/(app)/(tabs)/assistant')
  })
})
