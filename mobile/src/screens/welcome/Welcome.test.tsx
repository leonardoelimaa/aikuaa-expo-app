import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react-native'
import { Welcome } from './Welcome'

describe('Welcome', () => {
  it('renders the enterprise headline, value prop and demo CTA', async () => {
    await render(<Welcome onEnterDemo={jest.fn()} />)

    expect(screen.getByText('O conhecimento da sua empresa, acessível')).toBeTruthy()
    expect(
      screen.getByText(
        'Converse com o assistente da sua empresa em uma demonstração segura e determinística.',
      ),
    ).toBeTruthy()
    expect(screen.getByText('Entrar na demonstração')).toBeTruthy()
  })

  it('calls onEnterDemo when the CTA is pressed', async () => {
    const onEnterDemo = jest.fn()

    await render(<Welcome onEnterDemo={onEnterDemo} />)

    fireEvent.press(screen.getByText('Entrar na demonstração'))

    expect(onEnterDemo).toHaveBeenCalledTimes(1)
  })
})
