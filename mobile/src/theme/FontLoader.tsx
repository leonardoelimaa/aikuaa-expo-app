import { useFonts } from 'expo-font'
import { Manrope_600SemiBold, Manrope_700Bold } from '@expo-google-fonts/manrope'
import { DMSans_400Regular, DMSans_600SemiBold } from '@expo-google-fonts/dm-sans'
import { DMMono_400Regular } from '@expo-google-fonts/dm-mono'
import { type ReactNode } from 'react'

export function FontLoader({ children }: { children: ReactNode }) {
  const [loaded] = useFonts({
    Manrope: Manrope_600SemiBold,
    ManropeBold: Manrope_700Bold,
    'DM Sans': DMSans_400Regular,
    'DM Sans SemiBold': DMSans_600SemiBold,
    'DM Mono': DMMono_400Regular,
  })

  if (!loaded) return null

  return <>{children}</>
}
