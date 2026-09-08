export type ColorToken = string | { color: string; opacity: number }

function parseHexChannel(hex: string, start: number, length: number): number {
  const segment = hex.slice(start, start + length)
  const value = segment.length === 1 ? segment + segment : segment
  return parseInt(value, 16)
}

export function resolveColor(token: ColorToken): string {
  if (typeof token === 'string') return token

  const hex = token.color.replace('#', '')
  const hasAlpha = hex.length === 4 || hex.length === 8
  const channelLength = hex.length <= 4 ? 1 : 2

  const r = parseHexChannel(hex, 0, channelLength)
  const g = parseHexChannel(hex, channelLength, channelLength)
  const b = parseHexChannel(hex, channelLength * 2, channelLength)
  const a = hasAlpha ? parseHexChannel(hex, channelLength * 3, channelLength) / 255 : token.opacity

  const alpha = Math.round(a * 100) / 100
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}
