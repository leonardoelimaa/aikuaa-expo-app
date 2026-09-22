# PR-02 — Expo project setup + navigation + theme wiring + test harness

- Status: planned
- Tier: strong
- Previous dependency: PR-01
- Merge order: 2
- Suggested specialized agent (Phase A/C): `mobile-developer`

## Objective

Initialize Expo SDK 57 / React Native 0.86.3 app with Expo Router, Unistyles wiring (consuming PR-01 tokens), verified fonts, lint/format, and test harness. The design system is IMPLEMENTED here.

## Scope

- Expo project scaffold with folder structure.
- Expo Router with typed routes.
- Unistyles provider wired to PR-01 design tokens.
- expo-font with fonts verified in PR-01.
- ESLint / Prettier configuration.
- Jest + React Native Testing Library + Maestro scaffold.

## Out of scope

- Business screens or real features.
- Real backend integration.

## Dependencies

PR-01 — consumes the design token specification and font/brand research to wire the theme provider and verify font loading.

## Likely files or modules

- `mobile/app.json`
- `mobile/app.config.ts`
- `mobile/package.json`
- `mobile/tsconfig.json`
- `mobile/.eslintrc`
- `mobile/src/app/**`
- `mobile/src/theme/**`

## Mandatory validations

- `npm run lint`
- `npx tsc --noEmit`
- `npm run test`
- `expo export` / `expo-doctor`

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

- Expo SDK version and React Native compatibility must be verified at implementation time.
- Font loading via expo-font must be validated on both iOS and Android at least.
