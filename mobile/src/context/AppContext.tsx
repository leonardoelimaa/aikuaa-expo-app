import React, { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { AppContext as AppContextType } from '../types/app'
import { resolveEventContext } from './resolveEvent'

export type AppContext = AppContextType

export interface EventContextInput {
  eventId: string
  tenantId?: string
  companyId?: string
}

interface AppContextState {
  context: AppContextType
  isResolved: boolean
  resolveEvent: (input?: EventContextInput) => void
  resolveDemoEvent: () => void
}

const appContext = createContext<AppContextState | null>(null)

export const AppContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [context, setContext] = useState<AppContextType>(() => resolveEventContext())
  const [isResolved, setIsResolved] = useState(false)

  const resolveEvent = useCallback((input?: EventContextInput) => {
    setContext(resolveEventContext(input))
    setIsResolved(true)
  }, [])

  const resolveDemoEvent = useCallback(() => {
    resolveEvent()
  }, [resolveEvent])

  const value = useMemo(
    () => ({ context, isResolved, resolveEvent, resolveDemoEvent }),
    [context, isResolved, resolveEvent, resolveDemoEvent],
  )

  return <appContext.Provider value={value}>{children}</appContext.Provider>
}

export const useAppContext = (): AppContextState => {
  const ctx = useContext(appContext)
  if (!ctx) {
    throw new Error('useAppContext must be used within AppContextProvider')
  }
  return ctx
}
