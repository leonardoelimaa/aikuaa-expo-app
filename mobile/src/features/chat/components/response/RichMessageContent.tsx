import React, { useMemo } from 'react'
import { View, Text, Linking, type ViewStyle, type TextStyle } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'
import { parseMarkdown, type Block, type InlineToken } from './markdownParser'

export interface RichMessageContentProps {
  content: string
  testID?: string
}

export const RichMessageContent: React.FC<RichMessageContentProps> = ({ content, testID }) => {
  const blocks = useMemo(() => parseMarkdown(content), [content])

  return (
    <View
      style={styles.container}
      testID={testID ?? 'rich-message-content'}
      accessibilityRole="text"
      accessibilityLabel="Contenido con formato"
    >
      {blocks.map((block, index) => renderBlock(block, index))}
    </View>
  )
}

function renderBlock(block: Block, index: number): React.ReactNode {
  const key = `${block.type}-${index}`

  switch (block.type) {
    case 'heading':
      return (
        <Text
          key={key}
          style={[
            styles.heading,
            styles[`heading${block.level}` as keyof typeof styles] as TextStyle,
          ]}
          testID={`rich-heading-${block.level}`}
        >
          {renderInline(block.text, `heading-${index}`)}
        </Text>
      )
    case 'paragraph':
      return (
        <Text key={key} style={styles.paragraph} testID="rich-paragraph">
          {renderInline(block.text, `paragraph-${index}`)}
        </Text>
      )
    case 'codeBlock':
      return (
        <View key={key} style={styles.codeBlock} testID="rich-code-block">
          {block.language ? (
            <Text style={styles.codeLanguage} testID="rich-code-language">
              {block.language.toUpperCase()}
            </Text>
          ) : null}
          <Text style={styles.codeBlockText} testID="rich-code-text">
            {block.text}
          </Text>
        </View>
      )
    case 'unorderedList':
      return (
        <View key={key} style={styles.list} testID="rich-unordered-list">
          {block.items.map((item, itemIndex) => (
            <View key={`ul-${itemIndex}`} style={styles.listItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.listItemText}>
                {renderInline(item, `ul-${index}-${itemIndex}`)}
              </Text>
            </View>
          ))}
        </View>
      )
    case 'orderedList':
      return (
        <View key={key} style={styles.list} testID="rich-ordered-list">
          {block.items.map((item, itemIndex) => (
            <View key={`ol-${itemIndex}`} style={styles.listItem}>
              <Text style={styles.bullet}>{itemIndex + 1}.</Text>
              <Text style={styles.listItemText}>
                {renderInline(item, `ol-${index}-${itemIndex}`)}
              </Text>
            </View>
          ))}
        </View>
      )
    case 'table':
      return (
        <View key={key} style={styles.table} testID="rich-table">
          <View style={styles.tableRow}>
            {block.headers.map((header, headerIndex) => (
              <View key={`th-${headerIndex}`} style={[styles.tableCell, styles.tableHeaderCell]}>
                <Text style={styles.tableHeaderText}>{header}</Text>
              </View>
            ))}
          </View>
          {block.rows.map((row, rowIndex) => (
            <View key={`tr-${rowIndex}`} style={styles.tableRow}>
              {row.map((cell, cellIndex) => (
                <View key={`td-${cellIndex}`} style={styles.tableCell}>
                  <Text style={styles.tableCellText}>{cell}</Text>
                </View>
              ))}
            </View>
          ))}
        </View>
      )
    default:
      return null
  }
}

function tokenizeInline(text: string): InlineToken[] {
  const tokens: InlineToken[] = []
  let i = 0

  const emitText = (end: number) => {
    if (i < end) {
      tokens.push({ type: 'text', content: text.slice(i, end) })
      i = end
    }
  }

  while (i < text.length) {
    // Bold: **text**
    if (text.slice(i, i + 2) === '**') {
      const end = text.indexOf('**', i + 2)
      if (end !== -1) {
        tokens.push({ type: 'bold', content: text.slice(i + 2, end) })
        i = end + 2
        continue
      }
    }

    // Italic: *text* (but not **)
    if (text[i] === '*' && text[i + 1] !== '*') {
      const end = text.indexOf('*', i + 1)
      if (end !== -1 && text[end + 1] !== '*') {
        tokens.push({ type: 'italic', content: text.slice(i + 1, end) })
        i = end + 1
        continue
      }
    }

    // Italic: _text_
    if (text[i] === '_') {
      const end = text.indexOf('_', i + 1)
      if (end !== -1) {
        tokens.push({ type: 'italic', content: text.slice(i + 1, end) })
        i = end + 1
        continue
      }
    }

    // Inline code: `text`
    if (text[i] === '`') {
      const end = text.indexOf('`', i + 1)
      if (end !== -1) {
        tokens.push({ type: 'code', content: text.slice(i + 1, end) })
        i = end + 1
        continue
      }
    }

    // Link: [text](url)
    if (text[i] === '[') {
      const closeBracket = text.indexOf(']', i + 1)
      const openParen = closeBracket !== -1 ? text.indexOf('(', closeBracket + 1) : -1
      const closeParen = openParen !== -1 ? text.indexOf(')', openParen + 1) : -1
      if (closeParen !== -1 && openParen === closeBracket + 1) {
        tokens.push({
          type: 'link',
          content: text.slice(i + 1, closeBracket),
          url: text.slice(openParen + 1, closeParen),
        })
        i = closeParen + 1
        continue
      }
    }

    // Plain text: advance to the next special character
    let nextSpecial = text.length
    const specialChars = ['*', '_', '`', '[']
    for (const char of specialChars) {
      const pos = text.indexOf(char, i + 1)
      if (pos !== -1 && pos < nextSpecial) {
        nextSpecial = pos
      }
    }
    emitText(nextSpecial)
  }

  return tokens
}

