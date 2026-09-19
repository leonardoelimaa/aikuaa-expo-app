import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native'
import { ToolTransparency } from '../ToolTransparency'

const mockSteps = [
  {
    id: 'step-1',
    label: 'Entendí tu pregunta',
    description: 'Analicé las palabras clave para saber qué buscas.',
  },
  {
    id: 'step-2',
    label: 'Busqué empresas',
    description: 'Revisé la base de datos de empresas del evento.',
  },
  {
    id: 'step-3',
    label: 'Organicé la respuesta',
    description: 'Elegí la información más relevante para ti.',
  },
]

describe('ToolTransparency', () => {
  it('renders collapsed header', async () => {
    await render(<ToolTransparency steps={mockSteps} />)

    expect(screen.getByTestId('tool-transparency')).toBeTruthy()
    expect(screen.getByText('Cómo Aikuaa encontró esto')).toBeTruthy()
    expect(screen.queryByTestId('tool-transparency-list')).toBeNull()
  })

  it('expands to show mock tool steps without raw logs', async () => {
    await render(<ToolTransparency steps={mockSteps} />)

    const header = screen.getByTestId('tool-transparency-header')
    fireEvent.press(header)

    await waitFor(() => {
      expect(screen.getByTestId('tool-transparency-list')).toBeTruthy()
    })
    expect(screen.getByText('Entendí tu pregunta')).toBeTruthy()
    expect(screen.getByText('Busqué empresas')).toBeTruthy()
    expect(screen.getByText('Organicé la respuesta')).toBeTruthy()
    expect(screen.getByTestId('tool-step-step-1')).toBeTruthy()
    expect(screen.getByTestId('tool-step-step-2')).toBeTruthy()
    expect(screen.getByTestId('tool-step-step-3')).toBeTruthy()
    expect(screen.queryByText(/raw|log|debug/i)).toBeNull()
  })

  it('uses provided testID', async () => {
    await render(<ToolTransparency steps={mockSteps} testID="custom-tools" />)

    expect(screen.getByTestId('custom-tools')).toBeTruthy()
  })

  it('uses a distinct accessibility label from SourcesCitations', async () => {
    await render(<ToolTransparency steps={mockSteps} />)

    const header = screen.getByTestId('tool-transparency-header')
    expect(header.props.accessibilityLabel).toBe('Cómo Aikuaa encontró esto: pasos')
    expect(header.props.accessibilityHint).toBeDefined()
  })

  it('wraps the expanded list in a Reanimated layout transition', async () => {
    await render(<ToolTransparency steps={mockSteps} />)

    fireEvent.press(screen.getByTestId('tool-transparency-header'))

    await waitFor(() => {
      const list = screen.getByTestId('tool-transparency-list')
      expect(list).toBeTruthy()
      expect(list.props.entering).toBeDefined()
      expect(list.props.exiting).toBeDefined()
      expect(list.props.layout).toBeDefined()
    })
  })
})
