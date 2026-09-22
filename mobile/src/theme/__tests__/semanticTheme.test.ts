import { palette, rawColors } from '../tokens/colors'
import { theme } from '../theme'

describe('semantic light theme', () => {
  it('exposes the verified Aikuaa cream and navy palette', () => {
    expect(palette.cream).toEqual({
      50: '#FAF9F6',
      100: '#F5F3ED',
      200: '#EBE8DF',
    })
    expect(palette.navy).toEqual({
      300: '#A8BDD4',
      400: '#7A96B8',
      500: '#4A6B96',
      600: '#2A4D7A',
      700: '#1E3A61',
      800: '#162B4A',
      900: '#0F1F38',
      950: '#0A1628',
    })
  })

  it('maps semantic surfaces, content, focus, and disabled roles', () => {
    expect(rawColors).toMatchObject({
      canvas: palette.cream[50],
      surface: palette.white,
      surfaceMuted: palette.cream[100],
      surfaceSunken: palette.cream[200],
      content: palette.navy[950],
      contentSubtle: palette.navy[600],
      action: palette.navy[900],
      actionPressed: palette.navy[950],
      focusRing: palette.navy[500],
      disabledSurface: palette.cream[200],
      disabledContent: palette.navy[600],
    })
    expect(theme.colors.background).toBe(theme.colors.canvas)
    expect(theme.colors.foreground).toBe(theme.colors.content)
  })

  it('uses the three verified brand typefaces', () => {
    expect(theme.fonts).toEqual({
      display: 'Manrope',
      body: 'DM Sans',
      mono: 'DM Mono',
    })
  })
})
