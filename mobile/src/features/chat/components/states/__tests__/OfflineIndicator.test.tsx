import React from 'react'
import { render, screen } from '@testing-library/react-native'
import { OfflineIndicator } from '../OfflineIndicator'

describe('OfflineIndicator', () => {
  it('renders offline title and message', async () => {
    await render(<OfflineIndicator />)

    expect(screen.getByTestId('offline-indicator')).toBeTruthy()
    expect(screen.getByText('Sin conexión')).toBeTruthy()
    expect(
      screen.getByText('No hay conexión disponible. El asistente está desconectado.'),
    ).toBeTruthy()
  })
})
