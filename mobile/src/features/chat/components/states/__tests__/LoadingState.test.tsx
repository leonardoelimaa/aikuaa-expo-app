import React from 'react'
import { render, screen } from '@testing-library/react-native'
import { LoadingState } from '../LoadingState'

describe('LoadingState', () => {
  it('renders loading indicator and label', async () => {
    await render(<LoadingState />)

    expect(screen.getByTestId('chat-loading-state')).toBeTruthy()
    expect(screen.getByText('Aikuaa está pensando...')).toBeTruthy()
  })
})
