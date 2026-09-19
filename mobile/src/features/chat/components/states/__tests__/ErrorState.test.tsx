import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react-native'
import { ErrorState } from '../ErrorState'

describe('ErrorState', () => {
  it('renders timeout error and retry button', async () => {
    const onRetry = jest.fn()
    await render(
      <ErrorState
        code="TIMEOUT"
        message="El servidor tardó demasiado en responder."
        onRetry={onRetry}
      />,
    )

    expect(screen.getByTestId('error-state')).toBeTruthy()
    expect(screen.getByText('Tiempo de espera agotado')).toBeTruthy()
    expect(screen.getByText('El servidor tardó demasiado en responder.')).toBeTruthy()

    fireEvent.press(screen.getByTestId('error-state-retry'))
    expect(onRetry).toHaveBeenCalledTimes(1)
  })

  it('renders backend-down error', async () => {
    await render(<ErrorState code="BACKEND_DOWN" message="No se pudo conectar con el servidor." />)

    expect(screen.getByText('Servidor no disponible')).toBeTruthy()
    expect(
      screen.getByText('No se pudo conectar con el servidor. Intenta de nuevo en unos segundos.'),
    ).toBeTruthy()
  })

  it('renders no-answer error with retry', async () => {
    const onRetry = jest.fn()
    await render(
      <ErrorState code="NO_ANSWER" message="No tengo una respuesta para eso." onRetry={onRetry} />,
    )

    expect(screen.getByText('Sin respuesta')).toBeTruthy()
    expect(
      screen.getByText('No tengo una respuesta para eso. ¿Quieres intentarlo de nuevo?'),
    ).toBeTruthy()

    fireEvent.press(screen.getByTestId('error-state-retry'))
    expect(onRetry).toHaveBeenCalledTimes(1)
  })

  it('hides retry button when onRetry is omitted', async () => {
    await render(<ErrorState code="AI_ERROR" message="Error simulado del asistente." />)

    expect(screen.queryByTestId('error-state-retry')).toBeNull()
  })
})
