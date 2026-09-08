export function extractPrimaryFontFamily(stack: string): string {
  const first = stack.split(',')[0].trim()
  return first.replace(/^["']|["']$/g, '')
}
