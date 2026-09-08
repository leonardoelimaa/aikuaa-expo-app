import React from 'react'
import { View, Text, type ViewStyle, type TextStyle } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StyleSheet } from 'react-native-unistyles'

export default function SettingsScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Ajustes</Text>
        <Text style={styles.subtitle}>Próximamente.</Text>
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
    marginBottom: theme.spacing[3],
  } satisfies TextStyle,
  subtitle: {
    fontFamily: theme.fonts.body,
    fontSize: theme.fontSizes[16],
    color: theme.colors.secondary,
  } satisfies TextStyle,
}))
