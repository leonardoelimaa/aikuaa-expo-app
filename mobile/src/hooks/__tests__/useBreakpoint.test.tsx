import { useUnistyles } from 'react-native-unistyles'
import { useBreakpoint } from '../useBreakpoint'

jest.mock('react-native-unistyles')

const mockUseUnistyles = useUnistyles as jest.Mock

describe('useBreakpoint', () => {
  afterEach(() => {
    mockUseUnistyles.mockReset()
  })

  it('returns the direct breakpoint from Unistyles', () => {
    mockUseUnistyles.mockReturnValue({ breakpoint: 'md' })

    expect(useBreakpoint()).toBe('md')
  })

  it('falls back to runtime.breakpoint when direct value is absent', () => {
    mockUseUnistyles.mockReturnValue({
      runtime: { breakpoint: 'lg' },
    })

    expect(useBreakpoint()).toBe('lg')
  })

  it('falls back to rt.breakpoint for alternate runtime key', () => {
    mockUseUnistyles.mockReturnValue({
      rt: { breakpoint: 'sm' },
    })

    expect(useBreakpoint()).toBe('sm')
  })

  it('defaults to xs when no breakpoint is provided', () => {
    mockUseUnistyles.mockReturnValue({})

    expect(useBreakpoint()).toBe('xs')
  })

  it('defaults to xs when the direct breakpoint is not a valid breakpoint string', () => {
    mockUseUnistyles.mockReturnValue({ breakpoint: 'xl' })

    expect(useBreakpoint()).toBe('xs')
  })

  it('defaults to xs when the runtime breakpoint is not a valid breakpoint string', () => {
    mockUseUnistyles.mockReturnValue({
      runtime: { breakpoint: 'unknown' },
      rt: { breakpoint: 'invalid' },
    })

    expect(useBreakpoint()).toBe('xs')
  })

  it('defaults to xs when useUnistyles returns a non-object value', () => {
    mockUseUnistyles.mockReturnValue(null)

    expect(useBreakpoint()).toBe('xs')
  })
})
