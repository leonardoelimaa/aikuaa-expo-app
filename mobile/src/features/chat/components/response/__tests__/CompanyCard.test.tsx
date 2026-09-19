import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react-native'
import { CompanyCard } from '../CompanyCard'
import { mockCompanies } from '@/mocks/data/companies.mock'

describe('CompanyCard', () => {
  it('renders company details', async () => {
    const company = mockCompanies[0]
    await render(<CompanyCard company={company} />)

    expect(screen.getByTestId(`company-card-${company.id}`)).toBeTruthy()
    expect(screen.getByText(company.name)).toBeTruthy()
    expect(screen.getByText(company.industry!)).toBeTruthy()
    expect(screen.getByText(company.description)).toBeTruthy()
    expect(screen.getByTestId('company-logo-placeholder')).toBeTruthy()
  })

  it('renders optional location, website and tags', async () => {
    const company = {
      ...mockCompanies[1],
      location: 'Madrid, España',
      website: 'https://betalabs.example',
      tags: ['Biotecnología', 'Innovación'],
    }

    await render(<CompanyCard company={company} />)

    expect(screen.getByTestId('company-location')).toBeTruthy()
    expect(screen.getByText('Madrid, España')).toBeTruthy()
    expect(screen.getByTestId('company-website')).toBeTruthy()
    expect(screen.getByText('https://betalabs.example')).toBeTruthy()
    expect(screen.getByTestId('company-tags')).toBeTruthy()
    expect(screen.getByText('Biotecnología')).toBeTruthy()
    expect(screen.getByText('Innovación')).toBeTruthy()
  })

  it('calls onPress when pressed', async () => {
    const company = mockCompanies[2]
    const onPress = jest.fn()
    await render(<CompanyCard company={company} onPress={onPress} />)

    const card = screen.getByTestId(`company-card-${company.id}`)
    fireEvent.press(card)

    expect(onPress).toHaveBeenCalledTimes(1)
    expect(onPress).toHaveBeenCalledWith(company)
  })

  it('renders logo when logoUrl is provided', async () => {
    const company = { ...mockCompanies[0], logoUrl: 'https://aikuaa.example/acme.png' }
    await render(<CompanyCard company={company} />)

    expect(screen.getByTestId('company-logo')).toBeTruthy()
    expect(screen.queryByTestId('company-logo-placeholder')).toBeNull()
  })
})
