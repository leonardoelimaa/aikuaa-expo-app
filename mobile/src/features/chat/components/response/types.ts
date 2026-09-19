import { Company } from '@/services/types'

export interface Source {
  id: string
  title: string
  url?: string
}

export interface ToolStep {
  id: string
  label: string
  description: string
}

export type StructuredResponseData =
  | { type: 'company'; company: Company }
  | { type: 'companyList'; companies: Company[] }
  | { type: 'comparisonTable'; headers: string[]; rows: { label: string; values: string[] }[] }
