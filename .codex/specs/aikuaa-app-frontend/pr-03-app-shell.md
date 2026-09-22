# PR-03 — App shell (splash, welcome, event context, navigation)

- Status: planned
- Tier: standard
- Previous dependency: PR-02
- Merge order: 3
- Suggested specialized agent (Phase A/C): `mobile-developer`

## Objective

App shell + event-mode navigation skeleton with resolved (preconfigured) event context.

## Scope

- Splash screen.
- Welcome screen.
- Event context resolution — preconfigured for demo; QR / deep-link ready; NO user-facing event selection required.
- Tab / stack layout with Chat as primary + secondary menu.
- Safe areas and keyboard handling.

## Out of scope

- Chat rendering or conversation logic.
- State management beyond navigation.
- Real APIs or backend calls.

## Dependencies

PR-02 — requires the Expo scaffold, Expo Router, theme wiring, and fonts to be in place before building the shell.

## Likely files or modules

- `mobile/src/app/(app)/**`
- `mobile/src/features/events/**`
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

- Event context resolution is hardcoded for demo but must be designed so a future QR / deep-link entry point can inject context without architectural changes.
- Navigation skeleton complexity should stay minimal; this PR creates the structure, not the content.
