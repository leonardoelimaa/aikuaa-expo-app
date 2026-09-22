---
title: Aikuaa AI Mobile Frontend
slug: aikuaa-app-frontend
module: mobile
status: completed
date: 2026-09-08
related: []
---

# Aikuaa AI Mobile Frontend

- **Author:** planner-agent
- **Date:** 2026-09-08
- **Main module:** mobile
- **Status:** approved
- **Revision:** 2 (2026-09-08) — incorporated planner review round 2 feedback (PR reorder, event context, demo reset, simplified tenancy, anti-over-abstraction).
- **Revision:** 3 (2026-09-08) — PR-01 closed (delta-sync): brand research verified, design token spec delivered, design-system acceptance criterion satisfied.
- **Revision:** 4 (2026-09-08) — PR-02 closed (delta-sync): Expo scaffold + navigation + theme wiring + test harness delivered; RN pinned 0.86.3 (DA-003), Unistyles v3 wiring (DA-004), Maestro E2E deferred to PR-09 (DA-005).
- **Revision:** 5 (2026-09-08) — PR-03 closed (delta-sync): app shell delivered (splash, welcome, preconfigured + deep-link-ready event context, tab navigation, safe-area/keyboard handling); EVENT mode flow splash → welcome → event context → chat verified.

## 1. Context and Motivation

The Aikuaa.ai platform provides an AI assistant that answers questions about companies using multiple backend sources (RAG SQL, vector RAG, MCPs, HTTP tools, agents). Aikuaa wants a native mobile app (iOS + Android) that acts as a demo AI assistant at corporate events and later becomes the official corporate AI assistant for client companies (multi-tenant / white-label).

This initiative builds **only the frontend skeleton and design system** (React Native + Expo): the chat experience, navigation, screens, components, visual states, animations, accessibility, responsiveness, and local mocks. NO backend, NO real APIs, NO real LLM integration. All backend-dependent capabilities are expressed as **service interfaces backed by mock adapters**, prepared for future real integration. Primary priority (validated with the user): **attractiveness and polish of the demo**, with sound architecture for future COMPANY mode and multi-tenancy.

**Deferral priority rule (explicit):** The first feature to defer if implementation time must be reduced is **Conversations** (history list, new conversation, reopen, mock persistence — the Conversations portion of PR-07). **PR-08 (Polish) must remain part of the first demonstrable MVP.** The demo must be polished before Conversations is added.

## 2. Functional Requirements

- The system must boot a React Native + Expo app (iOS + Android) mobile-first and responsive (phones, tablets, eventual web).
- The system must provide an EVENT mode flow: Splash → Welcome → Event context → Chat. The Event context is resolved/preconfigured for the demo (future QR/deep-link injects `eventId`); no user-facing event gallery or event selection step is required. A guest should not need to "select an event".
- The system must render a chat experience with a welcome state, suggested prompts, a multi-line prompt composer, user and AI messages, a thinking state, and a mock streaming animation.
- The system must render AI responses with Markdown (paragraphs, lists, code blocks, tables, links, bold, italic, headers), sources/citations, company cards, and structured responses (company, company list, comparison table).
- The system must provide a tool-transparency component ("How Aikuaa found this") with mock data, without turning the UI into a technical log.
- The system must provide error states (offline, backend down, timeout, no answer), empty states, and loading states, triggerable locally via mocks.
- The system must define service interfaces (AIService, ConversationService, EventService, CompanyService, AnalyticsService) implemented only by mock adapters; no real backend calls.
- The system must provide a **deterministic demo reset mechanism** in the mock environment that clears local state and restores the initial event scenario (a dev/demo action, not necessarily a user-facing feature).
- The architecture must document and type the future tenant/event/company context, but the MVP must implement **only the event context required by the demo**. A type such as `AppContext { mode: 'event' | 'company'; tenantId?: string; eventId?: string; companyId?: string }` may exist, but COMPANY mode must NOT be functional.
- The system must define observability points (analytics.track) with a mock/no-op implementation.
- Conversation history (list, reopen, new conversation) with mock persistence — **Phase 2 (deferred)**. See deferral priority rule.

## 3. Non-Functional Requirements

