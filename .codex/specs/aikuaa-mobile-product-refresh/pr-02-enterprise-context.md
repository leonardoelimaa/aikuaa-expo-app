# PR-02 — Enterprise demo context and data boundaries

## Objective

Introduce explicit workspace/company demo context and deterministic enterprise fixtures while maintaining workspace isolation and preserving frontend-only Ports & Adapters.

## Scope

- Make the smallest justified event-to-workspace/company evolution; reuse existing ports where semantically adequate.
- Define stable workspace and conversation identities; never overload event IDs as workspace meaning.
- Provide deterministic enterprise fixtures and isolate late responses, drafts, caches, and persisted selection across workspace changes.
- Explicitly retire event-first demo behavior unless compatibility is justified.

## Non-scope

Backend/database execution, real permissions, real ingestion/authentication, production tenant authorization, and a second state architecture.

## Dependency and likely paths

- Dependency: PR-01 E.
- Likely paths (probable only): `mobile/src/context/`, service ports/adapters for AIService, ConversationService, EventService, CompanyService, fixtures, store/query integration, public-interface tests. Confirm actual paths during implementation.

## Risk and contracts

Risk R2. Frontend-only mock-backed ports are AIService, ConversationService, EventService, CompanyService, AnalyticsService. AppContext event mode works; company mode is typed but non-operational. Keep TanStack Query for service-backed state, Zustand/local state for draft, selection, presentation. Any contract/boundary change needs the gates below.

## Lifecycle and architecture gate

`0 → A → test → B → [C → test → D]* → E`; max three review rounds. Independent review. Required architecture gate before implementation and at closure for enterprise context/service contracts and workspace isolation. No later PR before E.

## Acceptance and tasks

