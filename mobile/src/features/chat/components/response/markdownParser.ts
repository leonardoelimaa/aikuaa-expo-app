export type InlineToken =
  | { type: 'text'; content: string }
  | { type: 'bold'; content: string }
  | { type: 'italic'; content: string }
  | { type: 'code'; content: string }
  | { type: 'link'; content: string; url: string }

export type Block =
  | { type: 'heading'; level: number; text: string }
  | { type: 'paragraph'; text: string }
  | { type: 'codeBlock'; language?: string; text: string }
  | { type: 'unorderedList'; items: string[] }
  | { type: 'orderedList'; items: string[] }
  | { type: 'table'; headers: string[]; rows: string[][] }

export function parseMarkdown(content: string): Block[] {
  const lines = content.split('\n')
  const blocks: Block[] = []
  let index = 0

  while (index < lines.length) {
    const line = lines[index]

    if (line.trim() === '') {
      index++
      continue
    }

    if (line.startsWith('```')) {
      const language = line.slice(3).trim() || undefined
      const start = index + 1
      let end = start
      while (end < lines.length && !lines[end].startsWith('```')) {
        end++
      }
      const codeLines = lines.slice(start, end)
      blocks.push({
        type: 'codeBlock',
        language,
        text: codeLines.join('\n'),
      })
      index = end + 1
      continue
    }

    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/)
    if (headingMatch) {
      blocks.push({
        type: 'heading',
        level: headingMatch[1].length,
        text: headingMatch[2].trim(),
      })
      index++
      continue
    }

    if (isTableRow(line)) {
      const tableLines: string[] = []
      while (index < lines.length && isTableRow(lines[index])) {
        tableLines.push(lines[index])
        index++
      }
      const table = parseTable(tableLines)
      if (table) {
        blocks.push(table)
      }
      continue
    }

    const unorderedMatch = line.match(/^[-*]\s+(.+)$/)
    const orderedMatch = line.match(/^\d+\.\s+(.+)$/)

    if (unorderedMatch) {
      const items: string[] = []
      while (index < lines.length && lines[index].match(/^[-*]\s+(.+)$/)) {
        const match = lines[index].match(/^[-*]\s+(.+)$/)!
        items.push(match[1].trim())
        index++
      }
      blocks.push({ type: 'unorderedList', items })
      continue
    }

    if (orderedMatch) {
      const items: string[] = []
      while (index < lines.length && lines[index].match(/^\d+\.\s+(.+)$/)) {
        const match = lines[index].match(/^\d+\.\s+(.+)$/)!
        items.push(match[1].trim())
        index++
      }
      blocks.push({ type: 'orderedList', items })
      continue
    }

    const paragraphLines: string[] = []
    while (
      index < lines.length &&
      lines[index].trim() !== '' &&
      !lines[index].startsWith('```') &&
      !lines[index].match(/^(#{1,6})\s+/) &&
      !lines[index].match(/^[-*]\s+/) &&
      !lines[index].match(/^\d+\.\s+/) &&
      !isTableRow(lines[index])
    ) {
      paragraphLines.push(lines[index])
      index++
    }
    blocks.push({ type: 'paragraph', text: paragraphLines.join(' ') })
  }

  return blocks
}

function isTableRow(line: string): boolean {
  return line.trim().startsWith('|') && line.trim().endsWith('|')
}

function parseTable(lines: string[]): Block | null {
  if (lines.length < 2) return null

  const cells = (row: string) =>
    row
      .split('|')
      .slice(1, -1)
      .map((cell) => cell.trim())

  const headers = cells(lines[0])
  const separator = cells(lines[1])
  const isSeparator = separator.every((cell) => /^[-:]+[-]*$/.test(cell))

  if (!isSeparator) return null

  const rows = lines.slice(2).map(cells)
  return { type: 'table', headers, rows }
}
