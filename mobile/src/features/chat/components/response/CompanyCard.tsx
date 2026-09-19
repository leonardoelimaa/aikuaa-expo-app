import React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  type ViewStyle,
  type TextStyle,
  type ImageStyle,
} from 'react-native'
import { StyleSheet } from 'react-native-unistyles'
import { Company } from '@/services/types'

export interface CompanyCardCompany extends Company {
  location?: string
  website?: string
  tags?: string[]
}

export interface CompanyCardProps {
  company: CompanyCardCompany
  onPress?: (company: CompanyCardCompany) => void
  testID?: string
}

export const CompanyCard: React.FC<CompanyCardProps> = ({ company, onPress, testID }) => {
  const logoInitial = company.name.charAt(0).toUpperCase()

  const content = (
    <>
      {company.logoUrl ? (
        <Image
          source={{ uri: company.logoUrl }}
          style={styles.logo}
          testID="company-logo"
          accessibilityLabel={`Logotipo de ${company.name}`}
        />
      ) : (
        <View style={[styles.logo, styles.logoPlaceholder]} testID="company-logo-placeholder">
          <Text style={styles.logoText}>{logoInitial}</Text>
        </View>
      )}
      <View style={styles.content}>
        <Text style={styles.name}>{company.name}</Text>
        {company.industry ? (
          <Text style={styles.industry} testID="company-industry">
            {company.industry}
          </Text>
        ) : null}
        {company.location ? (
          <Text style={styles.location} testID="company-location">
            {company.location}
          </Text>
        ) : null}
        <Text style={styles.description} numberOfLines={3} testID="company-description">
          {company.description}
        </Text>
        {company.website ? (
          <Text style={styles.website} testID="company-website">
            {company.website}
          </Text>
        ) : null}
        {company.tags && company.tags.length > 0 ? (
          <View style={styles.tags} testID="company-tags">
            {company.tags.map((tag) => (
              <View key={tag} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        ) : null}
      </View>
    </>
  )

  if (onPress) {
    return (
      <TouchableOpacity
        style={styles.container}
        onPress={() => onPress(company)}
        accessibilityRole="button"
        accessibilityLabel={`Empresa: ${company.name}`}
        activeOpacity={0.8}
        testID={testID ?? `company-card-${company.id}`}
      >
        {content}
      </TouchableOpacity>
    )
  }

  return (
    <View
      style={styles.container}
      accessibilityRole="none"
      accessibilityLabel={`Empresa: ${company.name}`}
      testID={testID ?? `company-card-${company.id}`}
    >
      {content}
    </View>
  )
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flexDirection: 'row',
    backgroundColor: theme.colors.backgroundSecondary,
    borderRadius: theme.radii.lg,
    padding: theme.spacing[4],
    marginVertical: theme.spacing[2],
  } satisfies ViewStyle,
  logo: {
    width: theme.spacing[12],
    height: theme.spacing[12],
    borderRadius: theme.radii.md,
    marginRight: theme.spacing[4],
  } satisfies ImageStyle,
  logoPlaceholder: {
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  } satisfies ViewStyle,
  logoText: {
    fontFamily: theme.fonts.display,
    fontSize: theme.fontSizes[24],
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.white,
  } satisfies TextStyle,
  content: {
    flex: 1,
  } satisfies ViewStyle,
  name: {
    fontFamily: theme.fonts.display,
    fontSize: theme.fontSizes[18],
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.foreground,
  } satisfies TextStyle,
  industry: {
    fontFamily: theme.fonts.body,
    fontSize: theme.fontSizes[12],
    color: theme.colors.primary,
    marginTop: theme.spacing[1],
    textTransform: 'uppercase',
  } satisfies TextStyle,
  location: {
    fontFamily: theme.fonts.body,
    fontSize: theme.fontSizes[12],
    color: theme.colors.muted,
    marginTop: theme.spacing[1],
  } satisfies TextStyle,
  description: {
    fontFamily: theme.fonts.body,
    fontSize: theme.fontSizes[14],
    color: theme.colors.foreground,
    marginTop: theme.spacing[2],
    lineHeight: theme.lineHeights[20],
  } satisfies TextStyle,
  website: {
    fontFamily: theme.fonts.body,
    fontSize: theme.fontSizes[12],
    color: theme.colors.primary,
    marginTop: theme.spacing[2],
  } satisfies TextStyle,
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: theme.spacing[2],
  } satisfies ViewStyle,
  tag: {
    backgroundColor: theme.colors.muted,
    borderRadius: theme.radii.full,
    paddingVertical: theme.spacing[1],
    paddingHorizontal: theme.spacing[2],
    marginRight: theme.spacing[2],
    marginBottom: theme.spacing[2],
  } satisfies ViewStyle,
  tagText: {
    fontFamily: theme.fonts.body,
    fontSize: theme.fontSizes[10],
    color: theme.colors.foreground,
  } satisfies TextStyle,
}))
