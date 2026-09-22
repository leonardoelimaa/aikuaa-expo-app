# Delta — PR-01 — Aikuaa brand research + design token specification

- **PR:** 01
- **Date:** 2026-09-08
- **Tier/model:** strong / ui-ux-designer (Phase A/C); impl-reviewer (B/D); tester certified the battery.

## Spec changes applied

What the spec promised for PR-01 is now fact:

- **Brand research verified and documented** in `docs/brand-research.md` (Spanish): the actual typography used by https://aikuaa.ai was confirmed (Manrope, DM Sans, DM Mono) and the real cream/navy palette was verified against the live site — no assumption of the source-document values.
- **Typed design token specification delivered** in `src/theme/tokens/`:
  - `colors.ts` — palette + semantic light/dark aliases (`paper`, `muted`, `line`, `proof`, `navyText`, `ink`, `surface`, `focus`, `headerBg`).
  - `typography.ts`, `spacing.ts`, `radius.ts`, `shadows.ts`, `animations.ts`.
  - `index.ts` — central re-export.
- **Semantic alias coverage tested** in `src/theme/tokens/__tests__/tokens.spec.ts` — all aliases in both light and dark, including `headerBg` as `{ color, opacity }`.
- **Minimal greenfield tooling**: `package.json`, `tsconfig.json`, `jest.config.js`.
- **Validation battery green** (test gate): `npm run lint`, `npx tsc --noEmit`, `npm run test`.
- **Reviews passed with no blockers**: Phase B code review = Approved with follow-ups (follow-ups closed during Phase E); architecture gate = Approved with recommendations.
- **Out of scope respected**: no UI screens, components, navigation, or Expo project setup created.

## Divergences found

- None significant. One representation detail: `headerBg` is delivered as a `{ color, opacity }` object rather than a raw alpha hex string, to keep color tokens RN-safe across the platform color type.

## New decisions / thresholds

- **RN-safe color token representation**: translucent colors (e.g., `headerBg`) are stored as `{ color, opacity }` and resolved at consumption time.
- **expo-font resolution contract deferred**: how typography family strings map to loaded fonts stays open until PR-02 wires expo-font.

## Remaining gaps

- `ColorToken` union + `resolveColor()` helper to normalize the color token contract — planned for PR-02 when Unistyles consumes the tokens.
- Precise `expo-font` adapter contract for typography family strings — PR-02.
- Breakpoints / z-index / elevation tokens — deferred until an actual component needs them.