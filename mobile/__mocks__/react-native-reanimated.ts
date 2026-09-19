import React from 'react'
import { View, Text, type ViewProps, type TextProps } from 'react-native'

type AnimatedViewProps = ViewProps & {
  entering?: unknown
  exiting?: unknown
  layout?: unknown
}

type AnimatedTextProps = TextProps & {
  entering?: unknown
  exiting?: unknown
  layout?: unknown
}

const AnimatedView = React.forwardRef<View, AnimatedViewProps>((props, ref) =>
  React.createElement(View, { ...props, ref }),
)
AnimatedView.displayName = 'Animated.View'

const AnimatedText = React.forwardRef<Text, AnimatedTextProps>((props, ref) =>
  React.createElement(Text, { ...props, ref }),
)
AnimatedText.displayName = 'Animated.Text'

const Reanimated = {
  View: AnimatedView,
  Text: AnimatedText,
}

export default Reanimated

export const Animated = Reanimated

export const FadeIn = { __kind: 'FadeIn' }
export const FadeOut = { __kind: 'FadeOut' }
export const FadeInUp = { __kind: 'FadeInUp' }
export const SlideInLeft = { __kind: 'SlideInLeft' }
export const SlideInRight = { __kind: 'SlideInRight' }
export const LinearTransition = { __kind: 'LinearTransition' }
export const Layout = LinearTransition

export const useSharedValue = <T>(initial: T) => ({ value: initial })
export const useAnimatedStyle = () => ({})
export const useAnimatedProps = () => ({})
export const useAnimatedKeyboard = () => ({
  height: { value: 0 },
  state: { value: 0 },
})
export const useDerivedValue = <T>(fn: () => T) => ({ value: fn() })

export const withTiming = (value: unknown) => value
export const withSpring = (value: unknown) => value
export const withDelay = (_delay: number, value: unknown) => value
export const withSequence = (...animations: unknown[]) => animations[animations.length - 1]
export const withRepeat = (animation: unknown) => animation

export const interpolate = () => 0
export const Extrapolation = {
  CLAMP: 'clamp',
  EXTEND: 'extend',
  IDENTITY: 'identity',
}
export const interpolateColor = () => 'transparent'
export const createAnimatedPropAdapter = () => null
export const processColor = () => 0

export const runOnJS = <T extends (...args: unknown[]) => unknown>(fn: T) => fn
export const runOnUI = <T extends (...args: unknown[]) => unknown>(fn: T) => fn

export const makeMutable = <T>(initial: T) => ({ value: initial })
export const makeShareableCloneRecursive = (value: unknown) => value
export const isSharedValue = () => false
export const enableLayoutAnimations = () => {}
export const configureLayoutAnimations = () => {}
