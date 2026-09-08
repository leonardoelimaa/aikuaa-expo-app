import React from 'react'
import { render, screen } from '@testing-library/react-native'
import { Splash } from './Splash'

describe('Splash', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
    jest.clearAllMocks()
  })

  it('renders the brand name and a loading indicator', async () => {
    await render(<Splash />)

    expect(screen.getByText('Aikuaa')).toBeTruthy()
    expect(screen.getByTestId('splash-spinner')).toBeTruthy()
  })

  it('calls onComplete after the default delay', async () => {
    const onComplete = jest.fn()

    await render(<Splash onComplete={onComplete} />)

    expect(onComplete).not.toHaveBeenCalled()

    jest.advanceTimersByTime(1500)

    expect(onComplete).toHaveBeenCalledTimes(1)
  })

  it('calls onComplete after a custom delay', async () => {
    const onComplete = jest.fn()

    await render(<Splash onComplete={onComplete} delayMs={500} />)

    jest.advanceTimersByTime(500)

    expect(onComplete).toHaveBeenCalledTimes(1)
  })
})
