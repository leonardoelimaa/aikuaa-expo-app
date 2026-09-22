import React, { useState } from 'react'
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query'
import { useAppContext } from './AppContext'
import { getServices } from '../services/serviceRegistry'

export const WorkspaceQueryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { retry: false, staleTime: 0, gcTime: 0 },
        },
      }),
  )

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>
}

export function useWorkspaceCompany() {
  const { context, revision } = useAppContext()
  const workspaceId = context?.workspaceId
  const companyId = context?.companyId

  return useQuery({
    queryKey: [
      'workspace-company',
      workspaceId ?? 'unresolved',
      revision,
      companyId ?? 'unresolved',
    ],
    enabled: Boolean(workspaceId && companyId),
    queryFn: async () => {
      if (!workspaceId || !companyId) {
        throw new Error('Workspace is not selected.')
      }
      return getServices().company.getCompanyById(workspaceId, companyId)
    },
  })
}

export function useWorkspaceCatalog() {
  return useQuery({
    queryKey: ['workspace-catalog'],
    queryFn: () => getServices().company.listWorkspaces(),
  })
}
