import { fireEvent, render, screen } from '@testing-library/react-native'
import { Button } from '../Button'

describe('Button', () => {
  it('exposes its label and button semantics through the public control', async () => {
    const onPress = jest.fn()

    await render(<Button label="Continuar" onPress={onPress} />)

    const button = screen.getByRole('button', { name: 'Continuar' })
    expect(button).toHaveStyle({ minHeight: 48, backgroundColor: '#0F1F38' })

    await fireEvent.press(button)
    expect(onPress).toHaveBeenCalledTimes(1)
  })

  it('renders pressed and keyboard-focus treatments', async () => {
    await render(<Button label="Continuar" onPress={jest.fn()} testID="button" />)

    const button = screen.getByTestId('button')
    await fireEvent(button, 'pressIn')
    expect(button).toHaveStyle({ backgroundColor: '#0A1628' })

    await fireEvent(button, 'pressOut')
    await fireEvent(button, 'focus')
    expect(button).toHaveStyle({ borderColor: '#4A6B96', borderWidth: 3 })
  })

  it('announces and enforces its disabled state', async () => {
    const onPress = jest.fn()

    await render(<Button label="Indisponível" onPress={onPress} disabled />)

    const button = screen.getByRole('button', { name: 'Indisponível' })
    expect(button).toHaveProp('accessibilityState', { disabled: true })
    expect(button).toHaveStyle({ backgroundColor: '#EBE8DF' })

    await fireEvent.press(button)
    expect(onPress).not.toHaveBeenCalled()
  })
})
