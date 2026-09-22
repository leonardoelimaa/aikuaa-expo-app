# Delta — PR-02 — Expo project setup + navigation + theme wiring + test harness

- **PR:** 02
- **Date:** 2026-09-08
- **Tier/model:** strong / mobile-developer (Phase A/C); impl-reviewer (B/D); tester certified the battery; architect-agent ran the architecture gate.

## Spec changes applied

What the spec promised for PR-02 is now fact:

- **Expo scaffold delivered** in `mobile/`: `package.json` with Expo SDK 57 / React Native 0.86.3 (New Architecture), Expo Router 57, Unistyles v3, Reanimated 4.5.1, FlashList, expo-font, Jest + React Native Testing Library; plus `app.config.ts`, `tsconfig.json`, `.eslintrc.js`, `.prettierrc`, `babel.config.js`, `jest.config.js`.
- **Expo Router structure** with typed routes: `src/app/_layout.tsx`, `src/app/index.tsx`, `src/app/(app)/{_layout,index}.tsx`, and route groups `(event)` / `(company)` as the COMPANY-mode navigation posture (group layouts populated by PR-03).
- **Unistyles v3 theme wiring** consuming PR-01 tokens: `src/theme/theme.ts`, `unistyles.ts`, `ThemeProvider.tsx` (documented pass-through shim), `FontLoader.tsx`, `fonts.ts`, `resolveColor.ts`.
- **Test harness**: Jest + RNTL baseline with `ThemedSmoke.tsx` + tests; `__mocks__/react-native-unistyles.tsx` v3 mock.
- **E2E harness scaffold**: `mobile/e2e/flow.yaml` placeholder (Maestro), deferred to PR-09.
- **Validation battery green** (test gate): typecheck, lint, format:check, test, `expo-doctor` (21/21), `expo export`.
- **Reviews passed with no blockers**: Phase B code review = Approved with follow-ups (follow-ups closed during Phase E); architecture gate = Approved with recommendations.
- **Out of scope respected**: no business screens, no real backend.

## Divergences found

- **React Native version:** the spec assumed RN 0.87 alongside Expo SDK 57; implementation pinned **0.86.3**, the version actually paired with SDK 57. `react-native@0.87.0` removes `react-native/rn-get-polyfills` (which `@expo/metro-config@57` depends on) and `react-native-reanimated@4.5.1` declares peer compatibility only with RN 0.83–0.86. Recorded as **DA-003**; the project pins 0.86.3 until SDK 58.
- **Unistyles API generation:** PR-02 was planned against the Unistyles v2 API, but the dependency resolved to **v3.3.0**, where theming is configured via `StyleSheet.configure` without a React provider and runtime theme changes go through `UnistylesRuntime`. The code was migrated to the v3 API and the Jest mock rewritten for v3. Recorded as **DA-004**.

## New decisions / thresholds

- **DA-003 — React Native pinned to 0.86.3** for Expo SDK 57 compatibility (expo-doctor 21/21 + expo export green with the pin). Downstream PRs reference RN 0.86.3 until SDK 58.
- **DA-004 — Unistyles v3 no-provider theme wiring**: `StyleSheet.configure` + `ThemeProvider` as a documented pass-through shim; runtime changes via `UnistylesRuntime`; theme-aware components use `StyleSheet.create` / `useUnistyles`; tests reset the active theme between tests.
- **DA-005 — Maestro E2E deferred to PR-09**: `e2e/flow.yaml` stays a placeholder; E2E validation appears at the PR-09 gate (no real screens exist to exercise yet).

## Remaining gaps

- Real Maestro E2E main flow — PR-09 (DA-005).
- `(app)` and route-group (`(event)` / `(company)`) layouts are stubs to be populated with the splash → welcome → event context → chat flow — PR-03.