import { resolveColor } from '../resolveColor'

describe('resolveColor', () => {
  it('returns hex strings unchanged', () => {
    expect(resolveColor('#FAF9F6')).toBe('#FAF9F6')
  })

  it('resolves an alpha object to rgba', () => {
    expect(resolveColor({ color: '#111423', opacity: 0.12 })).toBe('rgba(17, 20, 35, 0.12)')
  })

  it('resolves a 3-digit hex with alpha', () => {
    expect(resolveColor({ color: '#abc', opacity: 0.5 })).toBe('rgba(170, 187, 204, 0.5)')
  })

  it('respects an 8-digit hex alpha over the object opacity', () => {
    expect(resolveColor({ color: '#11142380', opacity: 0.2 })).toBe('rgba(17, 20, 35, 0.5)')
  })
})
