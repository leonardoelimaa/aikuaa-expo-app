import { ExpoConfig, ConfigContext } from 'expo/config'

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'Aikuaa',
  slug: 'aikuaa',
  version: '0.0.1',
  scheme: 'aikuaa',
  icon: './assets/brand/aikuaa-icon-ios.png',
  orientation: 'portrait',
  userInterfaceStyle: 'light',
  backgroundColor: '#FAF9F6',
  experiments: {
    typedRoutes: true,
  },
  plugins: [
    ['expo-router', { root: './src/app' }],
    [
      'expo-splash-screen',
      {
        image: './assets/brand/aikuaa-splash-mark.png',
        imageWidth: 200,
        resizeMode: 'contain',
        backgroundColor: '#FAF9F6',
      },
    ],
  ],
  ios: {
    bundleIdentifier: 'com.aikuaa.mobile',
    icon: './assets/brand/aikuaa-icon-ios.png',
  },
  android: {
    package: 'com.aikuaa.mobile',
    adaptiveIcon: {
      foregroundImage: './assets/brand/aikuaa-adaptive-foreground.png',
      backgroundColor: '#FAF9F6',
    },
  },
  web: {
    favicon: './assets/brand/aikuaa-icon.png',
  },
})
