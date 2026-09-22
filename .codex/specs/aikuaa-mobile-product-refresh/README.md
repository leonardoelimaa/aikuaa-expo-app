---
slug: aikuaa-mobile-product-refresh
module: mobile
status: in_progress
date: 2026-09-20
related: []
---

# Aikuaa Mobile Product Refresh

## Problem

The mobile app currently presents a generic event-first demo rather than Aikuaa's enterprise knowledge-assistant proposition. It lacks native brand assets and coherent semantic tokens; navigation exposes placeholders and an index route; and the assistant surface does not make workspace context, agents, or answer evidence legible. Generic fixtures and scattered Spanish copy further weaken the Portuguese-first enterprise demonstration.

## Goals

- Align the mobile experience with Aikuaa's enterprise assistant proposition and verified brand.
- Deliver a coherent Portuguese-primary, deterministic demonstration without implying production capabilities.
- Preserve the frontend-only Ports & Adapters architecture, existing stack, and state ownership.
- Make workspace selection and isolation, answer-bound evidence, and conversation continuity explicit and testable.
- Verify accessibility, native behavior, responsiveness, and performance to the extent available; report unavailable native checks as unverified.

## Non-goals

- Real authentication/Google OAuth, backend services, database execution, ingestion, or real permissions enforcement.
- Production tenant authorization, offline sync, push notifications, analytics, or usage billing.
- Mandatory dark mode, general-purpose runtime white-label plumbing, or full PT/ES/EN localization.
- Store submission, signing, or publishing.

## Product principles

- Present a product realignment, not a reskin; retire event-first target behavior unless compatibility is explicitly justified.
- Be honest: visible actions work on deterministic fixtures, explain their simulation, or are unavailable. Never imply real upload or SQL execution.
- Keep one explicit active workspace and stable conversation identity. Drafts, caches, persisted selection, and late responses must not cross workspace boundaries.
- Use TanStack Query for service-backed data and Zustand/local state for draft, selection, and presentation state; do not introduce a second state architecture.
- Bind citations, query text, tools, and results to the answer/message that produced them.
- Use cream paper, warm white cards, deep navy proof surfaces, editorial spacing, mono metadata, and restrained motion. Light-only is deliberate.

## Current and target

| Current | Target |
| --- | --- |
| Text-only splash/onboarding; app config lacks native brand assets and scheme | Official high-resolution owl/wordmark in applicable app, splash, and favicon assets; native branding configured |
| Contradictory palette, generic UI, and scattered Spanish copy | Verified semantic palette, reusable accessible primitives, centralized Portuguese-primary copy |
| Default tabs expose index and placeholders; event view exposes internal IDs | Assistant, Conversations, Workspace primary destinations; Settings via stack/profile; no dead tabs or route leaks |
| Plain chat empty state and flat, unconvincing evidence | Workspace/agent context, useful starters and composer, answer-bound proof and polished result surfaces |
| Generic fixtures and functional event mode; company mode typed but non-operational | Deterministic enterprise demo context and explicit workspace isolation; event-first behavior retired unless compatibility is justified |

## Requirements

1. Apply official owl/wordmark assets sourced from high-resolution official artwork; do not upscale the observed 80×80 header image for native icons. Configure applicable icon, adaptive icon, splash, favicon, and scheme metadata.
2. Correct tokens to cream `#faf9f6`, `#f5f3ed`, `#ebe8df`; navy `#0a1628`, `#0f1f38`, `#162b4a`, `#1e3a61`, `#2a4d7a`, `#4a6b96`, `#7a96b8`, `#a8bdd4`; typography Manrope, DM Sans, DM Mono. Provide semantic surfaces and reusable controls with accessible interaction states.
3. Centralize copy and make Portuguese the primary demo locale. Do not claim full localization.
4. Provide deterministic enterprise fixtures, explicit workspace context, and stable identities. Audit/reuse existing ports where semantically adequate; do not overload event IDs as workspace IDs.
5. Provide a branded and honest demo entry (no real Google OAuth), intentional routes/navigation, usable workspace details/selector and practical stack-accessible settings. Handle cold/restored/back behavior.
6. Provide a production-quality assistant flow with workspace and agent context, useful prompt starters, robust composer, keyboard/scroll handling, async/pending/error/retry states, and only supported mock attachment behavior.
7. Present message-bound citations and source excerpts, read-only query text, deterministic result tables/cards, and accessible tool/status disclosure. Make simulated behavior explicit.
8. Support workspace-scoped conversation list, reopen/continue, and explicitly specified restart persistence behavior.
9. Verify narrow/large phone and tablet layouts, safe areas, keyboard, large text, reduced motion, contrast, touch targets, Android back, VoiceOver/TalkBack, adaptive-icon cropping, and performance where infrastructure permits. Do not claim unavailable checks passed.

