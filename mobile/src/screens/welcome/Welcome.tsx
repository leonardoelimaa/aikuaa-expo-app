import React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  type ViewStyle,
  type TextStyle,
} from 'react-native'
import { StyleSheet } from 'react-native-unistyles'

interface WelcomeProps {
  onEnterDemo: () => void
}

export const Welcome: React.FC<WelcomeProps> = ({ onEnterDemo }) => (
  <ScrollView
    contentContainerStyle={styles.container}
    accessible
    accessibilityLabel="Boas-vindas à Aikuaa"
  >
    <View style={styles.content}>
      <Text style={styles.headline}>O conhecimento da sua empresa, acessível</Text>
      <Text style={styles.valueProp}>
        Converse com o assistente da sua empresa em uma demonstração segura e determinística.
      </Text>
    </View>

    <TouchableOpacity
      style={styles.cta}
      onPress={onEnterDemo}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityLabel="Entrar na demonstração"
    >
      <Text style={styles.ctaText}>Entrar na demonstração</Text>
    </TouchableOpacity>
  </ScrollView>
)

const styles = StyleSheet.create((theme) => ({
  container: {
    flexGrow: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing[6],
    justifyContent: 'space-between',
  } satisfies ViewStyle,
  content: {
    flex: 1,
    justifyContent: 'center',
  } satisfies ViewStyle,
  headline: {
    fontFamily: theme.fonts.display,
    fontSize: theme.fontSizes[32],
    color: theme.colors.foreground,
    marginBottom: theme.spacing[4],
    textAlign: 'center',
  } satisfies TextStyle,
  valueProp: {
    fontFamily: theme.fonts.body,
    fontSize: theme.fontSizes[18],
    color: theme.colors.secondary,
    textAlign: 'center',
    lineHeight: 24,
  } satisfies TextStyle,
  cta: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing[4],
    paddingHorizontal: theme.spacing[6],
    borderRadius: theme.radii.lg,
    alignItems: 'center',
    minHeight: 48,
    justifyContent: 'center',
  } satisfies ViewStyle,
  ctaText: {
    fontFamily: theme.fonts.display,
    fontSize: theme.fontSizes[18],
    color: theme.colors.white,
  } satisfies TextStyle,
}))
