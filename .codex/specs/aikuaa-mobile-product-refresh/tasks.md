# Task plan

Each task is independently verifiable at the public UI/interface. Run the listed command(s) from the repository root unless a command includes its own directory. Native/device checks are recorded unverified if the target infrastructure is unavailable.

## PR-01 — Official brand and interface foundation

### T01.1 — Native brand assets and semantic interface foundation
- Scope: official source artwork, applicable app config/launch assets, verified palette/type tokens, reusable controls and accessible states; no service/context contract changes.
- Dependency: none.
- Verification: `cd mobile && npm run lint`; `cd mobile && npm run typecheck`; `cd mobile && npm test -- --runInBand`; `cd mobile && npx expo export`.
- Observable result: exported app uses configured Aikuaa branding and semantic light surfaces; reusable controls expose visible/focus/disabled states without changing service behavior. Inspect adaptive-icon crop on native target when available.
- Status: **Closed 2026-09-20**. Verification passed: lint, typecheck, 42 suites / 176 tests, and Expo export for web/iOS/Android. Evidence: [PR-01 final Verification and review](pr-01-brand-foundation.md#final-verification), [delta](deltas/delta-pr-01.md). Native splash release preview, representative adaptive-mask preview, VoiceOver/TalkBack, and native-device focus rendering remain unverified and non-blocking.
- skill_requirements: phase baseline=behavior-first mobile implementation; primary domain=brand/theme/shared controls and native assets; concerns=accessibility, asset provenance, icon cropping. Test baseline=mobile unit/UI and export validation; concerns=semantic states and native asset metadata. Review baseline=isolated code review; concerns=brand consistency, accessibility and visual responsiveness. Closure baseline=spec delta-sync and memory update if warranted; concerns=append-only evidence.

## PR-02 — Enterprise demo context and data boundaries

### T02.1 — Explicit workspace semantics and deterministic enterprise data
- Scope: workspace/company demo context, stable IDs, fixtures, ports/adapters reuse/evolution, and workspace isolation; explicitly decide retirement of event-first behavior unless compatibility is justified.
- Dependency: PR-01 E.
- Verification: `cd mobile && npm run lint`; `cd mobile && npm run typecheck`; `cd mobile && npm test -- --runInBand`.
- Observable result: selecting a workspace changes explicit context and deterministic enterprise fixtures; event IDs are not used as workspace IDs; late responses and local state from another workspace are not exposed. Tests exercise behavior through public interfaces.
- Status: Closed 2026-09-20. Delivered operational company/workspace context, scoped services and query behavior, and stale-work isolation. Final verification: 48 suites / 207 tests, lint, typecheck, and Expo web/iOS/Android exports passed; see [PR-02 final verification](pr-02-enterprise-context.md#final-verification) and [delta-pr-02](deltas/delta-pr-02.md).
- skill_requirements: phase baseline=behavior-first mobile implementation; primary domain=workspace context and demo data boundaries; concerns=stable identity, cache/draft isolation, event retirement. Test baseline=mobile unit/UI and public-interface validation; concerns=workspace switch and late response. Review baseline=isolated code review; concerns=contracts, state ownership, isolation. Closure baseline=spec delta-sync and memory update; concerns=required architecture pre/closure gates and appended evidence.

## PR-03 — Enterprise entry and navigable product shell

### T03.1 — Honest entry and intentional navigation
- Scope: demo entry, Assistant/Conversations/Workspace destinations, stack/profile Settings, routes, workspace selector/details, practical settings, cold/restored/back behavior.
- Dependency: PR-02 E.
- Verification: `cd mobile && npm run lint`; `cd mobile && npm run typecheck`; `cd mobile && npm test -- --runInBand`; `cd mobile && npx expo export`.
- Observable result: entering the demo identifies its simulated state; all primary destinations work, settings is reachable, no index-route leak/dead placeholder tab remains, and selection/restoration/back behavior is deterministic.
- Status: Closed 2026-09-20. Delivered the guarded mobile product shell, honest demo entry, lifecycle restore guards, nested three-tab navigation, stack Settings/workspace detail, validated catalog IDs, truthful Conversations CTA, and one-way compatibility redirects. Verification: Phase 0 4/4 suites, 20/20 tests; final Jest 52/52 suites, 226/226 tests; typecheck PASS; lint PASS (0 errors, 18 warnings); Expo export PASS for web/iOS/Android; diff check PASS. Reviews: B Approved, no findings; architecture Approved, no conditions. See [PR-03 delta](deltas/delta-pr-03.md). Diff hash: `635c05b299f689cca3b08b68a4c678190aa3969d95de55126151f47239db6bf4`.
- skill_requirements: phase baseline=behavior-first mobile implementation; primary domain=mobile routes and product shell; concerns=honest demo, typed routes, restoration/back behavior. Test baseline=mobile UI and export checks; concerns=destination reachability and cold/restored state. Review baseline=isolated code review; concerns=route/context boundaries, safe areas and navigation accessibility. Closure baseline=spec delta-sync and memory update if warranted; concerns=conditional architecture gate and appended evidence.

## PR-04 — Assistant conversation workflow

### T04.1 — Contextual assistant and robust composer
- Scope: agent/workspace context, Portuguese prompt starters, composer, keyboard/scroll behavior, pending/error/retry, supported simulated attachment behavior.
- Dependency: PR-03 E.
- Verification: `cd mobile && npm run lint`; `cd mobile && npm run typecheck`; `cd mobile && npm test -- --runInBand`; `maestro test mobile/e2e/flow.yaml` when available, otherwise record unverified.
- Observable result: user can select a useful starter or enter a prompt, see its workspace/agent context, observe deterministic pending/error/retry behavior, and use the composer with keyboard without losing context. Unsupported attachment actions are unavailable or clearly simulated.
- skill_requirements: phase baseline=behavior-first mobile implementation; primary domain=assistant workflow; concerns=async lifecycle, composer, keyboard and mock capability honesty. Test baseline=mobile public-interface/UI and proportional E2E; concerns=retry, workspace isolation and keyboard. Review baseline=isolated code review; concerns=request/agent/attachment/cancellation/conversation contracts, accessibility. Closure baseline=spec delta-sync and memory update if warranted; concerns=conditional contract gate and appended evidence.

## PR-05 — Answer evidence and enterprise results

### T05.1 — Message-bound proof and result presentation
- Scope: citations/source excerpts, read-only query display, deterministic tables/cards, tool/status disclosure, accessible and narrow-screen layouts.
- Dependency: PR-04 E.
- Verification: `cd mobile && npm run lint`; `cd mobile && npm run typecheck`; `cd mobile && npm test -- --runInBand`; `maestro test mobile/e2e/flow.yaml` when available, otherwise record unverified.
- Observable result: citations, query, tools and results belong to the originating answer; evidence details can be inspected; queries and results visibly remain mock/read-only; narrow layouts do not conceal proof or status.
- skill_requirements: phase baseline=behavior-first mobile implementation; primary domain=assistant evidence/result surfaces; concerns=message binding and mock disclosure. Test baseline=mobile UI/public-interface and proportional E2E; concerns=evidence binding, accessibility and narrow widths. Review baseline=isolated code review; concerns=source/query/result contracts, evidence hierarchy and accessibility. Closure baseline=spec delta-sync and memory update if warranted; concerns=conditional contract gate and appended evidence.

## PR-06 — Conversation continuity

### T06.1 — Workspace-scoped conversation list and reopen behavior
- Scope: conversation list loading/empty/error, workspace scoping, reopen/continue, stable identity, and explicit restart persistence expectation.
- Dependency: PR-05 E.
- Verification: `cd mobile && npm run lint`; `cd mobile && npm run typecheck`; `cd mobile && npm test -- --runInBand`; `maestro test mobile/e2e/flow.yaml` when available, otherwise record unverified.
- Observable result: conversation list reflects only selected workspace; loading/empty/error states are meaningful; a conversation can be reopened/continued with stable identity; restart behavior matches the explicitly documented persistence contract.
- skill_requirements: phase baseline=behavior-first mobile implementation; primary domain=conversation continuity; concerns=workspace scope, identity, restart. Test baseline=public-interface/mobile UI and proportional E2E; concerns=reopen, switching and declared persistence. Review baseline=isolated code review; concerns=persistence/service contracts, cache isolation and navigation. Closure baseline=spec delta-sync and memory update; concerns=conditional architecture gate and appended evidence.

## PR-07 — Native quality and release evidence

### T07.1 — Device/accessibility/performance hardening
- Scope: resolve cross-device and accessibility issues; launch metadata/assets; document supported platforms and reproducible validation evidence without signing/publishing.
- Dependency: PR-06 E.
- Verification: `cd mobile && npm run lint`; `cd mobile && npm run typecheck`; `cd mobile && npm test -- --runInBand`; `cd mobile && npx expo export`; `maestro test mobile/e2e/flow.yaml` when available, otherwise record unverified.
- Observable result: supported phone/tablet layouts, safe-area/keyboard/back, large text, reduced motion, contrast, touch targets and accessible announcements are checked; launch assets are validated where native targets exist; every unavailable check is marked unverified, never passed.
- skill_requirements: phase baseline=behavior-first mobile implementation; primary domain=native quality and launch metadata; concerns=accessibility, responsive layouts, launch assets, performance. Test baseline=mobile, export, device/accessibility and proportional E2E; concerns=platform availability and truthful unverified status. Review baseline=isolated code review; concerns=regression, accessibility, supported platform claims. Closure baseline=spec delta-sync and memory update; concerns=complete evidence, append-only history and no publishing.
