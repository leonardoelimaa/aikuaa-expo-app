import React from 'react'
import { render, screen } from '@testing-library/react-native'
import { RichMessageContent } from '../RichMessageContent'
import * as MarkdownParser from '../markdownParser'

describe('RichMessageContent', () => {
  it('renders a paragraph', async () => {
    await render(<RichMessageContent content="Este es un párrafo simple." />)

    expect(screen.getByTestId('rich-message-content')).toBeTruthy()
    expect(screen.getByTestId('rich-paragraph')).toBeTruthy()
    expect(screen.getByText('Este es un párrafo simple.')).toBeTruthy()
  })

  it('renders headers of different levels', async () => {
    await render(
      <RichMessageContent
        content={`# Título 1
## Título 2
### Título 3`}
      />,
    )

    expect(screen.getByTestId('rich-heading-1')).toBeTruthy()
    expect(screen.getByTestId('rich-heading-2')).toBeTruthy()
    expect(screen.getByTestId('rich-heading-3')).toBeTruthy()
    expect(screen.getByText('Título 1')).toBeTruthy()
    expect(screen.getByText('Título 2')).toBeTruthy()
    expect(screen.getByText('Título 3')).toBeTruthy()
  })

  it('renders bold and italic inline styles', async () => {
    await render(<RichMessageContent content="Texto **negrita** y *cursiva*." />)

    expect(screen.getByTestId('rich-paragraph')).toBeTruthy()
    expect(screen.getAllByTestId('rich-bold')).toHaveLength(1)
    expect(screen.getAllByTestId('rich-italic')).toHaveLength(1)
    expect(screen.getByText('negrita')).toBeTruthy()
    expect(screen.getByText('cursiva')).toBeTruthy()
  })

  it('renders a link', async () => {
    await render(<RichMessageContent content="Visita [Aikuaa](https://aikuaa.example)." />)

    expect(screen.getByTestId('rich-link')).toBeTruthy()
    expect(screen.getByText('Aikuaa')).toBeTruthy()
  })

  it('renders inline code', async () => {
    await render(<RichMessageContent content="Usa el comando `npm start`." />)

    expect(screen.getByTestId('rich-inline-code')).toBeTruthy()
    expect(screen.getByText('npm start')).toBeTruthy()
  })

  it('renders a code block', async () => {
    await render(
      <RichMessageContent content={'```typescript\nconst x = 1;\nconsole.log(x);\n```'} />,
    )

    expect(screen.getByTestId('rich-code-block')).toBeTruthy()
    expect(screen.getByTestId('rich-code-language')).toBeTruthy()
    expect(screen.getByText('TYPESCRIPT')).toBeTruthy()
    expect(screen.getByTestId('rich-code-text')).toBeTruthy()
  })

  it('renders unordered and ordered lists', async () => {
    await render(
      <RichMessageContent content={'- Primer ítem\n- Segundo ítem\n\n1. Paso uno\n2. Paso dos'} />,
    )

    expect(screen.getByTestId('rich-unordered-list')).toBeTruthy()
    expect(screen.getByTestId('rich-ordered-list')).toBeTruthy()
    expect(screen.getByText('Primer ítem')).toBeTruthy()
    expect(screen.getByText('Segundo ítem')).toBeTruthy()
    expect(screen.getByText('Paso uno')).toBeTruthy()
    expect(screen.getByText('Paso dos')).toBeTruthy()
  })

  it('renders a table', async () => {
    await render(
      <RichMessageContent
        content={
          '| Empresa | Sector |\n|---------|--------|\n| Acme    | Ind    |\n| Beta    | Salud  |'
        }
      />,
    )

    expect(screen.getByTestId('rich-table')).toBeTruthy()
    expect(screen.getByText('Empresa')).toBeTruthy()
    expect(screen.getByText('Sector')).toBeTruthy()
    expect(screen.getByText('Acme')).toBeTruthy()
    expect(screen.getByText('Beta')).toBeTruthy()
    expect(screen.getByText('Salud')).toBeTruthy()
  })

  it('uses provided testID', async () => {
    await render(<RichMessageContent content="Hola" testID="custom-rich" />)

    expect(screen.getByTestId('custom-rich')).toBeTruthy()
  })

  it('memoizes markdown parse between renders when content is unchanged', async () => {
    const parseSpy = jest.spyOn(MarkdownParser, 'parseMarkdown')
    const { rerender } = await render(<RichMessageContent content="Hola" testID="rich-a" />)

    expect(parseSpy).toHaveBeenCalledTimes(1)

    await rerender(<RichMessageContent content="Hola" testID="rich-b" />)
    expect(parseSpy).toHaveBeenCalledTimes(1)

    await rerender(<RichMessageContent content="Adiós" testID="rich-c" />)
    expect(parseSpy).toHaveBeenCalledTimes(2)

    parseSpy.mockRestore()
  })
})