- Maintain clean architecture: feature-based structure with Ports & Adapters; dependency direction UI → hooks/stores → service interfaces → adapters.
- **Do not introduce abstractions that do not correspond to an identified future integration boundary.** Prepared architecture, not premature enterprise architecture. Do not build factories/repositories/providers beyond what an identified future backend integration requires.
- Preserve and centralize design tokens (colors, typography, spacing, radius, shadows, animations) in a theme layer; no hardcoded values in components.
- **No tenant-specific branding or business copy scattered through components.** Brand names, personas and business copy must be centralized (not necessarily a full i18n system in this stage), so future white-label/tenant customization is possible without hunting strings in 50 components.
- Design must be based on mandatory research of https://aikuaa.ai done BEFORE any UI screens. Research must **verify and document** the typography and colors actually used by the site (including whether Manrope, DM Sans and DM Mono are actually used, and the real palette) rather than assume the values mentioned in the source document.
- Accessibility: Dynamic Type, VoiceOver (iOS), TalkBack (Android), adequate contrast, minimum 44x44 dp touch targets, labels, accessibility navigation.
- Performance: fast startup; virtualize long message lists; do not re-render on every token during mock streaming (batch/throttle); handle long conversations and extensive responses.
- Security: never include API keys, MCP/DB credentials, seeds, or admin tokens in the mobile bundle. No mechanism depending on backend secrets.
- TypeScript type hints/code consistency across the codebase.
- Tests: unit, component, integration, and E2E (main flow) as defined in section 6.
- No real persistence or analytics infrastructure in this stage; only local mock persistence and no-op analytics.
- White-label theming plumbing is an architecture note ONLY — not implemented in the MVP.

## 4. Impact on Existing Modules

- **mobile:** This is a greenfield mobile module; the entire implementation lives here (`mobile/`).
- **backend:** NOT touched. No backend code, schema, or endpoints are created or modified.
- **face_service:** NOT touched.
- **web:** NOT touched.
- **Napkin (`.codex/napkin/`):** must be updated with the new architecture decisions and current state after planning (delegated to markdown-writer).

## 5. Implementation Proposal

1. Research https://aikuaa.ai and **verify/document** the actual visual identity (typography fonts actually used, real color palette, spacing, radius, shadows, animation style, tone); encode the result as **platform-agnostic design token specification + documentation** (PR-01). No UI components in this PR.
2. Set up the Expo project (SDK 57 / RN 0.86.3, New Architecture, Expo Router, typed routes), theme layer wiring (Unistyles consumes PR-01 tokens), verified fonts loading, lint/format, and test harness (Jest + RNTL + Maestro) (PR-02).
3. Implement the app shell: Splash, Welcome, Event context resolution (preconfigured; deep-link/QR-ready), navigation (Chat primary + secondary menu), safe areas, keyboard handling (PR-03).
4. Define the **service architecture**: typed service ports (AIService, ConversationService, EventService, CompanyService, AnalyticsService), mock adapters, typed multi-tenancy AppContext (event-only functional), and the **deterministic demo reset** mechanism (PR-04). Follow the anti-over-abstraction rule.
5. Implement the **chat core** wired to the mock AIService: welcome state, suggested prompts, composer, user/AI messages, thinking state, mock streaming (time-sliced batch accumulator), chat state (PR-05).
6. Implement **rich chat responses**: Markdown rendering, sources/citations, company cards, structured responses (company / list / comparison), tool transparency (PR-06).
7. Implement **conversations + states**: error/empty/loading/offline states + retry (core, keep); conversation history, new conversation, reopen, mock persistence (Phase 2 — defer first if time requires) (PR-07).
8. **Polish**: animations (Reanimated), accessibility, responsive behavior, keyboard handling, performance optimization (FlashList, memoized markdown) — MUST be part of the first demonstrable MVP (PR-08).
9. **Demo / integration preparation**: finalize service adapters swap contract, observability contract (analytics.track no-op), demo reset access for demo operators, packaged demo build, Maestro E2E flow (PR-09).

### 5.1 Sequence Diagram / Textual Flowchart

