import { ExpoConfig, ConfigContext } from 'expo/config'

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'Aikuaa',
  slug: 'aikuaa',
  version: '0.0.1',
  orientation: 'portrait',
  userInterfaceStyle: 'light',
  backgroundColor: '#FAF9F6',
  newArchEnabled: true,
  experiments: {
    typedRoutes: true,
  },
  plugins: [['expo-router', { root: './src/app' }]],
  ios: {
    bundleIdentifier: 'com.aikuaa.mobile',
    newArchEnabled: true,
  },
  android: {
    package: 'com.aikuaa.mobile',
    newArchEnabled: true,
  },
})
