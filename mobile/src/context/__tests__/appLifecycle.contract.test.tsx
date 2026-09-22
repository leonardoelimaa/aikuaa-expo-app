import React, { type PropsWithChildren } from 'react'
import { act, render, waitFor } from '@testing-library/react-native'

import { AppContextProvider, useAppContext } from '@/context/AppContext'

jest.disableAutomock()
jest.unmock('@testing-library/react-native')

type LifecycleContract = ReturnType<typeof useAppContext> & {
  bootStatus: 'resolving' | 'ready'
  isDemoActive: boolean
}

function deferredRestore() {
  let resolve!: (value: unknown) => void
  const restoration = new Promise<unknown>((resolvePromise) => {
    resolve = resolvePromise
  })
  const restoreSelection = jest.fn<Promise<unknown>, []>(() => restoration)

  return { restoreSelection, resolve }
}

function wrapperFor(restoreSelection: () => Promise<unknown>) {
  return function LifecycleWrapper({ children }: PropsWithChildren) {
    return <AppContextProvider restoreSelection={restoreSelection}>{children}</AppContextProvider>
  }
}

describe('AppContext lifecycle contract', () => {
  it('stays resolving and inactive while persisted selection is pending', async () => {
    const restore = deferredRestore()
    let context: LifecycleContract | undefined

    function Consumer() {
      context = useAppContext() as LifecycleContract
      return null
    }

    await render(<Consumer />, { wrapper: wrapperFor(restore.restoreSelection) })

    await waitFor(() => {
      expect(restore.restoreSelection).toHaveBeenCalledTimes(1)
    })
    expect(context?.bootStatus).toBe('resolving')
    expect(context?.isDemoActive).toBe(false)
  })

  it('becomes ready and inactive when no persisted selection exists', async () => {
    const restore = deferredRestore()
    let context: LifecycleContract | undefined

    function Consumer() {
      context = useAppContext() as LifecycleContract
      return null
    }

    await render(<Consumer />, { wrapper: wrapperFor(restore.restoreSelection) })

    await waitFor(() => {
      expect(restore.restoreSelection).toHaveBeenCalledTimes(1)
    })
    await act(async () => {
      restore.resolve(null)
    })

    await waitFor(() => {
      expect(context?.bootStatus).toBe('ready')
      expect(context?.isDemoActive).toBe(false)
    })
    expect(context?.context).toBeNull()
  })

  it('becomes ready and active after restoring a valid workspace selection', async () => {
    const restore = deferredRestore()
    let context: LifecycleContract | undefined

    function Consumer() {
      context = useAppContext() as LifecycleContract
      return null
    }

    await render(<Consumer />, { wrapper: wrapperFor(restore.restoreSelection) })

    await waitFor(() => {
      expect(restore.restoreSelection).toHaveBeenCalledTimes(1)
    })
    await act(async () => {
      restore.resolve('workspace-acme')
    })

    await waitFor(() => {
      expect(context?.bootStatus).toBe('ready')
      expect(context?.isDemoActive).toBe(true)
    })
    expect(context?.context).toEqual({
      mode: 'company',
      workspaceId: 'workspace-acme',
      companyId: 'comp-acme',
      tenantId: 'aikuaa-demo-tenant',
    })
  })
})
