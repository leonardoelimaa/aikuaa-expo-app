import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native'
import { SourcesCitations } from '../SourcesCitations'

const mockSources = [
  { id: 'src-1', title: 'Base de empresas Aikuaa', url: 'https://aikuaa.example/empresas' },
  { id: 'src-2', title: 'Perfiles del evento', url: 'https://aikuaa.example/evento' },
]

describe('SourcesCitations', () => {
  it('renders collapsed header', async () => {
    await render(<SourcesCitations sources={mockSources} />)

    expect(screen.getByTestId('sources-citations')).toBeTruthy()
    expect(screen.getByText('Cómo Aikuaa encontró esto')).toBeTruthy()
    expect(screen.queryByTestId('sources-citations-list')).toBeNull()
  })

  it('expands and collapses on header press', async () => {
    await render(<SourcesCitations sources={mockSources} />)

    const header = screen.getByTestId('sources-citations-header')
    fireEvent.press(header)

    await waitFor(() => {
      expect(screen.getByTestId('sources-citations-list')).toBeTruthy()
    })
    expect(screen.getByText('Base de empresas Aikuaa')).toBeTruthy()
    expect(screen.getByText('Perfiles del evento')).toBeTruthy()
    expect(screen.getByTestId('source-url-src-1')).toBeTruthy()

    fireEvent.press(header)
    await waitFor(() => {
      expect(screen.queryByTestId('sources-citations-list')).toBeNull()
    })
  })

  it('uses provided testID', async () => {
    await render(<SourcesCitations sources={mockSources} testID="custom-sources" />)

    expect(screen.getByTestId('custom-sources')).toBeTruthy()
  })

  it('uses a distinct accessibility label from ToolTransparency', async () => {
    await render(<SourcesCitations sources={mockSources} />)

    const header = screen.getByTestId('sources-citations-header')
    expect(header.props.accessibilityLabel).toBe('Cómo Aikuaa encontró esto: fuentes')
    expect(header.props.accessibilityHint).toBeDefined()
  })

  it('marks source URLs as accessible links', async () => {
    await render(<SourcesCitations sources={mockSources} />)

    fireEvent.press(screen.getByTestId('sources-citations-header'))

    await waitFor(() => {
      expect(screen.getByTestId('sources-citations-list')).toBeTruthy()
    })

    const url = screen.getByTestId('source-url-src-1')
    expect(url.props.accessibilityRole).toBe('link')
  })

  it('wraps the expanded list in a Reanimated layout transition', async () => {
    await render(<SourcesCitations sources={mockSources} />)

    fireEvent.press(screen.getByTestId('sources-citations-header'))

    await waitFor(() => {
      const list = screen.getByTestId('sources-citations-list')
      expect(list).toBeTruthy()
      expect(list.props.entering).toBeDefined()
      expect(list.props.exiting).toBeDefined()
      expect(list.props.layout).toBeDefined()
    })
  })
})
