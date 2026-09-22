import { useState } from 'react'
import { Pressable, Text, type PressableProps, type TextStyle, type ViewStyle } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'

export type ButtonVariant = 'primary' | 'secondary' | 'quiet'

export interface ButtonProps extends Omit<
  PressableProps,
  'accessibilityRole' | 'children' | 'style'
> {
  label: string
  variant?: ButtonVariant
}

export function Button({
  label,
  variant = 'primary',
  disabled = false,
  accessibilityLabel,
  accessibilityState,
  onBlur,
  onFocus,
  ...props
}: ButtonProps) {
  const [focused, setFocused] = useState(false)
  const [pressed, setPressed] = useState(false)
  const { onPressIn, onPressOut, ...pressableProps } = props
  const isDisabled = disabled === true

  return (
    <Pressable
      {...pressableProps}
      accessible
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityRole="button"
      accessibilityState={{ ...accessibilityState, disabled: isDisabled }}
      disabled={isDisabled}
      onBlur={(event) => {
        setFocused(false)
        onBlur?.(event)
      }}
      onFocus={(event) => {
        setFocused(true)
        onFocus?.(event)
      }}
      onPressIn={(event) => {
        setPressed(true)
        onPressIn?.(event)
      }}
      onPressOut={(event) => {
        setPressed(false)
        onPressOut?.(event)
      }}
      style={[
        styles.base,
        styles[variant],
        pressed && !isDisabled && styles[`${variant}Pressed`],
        isDisabled && styles.disabled,
        focused && !isDisabled && styles.focused,
      ]}
    >
      <Text style={[styles.label, styles[`${variant}Label`], isDisabled && styles.disabledLabel]}>
        {label}
      </Text>
    </Pressable>
  )
}

const styles = StyleSheet.create((theme) => ({
  base: {
    minHeight: 48,
    minWidth: 48,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing[5],
    paddingVertical: theme.spacing[3],
    borderRadius: theme.radii.lg,
    borderWidth: 1,
  } satisfies ViewStyle,
  primary: {
    backgroundColor: theme.colors.action,
    borderColor: theme.colors.action,
  } satisfies ViewStyle,
  primaryPressed: {
    backgroundColor: theme.colors.actionPressed,
    borderColor: theme.colors.actionPressed,
  } satisfies ViewStyle,
  secondary: {
    backgroundColor: theme.colors.actionSecondary,
    borderColor: theme.colors.action,
  } satisfies ViewStyle,
  secondaryPressed: {
    backgroundColor: theme.colors.surfaceSunken,
    borderColor: theme.colors.actionPressed,
  } satisfies ViewStyle,
  quiet: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
  } satisfies ViewStyle,
  quietPressed: {
    backgroundColor: theme.colors.surfaceSunken,
    borderColor: theme.colors.surfaceSunken,
  } satisfies ViewStyle,
  focused: {
    borderColor: theme.colors.focusRing,
    borderWidth: 3,
  } satisfies ViewStyle,
  disabled: {
    backgroundColor: theme.colors.disabledSurface,
    borderColor: theme.colors.border,
  } satisfies ViewStyle,
  label: {
    fontFamily: theme.fonts.body,
    fontSize: theme.fontSizes[16],
    fontWeight: theme.fontWeights.semibold,
    lineHeight: theme.lineHeights[24],
    textAlign: 'center',
  } satisfies TextStyle,
  primaryLabel: {
    color: theme.colors.onProofSurface,
  } satisfies TextStyle,
  secondaryLabel: {
    color: theme.colors.action,
  } satisfies TextStyle,
  quietLabel: {
    color: theme.colors.action,
  } satisfies TextStyle,
  disabledLabel: {
    color: theme.colors.disabledContent,
  } satisfies TextStyle,
}))
