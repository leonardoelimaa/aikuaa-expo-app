import { render, screen } from '@testing-library/react-native'
import { useFonts } from 'expo-font'
import { Text } from 'react-native'
import { FontLoader } from '../FontLoader'

jest.mock('expo-font', () => ({
  useFonts: jest.fn(() => [false]),
}))

describe('FontLoader', () => {
  it('does not render children until fonts are ready', async () => {
    ;(useFonts as jest.Mock).mockReturnValue([false])

    const { rerender } = await render(
      <FontLoader>
        <Text testID="child">Ready</Text>
      </FontLoader>,
    )

    expect(screen.queryByTestId('child')).toBeNull()

    ;(useFonts as jest.Mock).mockReturnValue([true])
    await rerender(
      <FontLoader>
        <Text testID="child">Ready</Text>
      </FontLoader>,
    )

    expect(screen.getByTestId('child')).toBeTruthy()
  })
})
