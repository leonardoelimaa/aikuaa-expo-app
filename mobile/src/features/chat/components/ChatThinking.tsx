import React, { useEffect, useState } from 'react'
import { View, Text, Animated, type ViewStyle, type TextStyle } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'

export const ChatThinking: React.FC = () => {
  const [opacity1] = useState(() => new Animated.Value(0.3))
  const [opacity2] = useState(() => new Animated.Value(0.3))
  const [opacity3] = useState(() => new Animated.Value(0.3))

  useEffect(() => {
    const animate = (value: Animated.Value, delay: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.timing(value, {
            toValue: 1,
            duration: 500,
            delay,
            useNativeDriver: true,
          }),
          Animated.timing(value, {
            toValue: 0.3,
            duration: 500,
            useNativeDriver: true,
          }),
        ]),
      )
    }

    const animations = [animate(opacity1, 0), animate(opacity2, 200), animate(opacity3, 400)]

    animations.forEach((animation) => animation.start())

    return () => {
      animations.forEach((animation) => animation.stop())
    }
  }, [opacity1, opacity2, opacity3])

  return (
    <View style={styles.container} testID="chat-thinking" accessibilityRole="progressbar">
      <Text style={styles.label}>Aikuaa está analizando</Text>
      <View style={styles.dots}>
        <Animated.Text style={[styles.dot, { opacity: opacity1 }]}>.</Animated.Text>
        <Animated.Text style={[styles.dot, { opacity: opacity2 }]}>.</Animated.Text>
        <Animated.Text style={[styles.dot, { opacity: opacity3 }]}>.</Animated.Text>
      </View>
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
    gap: theme.spacing[2],
  } satisfies ViewStyle,
  label: {
    fontFamily: theme.fonts.body,
    fontSize: theme.fontSizes[14],
    color: theme.colors.secondary,
  } satisfies TextStyle,
  dots: {
    flexDirection: 'row',
  } satisfies ViewStyle,
  dot: {
    fontFamily: theme.fonts.body,
    fontSize: theme.fontSizes[20],
    color: theme.colors.secondary,
    lineHeight: 18,
    marginHorizontal: 1,
  } satisfies TextStyle,
}))
