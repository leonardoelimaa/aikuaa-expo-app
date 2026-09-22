# PR-04 — Service architecture + mock adapters + demo reset

- Status: closed
- Tier: strong
- Previous dependency: PR-03
- Merge order: 4
- Suggested specialized agent (Phase A/C): `mobile-developer`

## Objective

Define typed service ports + mock adapters, typed multi-tenancy AppContext (event functional), and deterministic demo reset.

## Scope

- Service interfaces: AIService, ConversationService, EventService, CompanyService, AnalyticsService.
- Mock adapters implementing each interface with deterministic data sufficient for all visual states.
- Typed `AppContext` — mode / tenantId? / eventId? / companyId? — event functional; COMPANY documented but not functional.
- Deterministic demo reset: clears local state, restores initial event scenario.
- Anti-over-abstraction: only interfaces mapping to identified future backend boundaries.

## Out of scope

- Real HTTP adapters.
- UI components or screens.
- Real backend.

## Dependencies

PR-03 — requires the app shell and navigation skeleton so that AppContext and event resolution have a structural home.

## Likely files or modules

- `mobile/src/services/**`
- `mobile/src/mocks/**`
- `mobile/src/stores/session.ts`
- `mobile/src/app/context.ts`

## Mandatory validations

- `npm run lint`
- `npx tsc --noEmit`
- `npm run test`

## Lifecycle (A→E)

A (Implementation) → B (Code review) → [C (Fix) → D (Revalidation)]* → E (Closing). Maximum 3 review rounds (B = 1, D = 2-3). C/D only if blockers.

## Phases

### A — Implementation
- Target: implement scope — each task's `Verification` must be green.
- Validation gate: `tester` certifies the battery.

### B — Code review
- Reviewer: `impl-reviewer` (strong).
- Success: Approved / Approved with follow-ups (no blockers).
- Failure: Requires blocking fixes → C.

### C — Fix after review (only if blockers)
- Fix only blocking findings of the previous round.

### D — Revalidation (only if blockers were fixed)
- Revalidate only the corrected blockers.

### E — Closing
- Aggregate summary, handoff for next PR, delta-sync, chronology update.

## Review checkpoints

- Phase B gate: reviewer verdict.
- Phase D gate (if applicable): revalidation of blockers.
- Architecture gate: triggered because tier is `strong` and this PR defines contracts/interfaces that all subsequent PRs consume.

## Completion criteria

- [ ] Objective delivered
- [ ] Out of scope respected (no changes outside scope)
- [ ] All validations green
- [ ] Review approved (no blockers)
- [ ] Task `Verification`s all green (tasks.md)
- [ ] Handoffs recorded (aggregate summary, continuation handoff, handoff for next PR, review package, review result)
- [ ] Chronology updated

## Notes / Risks

- Service interfaces are contracts consumed by every downstream PR (05-09). Interface design errors here propagate broadly.
- Anti-over-abstraction: resist the temptation to add layers that are not justified by identified future backend boundaries.
- Architecture gate applies — this PR touches contracts shared across multiple modules.

## Review result

- Phase B (round 1): `Requires blocking fixes` — blockers:
  - Corrupted mock data fields (wrong field names/types in mock datasets).
  - Invalid test syntax (malformed assertions in the test files).
  - Inconsistent demo context shape (demo context object did not match `EventAppContext`).
- Phase C: all blockers fixed; test gate re-certified green.
- Phase D (round 2): `Approved with follow-ups`.
- Architecture gate: `Approved with recommendations` — recommendations resolved in a second C/D round:
  - Circular dependency broken.
  - `useServices` alias removed.
  - `DEMO_EVENT` typed as `Readonly<EventAppContext>`.
  - Temporary-store comments added.
- Final status: closed 2026-09-09.
