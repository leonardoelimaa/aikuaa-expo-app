# Architectural Decisions

Record architectural decisions here. Numbered sequentially (DA-001, DA-002, ...) with date, status, what changed, reason, impact, and risks/mitigation.

## DA-009: Operational workspace context and commit-aware demo isolation

- Date: 2026-09-20
- Status: Accepted
- What: Branded workspace/conversation IDs; company-only operational context with explicit workspace and monotonic revision; scoped ports and query keys; immutable conversation ownership; AbortSignal on create/save with atomic pre-commit checks; operational event mode retired.
- Why: Provide a deterministic enterprise demo while preventing stale work from crossing workspace boundaries.
- Impact: PR-03 and later UI consume workspace semantics. Service implementations preserve runtime scope validation and commit-boundary cancellation. Event compatibility remains unreachable.
- Risks: Mock isolation is not authorization and in-memory state is not persistence. Future real adapters must enforce server-side tenant authorization and cancellation or conditional writes.

## DA-008: Analytics contract as no-op/mock in-memory recorder

## DA-008: Analytics contract as no-op/mock in-memory recorder

**Date:** 2026-09-11

**Status:** accepted

**What changed:**
- The analytics contract is implemented as a no-op/mock in-memory recorder behind the existing `AnalyticsService` port. Instrumentation uses `getServices().analytics.track(...)`. Real adapters can be swapped via the `serviceRegistry.ts` factories without touching UI or hooks, as documented in `mobile/docs/adapter-swap.md`. No secrets or backend calls are included in the bundle.

**Reason:**
- Satisfy the observability contract for the MVP demo while keeping the app fully offline and white-label ready.

**Impact:**
- PR-09 closes the feature. Future analytics integration only touches `serviceRegistry.ts` and the new adapter file.

**Risks / mitigation:**
- Risk: the in-memory recorder loses events on restart and is not a real analytics backend. Mitigation: the service-port boundary keeps the UI decoupled; a real adapter can be added behind the same port without UI changes (see `mobile/docs/adapter-swap.md`).

## DA-006: Service port contracts and mock adapters for mobile frontend

**Date:** 2026-09-09

**Status:** accepted

**What changed:**
- Defined the five service ports consumed by the UI layer: `AIService`, `ConversationService`, `EventService`, `CompanyService`, `AnalyticsService`.
- `AIService.streamMessage` returns `AsyncIterableIterator<AIChunk>` to model streaming chat responses.
- Implemented mock adapters behind those ports, backed by module-level in-memory stores (see DA-007).
- Introduced a lightweight service registry: `createMockServices`, `getServices`, `resetServices`.
- `AppContext` is a typed union with the event context functional and the company context documented but non-operational (multi-tenancy shape in place).
- Added deterministic `resetDemoState()` for the dev/demo reset action.

**Reason:**
- The frontend-only demo stage needs stable contracts before the chat UI is built (PR-05), so real backend adapters can later be swapped behind the same ports without UI rewrites.

**Impact:**
- PR-05 (chat core) consumes these contracts; downstream work must not change port signatures without a new architecture gate.
- Service communication between the mobile UI and future backend is typed from the start.

**Risks / mitigation:**
- Risk: module-level mutable stores are temporary state. Mitigation: documented with code comments; a future PR will replace them with persistence (or real backend adapters).

## DA-007: Module-level mutable stores accepted as temporary demo infrastructure

**Date:** 2026-09-09

**Status:** accepted

**What changed:**
- The mock adapters keep their data (events, companies, conversations, AI replies) in module-level mutable in-memory stores instead of a persistence layer.
- `resetServices` / `resetDemoState()` re-seed those stores to a deterministic initial demo scenario.

**Reason:**
- Fastest path for a frontend-only demo stage: no backend, no database, and a demo reset that simply re-seeds the in-memory stores.

**Impact:**
- State is lost on app restart and shared across components at runtime; tests must reset the stores between cases.
- Accepted as technical debt; the store layer is explicitly commented as temporary.

**Risks / mitigation:**
- Risk: mutable module-level state leaks between tests or screens. Mitigation: deterministic reset helpers and tests that run `resetServices()` between cases.
- Risk: the temporary abstraction could be mistaken for real persistence. Mitigation: migration path is a future PR replacing the module stores with real persistence while keeping the same service ports.

