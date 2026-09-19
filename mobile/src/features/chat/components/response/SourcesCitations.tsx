import React, { useState } from 'react'
import { View, Text, TouchableOpacity, Linking, type ViewStyle, type TextStyle } from 'react-native'
import Animated, { FadeIn, FadeOut, LinearTransition } from 'react-native-reanimated'
import { StyleSheet } from 'react-native-unistyles'
import { Source } from './types'

export interface SourcesCitationsProps {
  sources: Source[]
  testID?: string
}

export const SourcesCitations: React.FC<SourcesCitationsProps> = ({ sources, testID }) => {
  const [expanded, setExpanded] = useState(false)

  return (
    <View style={styles.container} testID={testID ?? 'sources-citations'}>
      <TouchableOpacity
        style={styles.header}
        onPress={() => setExpanded((prev) => !prev)}
        accessibilityRole="button"
        accessibilityLabel="Cómo Aikuaa encontró esto: fuentes"
        accessibilityHint="Presiona para expandir o contraer las fuentes"
        accessibilityState={{ expanded }}
        activeOpacity={0.8}
        testID="sources-citations-header"
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
          testID="sources-citations-list"
        >
          {sources.map((source, index) => {
            const sourceUrl = source.url
            return (
              <View key={source.id} style={styles.item} testID={`source-item-${source.id}`}>
                <Text style={styles.index}>{index + 1}.</Text>
                <View style={styles.itemContent}>
                  <Text style={styles.title}>{source.title}</Text>
                  {sourceUrl ? (
                    <Text
                      style={styles.url}
                      onPress={() => Linking.openURL(sourceUrl)}
                      accessibilityRole="link"
                      accessibilityLabel={`Abrir fuente: ${source.title}`}
                      testID={`source-url-${source.id}`}
                    >
                      {sourceUrl}
                    </Text>
                  ) : null}
                </View>
              </View>
            )
          })}
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
  item: {
    flexDirection: 'row',
    marginVertical: theme.spacing[2],
  } satisfies ViewStyle,
  itemContent: {
    flex: 1,
  } satisfies ViewStyle,
  index: {
    fontFamily: theme.fonts.body,
    fontSize: theme.fontSizes[14],
    color: theme.colors.foreground,
    marginRight: theme.spacing[2],
    minWidth: theme.spacing[4],
  } satisfies TextStyle,
  title: {
    fontFamily: theme.fonts.body,
    fontSize: theme.fontSizes[14],
    color: theme.colors.foreground,
  } satisfies TextStyle,
  url: {
    fontFamily: theme.fonts.body,
    fontSize: theme.fontSizes[12],
    color: theme.colors.primary,
    marginTop: theme.spacing[1],
  } satisfies TextStyle,
}))