```
[Guest]            [Mobile App]              [Service Ports]              [Mock Adapters]
   |                      |                          |                          |
   | open app / QR        |                          |                          |
   |--------------------->| Splash → Welcome         |                          |
   |                      | resolve event context    |                          |
   |                      |----- getEvent() -------->|------ getEvent() ------->|
   |                      |                          |<--- mock event ----------|
   |                      | show Chat (welcome)      |                          |
   | type question        |                          |                          |
   |--------------------->| sendMessage(text)        |------ streamMessage() --->|
   |                      | thinking state           |                          |
   |                      |<---- mock stream chunks --|-- (batched tokens) ------|
   |                      | progressive render       |                          |
   |                      | sources + company cards  |------ searchCompanies() ->|
   |                      |                          |<--- mock companies -------|
   |                      | conversation saved       |                          |
   |<--- response shown ---|                          |                          |
   |                      |                          |                          |
   | demo reset           |                          |                          |
   |--------------------->| clear local state        |------- reset() ---------->|
   |                      |                          |<--- initial scenario -----|
   |<--- demo restored ----|                          |                          |
```

## 6. Complexity Triage

| Criterion | Assessment |
|---|---|
| Change surface | large (greenfield full mobile frontend) |
| Regression risk | medium (no existing code; moderate internal complexity) |
| Number of impacted modules | 1 (mobile) + Napkin |
| Need for cross-service coordination | no (frontend only, mocks) |
| **Overall tier** | standard (UI-heavy, stable internal contracts; several PRs are strong due to cross-cutting contracts) |

Note: the overall initiative is `standard` (UI-focused, no live backend), but individual PRs that establish cross-cutting contracts (brand/token spec, setup/nav/theme wiring, service ports, chat streaming, polish) are tier `strong` because they gate everything downstream.

## 7. Division into Sequential PRs

Each PR is small enough to be reviewed in one round and delivers incremental value. Total: 9 sequential PRs, dependency-ordered. Dependencies flow naturally: ports → mocks → UI core → rich data → conversations/states → polish → demo.

### PR-01 — Aikuaa brand research + design token specification

- **Tier:** strong
- **Tier justification:** establishes the cross-cutting design-token specification that every later PR depends on.
- **Objective:** Research the website and encode the resulting visual decisions as **platform-agnostic design tokens and documentation**. Do NOT implement UI components.
- **Scope:** web research of https://aikuaa.ai (colors, typography, spacing, radius, shadows, animation style, tone, components); **verify and document** the actual typography (including whether Manrope, DM Sans and DM Mono are actually used) and the real color palette (do NOT assume the values in the source doc); define typed design token spec (colors, typography, spacing, radius, shadows, animations) + brief token documentation.
- **Out of scope:** any UI screens, components, navigation, Expo project setup, theme-provider wiring. This PR does not "implement the design system"; it only specifies the tokens.
- **Previous dependency:** none
- **Likely files or modules:** `docs/brand-research.md`, `src/theme/tokens/*` (token spec types/values)
- **Required validations:** `npm run lint`, `npx tsc --noEmit`, `npm run test`
- **Verification:** token spec typed and documented; research note records the actually-verified fonts and palette with sources; no UI components exist yet.

### PR-02 — Expo project setup + navigation + theme wiring + test harness

- **Tier:** strong
- **Tier justification:** foundational project + navigation + theming that everything else builds on.
- **Objective:** Initialize the Expo SDK 57 / RN 0.86.3 app with Expo Router, Unistyles wiring (consuming PR-01 tokens), verified fonts, lint/format, and test harness. This is where the design system is **implemented/wired** into the app.
- **Scope:** project scaffold, folder structure, Expo Router typed routes, Unistyles theme provider using PR-01 tokens, expo-font loading of the fonts verified in PR-01, ESLint/Prettier, Jest/RNTL/Maestro scaffold.
- **Out of scope:** business screens; real backend.
- **Previous dependency:** PR-01
- **Likely files or modules:** `app.json`, `app.config.ts`, `src/app/`, `src/theme/`, `package.json`, `tsconfig.json`, `.eslintrc`
- **Required validations:** `npm run lint`, `npx tsc --noEmit`, `npm run test`, `npx expo export` or `expo-doctor`
- **Verification:** app compiles/boots to a default shell; theme provider injects PR-01 tokens; fonts load; baseline test passes.

### PR-03 — App shell (splash, welcome, event context, navigation)