## DA-001: Mobile frontend stack and architecture (Aikuaa AI assistant)

**Date:** 2026-09-08

**Status:** accepted

**What changed:**
- Selected the validated mobile stack for the greenfield Aikuaa AI assistant frontend: React Native 0.87 + Expo SDK 57 + Expo Router 57 (New Architecture), Zustand (UI/session/chat state) + TanStack Query (server state), react-native-unistyles (token theming), Reanimated (motion), @shopify/flash-list (virtualization), expo-font (fonts verified on aikuaa.ai), Jest + RNTL + Maestro (testing).
- Adopted a feature-based Ports & Adapters architecture: UI -> feature hooks/stores -> service interfaces (AIService, ConversationService, EventService, CompanyService, AnalyticsService) -> mock adapters now / real adapters later. Anti-over-abstraction rule: create only interfaces that correspond to an identified future integration boundary.
- PR-01 produces the design token SPECIFICATION (platform-agnostic tokens + docs, NO UI components); PR-02 implements the theme wiring. Centralized typed design tokens (colors, typography, spacing, radius, shadows, animations) based on mandatory research of https://aikuaa.ai that VERIFIES the actual typography and palette.
- Event mode flow: Splash -> Welcome -> Event context -> Chat. Event context is preconfigured for the demo and QR/deep-link-ready; NO user-facing event selection required.
- Mock streaming via time-sliced batch accumulator (40-80 ms chunk appends + memoized markdown).
- Tenancy: typed AppContext (mode, tenantId?, eventId?, companyId?) — only the event context is functional in the MVP; COMPANY type documented but NOT functional.
- Deterministic demo reset in the mock environment clears local state and restores the initial event scenario (dev/demo action).
- No tenant-specific branding/business copy scattered through components.

**Reason:**
- Frontend-only stage: no backend/real LLM calls; every backend dependency must be behind a mock-backed interface to enable future real integration without UI rewrites.
- Primary validated priority is demo polish (premium B2B feel), hence Unistyles (token-driven, pixel-perfect theming) + Reanimated (UI-thread motion) + FlashList (smooth long lists) + batch-accumulator streaming (no per-token re-render jank). PR-08 Polish must be in the first demonstrable MVP; Conversations (PR-07 portion) is the first to defer.
- Expo Router gives first-class deep-link/QR routing for "QR -> first question < 30s" and route groups support EVENT/COMPANY modes.
- Separated state (server/UI/session/chat) avoids a single global store and eases later backend adoption.
- The architecture reference is aikuaa.ai; PR-01 must verify actual brand values, not assume them.

**Impact:**
- Module `mobile` is greenfield; entire frontend initiative lives in `mobile/`.
- Contract change risk concentrated in PR-02 (nav/theme), PR-04 (service ports) and PR-05 (chat streaming) — these are architecture-gate boundaries.
- Napkin and index updated to reflect the planned mobile module (revision 2).

**Risks / mitigation:**
- Risk: Expo Router file structure feels rigid for future COMPANY mode. Mitigation: use route groups `(event)`/`(company)` and shared layouts.
- Risk: mock streaming jank on low-end devices. Mitigation: batch token updates, memoize markdown parse, test on mid-tier Android.
- Risk: markdown library gaps for cards/tables. Mitigation: plan custom render rules for structured responses from the start.
- Risk: Maestro E2E flakiness on CI. Mitigation: stable emulator configs.
- Risk: over-engineering service abstractions. Mitigation: anti-over-abstraction rule.
- Risk: white-label deferral. Mitigation: consume tokens only via theme, centralized copy, document tenant override points.

## DA-002: RN-safe color token representation and font-stack adapter rule

**Date:** 2026-09-08

**Status:** accepted

**What changed:**
- Color tokens with alpha are stored as `{ color, opacity }` objects instead of 8-digit hex strings (e.g., `#faf9f6eb`).
- A `ColorToken` union abstraction plus a `resolveColor()` helper must be used by all color consumers to obtain the final color value.
- Typography family tokens store full CSS font stacks (e.g., `"Manrope", system-ui, sans-serif`); consumers must extract the primary family name before passing it to `expo-font` / Unistyles.
- PR-02 must provide an `expo-font` adapter that performs this extraction; no consumer reads font stacks directly.
- Confirmed by PR-01 of `aikuaa-app-frontend` (design token specification delivered as platform-agnostic typed tokens + docs, no UI components).

