# Guía de intercambio de adaptadores de servicio

Esta guía explica cómo reemplazar los adaptadores mock de `mobile/src/services/` por implementaciones reales (backend, analytics, etc.) sin modificar las pantallas ni los hooks que los consumen.

> Aplica únicamente al directorio `mobile/`. La app funciona 100 % offline en modo demo; los adaptadores reales se conectan cuando el proyecto lo requiera.

## Patrón: registro de servicios

La app no instancia servicios directamente. Todos usan el registro central:

```typescript
import { getServices } from '@/services/serviceRegistry'

const services = getServices()
await services.ai.streamMessage({ message: 'hola' })
await services.analytics.track('message_sent')
```

Esto permite cambiar la implementación de cada servicio desde un solo punto.

## Cómo cambiar un adaptador

1. Crea la implementación real (p. ej. `mobile/src/services/realAi.service.ts`).
2. Asegúrate de que satisfaga la interfaz pública definida en `mobile/src/services/types.ts`.
3. En `mobile/src/services/serviceRegistry.ts`, reemplaza la llamada al mock por la real.

### Ejemplo: analytics real

```typescript
// mobile/src/services/realAnalytics.service.ts
import { AnalyticsService } from './types'

export function createRealAnalyticsService(): AnalyticsService {
  return {
    async track(name: string, properties?: Record<string, unknown>): Promise<void> {
      // Ejemplo: enviar a un backend propio, nunca a un SDK externo sin consentimiento.
      await fetch('/api/analytics/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, properties, timestamp: Date.now() }),
      })
    },

    async trackEvent(name: string, properties?: Record<string, unknown>): Promise<void> {
      return this.track(name, properties)
    },
  }
}
```

```typescript
// mobile/src/services/serviceRegistry.ts
import { createRealAnalyticsService } from './realAnalytics.service'

export function createMockServices(): Services {
  return {
    ai: createMockAIService(),
    conversation: createMockConversationService(),
    event: createMockEventService(),
    company: createMockCompanyService(),
    analytics: createRealAnalyticsService(), // <-- cambio
  }
}
```

Después del cambio, todo el código que usa `getServices().analytics.track()` seguirá compilando y funcionando sin tocar pantallas.

## Reglas de seguridad y privacidad

- No almacenes secretos (API keys, tokens) en el código fuente. Usa variables de entorno inyectadas por EAS o el gestor de secretos del proyecto.
- Los datos biométricos y de asistentes nunca deben enviarse a analytics.
- La implementación real debe ser opt-in y respetar el consentimiento del usuario.
- Mantén el modo demo/mock funcionando offline para pruebas y demos.

## Verificación

Tras cambiar un adaptador:

```bash
npm run typecheck
npm run test
npm run lint
```

Si todo es verde, el contrato de la interfaz se respeta.
