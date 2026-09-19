import React from 'react'
import { View, type ViewStyle } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'
import { ChatWelcome, type SuggestionPrompt } from '../ChatWelcome'

export interface EmptyStateProps {
  onSuggestionPress: (prompt: SuggestionPrompt) => void
  testID?: string
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  onSuggestionPress,
  testID = 'chat-empty-state',
}) => {
  return (
    <View style={styles.container} testID={testID}>
      <ChatWelcome
        title="¿Qué quieres descubrir?"
        subtitle="Pregunta lo que necesites sobre el evento."
        onSuggestionPress={onSuggestionPress}
      />
    </View>
  )
}

const styles = StyleSheet.create((theme) => ({
  container: {
    paddingVertical: theme.spacing[6],
  } satisfies ViewStyle,
}))
