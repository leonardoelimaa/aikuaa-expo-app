# Current Project State

## What is working

- Feature `aikuaa-mobile-product-refresh`: PR-01, PR-02, and PR-03 closed on 2026-09-20; PR-04 is next. PR-03 delivered the guarded mobile shell, honest demo entry, lifecycle restore guards, nested three-tab navigation, stack Settings/workspace detail, validated catalog IDs, truthful Conversations CTA, and one-way compatibility redirects. Final verification passed Jest 52/52 suites / 226/226 tests, typecheck, lint (0 errors; 18 warnings), and Expo web/iOS/Android exports; B and architecture reviews approved. Native/device Maestro, VoiceOver, and TalkBack checks remain unverified. See `.codex/specs/aikuaa-mobile-product-refresh/deltas/delta-pr-03.md`; diff hash `635c05b299f689cca3b08b68a4c678190aa3969d95de55126151f47239db6bf4`.

- Planning of the `aikuaa-app-frontend` feature is complete (revision 2, incorporating review round 2 feedback): approved spec (`.codex/specs/aikuaa-app-frontend/README.md`), 9 dependency-ordered PRs planned, `cronologia-resolucao.md` and `cronologia-implementacao.md` skeletons written.
- PR-01 of `aikuaa-app-frontend` is closed: Aikuaa brand research verified against https://aikuaa.ai and the platform-agnostic typed design-token specification (colors, typography, spacing, radius, shadows, animations) was delivered with docs and no UI components. Two decisions emerged from it (see DA-002).
- PR-03 of `aikuaa-app-frontend` is closed: the app shell (splash, welcome, event context, tab navigation, safe-area/keyboard handling) is complete.
- PR-04 of `aikuaa-app-frontend` is closed: typed service ports, mock adapters backed by in-memory stores, service registry and deterministic demo reset are in place (see DA-006, DA-007).
- PR-05 through PR-09 of `aikuaa-app-frontend` are closed: chat core, rich chat responses, chat states and retry, premium polish, and demo/integration/observability are delivered — the first demonstrable MVP of the Aikuaa AI mobile assistant is complete.

## Closed

- Feature `aikuaa-app-frontend`, PR-01 (Aikuaa brand research + design token specification) — closed. Created `.codex/specs/aikuaa-app-frontend/` artifacts, design token spec and docs; verified actual fonts/palette from https://aikuaa.ai. Follow-up decisions recorded in DA-002.
- Feature `aikuaa-app-frontend`, PR-02 (Expo setup + navigation + theme wiring + test harness) — closed. Delivered the `expo-font` adapter (extract primary family from font stacks) and `resolveColor()` / `ColorToken` handling per DA-002. Resolved decisions recorded: DA-003 (react-native pinned to 0.86.3 for Expo SDK 57), DA-004 (Unistyles v3 no-provider theme wiring via `StyleSheet.configure`; `ThemeProvider` is a pass-through shim), DA-005 (Maestro E2E deferred to PR-09; `mobile/e2e/flow.yaml` placeholder shipped in PR-02).
- Feature `aikuaa-app-frontend`, PR-03 (App shell: splash, welcome, event context, tab navigation, safe-area/keyboard) — closed. Delivered the full app shell with safe-area and keyboard handling. Non-blocking review follow-ups (tab accessibility labels, resolved-state back-navigation, typed routes) tracked for PR-08 or later.
- Feature `aikuaa-app-frontend`, PR-04 (Service architecture + mock adapters + demo reset) — closed. Delivered the typed service ports (`AIService`, `ConversationService`, `EventService`, `CompanyService`, `AnalyticsService`) with chunked streaming replies, mock adapters backed by module-level in-memory stores, a lightweight service registry (`createMockServices` / `getServices` / `resetServices`), the `AppContext` union (event functional, company non-operational) and deterministic `resetDemoState()`. Decisions recorded: DA-006 (service port contracts) and DA-007 (module-level stores as temporary demo infrastructure).

## In progress / Pending

### Mobile
**In progress / Pending — Mobile:**
- Feature `aikuaa-mobile-product-refresh`: PR-04 (assistant workflow) is next runnable after PR-03 reached Phase E.
- PR-09 closed: demo/integration prep + observability contract complete.
- Feature `aikuaa-app-frontend` first demonstrable MVP complete.
- Phase 2 deferred: PR-07 conversations/history/persistence (7.5–7.7) — first feature to cut if roadmap requires.

### Backend
- Not present in this repo. Must remain untouched.

### Web
- Not present in this repo.

### Face service
- Not present in this repo.

## Active technical debt

- Temporary module-level mutable stores in the mock adapters (in-memory state lost on restart) — accepted per DA-007; a future PR will replace them with persistence or real backend adapters.
- Duplicate demo constants across mocks (AI response templates, event/company fixtures) awaiting centralization in a shared fixtures module.
- `AIService.searchCompanies` overlaps with the event/company mock data and is not exercised by the demo UI; kept for contract completeness, to be removed or repurposed when real backend contracts land.
- PR-08 follow-ups: reduced-motion gating for Reanimated animations; verify FlashList `estimatedItemSize` on the next Expo/RN upgrade; establish a stable identity for streaming messages (keys/tests); promote `markdownParser.ts` to a shared module if non-chat usage appears.
- PR-09 follow-ups: encapsulate the analytics recorder state if used outside tests; add the Maestro E2E flow to CI; feature-flag the demo reset if Settings ships to end users.
- PR-06 follow-ups closed in PR-08: distinct accessibility labels for sources vs tool transparency and pressable source URLs were both resolved in PR-08.

## Current risks

- Demo polish is top priority; performance (streaming jank, long lists) and a11y were key risks — addressed and delivered in PR-08.
- Over-engineering of service abstractions -> anti-over-abstraction rule (only interfaces mapping to identified future backend boundaries).
- PR-03 review follow-ups (tab accessibility labels, resolved-state back-navigation, typed routes) are non-blocking and tracked for PR-08 or later.
- Service contract risk: the PR-04 ports gated downstream PRs 05–09; a contract change would have rippled through the whole feature. Retired — all downstream PRs (05–09) closed without port-signature changes, per the DA-006 architecture gate.
- PR-07 Phase 2 (conversations/history/persistence) is deferred; if the roadmap requires cuts, it is the first feature to drop.
- Maestro E2E is documented but not yet wired into CI; regression coverage for the demo flow depends on manual runs until the PR-09 follow-up lands.
- FlashList `estimatedItemSize` and reduced-motion gating are tuned for the current RN/Expo versions; re-verify on any SDK/RN upgrade (PR-08 follow-up).

## Pending decisions

- None — DA-001 through DA-007 validated.
