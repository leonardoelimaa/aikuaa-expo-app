import { fireEvent, render, screen } from '@testing-library/react-native'
import { TextField } from '../TextField'

describe('TextField', () => {
  it('associates the visible label and hint with the editable field', async () => {
    await render(
      <TextField
        label="Pergunta"
        hint="Use uma frase completa."
        value=""
        onChangeText={jest.fn()}
      />,
    )

    expect(screen.getByText('Pergunta')).toBeTruthy()
    expect(screen.getByText('Use uma frase completa.')).toBeTruthy()
    expect(screen.getByLabelText('Pergunta')).toHaveProp('accessibilityState', { disabled: false })
  })

  it('shows a visible focus state and forwards text changes', async () => {
    const onChangeText = jest.fn()
    await render(<TextField label="Pergunta" value="" onChangeText={onChangeText} testID="field" />)

    const field = screen.getByTestId('field')
    await fireEvent(field, 'focus')
    expect(field).toHaveStyle({ borderColor: '#4A6B96', borderWidth: 3 })

    await fireEvent.changeText(field, 'Qual é o prazo?')
    expect(onChangeText).toHaveBeenCalledWith('Qual é o prazo?')
  })

  it('announces and styles the disabled state', async () => {
    await render(<TextField label="Pergunta" value="Bloqueada" onChangeText={jest.fn()} disabled />)

    const field = screen.getByLabelText('Pergunta')
    expect(field).toHaveProp('accessibilityState', { disabled: true })
    expect(field).toHaveProp('editable', false)
    expect(field).toHaveStyle({ backgroundColor: '#EBE8DF', color: '#2A4D7A' })
  })
})
