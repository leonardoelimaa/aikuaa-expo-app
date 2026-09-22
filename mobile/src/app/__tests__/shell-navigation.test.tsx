import React from 'react'
import { render, screen } from '@testing-library/react-native'
import WelcomeCompatibilityRoute from '../welcome'

jest.mock('expo-router', () => ({
  Redirect: ({ href }: { href: string }) => {
    const ReactModule = require('react')
    const { Text } = require('react-native')
    return ReactModule.createElement(Text, { testID: 'redirect' }, href)
  },
}))

describe('shell navigation compatibility', () => {
  it('keeps the legacy welcome URL as a one-way redirect', async () => {
    await render(<WelcomeCompatibilityRoute />)

    expect(screen.getByTestId('redirect')).toHaveTextContent('/')
  })
})
