import React from 'react'
import { Pressable, Text } from 'react-native'
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react-native'
import { AppContextProvider, useAppContext } from '@/context/AppContext'
import { WorkspaceQueryProvider, useWorkspaceCompany } from '@/context/WorkspaceQueryProvider'
import { createMockServices, getServices } from '@/services/serviceRegistry'
import type { Company } from '@/services/types'
import { ACME_WORKSPACE_ID, BETA_WORKSPACE_ID, type WorkspaceId } from '@/types/app'

jest.mock('@/services/serviceRegistry', () => ({
  ...jest.requireActual('@/services/serviceRegistry'),
  getServices: jest.fn(),
}))

const mockedGetServices = jest.mocked(getServices)

function companyFixture(workspaceId: WorkspaceId, name: string, description: string): Company {
  return {
    id: workspaceId === ACME_WORKSPACE_ID ? 'comp-acme' : 'comp-beta',
    workspaceId,
    tenantId: 'aikuaa-demo-tenant',
    name,
    description,
  }
}

function QueryProbe() {
  const { selectWorkspace, resetDemo } = useAppContext()
  const company = useWorkspaceCompany()
  return (
    <>
      <Pressable testID="query-acme" onPress={() => void selectWorkspace('workspace-acme')} />
      <Pressable testID="query-beta" onPress={() => void selectWorkspace('workspace-beta')} />
      <Pressable testID="query-reset" onPress={() => void resetDemo()} />
      <Text testID="query-status">{company.isLoading ? 'loading' : 'settled'}</Text>
      <Text testID="query-company">{company.data?.name ?? 'none'}</Text>
    </>
  )
}

describe('WorkspaceQueryProvider public integration contract', () => {
  it('never uses previous-workspace data as placeholder while the next workspace loads', async () => {
    let resolveBeta!: (company: Company) => void
    const betaResult = new Promise<Company>((resolve) => {
      resolveBeta = resolve
    })
    const services = createMockServices()
    mockedGetServices.mockReturnValue(services)
    const getCompany = jest
      .spyOn(services.company, 'getCompanyById')
      .mockImplementation(async (workspaceId, companyId) => {
        if (workspaceId === 'workspace-beta') {
          expect(companyId).toBe('comp-beta')
          return betaResult
        }
        expect(workspaceId).toBe('workspace-acme')
        expect(companyId).toBe('comp-acme')
        return companyFixture(ACME_WORKSPACE_ID, 'Acme Corp', 'Acme fixture')
      })

    await render(
      <AppContextProvider>
        <WorkspaceQueryProvider>
          <QueryProbe />
        </WorkspaceQueryProvider>
      </AppContextProvider>,
    )

    fireEvent.press(screen.getByTestId('query-acme'))
    await waitFor(() =>
      expect(screen.getByTestId('query-company').props.children).toBe('Acme Corp'),
    )
    expect(getCompany).toHaveBeenCalledWith('workspace-acme', 'comp-acme')

    fireEvent.press(screen.getByTestId('query-beta'))
    await waitFor(() => expect(screen.getByTestId('query-status').props.children).toBe('loading'))
    expect(screen.getByTestId('query-company').props.children).toBe('none')
    expect(getCompany).toHaveBeenCalledWith('workspace-beta', 'comp-beta')

    await act(async () => {
      resolveBeta(companyFixture(BETA_WORKSPACE_ID, 'Beta Labs', 'Beta fixture'))
      await betaResult
    })

    await waitFor(() =>
      expect(screen.getByTestId('query-company').props.children).toBe('Beta Labs'),
    )
  })

  it('ignores a delayed result from the workspace that is no longer active', async () => {
    let resolveAcme!: (company: Company) => void
    const acmeResult = new Promise<Company>((resolve) => {
      resolveAcme = resolve
    })
    const services = createMockServices()
    mockedGetServices.mockReturnValue(services)
    const getCompany = jest
      .spyOn(services.company, 'getCompanyById')
      .mockImplementation(async (workspaceId, companyId) => {
        if (workspaceId === 'workspace-acme') {
          expect(companyId).toBe('comp-acme')
          return acmeResult
        }
        expect(workspaceId).toBe('workspace-beta')
        expect(companyId).toBe('comp-beta')
        return companyFixture(BETA_WORKSPACE_ID, 'Beta Labs', 'Beta fixture')
      })

    await render(
      <AppContextProvider>
        <WorkspaceQueryProvider>
          <QueryProbe />
        </WorkspaceQueryProvider>
      </AppContextProvider>,
    )

    fireEvent.press(screen.getByTestId('query-acme'))
    await waitFor(() => expect(screen.getByTestId('query-status').props.children).toBe('loading'))
    fireEvent.press(screen.getByTestId('query-beta'))
    await waitFor(() =>
      expect(screen.getByTestId('query-company').props.children).toBe('Beta Labs'),
    )
    expect(getCompany).toHaveBeenCalledWith('workspace-acme', 'comp-acme')
    expect(getCompany).toHaveBeenCalledWith('workspace-beta', 'comp-beta')

    await act(async () => {
      resolveAcme(companyFixture(ACME_WORKSPACE_ID, 'stale Acme', 'Late fixture'))
      await acmeResult
    })

    expect(screen.getByTestId('query-company').props.children).toBe('Beta Labs')
  })

  it('does not expose a late pre-reset result when the workspace is selected again', async () => {
    let resolveStale!: (company: Company) => void
    let resolveFresh!: (company: Company) => void
    const staleResult = new Promise<Company>((resolve) => {
      resolveStale = resolve
    })
    const freshResult = new Promise<Company>((resolve) => {
      resolveFresh = resolve
    })
    let acmeRequest = 0
    const services = createMockServices()
    mockedGetServices.mockReturnValue(services)
    const getCompany = jest
      .spyOn(services.company, 'getCompanyById')
      .mockImplementation(async (workspaceId, companyId) => {
        expect(workspaceId).toBe('workspace-acme')
        expect(companyId).toBe('comp-acme')
        acmeRequest += 1
        return acmeRequest === 1 ? staleResult : freshResult
      })

    await render(
      <AppContextProvider>
        <WorkspaceQueryProvider>
          <QueryProbe />
        </WorkspaceQueryProvider>
      </AppContextProvider>,
    )

    fireEvent.press(screen.getByTestId('query-acme'))
    await waitFor(() => expect(screen.getByTestId('query-status').props.children).toBe('loading'))
    expect(getCompany).toHaveBeenNthCalledWith(1, 'workspace-acme', 'comp-acme')
    fireEvent.press(screen.getByTestId('query-reset'))

    await act(async () => {
      resolveStale(companyFixture(ACME_WORKSPACE_ID, 'stale Acme', 'Late fixture'))
      await staleResult
    })

    fireEvent.press(screen.getByTestId('query-acme'))
    await waitFor(() => expect(screen.getByTestId('query-status').props.children).toBe('loading'))
    expect(screen.getByTestId('query-company').props.children).toBe('none')
    expect(getCompany).toHaveBeenNthCalledWith(2, 'workspace-acme', 'comp-acme')

    await act(async () => {
      resolveFresh(companyFixture(ACME_WORKSPACE_ID, 'fresh Acme', 'Fresh fixture'))
      await freshResult
    })
    await waitFor(() =>
      expect(screen.getByTestId('query-company').props.children).toBe('fresh Acme'),
    )
  })
})
