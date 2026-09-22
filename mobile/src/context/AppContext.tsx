import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import type { AppContext as AppContextType, WorkspaceId } from '../types/app'
import { ACME_WORKSPACE_ID, isWorkspaceId } from '../types/app'
import { createMockCompanyService } from '../services/company.service'
import { resetDemoState } from '../stores/demoStore'

export type AppContext = AppContextType

type RestoredSelection = unknown
type BootStatus = 'resolving' | 'ready'

interface AppContextState {
  context: AppContextType | null
  isResolved: boolean
  bootStatus: BootStatus
  isDemoActive: boolean
  revision: number
  enterDemo: () => Promise<void>
  selectWorkspace: (workspaceId: WorkspaceId | string) => Promise<void>
  resetDemo: () => Promise<void>
}

interface AppContextProviderProps {
  children: React.ReactNode
  restoreSelection?: () => Promise<RestoredSelection>
}

const appContext = createContext<AppContextState | null>(null)
const companyService = createMockCompanyService()

function restoredWorkspaceId(value: RestoredSelection): string | null {
  if (typeof value === 'string') return value
  if (value && typeof value === 'object' && 'workspaceId' in value) {
    const workspaceId = (value as { workspaceId?: unknown }).workspaceId
    return typeof workspaceId === 'string' ? workspaceId : null
  }
  return null
}

export const AppContextProvider: React.FC<AppContextProviderProps> = ({
  children,
  restoreSelection,
}) => {
  const [context, setContext] = useState<AppContextType | null>(null)
  const [bootStatus, setBootStatus] = useState<BootStatus>(() =>
    restoreSelection ? 'resolving' : 'ready',
  )
  const [isDemoActive, setIsDemoActive] = useState(false)
  const [revision, setRevision] = useState(0)
  const actionVersion = useRef(0)

  const commitWorkspace = useCallback(async (workspaceId: string, expectedAction: number) => {
    if (!isWorkspaceId(workspaceId)) {
      throw new Error('Unknown workspace selection.')
    }

    const workspace = await companyService.getWorkspaceById(workspaceId)
    if (!workspace) throw new Error('Unknown workspace selection.')
    if (actionVersion.current !== expectedAction) return

    setContext({
      mode: 'company',
      workspaceId: workspace.id,
      companyId: workspace.companyId,
      tenantId: workspace.tenantId,
    })
    setIsDemoActive(true)
    setBootStatus('ready')
    setRevision((value) => value + 1)
  }, [])

  const selectWorkspace = useCallback(
    async (workspaceId: WorkspaceId | string) => {
      if (!isWorkspaceId(workspaceId)) {
        throw new Error('Unknown workspace selection.')
      }

      const action = ++actionVersion.current
      setBootStatus('ready')
      await commitWorkspace(workspaceId, action)
    },
    [commitWorkspace],
  )

  const enterDemo = useCallback(async () => {
    const action = ++actionVersion.current
    setBootStatus('ready')
    await resetDemoState()
    await commitWorkspace(ACME_WORKSPACE_ID, action)
  }, [commitWorkspace])

  const resetDemo = useCallback(async () => {
    ++actionVersion.current
    setContext(null)
    setRevision((value) => value + 1)
    setIsDemoActive(false)
    setBootStatus('ready')
    await resetDemoState()
  }, [])

  useEffect(() => {
    if (!restoreSelection) return

    const expectedAction = actionVersion.current
    let active = true

    void (async () => {
      try {
        const restored = await restoreSelection()
        if (!active || actionVersion.current !== expectedAction) return

        const workspaceId = restoredWorkspaceId(restored)
        if (workspaceId && isWorkspaceId(workspaceId)) {
          await commitWorkspace(workspaceId, expectedAction)
        }
      } catch {
        // Restoration is best-effort. A failed restore leaves the demo inactive.
      } finally {
        if (active && actionVersion.current === expectedAction) {
          setBootStatus('ready')
        }
      }
    })()

    return () => {
      active = false
    }
  }, [commitWorkspace, restoreSelection])

  const value = useMemo<AppContextState>(
    () => ({
      context,
      isResolved: context !== null,
      bootStatus,
      isDemoActive,
      revision,
      enterDemo,
      selectWorkspace,
      resetDemo,
    }),
    [bootStatus, context, enterDemo, isDemoActive, resetDemo, revision, selectWorkspace],
  )

  return <appContext.Provider value={value}>{children}</appContext.Provider>
}

export const useAppContext = (): AppContextState => {
  const value = useContext(appContext)
  if (!value) {
    throw new Error('useAppContext must be used within AppContextProvider')
  }
  return value
}