function renderInline(text: string, keyPrefix: string): React.ReactNode {
  const tokens = tokenizeInline(text)
  return tokens.map((token, index) => {
    const key = `${keyPrefix}-inline-${index}`

    switch (token.type) {
      case 'bold':
        return (
          <Text key={key} style={styles.bold} testID="rich-bold">
            {token.content}
          </Text>
        )
      case 'italic':
        return (
          <Text key={key} style={styles.italic} testID="rich-italic">
            {token.content}
          </Text>
        )
      case 'code':
        return (
          <Text key={key} style={styles.inlineCode} testID="rich-inline-code">
            {token.content}
          </Text>
        )
      case 'link':
        return (
          <Text
            key={key}
            style={styles.link}
            onPress={() => Linking.openURL(token.url)}
            accessibilityRole="link"
            accessibilityLabel={`Enlace: ${token.content}`}
            testID="rich-link"
          >
            {token.content}
          </Text>
        )
      default:
        return <Text key={key}>{token.content}</Text>
    }
  })
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flexDirection: 'column',
  } satisfies ViewStyle,
  heading: {
    fontFamily: theme.fonts.display,
    color: theme.colors.foreground,
    marginVertical: theme.spacing[2],
  } satisfies TextStyle,
  heading1: {
    fontSize: theme.fontSizes[24],
    fontWeight: theme.fontWeights.bold,
  } satisfies TextStyle,
  heading2: {
    fontSize: theme.fontSizes[20],
    fontWeight: theme.fontWeights.bold,
  } satisfies TextStyle,
  heading3: {
    fontSize: theme.fontSizes[18],
    fontWeight: theme.fontWeights.semibold,
  } satisfies TextStyle,
  heading4: {
    fontSize: theme.fontSizes[16],
    fontWeight: theme.fontWeights.semibold,
  } satisfies TextStyle,
  heading5: {
    fontSize: theme.fontSizes[14],
    fontWeight: theme.fontWeights.semibold,
  } satisfies TextStyle,
  heading6: {
    fontSize: theme.fontSizes[12],
    fontWeight: theme.fontWeights.semibold,
  } satisfies TextStyle,
  paragraph: {
    fontFamily: theme.fonts.body,
    fontSize: theme.fontSizes[16],
    color: theme.colors.foreground,
    lineHeight: theme.lineHeights[22],
    marginVertical: theme.spacing[2],
  } satisfies TextStyle,
  bold: {
    fontWeight: theme.fontWeights.bold,
  } satisfies TextStyle,
  italic: {
    fontStyle: 'italic',
  } satisfies TextStyle,
  link: {
    color: theme.colors.primary,
    textDecorationLine: 'underline',
  } satisfies TextStyle,
  inlineCode: {
    fontFamily: theme.fonts.mono,
    fontSize: theme.fontSizes[14],
    backgroundColor: theme.colors.muted,
    color: theme.colors.foreground,
    paddingHorizontal: theme.spacing[1],
    borderRadius: theme.radii.sm,
  } satisfies TextStyle,
  codeBlock: {
    backgroundColor: theme.colors.muted,
    borderRadius: theme.radii.md,
    padding: theme.spacing[3],
    marginVertical: theme.spacing[2],
  } satisfies ViewStyle,
  codeLanguage: {
    fontFamily: theme.fonts.mono,
    fontSize: theme.fontSizes[12],
    color: theme.colors.foreground,
    fontWeight: theme.fontWeights.semibold,
    marginBottom: theme.spacing[2],
    textTransform: 'uppercase',
  } satisfies TextStyle,
  codeBlockText: {
    fontFamily: theme.fonts.mono,
    fontSize: theme.fontSizes[14],
    color: theme.colors.foreground,
  } satisfies TextStyle,
  list: {
    marginVertical: theme.spacing[2],
    paddingLeft: theme.spacing[2],
  } satisfies ViewStyle,
  listItem: {
    flexDirection: 'row',
    marginVertical: theme.spacing[1],
  } satisfies ViewStyle,
  bullet: {
    fontFamily: theme.fonts.body,
    fontSize: theme.fontSizes[16],
    color: theme.colors.foreground,
    marginRight: theme.spacing[2],
    minWidth: theme.spacing[4],
  } satisfies TextStyle,
  listItemText: {
    fontFamily: theme.fonts.body,
    fontSize: theme.fontSizes[16],
    color: theme.colors.foreground,
    flex: 1,
    lineHeight: theme.lineHeights[22],
  } satisfies TextStyle,
  table: {
    marginVertical: theme.spacing[2],
    borderWidth: 1,
    borderColor: theme.colors.muted,
    borderRadius: theme.radii.md,
    overflow: 'hidden',
  } satisfies ViewStyle,
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.muted,
  } satisfies ViewStyle,
  tableCell: {
    flex: 1,
    padding: theme.spacing[2],
    borderRightWidth: 1,
    borderRightColor: theme.colors.muted,
  } satisfies ViewStyle,
  tableHeaderCell: {
    backgroundColor: theme.colors.backgroundSecondary,
  } satisfies ViewStyle,
  tableHeaderText: {
    fontFamily: theme.fonts.body,
    fontSize: theme.fontSizes[14],
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.foreground,
  } satisfies TextStyle,
  tableCellText: {
    fontFamily: theme.fonts.body,
    fontSize: theme.fontSizes[14],
    color: theme.colors.foreground,
  } satisfies TextStyle,
}))
