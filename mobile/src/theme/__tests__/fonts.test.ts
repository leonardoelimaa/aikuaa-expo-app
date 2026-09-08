import { extractPrimaryFontFamily } from '../fonts'

describe('extractPrimaryFontFamily', () => {
  it('strips quotes from a CSS stack', () => {
    expect(extractPrimaryFontFamily('"Manrope", system-ui, sans-serif')).toBe('Manrope')
  })

  it('handles unquoted stacks', () => {
    expect(extractPrimaryFontFamily('DM Sans, system-ui, sans-serif')).toBe('DM Sans')
  })

  it('handles mono stacks', () => {
    expect(extractPrimaryFontFamily('"DM Mono", monospace')).toBe('DM Mono')
  })
})
