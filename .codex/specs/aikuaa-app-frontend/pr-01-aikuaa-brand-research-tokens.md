# PR-01 — Aikuaa brand research + design token specification

- Status: planned
- Tier: strong
- Previous dependency: none
- Merge order: 1
- Suggested specialized agent (Phase A/C): `ui-ux-designer`

## Objective

Research https://aikuaa.ai and encode the visual decisions as platform-agnostic design tokens and documentation; do NOT implement UI components.

## Scope

- Research of aikuaa.ai: verify and document the ACTUAL typography used (including whether Manrope / DM Sans / DM Mono are really used); verify the real color palette; spacing, radius, shadows, animation style, tone, and component patterns.
- Define a typed design token specification covering: colors, typography (family, weight, size scale), spacing scale, border-radius scale, shadows, and animation/transition tokens.
- Produce brief documentation capturing the visual identity rationale.

## Out of scope

- UI screens, components, or navigation.
- Expo project setup.
- Theme-provider wiring (consumed by PR-02).

## Dependencies

None — this is the first PR in the sequence. All subsequent PRs that consume design tokens depend on this one.

## Likely files or modules

- `docs/brand-research.md`
- `src/theme/tokens/*`

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

- Brand research depends on the current state of https://aikuaa.ai — the site content may differ from assumptions (e.g., fonts may not be Manrope/DM Sans/DM Mono). Document what is actually found and make explicit decisions.
- Token decisions here cascade into every subsequent PR; changes later are expensive.