**Reason:**
- React Native color parsing is not consistent across platforms for 8-digit hex (RGBA) strings; storing `{ color, opacity }` avoids platform-dependent parsing and keeps the token spec RN-safe and platform-agnostic.
- Design-token specs commonly carry full CSS font stacks for web; React Native cannot consume a stack as-is, so a single adapter boundary (PR-02) centralizes the transformation and prevents scattered, inconsistent font-family handling.

**Impact:**
- All color token consumers (theme wiring, Unistyles, components) must go through `resolveColor()` / the `ColorToken` union — no direct 8-digit hex usage anywhere in `mobile/`.
- The token spec remains platform-agnostic while the RN adaptation is confined to the adapter layer delivered in PR-02.
- Adds one small helper/abstraction to the theme infrastructure; no change to the PR plan order (PR-02 still handles theme wiring + expo-font adapter).

**Risks / mitigation:**
- Risk: consumers bypass `resolveColor()` and reintroduce raw 8-digit hex. Mitigation: document the rule in the token spec, enforce via code review, keep the helper as the only public path.
- Risk: font stack parsing edge cases (quoted families, fallbacks with spaces). Mitigation: centralize extraction in the PR-02 expo-font adapter with tests covering quoted/unquoted family names.
- Risk: opacity composition confusion (token-level opacity vs component-level opacity). Mitigation: `resolveColor()` composes alpha explicitly; document precedence in the token spec.

## DA-003: React Native pinned to 0.86.3 for Expo SDK 57 compatibility

**Date:** 2026-09-08

**Status:** accepted

**What changed:**
- `mobile/package.json` pins `react-native: 0.86.3` for Expo SDK 57.
- The original spec/plan assumed React Native 0.87.0 alongside SDK 57; PR-02 implementation and test-gate reconciliation corrected this assumption.

**Reason:**
- Expo SDK 57 pairs with React Native 0.86.3, not 0.87.0.
- `react-native@0.87.0` removes `react-native/rn-get-polyfills`, which `@expo/metro-config@57` depends on.
- `react-native-reanimated@4.5.1` declares peer compatibility only with React Native `0.83 - 0.86`.
- With the pin in place, `expo-doctor` passes 21/21 checks and `expo export` succeeds.

**Impact:**
- The mobile app runs on React Native 0.86.3.
- The spec and downstream PRs (PR-03 onwards) should reference RN 0.86.3 until SDK 58.

**Risks / mitigation:**
- Risk: a future SDK upgrade changes the RN pairing again. Mitigation: reassess the RN version pairing on every SDK upgrade and validate with `expo-doctor` + `expo export` before committing.
- Risk: blindly re-upgrading to RN 0.87 under SDK 57 would break `@expo/metro-config@57` (missing `rn-get-polyfills`) and reanimated peer ranges. Mitigation: keep 0.86.3 pinned while on SDK 57.

## DA-004: Unistyles v3 no-provider theme wiring

**Date:** 2026-09-08

**Status:** accepted

**What changed:**
- The theme is configured via `StyleSheet.configure`; `ThemeProvider` is a documented pass-through shim; runtime theme changes go through `UnistylesRuntime`.

**Reason:**
- Unistyles v3 does not require a React provider, which keeps the root layout stable for future theme system migrations.

**Impact:**
- Theme-aware components use `StyleSheet.create` / `useUnistyles`; no legacy theme context remains.

**Risks / mitigation:**
- Risk: maintainers may assume `ThemeProvider` does something. Mitigation: document the shim as a pass-through.
- Risk: active theme leaks between tests. Mitigation: tests reset the active theme between tests.

## DA-005: Maestro E2E deferred to PR-09

**Date:** 2026-09-08

**Status:** accepted

**What changed:**
- `mobile/e2e/flow.yaml` remains a placeholder in PR-02; the real Maestro E2E flow is implemented in PR-09.

**Reason:**
- PR-02 delivers the test harness only; there are no real screens to exercise yet.

**Impact:**
- E2E validation appears at the PR-09 gate, not earlier.
- **Fulfilled by PR-09 (2026-09-11):** the real Maestro E2E flow (`mobile/e2e/flow.yaml`) and its documentation were delivered when the feature closed; the flow is documented but not yet wired into CI (tracked as a PR-09 follow-up).
