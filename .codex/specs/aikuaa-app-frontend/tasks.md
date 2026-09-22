# Tasks — Aikuaa AI Mobile Frontend

Each task carries an id, a short description, an executable `Verification` (test / scenario / command with expected result), and a status checkbox (pending → in progress → done). Verified green before the PR closes (Phase A gate by `tester`, Phase B/D by `impl-reviewer`).

Deferral priority rule: if implementation time must be reduced, the **Conversations** portion of PR-07 is the first feature to defer (tasks 7.5–7.7). PR-08 (Polish) must remain part of the first demonstrable MVP.

## PR-01 — Aikuaa brand research + design token specification (strong)

- [x] **1.1** Research https://aikuaa.ai and its public pages; VERIFY and document the ACTUAL typography used (including whether Manrope, DM Sans and DM Mono are really used) and the REAL color palette; capture spacing, radius, shadows, animation style, tone, components.
  - Verification: `docs/brand-research.md` records concrete, source-verified values (fonts actually served, hex values observed) — checked in Phase B.
- [x] **1.2** Define typed color tokens from the verified palette.
  - Verification: `theme/tokens/colors.ts` exports typed tokens; unit test asserts expected keys non-empty; `npx tsc --noEmit` passes.
- [x] **1.3** Define typography tokens (families + weights + sizes) using the fonts VERIFIED on the site (not assumed).
  - Verification: `theme/tokens/typography.ts` exports tokens; typecheck passes.
- [x] **1.4** Define spacing, radius, shadow and animation tokens.
  - Verification: `theme/tokens/{spacing,radius,shadows,animations}.ts` export typed tokens; lint + typecheck pass; unit test asserts required keys.
- [x] **1.5** Central token index + brief documentation (platform-agnostic; no UI components).
  - Verification: `theme/tokens/index.ts` exports all token groups; docs present; no UI components exist (review).

## PR-02 — Expo project setup + navigation + theme wiring + test harness (strong)

- [x] **2.1** Initialize Expo SDK 57 / RN 0.86.3 project with New Architecture and TypeScript.
  - Verification: `npx expo-doctor` passes; `npx expo export` produces a bundle; `npx tsc --noEmit` passes.
- [x] **2.2** Configure Expo Router with typed routes and base layouts.
  - Verification: app boots to a default shell route; typed-route typecheck compiles.
- [x] **2.3** Wire Unistyles theme provider consuming PR-01 tokens (design system IMPLEMENTED).
  - Verification: smoke test renders a themed component reading from the token provider; typecheck passes.
- [x] **2.4** Load the fonts verified in PR-01 via expo-font.
  - Verification: useFonts ready flag asserted before first render; test green.
- [x] **2.5** Configure ESLint/Prettier and Jest + RNTL harness (scaffold Maestro E2E).
  - Verification: `npm run lint`, `npm run format:check`, `npm run test` pass with a baseline test.

## PR-03 — App shell (splash, welcome, event context, navigation) (standard)

- [x] **3.1** Splash screen with controlled hide.
  - Verification: component test asserts splash renders then transitions on event; typecheck passes.
- [x] **3.2** Welcome screen with brand copy and CTA.
  - Verification: component test asserts welcome text/CTA render; CTA triggers navigation.
- [x] **3.3** Event context resolution (preconfigured mock; QR/deep-link-ready; NO user-facing event selection).
  - Verification: unit test asserts the preconfigured event context resolves; a future-flag (deep-link code path type/signature) exists and compiles.
- [x] **3.4** Tab/stack layout: Chat primary + secondary menu (History, Event/Company, Settings).
  - Verification: navigation integration test reaches Chat after event context resolution; typecheck passes.
- [x] **3.5** Safe-area and keyboard handling wiring for the shell.
  - Verification: scenario test asserts safe-area + keyboard behavior on a target screen.

## PR-04 — Service architecture + mock adapters + demo reset (strong)

- [ ] **4.1** Service interfaces (ports) for AI, Conversation, Event, Company, Analytics — ONLY those mapping to identified future backend boundaries.
  - Verification: typecheck asserts interfaces exist with expected method signatures; mock adapters satisfy them (structural typing).
- [ ] **4.2** Mock adapters for all services (deterministic outputs; no real network).
  - Verification: unit tests drive mock adapters and assert deterministic outputs.
- [ ] **4.3** Typed multi-tenancy `AppContext` (mode/tenantId?/eventId?/companyId?) — event functional, COMPANY type documented but NOT functional.
  - Verification: unit test asserts event-mode context is effective and company-mode is non-operational at runtime.
- [ ] **4.4** Deterministic demo reset mechanism (clears local state, restores initial event scenario).
  - Verification: integration test calls demo reset and asserts local chat/session state cleared and initial event scenario restored.
- [ ] **4.5** Mock data sufficient to demonstrate all visual states (success, thinking, error, empty, offline, no-answer).
  - Verification: mock datasets exist and are exercised by tests; typecheck green.

## PR-05 — Chat core (strong)

