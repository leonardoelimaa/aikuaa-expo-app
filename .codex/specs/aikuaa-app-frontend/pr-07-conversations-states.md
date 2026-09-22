# PR-07 — Conversations + states

- Status: planned
- Tier: standard
- Previous dependency: PR-06
- Merge order: 7
- Suggested specialized agent (Phase A/C): `mobile-developer`

## Objective

Implement all visual states (core) and conversation history (Phase 2 — first to defer).

## Scope

### Core (mandatory)
- Offline indicator.
- Backend-down state.
- Timeout state.
- No-answer state.
- Empty states.
- Loading states.
- Retry logic (triggerable via mocks).

### Phase 2 (deferrable)
- Conversation history (grouped by day).
- New conversation.
- Reopen conversation.
- Mock session persistence.

## Out of scope

- Real network detection beyond mocks.
- Real sync / persistence.
- Real backend.

## Dependencies

PR-06 — requires rich chat responses to be in place so that states and history can wrap the complete chat experience.

## Likely files or modules

- `mobile/src/features/conversations/**`
- `mobile/src/services/storage/**`
- `mobile/src/features/chat/**`
- `mobile/src/components/ui/**`

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

## Completion criteria

- [ ] Objective delivered
- [ ] Out of scope respected (no changes outside scope)
- [ ] All validations green
- [ ] Review approved (no blockers)
- [ ] Task `Verification`s all green (tasks.md)
- [ ] Handoffs recorded (aggregate summary, continuation handoff, handoff for next PR, review package, review result)
- [ ] Chronology updated

## Notes / Risks

- Phase 2 (conversation history) is explicitly deferrable — prioritize the core visual states first to keep the MVP demonstrable.
- Mock-triggerable retry logic must simulate real error paths convincingly for demo purposes.
