import React, { useEffect } from 'react'
import { render, screen, waitFor } from '@testing-library/react-native'
import { ChatScreen } from '../ChatScreen'
import { AppContextProvider, useAppContext } from '@/context/AppContext'
import { getServices, resetServices, createMockServices } from '@/services/serviceRegistry'

jest.mock('react-native-safe-area-context', () => ({
  SafeAreaView: (props: { children: unknown }) => props.children,
}))
jest.mock('@/services/serviceRegistry', () => ({
  ...jest.requireActual('@/services/serviceRegistry'),
  getServices: jest.fn(),
}))
const mockedGetServices = jest.mocked(getServices)

function DemoHarness({ offline = false }: { offline?: boolean }) {
  const { enterDemo, isResolved } = useAppContext()

  useEffect(() => {
    void enterDemo()
  }, [enterDemo])

  if (!isResolved) {
    return null
  }

  return <ChatScreen offline={offline} />
}

function renderDemo(offline = false) {
  return render(
    <AppContextProvider>
      <DemoHarness offline={offline} />
    </AppContextProvider>,
  )
}

describe('ChatScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    resetServices()
    mockedGetServices.mockReturnValue(createMockServices())
  })

  it('shows the empty state with suggestions on first load', async () => {
    renderDemo()

    await waitFor(() => {
      expect(screen.getByTestId('chat-empty-state')).toBeTruthy()
      expect(screen.getByTestId('chat-welcome-title')).toBeTruthy()
      expect(screen.getByTestId('chat-suggestion-0')).toBeTruthy()
    })
  })

  it('shows the offline indicator and disables the composer when offline', async () => {
    renderDemo(true)

    await waitFor(() => {
      expect(screen.getByTestId('offline-indicator')).toBeTruthy()
      expect(screen.getByTestId('chat-composer-input').props.editable).toBe(false)
      expect(screen.getByTestId('chat-composer-send').props.accessibilityState.disabled).toBe(true)
    })
  })

  it('wraps content in a Reanimated container for screen transition and keyboard motion', async () => {
    renderDemo()

    await waitFor(() => {
      const animatedContent = screen.getByTestId('chat-animated-content')
      expect(animatedContent).toBeTruthy()
      expect(animatedContent.props.entering).toBeDefined()
      expect(animatedContent.props.layout).toBeDefined()
    })
  })
})
