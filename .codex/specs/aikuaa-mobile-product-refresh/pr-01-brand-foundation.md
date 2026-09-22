# PR-01 — Official brand and interface foundation

## Objective

Establish Aikuaa's verified native brand assets, semantic design foundation, and reusable accessible mobile controls without changing service or context contracts.

## Scope

- Use official high-resolution owl/wordmark artwork; do not upscale the observed 80×80 header image for native icons.
- Configure applicable app icon, adaptive icon, splash image, favicon, and scheme metadata.
- Correct cream/navy palette and Manrope, DM Sans, DM Mono typography; define semantic surfaces and reusable controls with interaction states.

## Non-scope

Workspace or service contract changes, product shell/navigation redesign, localization beyond centralized Portuguese-primary copy, dark mode, authentication, and production backend behavior.

## Dependency and likely paths

- Dependency: none; first planned slice.
- Likely paths (probable only): `mobile/app.config.ts`, `mobile/assets/`, `mobile/src/theme/`, `mobile/src/components/`, related mobile tests. Confirm actual paths during implementation.

## Risk and contracts

Risk R1. No service/context contracts change. Preserve Expo/RN/Unistyles stack and current state ownership. Brand values: cream `#faf9f6/#f5f3ed/#ebe8df`; navy `#0a1628/#0f1f38/#162b4a/#1e3a61/#2a4d7a/#4a6b96/#7a96b8/#a8bdd4`; typography Manrope, DM Sans, DM Mono.

## Lifecycle and architecture gate

`0 → A → test → B → [C → test → D]* → E`; max three review rounds (B plus up to two D). Independent review required. No architecture gate for visual work alone; if implementation unexpectedly changes a shared contract, stop and route through the applicable gate before E. Later PRs wait for this PR's E.

## Acceptance and tasks

- Native app branding uses official source artwork/configuration and does not upscale the small header image.
- Semantic tokens and reusable controls present accessible interaction states; service/context behavior is unchanged.
- Exported app shows configured brand surfaces and applicable assets.
- Task: [T01.1](tasks.md#t011--native-brand-assets-and-semantic-interface-foundation).

## Verification

- `cd mobile && npm run lint`
- `cd mobile && npm run typecheck`
- `cd mobile && npm test -- --runInBand`
- `cd mobile && npx expo export`
- Observable: exported app uses Aikuaa branding and semantic light surfaces; controls expose visible/focus/disabled states. Inspect adaptive-icon cropping when native target is available; record otherwise as unverified.

## Review policy

Independent isolated code review; inspect behavior, scope, regression, brand fidelity, accessibility, responsive treatment, and asset provenance. Blocking findings alone enter C; retest before D. No self-approval.

## Phase E closure

Record current Verification and review verdict; append chronology; delta-sync by appending `deltas/delta-pr-01.md` and refreshing the living spec without erasing history; update Napkin through its authorized workflow if a verified lasting fact/decision changed. Do not begin PR-02 before E.

## Continuation handoff

Completed 2026-09-20. PR-01 is closed after Phase E. Final diff hash: `9268f48cfdf1f7faba00973195d001c26089adf5535aba459be47b167204c203`; environment hash: `cb15ca0c85677035a91549106a7764abb2146c69cdcd99a413cee718fcc5602f`. Final Verification passed: lint, typecheck, 42 suites / 176 tests, and Expo exports for web/iOS/Android. Review D approved with follow-ups and zero blockers; no architecture signal or gate. Follow-ups remain unverified: native release-build splash preview, representative Android adaptive-mask preview, VoiceOver/TalkBack, and native-device focus rendering. Next action: PR-02, which is now runnable; follow its required pre-implementation architecture gate before Phase A.

## Review result (append-only)

- Initial placeholder retained: Not started.
- 2026-09-20 — Phase B found three blocking native-asset findings; Phase C fixed only those findings. Phase D verdict: **Approved with follow-ups**, zero blockers, `architecture_signal: none`. No architecture gate required. Final diff hash: `9268f48cfdf1f7faba00973195d001c26089adf5535aba459be47b167204c203`.

## Final Verification

- `cd mobile && npm run lint` — pass.
- `cd mobile && npm run typecheck` — pass.
- `cd mobile && npm test -- --runInBand` — 42 suites / 176 tests pass.
- `cd mobile && npx expo export` — web, iOS, and Android exports pass.
- Proved: official high-resolution mark provenance ([source](https://www.aikuaa.ai/_astro/logo-aikuaa.CtzI_7L2.png)); opaque 1024×1024 iOS icon; 432×432 safe-zone Android foreground with cream background; transparent 820×654 splash mark at `imageWidth: 200`; web icon; exact cream/navy palette; semantic surfaces and compatibility aliases; accessible reusable Button/TextField at least 48px with default, pressed, focus, and disabled semantics; no service/context/navigation contract change.
- Unverified, non-blocking: native release-build splash preview, representative Android adaptive-mask preview, VoiceOver/TalkBack, and native-device focus rendering.
- Phase E delta: [delta-pr-01](deltas/delta-pr-01.md). PR-01 closed; PR-02 is next runnable.
