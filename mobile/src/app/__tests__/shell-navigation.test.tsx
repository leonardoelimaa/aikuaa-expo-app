import React from 'react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native'
import WelcomeScreen from '../welcome'
import { AppContextProvider } from '@/context/AppContext'

const mockReplace = jest.fn()

jest.mock('expo-router', () => ({
  useRouter: () => ({ replace: mockReplace }),
}))

describe('Shell navigation', () => {
  beforeEach(() => {
    mockReplace.mockClear()
  })

  it('reaches the Chat route after the event context is resolved', async () => {
    await render(
      <AppContextProvider>
        <WelcomeScreen />
      </AppContextProvider>,
    )

    fireEvent.press(screen.getByText('Entrar al evento demo'))

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith('/(app)/chat')
    })
  })
})
