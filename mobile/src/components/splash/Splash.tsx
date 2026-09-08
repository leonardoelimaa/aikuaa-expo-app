import React, { useEffect } from 'react'
import { View, Text, ActivityIndicator, type ViewStyle, type TextStyle } from 'react-native'
import { StyleSheet, useUnistyles } from 'react-native-unistyles'

interface SplashProps {
  onComplete?: () => void
  delayMs?: number
}

const SPLASH_DELAY_MS = 1500

export const Splash: React.FC<SplashProps> = ({ onComplete, delayMs = SPLASH_DELAY_MS }) => {
  const { theme } = useUnistyles()

  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete?.()
    }, delayMs)

    return () => clearTimeout(timer)
  }, [delayMs, onComplete])

  return (
    <View
      style={styles.container}
      accessible
      accessibilityLabel="Pantalla de inicio de Aikuaa"
      accessibilityRole="progressbar"
    >
      <Text style={styles.brand}>Aikuaa</Text>
      <Text style={styles.tagline}>Presencia inteligente</Text>
      <ActivityIndicator
        style={styles.spinner}
        color={theme.colors.foreground}
        testID="splash-spinner"
      />
    </View>
  )
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing[6],
  } satisfies ViewStyle,
  brand: {
    fontFamily: theme.fonts.display,
    fontSize: theme.fontSizes[40],
    color: theme.colors.foreground,
    marginBottom: theme.spacing[3],
  } satisfies TextStyle,
  tagline: {
    fontFamily: theme.fonts.body,
    fontSize: theme.fontSizes[16],
    color: theme.colors.secondary,
    marginBottom: theme.spacing[6],
  } satisfies TextStyle,
  spinner: {
    marginTop: theme.spacing[6],
  } satisfies ViewStyle,
}))
