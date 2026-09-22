# Delta — PR-07: Conversations + states

- **Date:** 2026-09-11
- **Tier/model:** standard / mobile-developer (Phase A), impl-reviewer (Phase B)
- **Status:** closed

## Spec changes applied

- Implemented core chat state components under `mobile/src/features/chat/components/states/`:
  - `OfflineIndicator` — banner when the app is offline.
  - `ErrorState` — configurable error UI for `OFFLINE`, `TIMEOUT`, `BACKEND_DOWN`, `NO_ANSWER`, and `AI_ERROR`, with optional retry button.
  - `EmptyState` — chat welcome/empty state using `ChatWelcome`.
  - `LoadingState` — inline loading indicator during streaming wait.
- Wired states into `ChatMessageList` and `ChatScreen`.
- Added `retryLastMessage` action to the chat reducer and `useChat` hook.
- Retry re-submits the last user message without duplicating it.
- Extended mock `ai.service.ts` with keyword triggers for `timeout` and `backend`/`servidor`.
- `no se`/`no sé` now produces a `NO_ANSWER` error instead of a silent reset.
- Added component and hook tests covering offline, timeout, backend-down, no-answer, empty state, loading, and retry transitions.
- Phase 2 tasks 7.5–7.7 (conversation list grouped by day, new conversation, reopen + mock persistence) deferred per the spec's deferral priority rule.

## Divergences found

- Phase 2 scope (7.5–7.7) was intentionally deferred to keep PR-07 `standard` and ensure PR-08 Polish remains in the first MVP.
- Mock keyword triggers (`timeout`, `backend`, `servidor`) were added directly to `ai.service.ts` as part of the mock adapter; no production contract changed.
- `NO_ANSWER` changed from a silent stream reset to an explicit `ErrorState`, which improves demonstrability.

## New decisions / thresholds

- None requiring Napkin update.

## Remaining gaps / technical debt

- `ChatScreen.handleSend` and `handleRetry` should reset `isSending` in a `finally` block to avoid a stuck disabled composer if the async call throws.
- Document mock keyword triggers clearly (comment or rename) before real backend integration.
- Consolidate duplicated offline/error copy and container styles between `OfflineIndicator` and `ErrorState`.
- Remove unnecessary `useMemo` in `ErrorState`.
- Consider making `EmptyState` title/subtitle configurable via props.
- Decide intentional behavior when offline coexists with non-OFFLINE errors (currently both can render).
- Phase 2 conversations remain pending for a future PR or Phase 2 initiative.

## Handoff to PR-08

PR-08 (Polish: animations, accessibility, responsive behavior, performance — FlashList, memoized Markdown, Reanimated transitions, Dynamic Type, touch targets, contrast) builds on the now state-rich chat experience. It must remain part of the first demonstrable MVP.