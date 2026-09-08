import { act, renderHook } from '@testing-library/react-native'
import React from 'react'
import { AppContextProvider, useAppContext } from './AppContext'
import { resolveEventContext } from './resolveEvent'

describe('AppContext', () => {
  describe('resolveEventContext', () => {
    it('returns the preconfigured demo event by default', () => {
      const context = resolveEventContext()

      expect(context.mode).toBe('event')
      expect(context.eventId).toBe('aikuaa-demo-event')
      expect(context.tenantId).toBe('aikuaa-demo-tenant')
      expect(context.companyId).toBe('aikuaa-demo-company')
    })

    it('accepts a deep-link / QR payload without changing the architecture', () => {
      const context = resolveEventContext({
        eventId: 'deep-link-event',
        tenantId: 'deep-link-tenant',
        companyId: 'deep-link-company',
      })

      expect(context.mode).toBe('event')
      expect(context.eventId).toBe('deep-link-event')
      expect(context.tenantId).toBe('deep-link-tenant')
      expect(context.companyId).toBe('deep-link-company')
    })
  })

  describe('useAppContext', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AppContextProvider>{children}</AppContextProvider>
    )

    it('starts with the demo event context unresolved', async () => {
      const { result } = await renderHook(() => useAppContext(), { wrapper })

      expect(result.current.context.eventId).toBe('aikuaa-demo-event')
      expect(result.current.isResolved).toBe(false)
    })

    it('marks the context resolved when resolveEvent is called', async () => {
      const { result } = await renderHook(() => useAppContext(), { wrapper })

      await act(() => {
        result.current.resolveEvent()
      })

      expect(result.current.isResolved).toBe(true)
      expect(result.current.context.eventId).toBe('aikuaa-demo-event')
    })

    it('can resolve a custom event via the deep-link code path', async () => {
      const { result } = await renderHook(() => useAppContext(), { wrapper })

      await act(() => {
        result.current.resolveEvent({ eventId: 'qr-scanned-event' })
      })

      expect(result.current.isResolved).toBe(true)
      expect(result.current.context.eventId).toBe('qr-scanned-event')
    })

    it('resolves the demo event through resolveDemoEvent', async () => {
      const { result } = await renderHook(() => useAppContext(), { wrapper })

      await act(() => {
        result.current.resolveDemoEvent()
      })

      expect(result.current.isResolved).toBe(true)
      expect(result.current.context.eventId).toBe('aikuaa-demo-event')
    })
  })
})
