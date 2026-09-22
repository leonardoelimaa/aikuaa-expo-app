# PR-06 — Conversation continuity

## Objective

Enable workspace-scoped conversation discovery and stable reopen/continue behavior with an explicit restart persistence contract.

## Scope

- Workspace-scoped conversation list with loading, empty, and error states.
- Reopen/continue conversations with stable identity; define and verify expected restart persistence.

## Non-scope

Production offline sync, backend persistence, cross-device sync, or conversation sharing.

## Dependency and likely paths

- Dependency: PR-05 E.
- Likely paths (probable only): conversation list/detail routes, ConversationService mock adapter, query/cache and local persistence integration, UI/public-interface/E2E tests. Confirm actual paths during implementation.

## Risk and contracts

Risk R2. Gate required for persistence or service-contract changes. No conversation or cache state may cross workspace boundaries.

## Lifecycle and architecture gate

`0 → A → test → B → [C → test → D]* → E`; max three rounds; independent review. Conditional persistence/service-contract gate. No later PR before E.

## Acceptance and tasks

- List reflects only the active workspace and exposes meaningful loading/empty/error states.
- Reopened conversations retain stable identity and continue behavior.
- Restart behavior is explicitly specified and testable; switching workspace isolates conversations.
- Task: [T06.1](tasks.md#t061--workspace-scoped-conversation-list-and-reopen-behavior).

## Verification

- `cd mobile && npm run lint`
- `cd mobile && npm run typecheck`
- `cd mobile && npm test -- --runInBand`
- `maestro test mobile/e2e/flow.yaml` when available; otherwise mark unverified.
- Observable: list/reopen/continue, switch workspace, and restart app; behavior matches declared persistence and never leaks cross-workspace items.

## Review policy

Independent isolated review of persistence, identity, isolation, contracts, navigation, accessibility, scope, and regressions. Apply conditional architecture gate; fix blockers only and retest before D; max three rounds.

## Phase E closure

Record Verification/review/gate evidence; append chronology; append `deltas/delta-pr-06.md` and refresh living spec; update Napkin if lasting verified architecture changes. Do not begin PR-07 before E.

## Continuation handoff

Placeholder — populate at execution with phase, job/evidence references, hashes, gate decisions, remaining work, and exact next action. No execution has started.

## Review result (append-only)

- Not started.
