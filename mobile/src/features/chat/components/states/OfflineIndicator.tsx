import React from 'react'
import { View, Text, type ViewStyle, type TextStyle } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'

export interface OfflineIndicatorProps {
  testID?: string
}

export const OfflineIndicator: React.FC<OfflineIndicatorProps> = ({
  testID = 'offline-indicator',
}) => {
  return (
    <View style={styles.container} testID={testID} accessibilityRole="alert">
      <Text style={styles.title}>Sin conexión</Text>
      <Text style={styles.message}>
        No hay conexión disponible. El asistente está desconectado.
      </Text>
    </View>
  )
}

const styles = StyleSheet.create((theme) => ({
  container: {
    margin: theme.spacing[4],
    padding: theme.spacing[4],
    borderRadius: theme.radii.md,
    backgroundColor: theme.colors.backgroundSecondary,
    borderWidth: 1,
    borderColor: theme.colors.overlay,
    gap: theme.spacing[2],
  } satisfies ViewStyle,
  title: {
    fontFamily: theme.fonts.display,
    fontSize: theme.fontSizes[16],
    fontWeight: theme.fontWeights.semibold,
    color: theme.colors.foreground,
  } satisfies TextStyle,
  message: {
    fontFamily: theme.fonts.body,
    fontSize: theme.fontSizes[14],
    color: theme.colors.secondary,
  } satisfies TextStyle,
}))
