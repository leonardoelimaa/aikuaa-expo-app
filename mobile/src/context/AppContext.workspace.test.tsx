import React from 'react'
import { act, renderHook, waitFor } from '@testing-library/react-native'
import { AppContextProvider, useAppContext } from './AppContext'

const WORKSPACE_ACME = 'workspace-acme'
const WORKSPACE_BETA = 'workspace-beta'
const LEGACY_EVENT_ID = 'aikuaa-demo-event'

describe('AppContext workspace contract', () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <AppContextProvider>{children}</AppContextProvider>
  )

  it('enters the demo with an operational company workspace and no event identity', async () => {
    const { result } = await renderHook(() => useAppContext(), { wrapper })

    await act(async () => {
      await result.current.enterDemo()
    })

    expect(result.current.context).toEqual({
      mode: 'company',
      workspaceId: WORKSPACE_ACME,
      companyId: 'comp-acme',
      tenantId: 'aikuaa-demo-tenant',
    })
    expect(result.current.context).not.toHaveProperty('eventId')
    expect(result.current.revision).toBeGreaterThan(0)
  })

  it('selects a catalog workspace with its exact company and tenant mapping', async () => {
    const { result } = await renderHook(() => useAppContext(), { wrapper })

    await act(async () => {
      await result.current.enterDemo()
      await result.current.selectWorkspace(WORKSPACE_BETA)
    })

    expect(result.current.context).toEqual({
      mode: 'company',
      workspaceId: WORKSPACE_BETA,
      companyId: 'comp-beta',
      tenantId: 'aikuaa-demo-tenant',
    })
  })

  it('resets selection and advances the workspace incarnation', async () => {
    const { result } = await renderHook(() => useAppContext(), { wrapper })

    await act(async () => {
      await result.current.enterDemo()
    })
    const selectedRevision = result.current.revision

    await act(async () => {
      await result.current.resetDemo()
    })

    expect(result.current.context).toBeNull()
    expect(result.current.isResolved).toBe(false)
    expect(result.current.revision).toBeGreaterThan(selectedRevision)
  })

  it.each([['unknown-workspace'], [LEGACY_EVENT_ID]])(
    'rejects invalid or legacy selection %s without changing the active workspace',
    async (invalidWorkspaceId) => {
      const { result } = await renderHook(() => useAppContext(), { wrapper })

      await act(async () => {
        await result.current.enterDemo()
      })
      const before = result.current

      let rejection: unknown
      await act(async () => {
        try {
          await result.current.selectWorkspace(invalidWorkspaceId)
        } catch (error) {
          rejection = error
        }
      })

      expect(rejection).toBeInstanceOf(Error)
      expect((rejection as Error).message).toMatch(/workspace/i)
      expect(result.current.context).toEqual(before.context)
      expect(result.current.revision).toBe(before.revision)
    },
  )

  it('does not let delayed restoration override a newer explicit selection', async () => {
    let resolveRestored!: (workspaceId: string) => void
    const restoredWorkspace = new Promise<string>((resolve) => {
      resolveRestored = resolve
    })
    const restoringWrapper = ({ children }: { children: React.ReactNode }) => (
      <AppContextProvider restoreSelection={() => restoredWorkspace}>{children}</AppContextProvider>
    )
    const { result } = await renderHook(() => useAppContext(), { wrapper: restoringWrapper })

    await act(async () => {
      await result.current.selectWorkspace(WORKSPACE_ACME)
    })
    const explicitRevision = result.current.revision

    await act(async () => {
      resolveRestored(WORKSPACE_BETA)
      await restoredWorkspace
    })

    await waitFor(() => {
      expect(result.current.context?.workspaceId).toBe(WORKSPACE_ACME)
    })
    expect(result.current.revision).toBe(explicitRevision)
  })
})
