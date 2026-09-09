# Aikuaa

Aikuaa es un asistente AI para el control de presencia y asistencia con una experiencia centrada en el chat (chat-first). Pensado como demo para eventos, la app permite gestionar asistencias conversando con el asistente.

En este momento el proyecto es **frontend-only**: la app móvil consume interfaces de servicio respaldadas por mocks (adaptadores mock). No hay backend ni web en este repositorio por ahora.

## Estado actual

- La feature `aikuaa-app-frontend` está en implementación mediante PRs secuenciales.
- PRs cerrados: PR-01 (brand research y design tokens), PR-02 (Expo setup, navegación, theme y test harness) y PR-03 (app shell: splash, welcome, event context, tab navigation, safe-area y keyboard).
- PR-04 en curso (service architecture, mock adapters y demo reset).
- Pendientes: chat core, rich chat responses, conversations y estados, polish/animaciones/accesibilidad/rendimiento y demo/integración con E2E.

## Estructura del repositorio

- `mobile/` — aplicación móvil Expo (React Native). Todo el código de la app vive aquí.
- Raíz — workspace npm que agrupa tareas transversales (`lint`, `test`, `typecheck`).

## Requisitos previos

- **Node.js** (LTS recomendada)
- **npm** (el repositorio usa npm como workspace root)

## Cómo ejecutar la app

Instalación de dependencias:

```bash
# 1. Dependencias en la raíz (workspace npm)
npm install

# 2. Dependencias de la app mobile
cd mobile
npm install
```

Arranque de la app:

```bash
# Desde la carpeta mobile/

# Arrancar el Expo Dev Server
npm start

# Build + run en el simulador iOS
npm run ios

# Build + run en un emulador Android (requiere Android SDK/emulador configurado)
npm run android
```

Nota: las carpetas nativas (`ios/` y `android/`) se generan la primera vez que se ejecuta `npm run ios` / `npm run android` (comandos `expo run:ios` / `expo run:android`).

## Scripts

**Raíz del repositorio:**

| Script | Descripción |
|---|---|
| `npm run lint` | Verificación de tipos con `tsc --noEmit` |
| `npm test` | Tests con Jest |
| `npm run typecheck` | Verificación de tipos con `tsc --noEmit` |

**App mobile (`mobile/`):**

| Script | Descripción |
|---|---|
| `npm start` | Arranca el Expo Dev Server (`expo start`) |
| `npm run ios` | Build + run en el simulador iOS (`expo run:ios`) |
| `npm run android` | Build + run en un emulador Android (`expo run:android`) |
| `npm run lint` | ESLint sobre archivos `.ts` y `.tsx` |
| `npm run format` | Prettier sobre `src/**/*.{ts,tsx}` |
| `npm run format:check` | Verificación de formato con Prettier |
| `npm test` | Tests con Jest |
| `npm run typecheck` | Verificación de tipos con `tsc --noEmit` |

## Testing y calidad

- `npm test` en `mobile/` corre Jest (jest-expo + @testing-library/react-native); `npm test` en la raíz corre Jest del workspace.
- `npm run typecheck` y `npm run lint` en ambos niveles (raíz y `mobile/`).

## Tecnologías principales

- Expo SDK 57
- React Native 0.86
- React 19
- Expo Router (con typed routes)
- TypeScript
- Unistyles
- Reanimated 4
- FlashList, Nitro Modules, expo-status-bar

## Nota sobre backend y web

No hay backend ni aplicación web en este repositorio por ahora. La app es frontend-only y la lógica de servicio está respaldada por adaptadores mock, pensada para evolucionar hacia una integración real más adelante.