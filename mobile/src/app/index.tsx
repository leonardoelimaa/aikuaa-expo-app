import { Splash } from '@/components/splash'
import { useRouter } from 'expo-router'
import { useCallback } from 'react'

export default function SplashScreen() {
  const router = useRouter()

  const handleComplete = useCallback(() => {
    router.replace('/welcome')
  }, [router])

  return <Splash onComplete={handleComplete} />
}
