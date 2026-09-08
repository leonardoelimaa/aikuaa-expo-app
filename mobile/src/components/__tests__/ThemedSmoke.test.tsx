import { render, screen } from '@testing-library/react-native'
import { ThemedSmoke } from '../ThemedSmoke'

describe('ThemedSmoke', () => {
  it('renders with the token-derived background color', async () => {
    await render(<ThemedSmoke />)

    expect(screen.getByTestId('themed-smoke')).toHaveStyle({ backgroundColor: '#FAF9F6' })
  })
})
