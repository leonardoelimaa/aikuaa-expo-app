import React from 'react'
import { Pressable, Text } from 'react-native'
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react-native'
import { AppContextProvider, useAppContext } from '@/context/AppContext'
import { ChatScreen } from '../../components/ChatScreen'
import { createMockServices, getServices, resetServices } from '@/services/serviceRegistry'
import type { AIChunk } from '@/services/types'

jest.mock('react-native-safe-area-context', () => ({
  SafeAreaView: (props: { children: unknown }) => props.children,
}))

jest.mock('@/services/serviceRegistry', () => ({
  ...jest.requireActual('@/services/serviceRegistry'),
  getServices: jest.fn(),
}))

const mockedGetServices = jest.mocked(getServices)
const WORKSPACE_ACME = 'workspace-acme'
const WORKSPACE_BETA = 'workspace-beta'

interface Deferred<T> {
  promise: Promise<T>
  resolve: (value: T) => void
  reject: (reason: Error) => void
}

function deferred<T>(): Deferred<T> {
  let resolve!: (value: T) => void
  let reject!: (reason: Error) => void
  const promise = new Promise<T>((onResolve, onReject) => {
    resolve = onResolve
    reject = onReject
  })
  return { promise, resolve, reject }
}

function WorkspaceControls() {
  const { context, enterDemo, selectWorkspace, resetDemo } = useAppContext()
  return (
    <>
      <Text testID="active-workspace">{context?.workspaceId ?? 'none'}</Text>
      <Pressable testID="enter-demo" onPress={() => void enterDemo()} />
      <Pressable testID="select-acme" onPress={() => void selectWorkspace(WORKSPACE_ACME)} />
      <Pressable testID="select-beta" onPress={() => void selectWorkspace(WORKSPACE_BETA)} />
      <Pressable testID="reset-demo" onPress={() => void resetDemo()} />
    </>
  )
}

async function renderWorkspaceChat() {
  return await render(
    <AppContextProvider>
      <WorkspaceControls />
      <ChatScreen />
    </AppContextProvider>,
  )
}

async function enterDemo() {
  await fireEvent.press(screen.getByTestId('enter-demo'))
  await waitFor(() =>
    expect(screen.getByTestId('active-workspace').props.children).toBe(WORKSPACE_ACME),
  )
}

async function switchTo(testId: 'select-acme' | 'select-beta') {
  await fireEvent.press(screen.getByTestId(testId))
  const expected = testId === 'select-acme' ? WORKSPACE_ACME : WORKSPACE_BETA
  await waitFor(() => expect(screen.getByTestId('active-workspace').props.children).toBe(expected))
}

async function typeAndSend(text: string) {
  await fireEvent.changeText(screen.getByTestId('chat-composer-input'), text)
  await waitFor(() => expect(screen.getByTestId('chat-composer-input').props.value).toBe(text))
  await fireEvent.press(screen.getByTestId('chat-composer-send'))
}

