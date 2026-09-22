# PR-09 — Demo / integration preparation + observability contract

- Status: planned
- Tier: standard
- Previous dependency: PR-08
- Merge order: 9
- Suggested specialized agent (Phase A/C): `mobile-developer`

## Objective

Finalize adapter-swap contract, observability, demo reset operator access, and packaged demo build.

## Scope

- `analytics.track` implementation (no-op for demo).
- Service adapter swap documentation (mock → real).
- Demo reset accessible to demo operators (dev / demo action).
- Maestro E2E main flow.
- Demo build via EAS / dev build.
- Final battery of validations.

## Out of scope

- Real backend calls.
- Real analytics calls.

## Dependencies

PR-08 — requires the polished, complete app so that E2E flows and demo builds exercise the final experience.

## Likely files or modules

- `mobile/src/services/analytics/**`
- `mobile/src/dev/demo/**`
- `mobile/e2e/**`
- README / docs

## Mandatory validations

- `npm run lint`
- `npx tsc --noEmit`
- `npm run test`
- E2E tests (Maestro)
- Demo build succeeds (EAS / dev build)

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

## Completion criteria

- [ ] Objective delivered
- [ ] Out of scope respected (no changes outside scope)
- [ ] All validations green
- [ ] Review approved (no blockers)
- [ ] Task `Verification`s all green (tasks.md)
- [ ] Handoffs recorded (aggregate summary, continuation handoff, handoff for next PR, review package, review result)
- [ ] Chronology updated

## Notes / Risks

- This is the final PR of the sequence — closing it completes the MVP scope.
- Demo build must be validated on a real device or sim, not just Expo Go, since native modules may be involved.
- Adapter swap documentation should be precise enough that a future developer can swap mock → real without reading the entire codebase.
- E2E tests should cover the happy-path demo flow end-to-end as a regression safety net.
