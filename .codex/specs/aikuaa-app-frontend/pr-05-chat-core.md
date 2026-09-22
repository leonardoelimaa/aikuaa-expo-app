# PR-05 — Chat core

- Status: closed
- Tier: strong
- Previous dependency: PR-04
- Merge order: 5
- Suggested specialized agent (Phase A/C): `mobile-developer`

## Objective

Chat screen core wired to mock AIService.

## Scope

- Welcome state (initial empty chat screen).
- Suggested prompts.
- Multi-line keyboard-aware composer.
- User and AI message rendering.
- Thinking animation (streaming indicator).
- Time-sliced batch-accumulator streaming for AI responses.
- Chat state reducer / hook.

## Out of scope

- Sources, citations, company cards, structured responses (PR-06).
- Conversation history and state management (PR-07).
- Real backend.

## Dependencies

PR-04 — consumes the typed AIService interface and mock adapter to wire the chat screen to deterministic responses.

## Likely files or modules

- `mobile/src/features/chat/**`
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

- The time-sliced batch-accumulator streaming pattern is a key architectural decision; it must handle React Native render batching gracefully.
- Chat state reducer/hook design should be extensible enough for conversation history (PR-07) without premature abstraction.

## Review result

- Phase B (round 1): `Approved with follow-ups` — no blockers. Non-blocking follow-ups:
  - `ChatScreen.tsx` local `isSending` duplicates reducer state; will be derived from reducer in a follow-up polish pass.
  - Auto-scroll on every streaming-content/thinking change may over-fire; throttle candidate for PR-08 polish.
  - Message IDs generated with `Date.now() + Math.random()`; will be hardened before PR-07 (history/persistence).
  - Magic numbers (44, 60, 120, 2000, 500) not yet extracted to named constants.
- No C/D loop required — no blocking issues were raised.
- Architecture gate: `Approved with recommendations` — recommendations:
  - Keep the 60 ms batch-accumulator streaming pipeline and reducer actions stable so PR-06 can attach rich-response rendering without contract changes.
  - Harden message ID generation before PR-07 (conversation history/persistence).
  - Extract magic numbers (44, 60, 120, 2000, 500) to named constants to centralize chat tuning.
- Final status: closed 2026-09-09.
