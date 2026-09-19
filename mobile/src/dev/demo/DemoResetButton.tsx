import React, { useCallback, useState } from 'react'
import {
  View,
  Text,
  Pressable,
  ActivityIndicator,
  type ViewStyle,
  type TextStyle,
} from 'react-native'
import { StyleSheet, useUnistyles } from 'react-native-unistyles'
import { getServices } from '@/services/serviceRegistry'
import { resetDemoState } from '@/stores/demoStore'

export interface DemoResetButtonProps {
  onReset?: () => void
  testID?: string
}

/**
 * Dev/demo operator action that restores the initial event scenario.
 *
 * This is NOT end-user UI. It is intentionally placed in a dev-only area
 * (Settings) so demo operators can reset the app state between runs.
 */
export const DemoResetButton: React.FC<DemoResetButtonProps> = ({ onReset, testID }) => {
  const { theme } = useUnistyles()
  const [isResetting, setIsResetting] = useState(false)
  const [lastResetAt, setLastResetAt] = useState<number | null>(null)

  const handlePress = useCallback(async () => {
    if (isResetting) return

    setIsResetting(true)
    try {
      const context = await resetDemoState()
      await getServices().analytics.track('demo_reset', {
        eventId: context.eventId,
        tenantId: context.tenantId,
      })
      setLastResetAt(Date.now())
      onReset?.()
    } finally {
      setIsResetting(false)
    }
  }, [isResetting, onReset])

  return (
    <View style={styles.container} testID={testID ?? 'demo-reset-button'}>
      <View style={styles.warningBox}>
        <Text style={styles.warningTitle}>Acción de operador demo</Text>
        <Text style={styles.warningText}>
          Restablece conversaciones, sesión y contexto del evento de demostración. No visible para
          usuarios finales.
        </Text>
      </View>

      <Pressable
        style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
        onPress={handlePress}
        disabled={isResetting}
        accessibilityRole="button"
        accessibilityLabel="Restablecer demo"
        accessibilityHint="Restaura el estado inicial del evento de demostración"
        accessibilityState={{ busy: isResetting }}
        testID="demo-reset-pressable"
      >
        {isResetting ? (
          <ActivityIndicator size="small" color={theme.colors.white} testID="demo-reset-spinner" />
        ) : (
          <Text style={styles.buttonText}>Restablecer demo</Text>
        )}
      </Pressable>

      {lastResetAt ? (
        <Text style={styles.confirmation} testID="demo-reset-confirmation">
          Demo restablecida
        </Text>
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create((theme) => ({
  container: {
    marginTop: theme.spacing[6],
    gap: theme.spacing[4],
  } satisfies ViewStyle,
  warningBox: {
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.radii.md,
    padding: theme.spacing[4],
    borderWidth: 1,
    borderColor: theme.colors.overlay,
  } satisfies ViewStyle,
  warningTitle: {
    fontFamily: theme.fonts.display,
    fontSize: theme.fontSizes[14],
    fontWeight: theme.fontWeights.semibold,
    color: theme.colors.foreground,
    marginBottom: theme.spacing[1],
  } satisfies TextStyle,
  warningText: {
    fontFamily: theme.fonts.body,
    fontSize: theme.fontSizes[14],
    color: theme.colors.secondary,
    lineHeight: theme.lineHeights[20],
  } satisfies TextStyle,
  button: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radii.lg,
    minHeight: 48,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: theme.spacing[3],
    paddingHorizontal: theme.spacing[6],
  } satisfies ViewStyle,
  buttonPressed: {
    backgroundColor: theme.colors.primaryHover,
  } satisfies ViewStyle,
  buttonText: {
    fontFamily: theme.fonts.display,
    fontSize: theme.fontSizes[16],
    fontWeight: theme.fontWeights.semibold,
    color: theme.colors.white,
  } satisfies TextStyle,
  confirmation: {
    fontFamily: theme.fonts.body,
    fontSize: theme.fontSizes[14],
    color: theme.colors.secondary,
    textAlign: 'center',
  } satisfies TextStyle,
}))