- Workspace switching is explicit; deterministic fixtures use stable identities and do not map event IDs to workspace IDs.
- Public-interface tests show that late responses/local state from a previous workspace do not leak.
- Event-first target behavior is retired unless documented compatibility is justified and approved.
- Task: [T02.1](tasks.md#t021--explicit-workspace-semantics-and-deterministic-enterprise-data).

## Verification

- `cd mobile && npm run lint`
- `cd mobile && npm run typecheck`
- `cd mobile && npm test -- --runInBand`
- Observable: selecting a workspace changes explicit context/fixtures; workspace switching and delayed response behavior are verified through public interfaces.

## Review policy

Independent isolated review of boundaries, behavior, scope, tests, identity, state ownership, and regressions. Architecture gate is mandatory. Only blocking findings enter C; retest before D. Max three rounds, no self-approval.

## Final verification

- Mutation isolation: 10/10; Phase 0 public-interface contract: 22/22.
- Full validation: 48/48 suites, 207/207 tests, lint, and typecheck passed.
- Expo web, iOS, and Android exports passed. `git diff --check` was clean.
- Existing React `act` console warnings were non-blocking. No native-device check is claimed.
- Final diff hash: `81f5042edb0e92f5a65d422731520c0ff43b4474f0e4364659e7a225dde27bbb`; environment hash: `4d3ffa4c20c15af4fe79391f8a56ac07ed99582310326c5e270c5bae11ceac12`.

## Phase E closure

Record test/review/architecture evidence; append chronology; append `deltas/delta-pr-02.md` and refresh living spec via delta-sync; update Napkin for lasting verified architecture/threshold changes. Do not begin PR-03 before E.
PR-02 reached Phase E and is closed on 2026-09-20; the delta and Napkin now record the verified frontend workspace boundary. PR-03 is next. This closure makes no production authorization or durable-persistence claim.

## Continuation handoff

Placeholder — populate at execution with current phase, job/evidence references, hashes, gate decisions, remaining work, and exact next action. No execution has started.

### Pre-implementation handoff — architecture persisted

- Architecture job: `aikuaa-mobile-product-refresh/pr-02/architecture-pre/attempt-1`; profile `strong_architecture`, `gpt-6-astra/high`; baseline diff hash `9268f48cfdf1f7faba00973195d001c26089adf5535aba459be47b167204c203`; verdict `Approved with conditions`.
- The approved architecture contract is recorded below. Next action: begin Phase 0 by defining public-interface tests for the listed invariants, scope, race conditions, and retired event entry. Phase 0 must establish executable evidence before implementation.
- Required closure evidence remains: contract persisted; Phase 0 tests pass; lint, typecheck, and full Jest pass; independent review; mandatory architecture closure review; no unscoped content call and no production-auth or durable-persistence claim.
- Final handoff — closed: Phase 0 22/22; mutation isolation 10/10; final full run 48/48 suites and 207/207 tests, lint/typecheck, and Expo web/iOS/Android exports passed. Final diff hash `81f5042edb0e92f5a65d422731520c0ff43b4474f0e4364659e7a225dde27bbb`; environment hash `4d3ffa4c20c15af4fe79391f8a56ac07ed99582310326c5e270c5bae11ceac12`. Independent review and architecture closure approved. Next: PR-03.

## Review result (append-only)

- Not started.
- B round 1 (gpt-5.6-sol/xhigh) required blocking fixes for stale pending create/save commits. C attempt 1 (gpt-5.6-sol/high) added signal and atomic commit checks with tests. The post-C tester gate (gpt-5.6-terra/high) passed. D round 2 (gpt-5.6-sol/xhigh) approved with no findings.
- Architecture close attempt 1 was interrupted solely by a model-route change. Attempt 2 (gpt-5.6-sol/high) found the same blocker; attempt 3 (gpt-5.6-sol/high) approved with no conditions. Future architecture workers use gpt-5.6-sol/high.

## Pre-implementation architecture gate

Architecture job `aikuaa-mobile-product-refresh/pr-02/architecture-pre/attempt-1` used profile `strong_architecture` (`gpt-6-astra/high`) against baseline diff hash `9268f48cfdf1f7faba00973195d001c26089adf5535aba459be47b167204c203`. Verdict: `Approved with conditions`.

### Invariants

- There is one validated operational workspace. `WorkspaceId` is stable and distinct from company, event, labels, and positions. `ConversationId` is stable and has immutable workspace ownership.
- Every content call is explicitly scoped and fails closed when scope is absent.
- Switching or resetting clears draft, messages, partial output, error, retry, selection, and sending state.
- Stale work cannot mutate UI, store, or cache. Mock isolation does not constitute production authorization.

### Approved contract delta

- Define `WorkspaceId` and `ConversationId`.
- Resolve operational company `AppContext` from a Workspace catalog. Add a Workspace model and `CompanyService.listWorkspaces` / `getWorkspaceById`.
- Make `AIRequest` context mandatory and `AbortSignal` optional.
- Scope `ConversationService` and company content lookups by workspace.
- Add `AppContext` actions `selectWorkspace`, `enterDemo`, and `resetDemo`, with a monotonic revision.
- Keep Analytics unchanged. Do not expand evidence, agent, or attachment contracts.

### State ownership

- `AppContext` owns selection and revision.
- TanStack Query owns service-backed cache with scoped keys.
- Local/Zustand transient chat state is keyed to workspace incarnation.
- The mock conversation store is partitioned by workspace and returns defensive copies.
- No durable persistence is introduced.

### Isolation and race handling

- Key the chat subtree by workspace and revision.
- Each request captures context, revision, conversation, token, and `AbortController`.
- Guard chunk, flush, complete, catch, finally, persist, and cache paths against stale work.
- Invalidate synchronously; correctness must not rely on abort. Cover late resolve and reject, A-B-A switching, reset, and unmount.
- Do not show previous-workspace placeholder data. Validate restored selection and prevent it from overwriting a newer explicit selection.

### Event compatibility decision

- Retire operational event mode, resolvers, and event-derived reset behavior. `EventService` and fixtures may remain only as unreachable compatibility code.
- A temporary event route before PR-03 may use workspace semantics; an event ID must never serve as a workspace ID.

### Phase 0 public-interface test contract

- Cover provider selection, reset, and invalid legacy IDs; service scope and ownership; stable IDs; defensive copies; rendered draft isolation; late resolve and reject; A-B-A switching; reset and unmount; cache isolation; restore race; and retired event entry.

### Closure conditions

- Persist this contract; pass the Phase 0 tests; pass lint, typecheck, and full Jest; obtain independent review and mandatory architecture closure review; ensure there is no unscoped content call and no production-auth or durable-persistence claim.
