import React from 'react'
import { act, renderHook } from '@testing-library/react-native'

import { AppContextProvider, useAppContext } from '@/context/AppContext'
import {
  createMockServices,
  getServices,
  resetServices,
  type Services,
} from '@/services/serviceRegistry'
import { resetDemoState } from '@/stores/demoStore'
import { ACME_WORKSPACE_ID, BETA_WORKSPACE_ID } from '@/types/app'
import { useChat } from '../useChat'

jest.mock('@/services/serviceRegistry', () => ({
  ...jest.requireActual('@/services/serviceRegistry'),
  getServices: jest.fn(),
}))

const mockedGetServices = jest.mocked(getServices)

type Boundary = 'switch' | 'aba' | 'reset' | 'unmount'

function gate() {
  let resolve!: () => void
  const promise = new Promise<void>((done) => {
    resolve = done
  })
  return { promise, resolve }
}

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <AppContextProvider>{children}</AppContextProvider>
)

function useHarness() {
  const app = useAppContext()
  const chat = useChat()
  return { app, chat }
}

async function snapshot(services: Services) {
  return {
    acme: await services.conversation.listConversations(ACME_WORKSPACE_ID),
    beta: await services.conversation.listConversations(BETA_WORKSPACE_ID),
  }
}

async function runMutationRace(operation: 'create' | 'save', boundary: Boundary) {
  const services = createMockServices()
  mockedGetServices.mockReturnValue(services)
  jest.spyOn(services.ai, 'streamMessage').mockImplementation(async function* () {
    yield { type: 'text', content: 'Resposta atual' }
    yield { type: 'done' }
  })

  const started = gate()
  const release = gate()
  const hook = await renderHook(() => useHarness(), { wrapper })

  await act(async () => {
    await hook.result.current.app.enterDemo()
  })

  if (operation === 'save') {
    await services.conversation.createConversation(ACME_WORKSPACE_ID, {
      id: hook.result.current.chat.conversationId,
      title: 'Seed',
    })
  }

  if (operation === 'create') {
    const original = services.conversation.createConversation.bind(services.conversation)
    jest
      .spyOn(services.conversation, 'createConversation')
      .mockImplementation(async (workspaceId, params, options) => {
        started.resolve()
        await release.promise
        return original(workspaceId, params, options)
      })
  } else {
    const original = services.conversation.saveConversation.bind(services.conversation)
    jest
      .spyOn(services.conversation, 'saveConversation')
      .mockImplementation(async (workspaceId, conversation, options) => {
        started.resolve()
        await release.promise
        return original(workspaceId, conversation, options)
      })
  }

  let pending!: Promise<void>
  await act(async () => {
    pending = hook.result.current.chat.sendMessage(`${operation}-${boundary}`)
    await started.promise
  })

  await act(async () => {
    if (boundary === 'switch') {
      await hook.result.current.app.selectWorkspace(BETA_WORKSPACE_ID)
    }
    if (boundary === 'aba') {
      await hook.result.current.app.selectWorkspace(BETA_WORKSPACE_ID)
      await hook.result.current.app.selectWorkspace(ACME_WORKSPACE_ID)
    }
    if (boundary === 'reset') {
      await hook.result.current.app.resetDemo()
    }
    if (boundary === 'unmount') {
      hook.unmount()
    }
  })

  const atBoundary = await snapshot(services)

  await act(async () => {
    release.resolve()
    await pending
  })

  expect(await snapshot(services)).toEqual(atBoundary)
}

describe('conversation mutation isolation', () => {
  beforeEach(async () => {
    jest.clearAllMocks()
    resetServices()
    await resetDemoState()
  })

  it('rejects an already-aborted create at the adapter commit boundary', async () => {
    const services = createMockServices()
    const before = await snapshot(services)
    const controller = new AbortController()
    controller.abort()

    await expect(
      services.conversation.createConversation(
        ACME_WORKSPACE_ID,
        { title: 'stale' },
        { signal: controller.signal },
      ),
    ).rejects.toMatchObject({ name: 'AbortError' })
    expect(await snapshot(services)).toEqual(before)
  })

  it('rejects an already-aborted save at the adapter commit boundary', async () => {
    const services = createMockServices()
    const seeded = await services.conversation.createConversation(ACME_WORKSPACE_ID, {
      title: 'seed',
    })
    const before = await snapshot(services)
    const controller = new AbortController()
    controller.abort()

    await expect(
      services.conversation.saveConversation(
        ACME_WORKSPACE_ID,
        { ...seeded, title: 'stale' },
        { signal: controller.signal },
      ),
    ).rejects.toMatchObject({ name: 'AbortError' })
    expect(await snapshot(services)).toEqual(before)
  })

  it.each(['switch', 'aba', 'reset', 'unmount'] as const)(
    'prevents delayed create after %s',
    async (boundary) => {
      await runMutationRace('create', boundary)
    },
  )

  it.each(['switch', 'aba', 'reset', 'unmount'] as const)(
    'prevents delayed save after %s',
    async (boundary) => {
      await runMutationRace('save', boundary)
    },
  )
})