## Decisions

- Preserve Expo SDK 57, React Native 0.86.3, Expo Router typed routes, TypeScript, Unistyles v3, Reanimated, FlashList, Zustand, TanStack Query, Jest, React Native Testing Library, and Maestro.
- Preserve frontend-only mock-backed Ports & Adapters: AIService, ConversationService, EventService, CompanyService, AnalyticsService. Company/workspace AppContext is operational; event behavior is retired, with unreachable compatibility adapters only. The scoped mutation signal contract provides frontend-only isolation, not authorization.
- Separate brand foundation (PR-01) from enterprise context/service-contract evolution (PR-02).
- Keep one explicit active workspace; use stable conversation identity and isolate late responses, drafts, caches, and persisted selection when context changes.
- Main navigation is Assistant, Conversations, Workspace; Settings remains stack-accessible.
- Architecture approval: approved with conditions. PR-02 requires pre-implementation and closure gates for enterprise context/contracts and isolation. PR-03 gate only if route/context integration or persisted entry-state changes shared boundaries. PR-04 gate if request/agent/attachment/cancellation/conversation contracts change. PR-05 gate if source/query/result contracts change. PR-06 gate for persistence/service-contract changes. Visual multi-folder changes alone do not trigger a gate.

## Module impacts

- Mobile app configuration/assets, theme/tokens, shared UI primitives, routes/navigation, workspace/company context and fixtures, assistant/conversation/evidence views, and mobile tests/E2E.
- Service boundaries remain frontend-only mocks; any contract evolution is isolated to the relevant PR and receives its specified architecture gate.

## Risks

- Workspace isolation and stable identity can be undermined by shared caches or late responses; public-interface tests must exercise switching and stale results.
- Mock interactions may be mistaken for production capabilities; every action must work deterministically, clearly disclose simulation, or be unavailable.
- Native launch/device/accessibility checks may be blocked by infrastructure; report each as unverified rather than passed.
- Existing event semantics may be coupled to current routes/state; PR-02 must explicitly retire event-first behavior unless compatibility is justified and approved.
- Native icon cropping and large-text/narrow-screen layout can obscure brand or evidence; validate on supported targets.

## PR roadmap

| PR | Slice | Risk | Dependency |
| --- | --- | --- | --- |
| [PR-01](pr-01-brand-foundation.md) | Official brand and interface foundation | R1 | None |
| [PR-02](pr-02-enterprise-context.md) | Enterprise demo context and data boundaries | R2 | PR-01 |
| [PR-03](pr-03-product-shell.md) | Enterprise entry and navigable product shell | R2 | PR-02 |
| [PR-04](pr-04-assistant-workflow.md) | Assistant conversation workflow | R2 | PR-03 |
| [PR-05](pr-05-evidence-results.md) | Answer evidence and enterprise results | R2 | PR-04 |
| [PR-06](pr-06-conversation-continuity.md) | Conversation continuity | R2 | PR-05 |
| [PR-07](pr-07-native-hardening.md) | Native quality and release evidence | R1 | PR-06 |

## Verification summary

Every task and PR defines executable checks and observable behavior in [tasks.md](tasks.md) and the canonical PR documents. Available commands:

