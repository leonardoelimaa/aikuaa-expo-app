import { useRouter } from 'expo-router'
import React, { useCallback } from 'react'
import { Welcome } from '@/screens/welcome'
import { useAppContext } from '@/context/AppContext'

export default function WelcomeScreen() {
  const router = useRouter()
  const { resolveDemoEvent } = useAppContext()

  const handleEnterEvent = useCallback(() => {
    resolveDemoEvent()
    router.replace('/(app)/chat')
  }, [resolveDemoEvent, router])

  return <Welcome onEnterEvent={handleEnterEvent} />
}
