import React from 'react'
import { render, screen } from '@testing-library/react-native'
import HomeScreen from '../index'

jest.mock('expo-router', () => {
  const { Text } = require('react-native')

  return {
    Redirect: ({ href }: { href: string }) => <Text testID="redirect">{href}</Text>,
  }
})

describe('HomeScreen', () => {
  it('redirects to the Chat tab', async () => {
    await render(<HomeScreen />)

    expect(screen.getByTestId('redirect').props.children).toBe('/(app)/chat')
  })
})