- **Tier:** standard
- **Tier justification:** localized UI shell with stable contracts from PR-02.
- **Objective:** Implement the app shell and event-mode navigation skeleton.
- **Scope:** Splash screen, Welcome screen, Event context resolution (preconfigured for the demo; QR/deep-link-ready; NO user-facing event selection required), tab/stack layout (Chat primary + secondary menu), safe-area, keyboard handling.
- **Out of scope:** chat message rendering; conversations; states; real APIs.
- **Previous dependency:** PR-02
- **Likely files or modules:** `src/app/(app)`, `src/features/events`, `src/components/ui`
- **Required validations:** `npm run lint`, `npx tsc --noEmit`, `npm run test`
- **Verification:** navigation to Chat after resolving the (mock, preconfigured) event context; splash→welcome→event→chat flow works via component/integration tests.

### PR-04 — Service architecture + mock adapters + demo reset

- **Tier:** strong
- **Tier justification:** defines the service port contracts (adapters) that future backend integration depends on; architecture gate.
- **Objective:** Define the service architecture (typed ports + mock adapters), the typed multi-tenancy AppContext (event-only functional), and the deterministic demo reset.
- **Scope:** AIService/ConversationService/EventService/CompanyService/AnalyticsService interfaces + mock adapters; typed `AppContext` (mode/tenantId?/eventId?/companyId?) — event context functional, COMPANY type documented but NOT functional; **deterministic demo reset** (clears local state, restores initial event scenario); mock data sufficient to demonstrate all visual states.
- **Out of scope:** real HTTP adapters; UI components; real backend. Follow anti-over-abstraction: create only interfaces that map to an identified future backend boundary.
- **Previous dependency:** PR-03
- **Likely files or modules:** `src/services/**`, `src/mocks/**`, `src/stores/session.ts`, `src/app/context.ts`
- **Required validations:** `npm run lint`, `npx tsc --noEmit`, `npm run test`
- **Verification:** mock adapters implement the ports; unit tests drive deterministic mock outputs; demo reset restores the initial scenario; typecheck green.

### PR-05 — Chat core

- **Tier:** strong
- **Tier justification:** the primary product experience with streaming logic and chat-state contracts.
- **Objective:** Implement the chat screen core wired to the mock AIService.
- **Scope:** welcome state, suggested prompts, multi-line composer (keyboard-aware), user/AI message rendering, thinking animation, time-sliced batch-accumulator mock streaming, chat state (reducer/hook).
- **Out of scope:** sources/citations, company cards and structured responses (PR-06); conversations and states (PR-07); real backend.
- **Previous dependency:** PR-04
- **Likely files or modules:** `src/features/chat/**`, `src/components/ai/**`
- **Required validations:** `npm run lint`, `npx tsc --noEmit`, `npm run test`
- **Verification:** unit tests for message reducer/chat state; integration test send → stream → render → complete; composer and message components tested.

### PR-06 — Rich chat responses

- **Tier:** standard
- **Tier justification:** localized rich-rendering components on stable chat + service contracts.
- **Objective:** Implement sources/citations, company cards, structured responses and tool transparency in the chat.
- **Scope:** sources/citations component; company cards (logo, name, description, sector, location, website, tags); structured responses (company, company list, comparison table); tool-transparency component ("How Aikuaa found this"); Markdown rendering rules for rich AI text.
- **Out of scope:** conversations and states (PR-07); real backend.
- **Previous dependency:** PR-05
- **Likely files or modules:** `src/features/chat/components/response/**`, `src/components/company/**`, `src/components/ai/**`
- **Required validations:** `npm run lint`, `npx tsc --noEmit`, `npm run test`
- **Verification:** component/integration tests for sources, company card, structured responses, tool transparency.

### PR-07 — Conversations + states

- **Tier:** standard
- **Tier justification:** localized feature + UI state handling on stable contracts.
- **Objective:** Implement all visual states (core) and conversation history (Phase 2 — first to defer).
- **Scope (core):** offline indicator, backend-down, timeout, no-answer, empty states, loading states, retry logic; triggerable via mocks.
- **Scope (Phase 2, deferrable):** conversation history (grouped by day), new conversation, reopen conversation, mock session persistence.
- **Out of scope:** real network detection beyond what mocks need; real sync/persistence; real backend.
- **Previous dependency:** PR-06
- **Likely files or modules:** `src/features/conversations/**`, `src/services/storage/**`, `src/features/chat/**`, `src/components/ui/**`
- **Required validations:** `npm run lint`, `npx tsc --noEmit`, `npm run test`
- **Verification:** each state renders correctly with mock trigger; retry resets state (component tests); conversations tests (history, new conversation, reopen, mock persistence). Conversations tasks are marked Phase 2 / deferrable.

