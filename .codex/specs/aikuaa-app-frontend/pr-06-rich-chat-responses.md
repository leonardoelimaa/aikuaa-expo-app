# PR-06 — Rich chat responses

- Status: planned
- Tier: standard
- Previous dependency: PR-05
- Merge order: 6
- Suggested specialized agent (Phase A/C): `mobile-developer`

## Objective

Sources/citations, company cards, structured responses, tool transparency, and Markdown rendering rules in the chat.

## Scope

- Sources / citations component.
- Company card component.
- Structured responses: company, list, comparison table.
- Tool transparency ("How Aikuaa found this").
- Markdown render rules for AI responses.

## Out of scope

- Conversation history and state management (PR-07).
- Real backend.

## Dependencies

PR-05 — requires the core chat screen, message rendering, and streaming infrastructure to attach rich response components to.

## Likely files or modules

- `mobile/src/features/chat/components/response/**`
- `mobile/src/components/company/**`
- `mobile/src/components/ai/**`

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

- Markdown rendering in React Native requires careful choice of library or custom renderer; must handle the subset needed without pulling in heavy dependencies.
- Structured response components (comparison table, list) need to handle variable data lengths gracefully on small screens.
