import { useUnistyles } from 'react-native-unistyles'

export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg'

const VALID_BREAKPOINTS: readonly Breakpoint[] = ['xs', 'sm', 'md', 'lg']

const isValidBreakpoint = (value: unknown): value is Breakpoint =>
  typeof value === 'string' && (VALID_BREAKPOINTS as readonly string[]).includes(value)

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

/**
 * Project-specific adapter over react-native-unistyles `useUnistyles()`.
 *
 * react-native-unistyles v3 has changed the runtime shape across releases:
 * sometimes the breakpoint is exposed directly, sometimes under `runtime`,
 * and sometimes under `rt`. This hook isolates that volatility so the rest
 * of the app reads a stable, validated `Breakpoint`.
 */
export const useBreakpoint = (): Breakpoint => {
  const result: unknown = useUnistyles()

  if (!isRecord(result)) {
    return 'xs'
  }

  if (isValidBreakpoint(result.breakpoint)) {
    return result.breakpoint
  }

  const runtime = isRecord(result.runtime) ? result.runtime : null
  if (runtime && isValidBreakpoint(runtime.breakpoint)) {
    return runtime.breakpoint
  }

  const rt = isRecord(result.rt) ? result.rt : null
  if (rt && isValidBreakpoint(rt.breakpoint)) {
    return rt.breakpoint
  }

  return 'xs'
}
