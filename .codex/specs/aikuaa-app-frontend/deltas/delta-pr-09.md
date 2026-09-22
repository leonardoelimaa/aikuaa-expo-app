# Delta — PR-09: Demo / integration preparation + observability contract

- **Date:** 2026-09-11
- **Tier/model:** standard / mobile-developer (Phase A), impl-reviewer (Phase B)
- **Status:** closed

## Spec changes applied

- Implemented `analytics.track` contract as a no-op/mock in-memory recorder (`AnalyticsService.track` + `trackEvent` alias; `getRecordedEvents`, `clearRecordedEvents`).
- Wired analytics calls into `useChat.sendMessage` (`message_sent`) and `DemoResetButton` (`demo_reset`).
- Created `DemoResetButton` dev/demo operator action in Settings that restores the initial event scenario via `resetDemoState()`.
- Created Spanish adapter-swap guide at `mobile/docs/adapter-swap.md` with mock → real code example.
- Added `mobile/src/services/__tests__/adapter-swap.typecheck.ts` so TypeScript verifies the documentation example compiles.
- Updated Maestro E2E flow at `mobile/e2e/flow.yaml` to cover the offline demo path: welcome → chat → suggestion → mock response → settings → demo reset.
- Validated demo build with `npx expo export`.

## Divergences found

- The mock analytics service uses module-level mutable state (`recordedEvents`) for demo/test diagnostics; acceptable because `resetServices()` clears it and no real backend or secrets are involved.
- Maestro E2E is documented but not executed in CI in this PR; the YAML syntax and asserted texts were verified against the codebase.
- Conversations Phase 2 (PR-07 deferred tasks) remains out of scope; the E2E flow ends with demo reset instead of a conversation history action.

## New decisions / thresholds

- Analytics instrumentation uses `getServices().analytics.track(...)` via the service registry; swapping to a real adapter requires only changing the factory in `serviceRegistry.ts`, as documented.
- Demo reset is exposed as a dev/demo operator action in the Settings screen, not as end-user UI.

## Remaining gaps / technical debt

- Encapsulate recorder state inside the factory if the mock adapter is ever used by non-test/non-demo code.
- Run the Maestro flow against a development build and add it to CI once a stable build target exists.
- Gate `DemoResetButton` behind a demo/dev feature flag if Settings is ever shipped to non-operator users.
- PR-07 Phase 2 conversations remain deferred for a future initiative.

## Handoff / Feature status

PR-09 is the final PR. The first demonstrable MVP of the Aikuaa AI Mobile Frontend is complete:
- PR-01 brand/design tokens ✓
- PR-02 Expo setup ✓
- PR-03 app shell ✓
- PR-04 service architecture + demo reset ✓
- PR-05 chat core ✓
- PR-06 rich responses ✓
- PR-07 states (core) ✓ — conversations Phase 2 deferred
- PR-08 polish ✓
- PR-09 demo/integration prep ✓