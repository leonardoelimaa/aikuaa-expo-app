import React from 'react'
import { View, Text, type ViewStyle, type TextStyle } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StyleSheet } from 'react-native-unistyles'
import { useAppContext } from '@/context/AppContext'

export default function EventScreen() {
  const { context } = useAppContext()

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Evento</Text>
        <Text style={styles.label}>Nombre</Text>
        <Text style={styles.value}>Aikuaa Demo</Text>
        <Text style={styles.label}>ID</Text>
        <Text style={styles.value}>{context.eventId}</Text>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create((theme) => ({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  } satisfies ViewStyle,
  container: {
    flex: 1,
    padding: theme.spacing[6],
  } satisfies ViewStyle,
  title: {
    fontFamily: theme.fonts.display,
    fontSize: theme.fontSizes[24],
    color: theme.colors.foreground,
    marginBottom: theme.spacing[6],
  } satisfies TextStyle,
  label: {
    fontFamily: theme.fonts.body,
    fontSize: theme.fontSizes[12],
    color: theme.colors.muted,
    marginTop: theme.spacing[4],
  } satisfies TextStyle,
  value: {
    fontFamily: theme.fonts.body,
    fontSize: theme.fontSizes[16],
    color: theme.colors.foreground,
  } satisfies TextStyle,
}))