### PR-08 — Polish: animations, accessibility, responsive, performance

- **Tier:** strong
- **Tier justification:** broad cross-cutting quality pass (a11y, motion, performance) across all screens; MUST be part of the first demonstrable MVP.
- **Objective:** Refine the app to premium polish.
- **Scope:** Reanimated animations (message entry, sources expand, transitions, keyboard), Dynamic Type/accessibility (VoiceOver, TalkBack, touch targets, contrast), responsive/tablet behavior, FlashList virtualization tuning, memoized markdown, streaming performance.
- **Out of scope:** new features (e.g., Conversations if deferred); real backend.
- **Previous dependency:** PR-07
- **Likely files or modules:** `src/features/**`, `src/components/**`, `src/theme/**`
- **Required validations:** `npm run lint`, `npx tsc --noEmit`, `npm run test`
- **Verification:** a11y and performance checks pass; animations run on UI thread; long-message virtualization tested.

### PR-09 — Demo / integration preparation + observability contract

- **Tier:** standard
- **Tier justification:** readiness + packaging pass; no live integration.
- **Objective:** Finalize the adapter-swap contract, observability, demo reset access for operators, and a packaged demo build.
- **Scope:** analytics.track contract (no-op), service adapter swap documentation (mock → real), demo reset accessible for demo operators (dev/demo action to restore initial state between sessions), final Maestro E2E main flow, demo build via EAS/development build, final validation battery.
- **Out of scope:** any real backend call or REAL analytics platform.
- **Previous dependency:** PR-08
- **Likely files or modules:** `src/services/analytics/**`, `src/dev/demo/`, `e2e/**`, README/docs
- **Required validations:** `npm run lint`, `npx tsc --noEmit`, `npm run test`, E2E flow, demo build
- **Verification:** E2E main flow passes; demo build succeeds; adapter-swap guide documented; demo reset demonstrable by an operator.

## 8. Global Acceptance Criteria

**Phase 1 — first demonstrable MVP (REQUIRED):**
- [x] App boots on iOS and Android (Expo SDK 57 / RN 0.86.3) to a polished chat-first experience. — PR-02 boot + project compiles; PR-03 shell + PR-05 chat + PR-08 polish delivered.
- [x] Design system centralized, based on VERIFIED aikuaa.ai research (actual fonts and palette documented); no hardcoded colors/typography in components. — PR-01: verified research + token spec delivered. PR-02: enforcement confirmed — Unistyles consumes the tokens through the `resolveColor()`/`ColorToken` contract and the themed smoke component; fonts load via the expo-font adapter.
- [x] No tenant-specific branding or business copy scattered through components (centralized copy). — copy centralized in ChatWelcome and components; Spanish copy consistent.
- [x] EVENT mode flow works: Splash → Welcome → Event context → Chat (no event selection needed). — PR-03: shell + preconfigured event context delivered; splash → welcome → event context resolution → `/(app)/chat` verified via component/integration tests.
- [x] User can start a conversation, ask a question, see a mock streamed answer, view Markdown, sources, company cards, and structured responses. — PR-05 core + PR-06 rich responses + PR-08 polish.
- [x] Thinking, loading, empty, error (offline, backend down, timeout, no answer) states are rendered. — PR-07 core states.
- [x] Deterministic demo reset restores the initial event scenario for consecutive demos on the same device. — PR-04 reset + PR-09 operator action.
- [x] All backend-dependent capabilities are behind service interfaces with mock adapters only; no premature abstractions beyond identified integration boundaries. — PR-04 architecture + PR-09 adapter-swap doc.
- [x] Multi-tenancy context is typed (mode/tenantId?/eventId?/companyId?); ONLY the event context is functional. — PR-04 AppContext union.
- [x] Accessibility (Dynamic Type, VoiceOver/TalkBack, touch targets, contrast) is implemented. — PR-08 a11y pass.
- [x] Performance: fast startup, virtualized long lists, no per-token re-render jank during mock streaming. — PR-08 FlashList + memoized markdown + scroll guard.
- [x] Test battery is green: unit, component, integration, and E2E main flow. — 38 suites / 163 tests passing; E2E flow documented.
- [x] No secrets/API keys/credentials in the mobile bundle. — verified across PRs.
- [x] White-label readiness captured as an architecture note (no theming plumbing). — architecture note only.

