# Delta — PR-03 — App shell (splash, welcome, event context, navigation)

- **PR:** 03
- **Date:** 2026-09-08
- **Tier/model:** standard / mobile-developer (Phase A); impl-reviewer (B); tester certified the battery. Architecture gate not required (tier standard, no contract change).

## Spec changes applied

What the spec promised for PR-03 is now fact:

- **App shell delivered** in `mobile/src/app/`: root `_layout.tsx` wiring SafeAreaProvider / ThemeProvider / FontLoader / AppContextProvider.
- **Splash → Welcome flow**: `mobile/src/app/index.tsx` renders the Splash component then routes to `/welcome`; `mobile/src/app/welcome.tsx` resolves the demo event context and routes to `/(app)/chat`.
- **Event context preconfigured + deep-link ready**: `mobile/src/context/AppContext.tsx` + `resolveEvent.ts` provide a typed `AppContext` whose resolver (`resolveEvent`/`resolveDemoEvent`) can be driven by a future QR/deep-link `eventId` without architectural changes; the demo uses the preconfigured event, matching the spec's "no user-facing event selection" requirement.
- **Tab navigation**: `mobile/src/app/(app)/_layout.tsx` Tabs layout with Chat as primary tab plus History, Event and Settings screens (`{chat,history,event,settings}.tsx`).
- **Safe-area / keyboard handling**: wired at the shell level for a polished demo posture.
- **Components**: `mobile/src/components/splash/Splash.tsx`, `mobile/src/screens/welcome/Welcome.tsx`, `mobile/src/components/chat/ChatPlaceholder.tsx`.
- **Follow-ups from Phase B closed in Phase E**: `resolveEvent`/`resolveDemoEvent` wrapped in `useCallback` and added to `useMemo` deps (`AppContext.tsx`); `styles.inputPlaceholder.color` replaced with direct `theme.colors.muted` usage (`ChatPlaceholder.tsx`).
- **Tests for all verifications green** (test gate): lint (warnings only), typecheck pass, 28 tests pass, `expo export` pass.
- **Reviews passed with no blockers**: Phase B code review = Approved with follow-ups (follow-ups closed during Phase E).
- **Out of scope respected**: no chat message rendering, no conversation logic, no state management beyond navigation, no real APIs.

## Divergences found

- **None major.** The implementation kept the planned scope and the contracts established by PR-02; no structural or contract-level drift.

## New decisions / thresholds

- **None.** The Phase E follow-ups were code-quality adjustments, not architectural decisions.

## Remaining gaps

- Tab accessibility labels (VoiceOver/TalkBack) — PR-08 (Polish).
- Back-navigation behavior from the resolved (preconfigured) event state — revisit when the QR/deep-link entry point lands (PR-04 service architecture, later demo integration).
- Fully exploit Expo Router typed routes once the generated route types are stable.