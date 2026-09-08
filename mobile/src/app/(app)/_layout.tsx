import { Tabs } from 'expo-router'
import React from 'react'
import { useUnistyles } from 'react-native-unistyles'

export default function AppLayout() {
  const { theme } = useUnistyles()

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.secondary,
        tabBarStyle: {
          backgroundColor: theme.colors.white,
          borderTopColor: theme.colors.overlay,
        },
        headerStyle: {
          backgroundColor: theme.colors.white,
        },
        headerTitleStyle: {
          fontFamily: theme.fonts.display,
          color: theme.colors.foreground,
        },
      }}
    >
      <Tabs.Screen name="chat" options={{ title: 'Chat', tabBarLabel: 'Chat' }} />
      <Tabs.Screen name="history" options={{ title: 'Historial', tabBarLabel: 'Historial' }} />
      <Tabs.Screen name="event" options={{ title: 'Evento', tabBarLabel: 'Evento' }} />
      <Tabs.Screen name="settings" options={{ title: 'Ajustes', tabBarLabel: 'Ajustes' }} />
    </Tabs>
  )
}
