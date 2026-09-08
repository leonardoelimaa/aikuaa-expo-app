# Investigación de marca aikuaa.ai

Fecha de extracción: 2026-09-08.  
Fuente: HTML/CSS público de https://aikuaa.ai (hojas de estilo `Base.BxnUo5wO.css` y fuentes servidas por el sitio).

## 1. Tipografía verificada

El sitio precarga tres familias tipográficas:

| Familia | Rol | Pesos servidos | Stack CSS declarado |
|---|---|---|---|
| Manrope | Display | 600, 700 | `"Manrope", system-ui, sans-serif` |
| DM Sans | Body | 400, 600 | `"DM Sans", system-ui, sans-serif` |
| DM Mono | Monospace | — | `"DM Mono", ui-monospace, monospace` |

Evidencia de fuente:

- `/fonts/manrope-600-700-latin.woff2` → Manrope 600/700.
- `/fonts/dm-sans-400-600-latin.woff2` → DM Sans 400/600.
- `DM Mono` aparece en la variable `--font-mono`.

> Nota para implementación mobile: en React Native / Expo estas fuentes deberán cargarse con `expo-font` o un mecanismo equivalente; los tokens almacenan los nombres de familia para que el adaptador de fuentes las resuelva en runtime.

## 2. Paleta de color verificada

### Escala cream (fondos cálidos)

| Token | Hex |
|---|---|
| `--cream-50` | `#faf9f6` |
| `--cream-100` | `#f5f3ed` |
| `--cream-200` | `#ebe8df` |

### Escala navy (tinta profunda)

| Token | Hex |
|---|---|
| `--navy-950` | `#0a1628` |
| `--navy-900` | `#0f1f38` |
| `--navy-800` | `#162b4a` |
| `--navy-700` | `#1e3a61` |
| `--navy-600` | `#2a4d7a` |
| `--navy-500` | `#4a6b96` |
| `--navy-400` | `#7a96b8` |
| `--navy-300` | `#a8bdd4` |

### Alias semánticos

| Alias | Superficie clara | Superficie oscura |
|---|---|---|
| `--paper` | `var(--cream-50)` | `var(--navy-900)` |
| `--surface` | `#fff` | `var(--navy-800)` |
| `--ink` | `var(--navy-950)` | `var(--cream-50)` |
| `--muted` | `var(--navy-500)` | `var(--cream-100)` |
| `--line` | `var(--cream-200)` | `var(--navy-700)` |
| `--proof` | `var(--navy-900)` | `var(--navy-800)` |
| `--navy-text` | `var(--navy-500)` | `var(--cream-100)` |
| `--header-bg` | `#faf9f6eb` (con alfa) | `var(--navy-900)` |
| `--focus` | `var(--navy-900)` | `var(--cream-50)` |

## 3. Estilo visual observado

- **Fondo:** papel crema (`--cream-50`) como base; tarjetas y superficies elevadas en blanco puro.
- **Tinta:** navy 950 para títulos y cuerpo principal; navy 500 para texto secundario o deshabilitado.
- **Formas:** bordes muy redondeados en pills/tags (`border-radius` cercano a 9999 px); tarjetas con radio amplio (12–24 px).
- **Espaciado:** layout editorial aireado; grandes márgenes verticales y gutters amplios.
- **Sombras:** sombras suaves y difusas para tarjetas elevadas; color de sombra derivado de navy 950 con baja opacidad.
- **Animaciones:** transiciones de estado rápidas (200–300 ms) con `ease`/`ease-out`; movimiento contenido y profesional.
- **Motivos decorativos:** puntos/ondas sutiles como fondo de secciones; no forman parte de la paleta funcional.
- **Tono:** B2B cercano y acogedor; lenguaje claro; secciones de "proof" con citas/fuentes.

## 4. Patrones de componentes clave

- **Pills / tags:** fondo crema 100 o navy 900, texto navy 500 o crema 50, radio completo.
- **Tarjetas:** fondo blanco, borde crema 200, sombra suave, radio 16–24 px.
- **Bloques proof:** fondo navy 900, texto crema 50, enlaces/fuentes en navy 300.
- **Header:** fondo crema 50 con translucidez (`#faf9f6eb`), borde inferior crema 200.
- **Botones primarios:** fondo navy 950, texto crema 50; hover con ligero levantamiento/sombra.
- **Inputs:** fondo blanco, borde crema 200, anillo de focus navy 950 en claro / crema 50 en oscuro.
