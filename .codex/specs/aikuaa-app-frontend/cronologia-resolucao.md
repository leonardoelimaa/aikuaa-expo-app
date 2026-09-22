# Resolution Chronology — Aikuaa AI Mobile Frontend

Status: Planning complete
Date: 2026-09-08
Revision: 2 (2026-09-08) — applied review round 2 feedback
Author: planner-agent

## Problem statement

Build a greenfield React Native + Expo (iOS + Android) frontend skeleton of the Aikuaa AI assistant. The app is a demo AI assistant for corporate events (Splash -> Welcome -> Event context -> Chat with mock streaming, sources, company cards, structured responses, states) and must be architecturally prepared to become a multi-tenant corporate AI assistant (COMPANY mode, white-label) with real backend integration later. This stage is FRONTEND ONLY: no backend, no real APIs, no real LLM calls; all backend-dependent capabilities are expressed as service interfaces backed by mocks. Primary priority: attractiveness/polish of the demo (PR-08 Polish must be in the first MVP). First feature to defer if time is reduced: Conversations (PR-07 portion, Phase 2).

## Validated architecture

- Stack: Expo SDK 57 / React Native 0.87 / Expo Router 57 (New Architecture), Zustand (UI/session/chat state) + TanStack Query (server state), react-native-unistyles (token theming), React Native Reanimated (motion), @shopify/flash-list (virtualization), expo-font (fonts VERIFIED on aikuaa.ai), Jest + RNTL + Maestro (testing).
- Pattern: feature-based Ports & Adapters. Dependency direction UI -> feature hooks/stores -> service interfaces (AIService, ConversationService, EventService, CompanyService, AnalyticsService) -> mock adapters now / real adapters later. Anti-over-abstraction rule: create only interfaces that correspond to an identified future integration boundary.
- Design system: centralized typed tokens (colors, typography, spacing, radius, shadows, animations) researched from https://aikuaa.ai. PR-01 produces the token SPEC (no UI); PR-02 implements the theme wiring.
- Brand research must VERIFY the actual typography/palette used on the site, not assume Manrope/DM Sans/DM Mono or the source-doc palette.
- Streaming: time-sliced batch accumulator (40-80 ms chunk appends + memoized markdown), no per-token re-render.
- Tenancy: typed AppContext (mode, tenantId?, eventId?, companyId?) — event context functional; COMPANY type documented but NOT functional in the MVP.
- No tenant-specific branding/business copy scattered through components (centralized copy).
- Deterministic demo reset in the mock environment clears local state and restores the initial event scenario.

### Validated decisions (user-confirmed)

1. Primary priority: demo polish/attractiveness — architecture must stay sound.
2. Versions: Expo SDK 57 / RN 0.87 / Expo Router 57.
3. Theming: Unistyles.
4. Streaming: time-sliced batch accumulator.
5. PR ordering: service architecture before chat core before rich responses before conversations/states (ports -> mocks -> UI -> rich data -> polish).
6. Deferral priority: Conversations (PR-07 portion) is Phase 2 — first to defer; PR-08 Polish remains in the first MVP.
7. PR-01 = research + design token SPECIFICATION only (no UI components).
8. Brand research verifies actual fonts/colors (no assumption).
9. Event context: preconfigured for demo, QR/deep-link-ready; no user-facing event selection.
10. Demo reset mechanism required for consecutive demos on the same device.
11. Tenancy simplified: typed context, event-only functional, COMPANY documented-not-functional.
12. Anti-over-abstraction rule added.

## Implementation specification

- Path: `.codex/specs/aikuaa-app-frontend/README.md`
- Status: approved (revision 2)

## PR plan

| PR | Title | Tier | Depends on | Merge order | Review checkpoints | Completion criteria |
|---|---|---|---|---|---|---|
| PR-01 | Aikuaa brand research + design token specification | strong | none | 1 | Phase B (+ architecture gate) | token spec typed + documented; fonts/palette VERIFIED on site |
| PR-02 | Expo setup + navigation + theme wiring + test harness | strong | PR-01 | 2 | Phase B (+ architecture gate) | app boots; expo-doctor/export pass; tokens wired |
| PR-03 | App shell (splash, welcome, event context, nav) | standard | PR-02 | 3 | Phase B | splash->welcome->event->chat flow works |
| PR-04 | Service architecture + mock adapters + demo reset | strong | PR-03 | 4 | Phase B (+ architecture gate) | ports + mocks + demo reset tested |
| PR-05 | Chat core | strong | PR-04 | 5 | Phase B (+ architecture gate) | send->stream->render->complete integration green |
| PR-06 | Rich chat responses | standard | PR-05 | 6 | Phase B | sources/cards/structured responses tested |
| PR-07 | Conversations + states | standard | PR-06 | 7 | Phase B | states green; Conversations Phase 2 deferrable |
| PR-08 | Polish: animations, a11y, responsive, performance | strong | PR-07 | 8 | Phase B (+ architecture gate) | a11y/perf checks pass; UI-thread animations |
| PR-09 | Demo / integration prep + observability | standard | PR-08 | 9 | Phase B | Maestro E2E green; demo build; operator demo reset |

## Dependency graph

- PR-01 -> PR-02 -> PR-03 -> PR-04 -> PR-05 -> PR-06 -> PR-07 -> PR-08 -> PR-09 (linear; each builds on the previous).

## Milestones

- M1 (after PR-02): project boots, navigation + theme wiring + test harness operational.
- M2 (after PR-04): service architecture + mocks + demo reset ready.
- M3 (after PR-05): chat-first polished demo core usable (send -> stream -> render).
- M4 (after PR-07): states complete (Conversations optional if deferred).
- M5 (after PR-08): premium polish, a11y and performance complete — first demonstrable MVP.
- M6 (after PR-09): full E2E + packaged demo build; feature closed.

## Implementation timeline

- Phase 1 (medium): PR-01 — brand research + token spec.
- Phase 2 (medium): PR-02 — Expo setup + nav + theme + harness.
- Phase 3 (medium): PR-03 — app shell.
- Phase 4 (medium): PR-04 — service architecture + mocks + demo reset.
- Phase 5 (large): PR-05 — chat core.
- Phase 6 (medium): PR-06 — rich chat responses.
- Phase 7 (medium): PR-07 — conversations + states (conversations deferrable).
- Phase 8 (large): PR-08 — polish (a11y, responsive, performance).
- Phase 9 (medium): PR-09 — demo/integration prep + observability.

## Completion checkpoints

- Checkpoint 1: after PR-02 Phase B (foundation gate).
- Checkpoint 2: after PR-05 Phase B (chat demo gate).
- Checkpoint 3: after PR-07 Phase B (states gate; Conversations optional).
- Checkpoint 4: after PR-08 Phase B (polish gate — first demonstrable MVP).
- Checkpoint 5: feature closing gate (PR-09, all validations green, chronology updated).
