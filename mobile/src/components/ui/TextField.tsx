import { useState } from 'react'
import {
  Text,
  TextInput,
  View,
  type TextInputProps,
  type TextStyle,
  type ViewStyle,
} from 'react-native'
import { StyleSheet, useUnistyles } from 'react-native-unistyles'

export interface TextFieldProps extends Omit<TextInputProps, 'editable' | 'style'> {
  label: string
  hint?: string
  disabled?: boolean
}

export function TextField({
  label,
  hint,
  disabled = false,
  accessibilityHint,
  accessibilityLabel,
  accessibilityState,
  onBlur,
  onFocus,
  ...props
}: TextFieldProps) {
  const { theme } = useUnistyles()
  const [focused, setFocused] = useState(false)

  return (
    <View style={styles.container}>
      <Text style={[styles.label, disabled && styles.disabledText]}>{label}</Text>
      <TextInput
        {...props}
        accessibilityHint={accessibilityHint ?? hint}
        accessibilityLabel={accessibilityLabel ?? label}
        accessibilityState={{ ...accessibilityState, disabled }}
        editable={!disabled}
        onBlur={(event) => {
          setFocused(false)
          onBlur?.(event)
        }}
        onFocus={(event) => {
          setFocused(true)
          onFocus?.(event)
        }}
        placeholderTextColor={theme.colors.contentMuted}
        style={[styles.input, focused && !disabled && styles.focused, disabled && styles.disabled]}
      />
      {hint ? <Text style={[styles.hint, disabled && styles.disabledText]}>{hint}</Text> : null}
    </View>
  )
}

const styles = StyleSheet.create((theme) => ({
  container: {
    gap: theme.spacing[2],
  } satisfies ViewStyle,
  label: {
    color: theme.colors.content,
    fontFamily: theme.fonts.body,
    fontSize: theme.fontSizes[14],
    fontWeight: theme.fontWeights.semibold,
    lineHeight: theme.lineHeights[20],
  } satisfies TextStyle,
  input: {
    minHeight: 48,
    paddingHorizontal: theme.spacing[4],
    paddingVertical: theme.spacing[3],
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radii.lg,
    backgroundColor: theme.colors.surface,
    color: theme.colors.content,
    fontFamily: theme.fonts.body,
    fontSize: theme.fontSizes[16],
    lineHeight: theme.lineHeights[24],
  } satisfies TextStyle,
  focused: {
    borderColor: theme.colors.focusRing,
    borderWidth: 3,
  } satisfies TextStyle,
  disabled: {
    backgroundColor: theme.colors.disabledSurface,
    color: theme.colors.disabledContent,
  } satisfies TextStyle,
  hint: {
    color: theme.colors.contentSubtle,
    fontFamily: theme.fonts.body,
    fontSize: theme.fontSizes[14],
    lineHeight: theme.lineHeights[20],
  } satisfies TextStyle,
  disabledText: {
    color: theme.colors.disabledContent,
  } satisfies TextStyle,
}))
