# Delta — PR-08: Polish

- **Date:** 2026-09-11
- **Tier/model:** strong / mobile-developer (Phase A/C), impl-reviewer (Phase B/D), architect-agent (architecture gate)
- **Status:** closed

## Spec changes applied

- Added Reanimated animations: message bubble entrance (`SlideInLeft`/`SlideInRight`), `SourcesCitations`/`ToolTransparency` expand/collapse (`FadeIn`/`FadeOut`/`LinearTransition`), screen content transition in `ChatScreen`.
- Completed accessibility pass: distinct accessibility labels for sources vs tool transparency, pressable source URLs, `accessibilityState` on composer input, verified touch targets ≥44 dp (send button, composer input, suggestion chips, panel headers), Dynamic Type-safe text sizing.
- Implemented responsive/tablet behavior: introduced `useBreakpoint` hook, chat bubble `maxWidth` adapts at `md`/`lg`, `ChatScreen` content centers with `maxWidth: theme.breakpoints.md` on tablets.
- Replaced `FlatList` with `@shopify/flash-list` `FlashList` in `ChatMessageList`, plus `getItemType` and stable `StreamingFooter`.
- Extracted `markdownParser.ts` and memoized `parseMarkdown(content)` in `RichMessageContent` with `useMemo`.
- Addressed PR-07 follow-up: `ChatScreen.handleSend` and `handleRetry` now reset `isSending` in `finally` blocks.
- Added Jest mocks for `react-native-reanimated` and `@shopify/flash-list`.

## Divergences found

- No Markdown library dependency added; custom parser was extracted and memoized instead.
- `@shopify/flash-list@2.0.2` does not expose an `estimatedItemSize` prop, so the virtualization test asserts `getItemType`/`keyExtractor` and long-conversation rendering instead.
- `StreamingFooter` was extracted during the C/D correction loop to fix a Phase B blocker about inline `ListFooterComponent`.

## New decisions / thresholds

- `useBreakpoint` is the project's adapter over `react-native-unistyles` for breakpoint access; it should be treated as the single source of truth for responsive logic.
- `markdownParser.ts` is currently feature-local under `features/chat/components/response/`; promote to shared utils if non-chat features need Markdown.

## Remaining gaps / technical debt

- Gate Reanimated enter/layout animations on system reduced-motion preference.
- Add a test that mocks `scrollToEnd` to prove it is not called when only `streamingContent` changes.
- Consider stable streaming message object identity in `StreamingFooter` so parent memoization is not defeated.
- Verify FlashList `estimatedItemSize` behavior if upgrading to a version that supports it.
- Conversation history (PR-07 Phase 2) remains deferred.

## Handoff to PR-09

PR-09 (Demo / integration preparation + observability contract) finalizes the adapter-swap contract, analytics.track no-op, demo reset access for operators, packaged demo build, and Maestro E2E main flow. This is the final PR of the feature.