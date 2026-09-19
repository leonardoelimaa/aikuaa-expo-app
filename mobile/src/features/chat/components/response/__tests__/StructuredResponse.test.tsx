import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react-native'
import { StructuredResponse } from '../StructuredResponse'
import { mockCompanies } from '@/mocks/data/companies.mock'

describe('StructuredResponse', () => {
  it('renders a single company card', async () => {
    await render(<StructuredResponse response={{ type: 'company', company: mockCompanies[0] }} />)

    expect(screen.getByTestId('structured-response-company')).toBeTruthy()
    expect(screen.getByText(mockCompanies[0].name)).toBeTruthy()
  })

  it('renders a list of company cards', async () => {
    await render(
      <StructuredResponse
        response={{ type: 'companyList', companies: mockCompanies.slice(0, 2) }}
      />,
    )

    expect(screen.getByTestId('structured-response-company-list')).toBeTruthy()
    expect(screen.getByText(mockCompanies[0].name)).toBeTruthy()
    expect(screen.getByText(mockCompanies[1].name)).toBeTruthy()
    expect(screen.queryByText(mockCompanies[2].name)).toBeNull()
  })

  it('renders a comparison table', async () => {
    await render(
      <StructuredResponse
        response={{
          type: 'comparisonTable',
          headers: ['Característica', 'Acme', 'Beta'],
          rows: [
            { label: 'Sector', values: ['Manufactura', 'Salud'] },
            { label: 'Ubicación', values: ['Madrid', 'Barcelona'] },
          ],
        }}
      />,
    )

    expect(screen.getByTestId('structured-response-comparison-table')).toBeTruthy()
    expect(screen.getByText('Característica')).toBeTruthy()
    expect(screen.getByText('Acme')).toBeTruthy()
    expect(screen.getByText('Beta')).toBeTruthy()
    expect(screen.getByText('Sector')).toBeTruthy()
    expect(screen.getByText('Ubicación')).toBeTruthy()
    expect(screen.getByText('Manufactura')).toBeTruthy()
    expect(screen.getByText('Barcelona')).toBeTruthy()
  })

  it('calls onCompanyPress when a company card is pressed', async () => {
    const onCompanyPress = jest.fn()
    await render(
      <StructuredResponse
        response={{ type: 'company', company: mockCompanies[0] }}
        onCompanyPress={onCompanyPress}
      />,
    )

    const card = screen.getByTestId(`company-card-${mockCompanies[0].id}`)
    fireEvent.press(card)

    expect(onCompanyPress).toHaveBeenCalledTimes(1)
    expect(onCompanyPress).toHaveBeenCalledWith(mockCompanies[0])
  })

  it('uses provided testID', async () => {
    await render(
      <StructuredResponse
        response={{ type: 'company', company: mockCompanies[0] }}
        testID="custom-structured"
      />,
    )

    expect(screen.getByTestId('custom-structured')).toBeTruthy()
  })
})