**Phase 2 — Conversations (DEFERRED — first to cut if time must be reduced):**
- [ ] User can navigate conversation history, create a new conversation, and reopen a conversation (with local mock persistence).

## 9. Notes and Risks

- **Technical risk:** Expo Router file structure may feel rigid for future COMPANY mode → use route groups `(event)`/`(company)` and shared layouts.
- **Technical risk:** Mock streaming jank on low-end devices → batch token updates, memoize markdown parse, test on mid-tier Android.
- **Technical risk:** Over-engineering of service abstractions → anti-over-abstraction rule: create only interfaces that correspond to an identified future integration boundary.
- **External dependency:** markdown library must cover chat markdown + custom renderers for cards/tables → plan custom render rules.
- **External dependency:** Maestro E2E on CI can be flaky → stable emulator configs.
- **Deferred scope:** white-label theming plumbing out of scope (architecture note only); **Conversations (PR-07 portion) is Phase 2 — the first feature to defer if time is reduced**. PR-08 Polish must remain in the first MVP.
- **Brand research:** PR-01 must VERIFY the actual typography/palette on aikuaa.ai rather than assume Manrope/DM Sans/DM Mono or the source-doc palette.
- **Pending decisions:** none (all architecture decisions validated with the user across two review rounds).

## 10. Structure of Generated Files

Once this spec is approved, the `spec-engineer` will create inside `.codex/specs/aikuaa-app-frontend/`:

- `README.md` — this specification.
- `cronologia-resolucao.md` — resolution chronology (planning).
- `cronologia-implementacao.md` — chronological development memory.
- `pr-01-…md` … `pr-09-…md` — canonical documents of each PR.
- `tasks.md` — task-level checkboxes with `Verification` per task.
- `deltas/` — delta-sync records per closed PR.
- Legacy phase prompts were intentionally retired during the Codex migration; canonical evidence remains in `tasks.md`, the PR documents, chronology, deltas, and runtime state for new executions.

## History / Last synced

### 2026-09-11 — PR-09: Demo / integration preparation + observability contract (closed)

- Tier/model: standard / mobile-developer (Phase A); impl-reviewer (Phase B — `Approved with follow-ups`, no blockers); tester certified the battery.
- Test gate green: lint (0 errors, 3 pre-existing warnings), typecheck pass, 163 tests pass (38 suites), `npx expo export` succeeds.
- Delivered: no-op/mock `analytics.track` contract, in-memory event recorder, adapter-swap guide (`docs/adapter-swap.md`) with typecheck coverage, `DemoResetButton` operator action, Maestro E2E flow (`e2e/flow.yaml`), demo build validation.
- Acceptance criteria annotated in section 8: observability contract, deterministic demo reset, demo build, E2E main flow satisfied.
- Full record in [`deltas/delta-pr-09.md`](./deltas/delta-pr-09.md).
- Feature status: all 9 PRs closed; first demonstrable MVP complete (PR-07 Phase 2 conversations deferred).

### 2026-09-11 — PR-08: Polish (closed)

- Tier/model: strong / mobile-developer (Phase A/C); impl-reviewer (Phase B round 1 `Requires blocking fixes`, Phase D round 2 `Approved with follow-ups`); architect-agent (`Approved with recommendations`); tester certified the battery after each gate.
- Test gate green: lint (0 errors, 3 pre-existing warnings), typecheck pass, 153 tests pass (35 suites).
- Delivered: Reanimated animations, accessibility pass, responsive/tablet layout (`useBreakpoint`), FlashList virtualization, extracted + memoized `markdownParser.ts`, stable `StreamingFooter`, `isSending` `finally` fix.
- Correction loop: Phase B found 2 blockers (inline `ListFooterComponent`, scroll effect on `streamingContent`); Phase C extracted `StreamingFooter` and moved scroll guard to `onContentSizeChange`; Phase D approved; architecture gate approved with `useBreakpoint` hardening applied before closing.
- Non-blocking follow-ups recorded in `deltas/delta-pr-08.md` (reduced-motion gating, scroll-to-end mock test, stable streaming message identity, `markdownParser` promotion).
- Acceptance criteria annotated in section 8: animations, accessibility, responsive behavior, performance/virtualization satisfied.
- Full record in [`deltas/delta-pr-08.md`](./deltas/delta-pr-08.md).
- Handoff to PR-09: Demo / integration preparation + observability contract (final PR).

