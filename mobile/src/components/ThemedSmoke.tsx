import { View, Text, type ViewStyle } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'

export function ThemedSmoke() {
  return (
    <View testID="themed-smoke" style={styles.box}>
      <Text>Smoke</Text>
    </View>
  )
}

const styles = StyleSheet.create((theme) => ({
  box: {
    backgroundColor: theme.colors.background,
    padding: theme.spacing[4],
    borderRadius: theme.radii.md,
  } satisfies ViewStyle,
}))
