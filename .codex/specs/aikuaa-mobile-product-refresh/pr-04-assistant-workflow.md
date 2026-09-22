# PR-04 — Assistant conversation workflow

## Objective

Build a useful enterprise assistant interaction with workspace/agent context, Portuguese prompt starters, robust composer, and honest asynchronous mock behavior.

## Scope

- Show active workspace and agent identity; provide useful product-relevant prompt starters.
- Handle composer input, keyboard and scroll, pending/error/retry states.
- Support only mock attachment behavior that is actually implemented; disclose its simulated nature.

## Non-scope

Real AI/service execution, real upload, production agent execution, or changing contracts without a gate.

## Dependency and likely paths

- Dependency: PR-03 E.
- Likely paths (probable only): assistant/conversation screens and components, AI/Conversation adapters if needed, local UI/session state, UI/public-interface/E2E tests. Confirm actual paths during implementation.

## Risk and contracts

Risk R2. Keep TanStack Query/Zustand state ownership. A gate is required if request, agent, attachment, cancellation, or conversation contracts change.

## Lifecycle and architecture gate

`0 → A → test → B → [C → test → D]* → E`; max three rounds; independent review. Conditional contract architecture gate as above. No later PR before E.

## Acceptance and tasks

- Assistant identifies active workspace and agent; prompt starters are relevant and Portuguese-primary.
- Composer works with keyboard/scroll; pending, failure, retry, and deterministic mock response states are understandable.
- Unsupported attachments are unavailable or transparently simulated, never represented as uploaded.
- Task: [T04.1](tasks.md#t041--contextual-assistant-and-robust-composer).

## Verification

- `cd mobile && npm run lint`
- `cd mobile && npm run typecheck`
- `cd mobile && npm test -- --runInBand`
- `maestro test mobile/e2e/flow.yaml` when a Maestro/native target is available; otherwise explicitly mark unverified.
- Observable: select starter/type prompt, see context, exercise pending/error/retry and keyboard; workspace switching does not expose previous context.

## Review policy

Independent isolated review of assistant behavior, async lifecycle, mock honesty, keyboard/accessibility, scope, and regressions. Apply conditional architecture gate. Fix blockers only and rerun tests before D; max three rounds.

## Phase E closure

Record current test/review/gate evidence; append chronology; append `deltas/delta-pr-04.md` and refresh living spec; update Napkin if lasting verified architecture changes. Do not begin PR-05 before E.

## Continuation handoff

Placeholder — populate at execution with phase, job/evidence references, hashes, gate decisions, remaining work, and exact next action. No execution has started.

## Review result (append-only)

- Not started.
