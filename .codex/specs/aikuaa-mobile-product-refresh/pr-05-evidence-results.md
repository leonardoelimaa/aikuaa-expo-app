# PR-05 — Answer evidence and enterprise results

## Objective

Make answer evidence and deterministic enterprise results a clear, accessible product signature, with proof bound to the answer that generated it.

## Scope

- Answer-bound citation preview/details and source excerpts.
- Read-only query presentation; deterministic result tables/cards; accessible tool/status disclosures.
- Clear mock/read-only labels and usable narrow-screen behavior.

## Non-scope

Real SQL/database execution, source ingestion, backend changes, or production analytics.

## Dependency and likely paths

- Dependency: PR-04 E.
- Likely paths (probable only): answer/rendering components, citation/source/query/result model adapters if required, tables/cards/status surfaces, public-interface/UI tests. Confirm actual paths during implementation.

## Risk and contracts

Risk R2. Evidence entities must remain bound to their producing message. Gate required if source/query/result contracts change.

## Lifecycle and architecture gate

`0 → A → test → B → [C → test → D]* → E`; max three rounds; independent review. Conditional source/query/result contract gate. No later PR before E.

## Acceptance and tasks

- Citation/source/query/tool/result content is bound to the originating answer; inspecting details does not reveal another message's evidence.
- Read-only query and deterministic results are clearly distinguished from actual execution.
- Tables/cards/status and evidence remain accessible and understandable at narrow widths.
- Task: [T05.1](tasks.md#t051--message-bound-proof-and-result-presentation).

## Verification

- `cd mobile && npm run lint`
- `cd mobile && npm run typecheck`
- `cd mobile && npm test -- --runInBand`
- `maestro test mobile/e2e/flow.yaml` when available; otherwise mark unverified.
- Observable: open evidence from one answer and verify citation, excerpt, query, tool, result association; test narrow layout and accessibility semantics.

## Review policy

Independent isolated review of evidence binding, contract changes, behavior, scope, visual hierarchy, accessibility, and regressions. Apply conditional gate; blocker-only fixes and test before D; max three rounds.

## Phase E closure

Record Verification/review/gate evidence; append chronology; append `deltas/delta-pr-05.md` and refresh living spec; update Napkin if lasting verified architecture changes. Do not begin PR-06 before E.

## Continuation handoff

Placeholder — populate at execution with phase, job/evidence references, hashes, gate decisions, remaining work, and exact next action. No execution has started.

## Review result (append-only)

- Not started.
