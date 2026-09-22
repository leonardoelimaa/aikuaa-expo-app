import { act, renderHook } from '@testing-library/react-native'
import React from 'react'
import { AppContextProvider, useAppContext } from './AppContext'

describe('AppContext', () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <AppContextProvider restoreSelection={async () => null}>{children}</AppContextProvider>
  )

  it('starts without a resolved workspace', async () => {
    const { result } = await renderHook(() => useAppContext(), { wrapper })

    expect(result.current.context).toBeNull()
    expect(result.current.isResolved).toBe(false)
    expect(result.current.revision).toBe(0)
  })

  it('enters the pinned Acme demo workspace', async () => {
    const { result } = await renderHook(() => useAppContext(), { wrapper })

    await act(async () => result.current.enterDemo())

    expect(result.current.isResolved).toBe(true)
    expect(result.current.context).toEqual({
      mode: 'company',
      workspaceId: 'workspace-acme',
      companyId: 'comp-acme',
      tenantId: 'aikuaa-demo-tenant',
    })
    expect(result.current.context).not.toHaveProperty('eventId')
  })

  it('selects the pinned Beta workspace and advances the revision', async () => {
    const { result } = await renderHook(() => useAppContext(), { wrapper })

    await act(async () => result.current.enterDemo())
    const priorRevision = result.current.revision
    await act(async () => result.current.selectWorkspace('workspace-beta'))

    expect(result.current.context).toEqual({
      mode: 'company',
      workspaceId: 'workspace-beta',
      companyId: 'comp-beta',
      tenantId: 'aikuaa-demo-tenant',
    })
    expect(result.current.revision).toBeGreaterThan(priorRevision)
  })

  it('resets to an unresolved workspace and advances the revision', async () => {
    const { result } = await renderHook(() => useAppContext(), { wrapper })

    await act(async () => result.current.enterDemo())
    const priorRevision = result.current.revision
    await act(async () => result.current.resetDemo())

    expect(result.current.context).toBeNull()
    expect(result.current.isResolved).toBe(false)
    expect(result.current.revision).toBeGreaterThan(priorRevision)
  })

  it('rejects legacy event identifiers without changing the active workspace', async () => {
    const { result } = await renderHook(() => useAppContext(), { wrapper })

    await act(async () => result.current.enterDemo())
    const priorContext = result.current.context
    const priorRevision = result.current.revision
    let error: unknown

    await act(async () => {
      try {
        await result.current.selectWorkspace('aikuaa-demo-event')
      } catch (caught) {
        error = caught
      }
    })

    expect(error).toBeInstanceOf(Error)
    expect(result.current.context).toEqual(priorContext)
    expect(result.current.revision).toBe(priorRevision)
  })
})
