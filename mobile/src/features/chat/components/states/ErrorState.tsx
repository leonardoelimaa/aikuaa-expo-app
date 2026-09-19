import React, { useMemo } from 'react'
import { View, Text, Pressable, type ViewStyle, type TextStyle } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'

export interface ErrorStateProps {
  code: string
  message: string
  onRetry?: () => void
  testID?: string
}

interface ErrorConfig {
  title: string
  message: string
}

function getErrorConfig(code: string, fallbackMessage: string): ErrorConfig {
  switch (code) {
    case 'OFFLINE':
      return {
        title: 'Sin conexión',
        message: 'No hay conexión disponible. El asistente está desconectado.',
      }
    case 'TIMEOUT':
      return {
        title: 'Tiempo de espera agotado',
        message: 'El servidor tardó demasiado en responder.',
      }
    case 'BACKEND_DOWN':
      return {
        title: 'Servidor no disponible',
        message: 'No se pudo conectar con el servidor. Intenta de nuevo en unos segundos.',
      }
    case 'NO_ANSWER':
      return {
        title: 'Sin respuesta',
        message: 'No tengo una respuesta para eso. ¿Quieres intentarlo de nuevo?',
      }
    case 'AI_ERROR':
      return {
        title: 'Error del asistente',
        message: fallbackMessage || 'El asistente encontró un problema. Inténtalo de nuevo.',
      }
    default:
      return {
        title: 'Algo salió mal',
        message: fallbackMessage || 'Ocurrió un error inesperado.',
      }
  }
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  code,
  message,
  onRetry,
  testID = 'error-state',
}) => {
  const config = useMemo(() => getErrorConfig(code, message), [code, message])

  return (
    <View style={styles.container} testID={testID} accessibilityRole="alert">
      <Text style={styles.title}>{config.title}</Text>
      <Text style={styles.message}>{config.message}</Text>
      {onRetry ? (
        <Pressable
          style={({ pressed }) => [styles.retryButton, pressed && styles.retryButtonPressed]}
          onPress={onRetry}
          accessibilityRole="button"
          accessibilityLabel="Intentar de nuevo"
          testID="error-state-retry"
        >
          <Text style={styles.retryText}>Intentar de nuevo</Text>
        </Pressable>
      ) : null}
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
    gap: theme.spacing[3],
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
  retryButton: {
    minHeight: 44,
    paddingVertical: theme.spacing[3],
    paddingHorizontal: theme.spacing[4],
    borderRadius: theme.radii.full,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-start',
  } satisfies ViewStyle,
  retryButtonPressed: {
    backgroundColor: theme.colors.primaryHover,
  } satisfies ViewStyle,
  retryText: {
    fontFamily: theme.fonts.body,
    fontSize: theme.fontSizes[14],
    fontWeight: theme.fontWeights.semibold,
    color: theme.colors.white,
  } satisfies TextStyle,
}))