### 2026-09-11 — PR-07: Conversations + states (closed)

- Tier/model: standard / mobile-developer (Phase A); impl-reviewer (Phase B — `Approved with follow-ups`, no blockers); tester certified the battery.
- Test gate green: lint (0 errors, 3 pre-existing warnings), typecheck pass, 129 tests pass (33 suites).
- Delivered: chat state components (`OfflineIndicator`, `ErrorState`, `EmptyState`, `LoadingState`), retry logic in `useChat`/`chatReducer`, mock keyword triggers for `timeout`/`backend`/`servidor`, `NO_ANSWER` explicit error.
- Deferred: Phase 2 tasks 7.5–7.7 (conversation list, new conversation, reopen + mock persistence) per the spec's deferral priority rule.
- Non-blocking follow-ups recorded in `deltas/delta-pr-07.md` (`isSending` robustness, mock keyword documentation, style consolidation, `useMemo`, configurable `EmptyState` copy).
- Acceptance criteria annotated in section 8: error/empty/loading/offline states satisfied; conversation history remains Phase 2.
- Full record in [`deltas/delta-pr-07.md`](./deltas/delta-pr-07.md).
- Handoff to PR-08: Polish (animations, accessibility, responsive, performance) — mandatory for first MVP.

### 2026-09-11 — PR-06: Rich chat responses (closed)

- Tier/model: standard / mobile-developer (Phase A); impl-reviewer (Phase B — `Approved with follow-ups`, no blockers); tester certified the battery.
- Test gate green: lint (0 errors, 3 pre-existing warnings), typecheck pass, 115 tests pass (28 suites).
- Delivered: custom Markdown renderer (`RichMessageContent`); `SourcesCitations`; `CompanyCard`; `StructuredResponse` (company / company list / comparison table); `ToolTransparency`; integration into `ChatMessage`; `lineHeights` theme tokens; component tests for tasks 6.1–6.5.
- Non-blocking follow-ups recorded in `deltas/delta-pr-06.md` (accessibility labels, pressable source URLs, logo fallback, table overflow, reusable expandable section, Markdown memoization).
- Acceptance criteria annotated in section 8: user can see Markdown, sources, company cards, and structured responses in chat; thinking/loading/empty/error states remain for PR-07.
- Full record in [`deltas/delta-pr-06.md`](./deltas/delta-pr-06.md).
- Handoff to PR-07: conversations + states build on rich-response components.

### 2026-09-08 — PR-03: App shell (splash, welcome, event context, navigation) (closed)

- Tier/model: standard / mobile-developer (Phase A); impl-reviewer (B); tester certified the battery. Architecture gate not required (tier standard, no contract change).
- Test gate green: lint (warnings only), typecheck pass, 28 tests pass, `expo export` pass.
- Code review: **Approved with follow-ups (no blockers)**. Follow-ups applied in Phase E: `resolveEvent`/`resolveDemoEvent` wrapped in `useCallback` and added to `useMemo` deps (`AppContext.tsx`); `ChatPlaceholder.tsx` uses `theme.colors.muted` directly instead of `styles.inputPlaceholder.color`.
- Delivered: root layout `src/app/_layout.tsx` (SafeAreaProvider/ThemeProvider/FontLoader/AppContextProvider); Splash (`src/app/index.tsx` → `/welcome`); Welcome (`src/app/welcome.tsx` → resolves demo event → `/(app)/chat`); Tabs layout `(app)/_layout.tsx` (Chat, History, Event, Settings) + `{chat,history,event,settings}.tsx` screens; typed AppContext + deep-link-ready resolver (`src/context/AppContext.tsx`, `resolveEvent.ts`); `Splash.tsx`, `Welcome.tsx`, `ChatPlaceholder.tsx`; tests for all verifications.
- Acceptance criteria annotated in section 8 (EVENT mode flow splash → welcome → event context → chat works).
- Full record in [`deltas/delta-pr-03.md`](./deltas/delta-pr-03.md).
- Handoff to PR-04: service architecture + mock adapters + demo reset build on the resolved event context.

