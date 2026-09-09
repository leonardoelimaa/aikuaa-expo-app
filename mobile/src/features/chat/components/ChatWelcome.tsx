import React from 'react'
import { View, Text, Pressable, type ViewStyle, type TextStyle } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'

export interface SuggestionPrompt {
  id: string
  label: string
}

export interface ChatWelcomeProps {
  suggestions?: SuggestionPrompt[]
  onSuggestionPress: (prompt: SuggestionPrompt) => void
}

const DEFAULT_SUGGESTIONS: SuggestionPrompt[] = [
  { id: 'event', label: 'Conoce el evento' },
  { id: 'discover', label: '¿Qué quieres descubrir?' },
  { id: 'companies', label: '¿Qué empresas están aquí?' },
]

export const ChatWelcome: React.FC<ChatWelcomeProps> = ({
  suggestions = DEFAULT_SUGGESTIONS,
  onSuggestionPress,
}) => {
  return (
    <View style={styles.container} testID="chat-welcome">
      <Text style={styles.title} testID="chat-welcome-title">
        Chat
      </Text>
      <Text style={styles.subtitle} testID="chat-welcome-subtitle">
        Pregunta lo que necesites sobre el evento.
      </Text>
      <View style={styles.suggestions} testID="chat-suggestions">
        {suggestions.map((suggestion, index) => (
          <Pressable
            key={suggestion.id}
            style={({ pressed }) => [styles.chip, pressed && styles.chipPressed]}
            onPress={() => onSuggestionPress(suggestion)}
            accessibilityRole="button"
            accessibilityLabel={suggestion.label}
            testID={`chat-suggestion-${index}`}
          >
            <Text style={styles.chipText}>{suggestion.label}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  )
}

const styles = StyleSheet.create((theme) => ({
  container: {
    padding: theme.spacing[6],
    gap: theme.spacing[3],
  } satisfies ViewStyle,
  title: {
    fontFamily: theme.fonts.display,
    fontSize: theme.fontSizes[32],
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.foreground,
  } satisfies TextStyle,
  subtitle: {
    fontFamily: theme.fonts.body,
    fontSize: theme.fontSizes[16],
    color: theme.colors.secondary,
  } satisfies TextStyle,
  suggestions: {
    marginTop: theme.spacing[4],
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing[3],
  } satisfies ViewStyle,
  chip: {
    minHeight: 44,
    paddingVertical: theme.spacing[3],
    paddingHorizontal: theme.spacing[4],
    borderRadius: theme.radii.full,
    backgroundColor: theme.colors.backgroundSecondary,
    borderWidth: 1,
    borderColor: theme.colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
  } satisfies ViewStyle,
  chipPressed: {
    backgroundColor: theme.colors.overlay,
  } satisfies ViewStyle,
  chipText: {
    fontFamily: theme.fonts.body,
    fontSize: theme.fontSizes[14],
    fontWeight: theme.fontWeights.semibold,
    color: theme.colors.foreground,
  } satisfies TextStyle,
}))