describe('rendered workspace chat isolation', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    resetServices()
  })

  it('clears rendered draft, messages, error, and retry when the workspace changes', async () => {
    const services = createMockServices()
    mockedGetServices.mockReturnValue(services)
    jest.spyOn(services.ai, 'streamMessage').mockImplementation(async function* () {
      yield { type: 'error', code: 'AI_ERROR', message: 'Acme failure' }
    })
    await renderWorkspaceChat()
    await enterDemo()

    await typeAndSend('Acme failed request')
    await waitFor(() => expect(screen.getByTestId('chat-error-banner')).toBeTruthy())
    await fireEvent.changeText(screen.getByTestId('chat-composer-input'), 'Acme private draft')

    await switchTo('select-beta')

    expect(screen.getByTestId('chat-composer-input').props.value).toBe('')
    expect(screen.queryByText('Acme failed request')).toBeNull()
    expect(screen.queryByText('Acme failure')).toBeNull()
    expect(screen.queryByTestId('error-state-retry')).toBeNull()
  })

  it('ignores deferred success and rejection from A after B becomes active', async () => {
    const acmeSuccess = deferred<AIChunk[]>()
    const acmeRejection = deferred<AIChunk[]>()
    const services = createMockServices()
    mockedGetServices.mockReturnValue(services)
    jest.spyOn(services.ai, 'streamMessage').mockImplementation(async function* (request) {
      if (request.message === 'A succeeds late') {
        for (const chunk of await acmeSuccess.promise) yield chunk
        return
      }
      if (request.message === 'A rejects late') {
        for (const chunk of await acmeRejection.promise) yield chunk
        return
      }
      yield { type: 'text', content: 'B remains correct' }
      yield { type: 'done' }
    })
    await renderWorkspaceChat()
    await enterDemo()

    await typeAndSend('A succeeds late')
    await switchTo('select-beta')
    await typeAndSend('B request')
    await waitFor(() => expect(screen.getByText('B remains correct')).toBeTruthy())

    await act(async () => {
      acmeSuccess.resolve([{ type: 'text', content: 'stale A success' }, { type: 'done' }])
      await acmeSuccess.promise
    })
    expect(screen.queryByText('stale A success')).toBeNull()
    expect(screen.getByText('B remains correct')).toBeTruthy()

    await switchTo('select-acme')
    await typeAndSend('A rejects late')
    await switchTo('select-beta')
    await typeAndSend('B after rejection')
    await waitFor(() => expect(screen.getByText('B remains correct')).toBeTruthy())
    await act(async () => {
      acmeRejection.reject(new Error('stale A rejection'))
      await expect(acmeRejection.promise).rejects.toThrow('stale A rejection')
    })

    await waitFor(() => {
      expect(screen.queryByText('stale A rejection')).toBeNull()
      expect(screen.queryByTestId('chat-error-banner')).toBeNull()
      expect(screen.getByText('B remains correct')).toBeTruthy()
    })
  })

  it('keeps the original A request stale across an A to B to A sequence', async () => {
    const originalA = deferred<AIChunk[]>()
    const services = createMockServices()
    mockedGetServices.mockReturnValue(services)
    jest.spyOn(services.ai, 'streamMessage').mockImplementation(async function* (request) {
      if (request.message === 'original A') {
        for (const chunk of await originalA.promise) yield chunk
        return
      }
      yield { type: 'text', content: 'new A incarnation' }
      yield { type: 'done' }
    })
    await renderWorkspaceChat()
    await enterDemo()

    await typeAndSend('original A')
    await switchTo('select-beta')
    await switchTo('select-acme')
    await typeAndSend('new A')
    await waitFor(() => expect(screen.getByText('new A incarnation')).toBeTruthy())

    await act(async () => {
      originalA.resolve([{ type: 'text', content: 'original A stale result' }, { type: 'done' }])
      await originalA.promise
    })

    expect(screen.queryByText('original A stale result')).toBeNull()
    expect(screen.getByText('new A incarnation')).toBeTruthy()
  })

  it.each(['reset', 'unmount'] as const)(
    '%s prevents a late request from mutating rendered or conversation state',
    async (boundary) => {
      const late = deferred<AIChunk[]>()
      const services = createMockServices()
      mockedGetServices.mockReturnValue(services)
      jest.spyOn(services.ai, 'streamMessage').mockImplementation(async function* () {
        for (const chunk of await late.promise) yield chunk
      })
      const rendered = await renderWorkspaceChat()
      await enterDemo()
      const before = await services.conversation.listConversations(WORKSPACE_ACME)

      await typeAndSend(`${boundary} pending`)
      if (boundary === 'reset') {
        await fireEvent.press(screen.getByTestId('reset-demo'))
        await waitFor(() =>
          expect(screen.getByTestId('active-workspace').props.children).toBe('none'),
        )
      } else {
        await rendered.unmount()
      }

      await act(async () => {
        late.resolve([{ type: 'text', content: `${boundary} stale result` }, { type: 'done' }])
        await late.promise
      })

      const after = await services.conversation.listConversations(WORKSPACE_ACME)
      expect(after).toEqual(before)
      if (boundary === 'reset') {
        expect(screen.queryByText(`${boundary} stale result`)).toBeNull()
      }
    },
  )
})