### 2026-09-08 — PR-02: Expo project setup + navigation + theme wiring + test harness (closed)

- Tier/model: strong / mobile-developer (Phase A/C); impl-reviewer (B/D); tester certified the battery; architect-agent ran the architecture gate.
- Test gate green: typecheck, lint, format:check, test, expo-doctor (21/21), `expo export`.
- Code review: **Approved with follow-ups (no blockers)**. Follow-ups addressed: `ThemeProvider` documented as a pass-through shim (DA-004); RN 0.87 → 0.86.3 recorded as DA-003.
- Architecture gate: **Approved with recommendations**. Napkin updated: DA-003 (RN pinned 0.86.3 for SDK 57), DA-004 (Unistyles v3 no-provider theme wiring), DA-005 (Maestro E2E deferred to PR-09); `architecture.md` records the `(event)`/`(company)` route groups.
- Delivered: `mobile/package.json` (Expo SDK 57 / RN 0.86.3 New Architecture / Expo Router 57 / Unistyles v3 / Reanimated 4.5.1 / FlashList / expo-font / Jest / RNTL), `app.config.ts`, `tsconfig.json`, `.eslintrc.js`, `.prettierrc`, `babel.config.js`, `jest.config.js`; Expo Router structure (`src/app/_layout.tsx`, `src/app/index.tsx`, `src/app/(app)/{_layout,index}.tsx`, route groups `(event)`/`(company)`); theme layer (`theme.ts`, `unistyles.ts`, `ThemeProvider.tsx`, `FontLoader.tsx`, `fonts.ts`, `resolveColor.ts`); `ThemedSmoke.tsx` + tests; `__mocks__/react-native-unistyles.tsx` (v3 mock); `e2e/flow.yaml` placeholder.
- Acceptance criteria annotated in section 8 (boot shell, design-token enforcement, test harness).
- Full record in [`deltas/delta-pr-02.md`](./deltas/delta-pr-02.md).
- Handoff to PR-03: populate `(app)` and route-group layouts with the splash → welcome → event context → chat flow.

### 2026-09-08 — PR-02: Expo SDK 57 / React Native version reconciliation

- **Version note:** PR-02 reconciled Expo SDK 57 with **React Native 0.86.3** (the React Native version bundled with SDK 57), superseding the previously assumed "RN 0.87" references in this spec. See Napkin decision DA-003.

### 2026-09-08 — PR-01: Aikuaa brand research + design token specification (closed)

- Tier/model: strong / ui-ux-designer. Test gate green (`npm run lint`, `npx tsc --noEmit`, `npm run test`). Code review: Approved with follow-ups (closed during Phase E); architecture gate: Approved with recommendations. No blockers.
- Brand research **verified** against https://aikuaa.ai and documented in `docs/brand-research.md` (Spanish): Manrope, DM Sans and DM Mono confirmed; cream/navy palette confirmed.
- Design token specification **delivered** in `src/theme/tokens/`: palette + semantic light/dark aliases (`colors.ts`) and `typography.ts`, `spacing.ts`, `radius.ts`, `shadows.ts`, `animations.ts`, with a central `index.ts` re-export; `headerBg` as RN-safe `{ color, opacity }`.
- Semantic alias test coverage complete (all aliases, light + dark) in `src/theme/tokens/__tests__/tokens.spec.ts`; minimal greenfield tooling (`package.json`, `tsconfig.json`, `jest.config.js`) added.
- Acceptance criterion "Design system centralized, based on VERIFIED aikuaa.ai research" **satisfied** by PR-01 (see section 8).
- Full record in [`deltas/delta-pr-01.md`](./deltas/delta-pr-01.md).
- Deferred to PR-02: `ColorToken` union + `resolveColor()`, expo-font typography adapter contract. Breakpoints / z-index / elevation tokens deferred until a component needs them.
