# PR-03 — Enterprise entry and navigable product shell

## Objective

Deliver an honest branded demo entry and intentional product navigation with workspace selection/details and practical settings.

## Scope

- Primary destinations: Assistant, Conversations, Workspace. Settings through stack/profile entry.
- Remove hidden/index route leaks, dead tabs, placeholders, and default triangle icons; use intentional headers/icons.
- Provide branded entry that identifies demo/sign-in state without real Google OAuth; workspace selector/details; practical settings; deterministic cold/restored/back behavior.

## Non-scope

Real auth, production account management, backend permissions, and conversation workflow implementation beyond shell navigation.

## Dependency and likely paths

- Dependency: PR-02 E.
- Likely paths (probable only): mobile Expo Router route groups/layouts, entry screen, tab/stack navigation, workspace screens, settings, route/UI tests. Confirm actual paths during implementation.

## Risk and contracts

Risk R2. Preserve typed routes and explicit active workspace context. No route/context shared-boundary or persisted entry-state changes without the conditional architecture gate.

## Lifecycle and architecture gate

`0 → A → test → B → [C → test → D]* → E`; max three review rounds; independent review. Architecture gate only if route/context integration or persisted entry-state changes shared boundaries. No later PR before E.

## Acceptance and tasks

- Entry clearly represents the simulated demo and offers no real Google OAuth implication.
- Exactly the intentional primary destinations are discoverable; Settings remains accessible; no index route leak/dead placeholder tab.
- Workspace selection/details and cold/restored/back behavior work deterministically.
- Task: [T03.1](tasks.md#t031--honest-entry-and-intentional-navigation).

## Verification

- `cd mobile && npm run lint`
- `cd mobile && npm run typecheck`
- `cd mobile && npm test -- --runInBand`
- `cd mobile && npx expo export`
- Observable: each destination is reachable; entry, selection, restore, and back flows behave as specified.

## Review policy

Independent isolated review of navigation behavior, route scope, accessibility, safe areas, regressions, and any shared-boundary changes. Conditional architecture gate as above. Blocking fixes only; test before revalidation; max three rounds.

## Phase E closure

Record Verification/review and any required architecture evidence; append chronology; append `deltas/delta-pr-03.md` and refresh living spec; update Napkin only for lasting verified decisions. Do not begin PR-04 before E.

## Continuation handoff

Placeholder — populate at execution with current phase, job/evidence references, hashes, gate decisions, remaining work, and exact next action. No execution has started.

Pre-implementation architecture handoff: architecture job `aikuaa-mobile-product-refresh/pr-03/architecture-pre/attempt-1`, profile `strong_architecture`, `gpt-5.6-sol/high`; baseline diff hash `81f5042edb0e92f5a65d422731520c0ff43b4474f0e4364659e7a225dde27bbb`; verdict `Approved with blocking conditions`. Complete Phase 0 against the ten behaviors recorded under [Pre-implementation architecture gate](#pre-implementation-architecture-gate) before Phase A. Implementation has not started.

## Review result (append-only)

- Not started.
- B review: Approved, no findings. Factual reconciliation confirmed the duplicate-header concern was not an implementation defect.
- Architecture review: Approved, no conditions. This implements the already approved boundary; no new architectural decision was introduced.

## Pre-implementation architecture gate

- Job: `aikuaa-mobile-product-refresh/pr-03/architecture-pre/attempt-1`; profile `strong_architecture`; model/reasoning `gpt-5.6-sol/high`.
- Baseline diff hash: `81f5042edb0e92f5a65d422731520c0ff43b4474f0e4364659e7a225dde27bbb`.
- Verdict: `Approved with blocking conditions`. Resolve the conditions in the Phase 0 executable contract before implementation.
- Navigation structure: `(app)` Stack containing `(tabs)`; the only visible tabs are Assistant, Conversations, and Workspace. Settings and workspace details are Stack pushes.
- Legacy routes are hidden one-way redirects. Boot has three explicit states, and route IDs are validated.
- `WorkspaceQuery` owns the workspace catalog. `AppContext` owns demo mode, selection, and revision.
- Conversations must show a truthful empty state; tabs are label-only and accessible.
- No auth, network, or persistence is introduced.
- Phase 0 must verify these ten behaviors:
  1. Cold and restored boot behavior.
  2. Entry uses replace semantics and Back does not return to entry.
  3. Exactly Assistant, Conversations, and Workspace are visible tabs.
  4. Visible navigation and Back behavior across destinations.
  5. Hidden legacy-route redirects are one-way.
  6. Conversations empty state and its CTA.
  7. Workspace selection, details navigation, and rejection of invalid route IDs.
  8. Settings navigation, Back behavior, and reset.
  9. Direct-access guards for protected shell routes.
  10. Tab labels and accessible semantics without icon-only navigation.
- Next phase: Phase 0 public-interface test contract. No implementation has started.

## Final continuation handoff

PR-03 is closed at Phase E. PR-04 (assistant workflow) is next. The delivered shell uses the honest demo root entry, guarded app Stack, exactly three label-only Assistant/Conversations/Workspace tabs, and stack Settings/workspace detail with back navigation. Lifecycle restore guards prevent stale state. No auth, network access, or durable persistence was added.

## Final verification

- Phase 0 contract: 4/4 suites, 20/20 tests.
- Final Jest: 52/52 suites, 226/226 tests.
- Typecheck: PASS.
- Lint: PASS, 0 errors and 18 warnings.
- Expo export: PASS for web, iOS, and Android.
- Diff check: PASS.
- Native/device Maestro, VoiceOver, and TalkBack checks were not run and remain unverified.
- Final implementation diff hash: `635c05b299f689cca3b08b68a4c678190aa3969d95de55126151f47239db6bf4`.

## Phase E result

Closed PR-03 on 2026-09-20. Delta-sync recorded in `deltas/delta-pr-03.md`; the living spec and project memory now reflect PR-03 completion. Next runnable PR: PR-04.
