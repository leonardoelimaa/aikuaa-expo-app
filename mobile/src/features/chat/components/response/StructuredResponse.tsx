import React from 'react'
import { View, Text, type ViewStyle, type TextStyle } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'
import { StructuredResponseData } from './types'
import { CompanyCard, CompanyCardCompany } from './CompanyCard'

export interface StructuredResponseProps {
  response: StructuredResponseData
  onCompanyPress?: (company: CompanyCardCompany) => void
  testID?: string
}

export const StructuredResponse: React.FC<StructuredResponseProps> = ({
  response,
  onCompanyPress,
  testID,
}) => {
  switch (response.type) {
    case 'company':
      return (
        <View style={styles.container} testID={testID ?? 'structured-response-company'}>
          <CompanyCard company={response.company} onPress={onCompanyPress} />
        </View>
      )
    case 'companyList':
      return (
        <View style={styles.container} testID={testID ?? 'structured-response-company-list'}>
          {response.companies.map((company) => (
            <CompanyCard key={company.id} company={company} onPress={onCompanyPress} />
          ))}
        </View>
      )
    case 'comparisonTable':
      return (
        <View style={styles.container} testID={testID ?? 'structured-response-comparison-table'}>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              {response.headers.map((header, index) => (
                <View
                  key={`header-${index}`}
                  style={[
                    styles.tableCell,
                    index === 0 && styles.labelCell,
                    styles.tableHeaderCell,
                  ]}
                >
                  <Text style={styles.tableHeaderText}>{header}</Text>
                </View>
              ))}
            </View>
            {response.rows.map((row, rowIndex) => (
              <View key={`row-${rowIndex}`} style={styles.tableRow}>
                <View style={[styles.tableCell, styles.labelCell]}>
                  <Text style={styles.rowLabelText}>{row.label}</Text>
                </View>
                {row.values.map((value, valueIndex) => (
                  <View key={`cell-${valueIndex}`} style={styles.tableCell}>
                    <Text style={styles.tableCellText}>{value}</Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
        </View>
      )
    default:
      return null
  }
}

const styles = StyleSheet.create((theme) => ({
  container: {
    marginVertical: theme.spacing[2],
  } satisfies ViewStyle,
  table: {
    borderWidth: 1,
    borderColor: theme.colors.muted,
    borderRadius: theme.radii.md,
    overflow: 'hidden',
  } satisfies ViewStyle,
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.muted,
  } satisfies ViewStyle,
  tableCell: {
    flex: 1,
    padding: theme.spacing[2],
    borderRightWidth: 1,
    borderRightColor: theme.colors.muted,
  } satisfies ViewStyle,
  labelCell: {
    minWidth: theme.spacing[24],
    flex: 0,
  } satisfies ViewStyle,
  tableHeaderCell: {
    backgroundColor: theme.colors.backgroundSecondary,
  } satisfies ViewStyle,
  tableHeaderText: {
    fontFamily: theme.fonts.body,
    fontSize: theme.fontSizes[12],
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.foreground,
  } satisfies TextStyle,
  rowLabelText: {
    fontFamily: theme.fonts.body,
    fontSize: theme.fontSizes[12],
    fontWeight: theme.fontWeights.semibold,
    color: theme.colors.foreground,
  } satisfies TextStyle,
  tableCellText: {
    fontFamily: theme.fonts.body,
    fontSize: theme.fontSizes[12],
    color: theme.colors.foreground,
  } satisfies TextStyle,
}))
