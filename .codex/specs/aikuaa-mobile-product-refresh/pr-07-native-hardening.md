# PR-07 — Native quality and release evidence

## Objective

Harden the experience across supported device sizes and accessibility settings, validate launch metadata/assets, and provide truthful reproducible quality evidence.

## Scope

- Small/large phone and tablet, safe area, keyboard, Android back, large text, reduced motion, contrast, touch targets, VoiceOver/TalkBack, adaptive-icon crop, and performance verification/fixes.
- Confirm launch metadata/assets and document supported platforms and reproducible checks.

## Non-scope

App Store/Play Store submission, signing, publishing, mandatory dark mode, or claims for targets not checked.

## Dependency and likely paths

- Dependency: PR-06 E.
- Likely paths (probable only): mobile screens/layouts, theme/accessibility behavior, app config/assets, E2E/accessibility checks and support notes. Confirm actual paths during implementation.

## Risk and contracts

Risk R1. No planned service contract changes. Light-only support is deliberate; do not claim dark support. Native/signing infrastructure may be absent; record exact unverified checks.

## Lifecycle and architecture gate

`0 → A → test → B → [C → test → D]* → E`; max three rounds; independent review. No architecture gate for visual multi-folder changes alone; any shared contract changes require re-triage. No later PR follows this final PR.

## Acceptance and tasks

- Required device, accessibility, motion, launch-asset and performance checks have reproducible evidence where available.
- Every unavailable check is explicitly unverified, never reported as passed. Supported platform claims match evidence; light-only is declared.
- Task: [T07.1](tasks.md#t071--deviceaccessibilityperformance-hardening).

## Verification

- `cd mobile && npm run lint`
- `cd mobile && npm run typecheck`
- `cd mobile && npm test -- --runInBand`
- `cd mobile && npx expo export`
- `maestro test mobile/e2e/flow.yaml` when available; otherwise mark unverified.
- Observable: inspect supported phone/tablet, safe areas, keyboard/back, accessibility settings, adaptive-icon crop, and performance. Record platform and availability for each.

## Review policy

Independent isolated review of evidence quality, regression, accessibility, launch metadata, scope, and supported-platform claims. Blocker-only fixes; tests before D; max three rounds.

## Phase E closure

Record full Verification/review evidence and unverified items; append chronology; append `deltas/delta-pr-07.md` and refresh living spec; update Napkin for lasting verified changes. Complete feature only after E, delta-sync, and memory update are complete; do not submit/publish.

## Continuation handoff

Placeholder — populate at execution with phase, job/evidence references, hashes, gates, remaining work, and exact next action. No execution has started.

## Review result (append-only)

- Not started.