- [ ] **5.1** Welcome state ("Conheça o evento", "O que você quer descobrir?" + suggested prompts).
  - Verification: component test asserts welcome + suggested prompts render; tapping a suggestion pre-fills/triggers composer.
- [ ] **5.2** Multi-line keyboard-aware prompt composer (large, rounded, send button, long-prompt support).
  - Verification: component test asserts multiline input, send enabled/disabled logic, submit callbacks.
- [ ] **5.3** User vs AI message rendering with distinct styling (no classic alternating bubbles).
  - Verification: component tests for user/AI variants; distinct-style assertions.
- [ ] **5.4** Thinking state with a minimalist Aikuaa animation ("Aikuaa está analisando...").
  - Verification: test asserts thinking indicator shows while pending and hides on completion.
- [ ] **5.5** Time-sliced batch-accumulator mock streaming (Pensando → tokens appear progressively).
  - Verification: integration test sends → streaming tokens appear in batches → complete; performance: no per-token full-list re-render.
- [ ] **5.6** Chat state reducer/hook (messages, streaming, thinking, send).
  - Verification: unit tests for reducer actions (send/stream/complete/error) with deterministic transitions.

## PR-06 — Rich chat responses (standard)

- [ ] **6.1** Markdown rendering rules for rich AI text (paragraphs, lists, code, tables, links, bold, italic, headers).
  - Verification: component tests render each markdown construct from mock AI response.
- [ ] **6.2** Sources/citations component ("Como o Aikuaa encontrou isso").
  - Verification: component test renders sources/citations from mock data and supports expand/collapse.
- [ ] **6.3** CompanyCard component (logo, name, description, sector, location, website, tags; flexible).
  - Verification: component test renders a company card; press triggers optional callback.
- [ ] **6.4** Structured responses: company, company list, comparison table.
  - Verification: component tests render each structured-response variant from mock data.
- [ ] **6.5** Tool-transparency component (mock tool list, non-technical, expandable, not a log screen).
  - Verification: component test renders the "How Aikuaa found this" panel without raw logs.

## PR-07 — Conversations + states (standard)

**Core (states) — must ship:**
- [ ] **7.1** Offline indicator (UI opens; no fake AI availability).
  - Verification: test asserts offline state renders and composer/AI shows unavailable state.
- [ ] **7.2** Backend-down, timeout, and no-answer error states.
  - Verification: mock triggers each error; component tests assert correct message + retry.
- [ ] **7.3** Empty states ("O que você quer descobrir?").
  - Verification: component test asserts empty-state copy and suggestions render.
- [ ] **7.4** Loading states and retry logic.
  - Verification: integration test triggers loading, failure, retry, success; transitions correct.

**Phase 2 (Conversations) — DEFER FIRST if time must be reduced:**
- [ ] **7.5** Conversation list grouped by day with title + timestamp + reopen.
  - Verification: component test renders grouped mock conversations; tapping reopens.
- [ ] **7.6** New conversation: resets thread, keeps tenant/event context.
  - Verification: integration test asserts new conversation clears messages and preserves AppContext.
- [ ] **7.7** Reopen loads prior messages; mock session persistence (local only).
  - Verification: unit test with mock storage adapter persists and reloads a conversation.

## PR-08 — Polish: animations, accessibility, responsive, performance (strong — MUST be in first MVP)

- [ ] **8.1** Reanimated animations (message entry, sources expand, transitions, keyboard) on UI thread.
  - Verification: tests run animations on UI thread (Reanimated assertions); no JS-thread blocking.
- [ ] **8.2** Accessibility: Dynamic Type, VoiceOver/TalkBack, touch targets (44x44), contrast, labels.
  - Verification: a11y checks + manual VoiceOver/TalkBack checklist pass; touch-target/contrast assertions.
- [ ] **8.3** Responsive/tablet behavior (no fixed iPhone dimensions).
  - Verification: tests at multiple breakpoints assert layouts adapt.
- [ ] **8.4** FlashList virtualization for long message lists.
  - Verification: perf test asserts long conversations virtualize/recycle; builds fine.
- [ ] **8.5** Memoized markdown + streaming batching performance.
  - Verification: test asserts markdown parse memoized (not re-run per token); no per-token re-render.

## PR-09 — Demo / integration preparation + observability contract (standard)

- [ ] **9.1** analytics.track contract with no-op/mock implementation.
  - Verification: unit test asserts track calls recorded by a mock; no-op safe in production path.
- [ ] **9.2** Service adapter-swap guide (mock → real) documented.
  - Verification: doc present; interface-swap example compiles (typecheck).
- [ ] **9.3** Demo reset accessible to demo operators (dev/demo action restoring initial state between sessions).
  - Verification: operator action (dev trigger) resets state; integration test asserts restoration.
- [ ] **9.4** Maestro E2E main flow (Open App → Event context → Chat → Prompt → Mock Response → Source → New Conversation [or reset when Conversations deferred]).
  - Verification: `maestro test` E2E passes green.
- [ ] **9.5** Demo build via EAS/development build + final validation battery.
  - Verification: `npx expo export` (or EAS build) succeeds; app launches; lint/typecheck/tests/E2E green; chronology updated.