- `cd mobile && npm run lint`
- `cd mobile && npm run typecheck`
- `cd mobile && npm test -- --runInBand`
- `cd mobile && npx expo export`
- `maestro test mobile/e2e/flow.yaml` when a Maestro/native target is available; otherwise record unverified.

Public-interface coverage must include workspace switching and late-response isolation, stable conversation identity, retry, answer/evidence binding, and declared persistence. The end-to-end journey is enter demo → identify/select workspace → ask → inspect source/query evidence → reopen conversation → switch workspace. Include phone/tablet, keyboard, safe-area, Android back, VoiceOver, TalkBack, large text, contrast, touch target, reduced-motion, performance, and adaptive-icon checks as infrastructure permits. Light-only; do not claim dark support.

## Lifecycle and closure

Each PR follows `0 → A → test → B → [C → test → D]* → E`, with at most three review rounds total (B plus at most two D revalidations). Review is independent of implementation. Apply semantic architecture gates as specified per PR. No later PR begins until the prior PR reaches E with current Verification, independent review, required architecture approval, delta-sync, and memory update. Phase E appends `deltas/delta-pr-NN.md`, refreshes this living spec without erasing history, updates project memory when required, and appends chronology. PR-01, PR-02, and PR-03 reached E and are closed; PR-04 is the next runnable PR.

## History

- 2026-09-19 — Plan created after Napkin-first discovery, repository/UI sweep, current-site visual/product research, and conditional strong architecture approval. No implementation started.
- 2026-09-19 — Planning review (`aikuaa-mobile-product-refresh/planning/review/attempt-1`) approved with follow-ups; combined reviewed Markdown spec hash: `3dfdeee868ff8a634110e13bec534d14e2eea0800aec6e86522c3328445b5d09`. Architecture review is required per the documented gates. Before PR-06 Phase A, choose and append restart-persistence behavior to this spec, PR-06, and T06.1 acceptance/public-interface Verification; run the architecture gate if persistence/service contracts change. Runtime state/event logs were initialized by the root at `2026-09-19T20:00:17-03:00` with initiative `PLANNED` and `nextRunnablePr: PR-01`. No implementation started.
- 2026-09-20 — PR-01 closed after passing lint, typecheck, 42 suites / 176 tests, and Expo web/iOS/Android exports. Official high-resolution mark, native assets, verified cream/navy semantic tokens, and accessible reusable Button/TextField are in place; service/context/navigation contracts did not change. Review D approved with follow-ups, zero blockers, and no architecture signal. Remaining native previews and assistive/device checks are recorded as unverified in [PR-01](pr-01-brand-foundation.md#final-verification). See [delta-pr-01](deltas/delta-pr-01.md). PR-02 is next runnable and retains its required architecture gate.
- 2026-09-20 — PR-02 closed after operational company/workspace context, scoped service/query behavior, and stale-work isolation were delivered. Final verification passed 48 suites / 207 tests, lint, typecheck, and Expo web/iOS/Android exports. Review D and architecture closure approved with no findings/conditions. See [PR-02 final verification](pr-02-enterprise-context.md#final-verification) and [delta-pr-02](deltas/delta-pr-02.md). Final diff hash: `81f5042edb0e92f5a65d422731520c0ff43b4474f0e4364659e7a225dde27bbb`. PR-03 is next.
- **PR-03 closed (2026-09-20):** Delivered the guarded mobile product shell with a three-state lifecycle, honest demo entry, nested three-tab navigation, stack Settings/workspace detail, validated catalog IDs, truthful Conversations CTA, and one-way compatibility redirects. Phase 0: 4/4 suites, 20/20 tests; final verification: Jest 52/52 suites, 226/226 tests; typecheck, lint, Expo export (web/iOS/Android), and diff check passed. B and architecture reviews approved. See [PR-03 delta](deltas/delta-pr-03.md). Diff hash: `635c05b299f689cca3b08b68a4c678190aa3969d95de55126151f47239db6bf4`.
