# PR-08 — Polish: animations, accessibility, responsive, performance

- Status: planned
- Tier: strong
- Previous dependency: PR-07
- Merge order: 8
- Suggested specialized agent (Phase A/C): `mobile-developer`

## Objective

Refine the app to premium polish across animations, accessibility, responsiveness, and performance.

## Scope

- Reanimated animations: message entry, sources expand, screen transitions, keyboard-aware motion.
- Dynamic Type / accessibility: VoiceOver, TalkBack, touch targets, contrast ratios.
- Responsive / tablet layout support.
- FlashList virtualization for long lists.
- Memoized Markdown rendering.
- Streaming performance optimization.

## Out of scope

- New features (e.g., deferred Conversations from PR-07 Phase 2).
- Real backend.

## Dependencies

PR-07 — requires all visual states and chat features to be in place so that polish passes can refine the complete experience.

## Likely files or modules

- `mobile/src/features/**`
- `mobile/src/components/**`
- `mobile/src/theme/**`

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
- Architecture gate: triggered because tier is `strong`.

## Completion criteria

- [ ] Objective delivered
- [ ] Out of scope respected (no changes outside scope)
- [ ] All validations green
- [ ] Review approved (no blockers)
- [ ] Task `Verification`s all green (tasks.md)
- [ ] Handoffs recorded (aggregate summary, continuation handoff, handoff for next PR, review package, review result)
- [ ] Chronology updated

## Notes / Risks

- This PR MUST remain in the first demonstrable MVP — polish is not optional.
- Performance work (FlashList, memoization) must be validated on lower-end devices or emulators to be meaningful.
- Accessibility pass should be tested with actual screen readers (VoiceOver on iOS, TalkBack on Android), not just computed contrast checks.
