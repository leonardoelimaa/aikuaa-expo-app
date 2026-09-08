import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react-native'
import { Welcome } from './Welcome'

describe('Welcome', () => {
  it('renders the brand headline, value prop and CTA', async () => {
    await render(<Welcome onEnterEvent={jest.fn()} />)

    expect(screen.getByText('Simplifica la presencia de tu evento')).toBeTruthy()
    expect(
      screen.getByText('Aikuaa conecta asistentes, voluntarios y organizadores en un solo lugar.'),
    ).toBeTruthy()
    expect(screen.getByText('Entrar al evento demo')).toBeTruthy()
  })

  it('calls onEnterEvent when the CTA is pressed', async () => {
    const onEnterEvent = jest.fn()

    await render(<Welcome onEnterEvent={onEnterEvent} />)

    fireEvent.press(screen.getByText('Entrar al evento demo'))

    expect(onEnterEvent).toHaveBeenCalledTimes(1)
  })
})
