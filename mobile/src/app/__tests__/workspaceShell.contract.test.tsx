import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react-native'

import WorkspaceScreen from '@/app/(app)/(tabs)/workspace'
import WorkspaceDetailScreen from '@/app/(app)/workspace/[workspaceId]'
import { useWorkspaceCatalog } from '@/features/workspaces/hooks/useWorkspaceCatalog'

jest.disableAutomock()
jest.unmock('@testing-library/react-native')

const mockPush = jest.fn()
const mockReplace = jest.fn()
const mockSelectWorkspace = jest.fn()
let mockRouteParams: Record<string, string> = {}
let mockContext = {
  mode: 'company',
  workspaceId: 'workspace-acme',
  companyId: 'comp-acme',
  tenantId: 'aikuaa-demo-tenant',
}

const mockWorkspaces = [
  {
    id: 'workspace-acme',
    name: 'Acme',
    companyId: 'comp-acme',
    tenantId: 'aikuaa-demo-tenant',
  },
  {
    id: 'workspace-beta',
    name: 'Beta',
    companyId: 'comp-beta',
    tenantId: 'aikuaa-demo-tenant',
  },
]

jest.mock('expo-router', () => ({
  useLocalSearchParams: () => mockRouteParams,
  useRouter: () => ({
    push: mockPush,
    replace: mockReplace,
    back: jest.fn(),
    canGoBack: jest.fn(() => true),
  }),
}))

jest.mock('@/context/AppContext', () => ({
  useAppContext: () => ({
    bootStatus: 'ready',
    isDemoActive: true,
    context: mockContext,
    isResolved: true,
    revision: 1,
    enterDemo: jest.fn(),
    selectWorkspace: mockSelectWorkspace,
    resetDemo: jest.fn(),
  }),
}))

jest.mock('@/features/workspaces/hooks/useWorkspaceCatalog', () => ({
  useWorkspaceCatalog: jest.fn(),
}))

const mockUseWorkspaceCatalog = jest.mocked(useWorkspaceCatalog)

describe('workspace shell contract', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockRouteParams = {}
    mockContext = {
      mode: 'company',
      workspaceId: 'workspace-acme',
      companyId: 'comp-acme',
      tenantId: 'aikuaa-demo-tenant',
    }
    mockUseWorkspaceCatalog.mockReturnValue({
      data: mockWorkspaces,
      isLoading: false,
      isError: false,
    } as ReturnType<typeof useWorkspaceCatalog>)
  })

  it('marks the active workspace and selects another workspace through context', async () => {
    await render(<WorkspaceScreen />)

    expect(
      screen.getByRole('button', { name: 'Selecionar workspace Acme' }).props.accessibilityState,
    ).toEqual(expect.objectContaining({ selected: true }))
    expect(
      screen.getByRole('button', { name: 'Selecionar workspace Beta' }).props.accessibilityState,
    ).toEqual(expect.objectContaining({ selected: false }))

    await fireEvent.press(screen.getByRole('button', { name: 'Selecionar workspace Beta' }))
    expect(mockSelectWorkspace).toHaveBeenCalledWith('workspace-beta')
  })

  it('opens workspace details on the canonical stack path', async () => {
    await render(<WorkspaceScreen />)

    await fireEvent.press(screen.getByRole('button', { name: 'Ver detalhes de Acme' }))
    expect(mockPush).toHaveBeenCalledWith('/(app)/workspace/workspace-acme')

    await fireEvent.press(screen.getByRole('button', { name: 'Ver detalhes de Beta' }))
    expect(mockPush).toHaveBeenCalledWith('/(app)/workspace/workspace-beta')
  })

  it('renders the selected workspace details from a validated catalog entry', async () => {
    mockRouteParams = { workspaceId: 'workspace-acme' }

    await render(<WorkspaceDetailScreen />)

    expect(screen.getByRole('header', { name: 'Acme' })).toBeTruthy()
    expect(screen.queryByText('Workspace não encontrado')).toBeNull()
  })

  it('rejects an unknown workspace id and offers canonical recovery', async () => {
    mockRouteParams = { workspaceId: 'workspace-unknown' }

    await render(<WorkspaceDetailScreen />)

    expect(screen.getByText('Workspace não encontrado')).toBeTruthy()
    await fireEvent.press(screen.getByRole('button', { name: 'Voltar para Workspace' }))
    expect(mockReplace).toHaveBeenCalledWith('/(app)/(tabs)/workspace')
  })
})
