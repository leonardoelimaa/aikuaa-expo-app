import React, { useState } from 'react'
import { View, Text, TouchableOpacity, type ViewStyle, type TextStyle } from 'react-native'
import Animated, { FadeIn, FadeOut, LinearTransition } from 'react-native-reanimated'
import { StyleSheet } from 'react-native-unistyles'
import { ToolStep } from './types'

export interface ToolTransparencyProps {
  steps: ToolStep[]
  testID?: string
}

export const ToolTransparency: React.FC<ToolTransparencyProps> = ({ steps, testID }) => {
  const [expanded, setExpanded] = useState(false)

  return (
    <View style={styles.container} testID={testID ?? 'tool-transparency'}>
      <TouchableOpacity
        style={styles.header}
        onPress={() => setExpanded((prev) => !prev)}
        accessibilityRole="button"
        accessibilityLabel="Cómo Aikuaa encontró esto: pasos"
        accessibilityHint="Presiona para expandir o contraer los pasos"
        accessibilityState={{ expanded }}
        activeOpacity={0.8}
        testID="tool-transparency-header"
      >
        <Text style={styles.headerText}>Cómo Aikuaa encontró esto</Text>
        <Text style={styles.chevron}>{expanded ? '▲' : '▼'}</Text>
      </TouchableOpacity>
      {expanded && (
        <Animated.View
          entering={FadeIn}
          exiting={FadeOut}
          layout={LinearTransition}
          style={styles.list}
          testID="tool-transparency-list"
        >
          {steps.map((step, index) => (
            <View key={step.id} style={styles.step} testID={`tool-step-${step.id}`}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>{index + 1}</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepLabel}>{step.label}</Text>
                <Text style={styles.stepDescription}>{step.description}</Text>
              </View>
            </View>
          ))}
        </Animated.View>
      )}
    </View>
  )
}

const styles = StyleSheet.create((theme) => ({
  container: {
    marginTop: theme.spacing[3],
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.radii.md,
    overflow: 'hidden',
  } satisfies ViewStyle,
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing[3],
    paddingHorizontal: theme.spacing[4],
    minHeight: 48,
  } satisfies ViewStyle,
  headerText: {
    fontFamily: theme.fonts.body,
    fontSize: theme.fontSizes[14],
    fontWeight: theme.fontWeights.semibold,
    color: theme.colors.foreground,
  } satisfies TextStyle,
  chevron: {
    fontSize: theme.fontSizes[12],
    color: theme.colors.foreground,
  } satisfies TextStyle,
  list: {
    paddingHorizontal: theme.spacing[4],
    paddingBottom: theme.spacing[4],
  } satisfies ViewStyle,
  step: {
    flexDirection: 'row',
    marginVertical: theme.spacing[2],
  } satisfies ViewStyle,
  stepNumber: {
    width: theme.spacing[6],
    height: theme.spacing[6],
    borderRadius: theme.radii.full,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing[3],
  } satisfies ViewStyle,
  stepNumberText: {
    fontFamily: theme.fonts.body,
    fontSize: theme.fontSizes[12],
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.white,
  } satisfies TextStyle,
  stepContent: {
    flex: 1,
  } satisfies ViewStyle,
  stepLabel: {
    fontFamily: theme.fonts.body,
    fontSize: theme.fontSizes[14],
    fontWeight: theme.fontWeights.semibold,
    color: theme.colors.foreground,
  } satisfies TextStyle,
  stepDescription: {
    fontFamily: theme.fonts.body,
    fontSize: theme.fontSizes[12],
    color: theme.colors.foreground,
    marginTop: theme.spacing[1],
    lineHeight: theme.lineHeights[18],
  } satisfies TextStyle,
}))
