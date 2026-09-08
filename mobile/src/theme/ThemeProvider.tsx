import { type ReactNode } from 'react'

/**
 * Intentional pass-through shim.
 *
 * react-native-unistyles v3 does not require a React provider; `StyleSheet.configure`
 * is called once in `@/theme/unistyles`. This component exists so the root layout
 * (`src/app/_layout.tsx`) does not change when the theme system is migrated again.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  return <>{children}</>
}
