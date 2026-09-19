import React from 'react'
import { View, Text, ActivityIndicator, type ViewStyle, type TextStyle } from 'react-native'
import { StyleSheet, useUnistyles } from 'react-native-unistyles'

export interface LoadingStateProps {
  testID?: string
}

export const LoadingState: React.FC<LoadingStateProps> = ({ testID = 'chat-loading-state' }) => {
  const { theme } = useUnistyles()

  return (
    <View style={styles.container} testID={testID} accessibilityRole="progressbar">
      <ActivityIndicator color={theme.colors.primary} />
      <Text style={styles.text}>Aikuaa está pensando...</Text>
    </View>
  )
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginVertical: theme.spacing[2],
    marginHorizontal: theme.spacing[4],
    paddingVertical: theme.spacing[3],
    paddingHorizontal: theme.spacing[4],
    borderRadius: theme.radii['2xl'],
    borderBottomLeftRadius: theme.radii.sm,
    backgroundColor: theme.colors.backgroundSecondary,
    gap: theme.spacing[3],
  } satisfies ViewStyle,
  text: {
    fontFamily: theme.fonts.body,
    fontSize: theme.fontSizes[14],
    color: theme.colors.secondary,
  } satisfies TextStyle,
}))
