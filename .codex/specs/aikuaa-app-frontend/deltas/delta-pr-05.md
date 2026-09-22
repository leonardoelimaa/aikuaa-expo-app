# Delta — PR-05: Chat core

## Status
Closed (2026-09-09)

## What was implemented
- New feature module `mobile/src/features/chat/`:
  - `ChatScreen.tsx` — safe-area + keyboard-aware screen shell, wires list, composer, and welcome.
  - `ChatWelcome.tsx` — title, subtitle, tappable suggestion chips that trigger send.
  - `ChatComposer.tsx` — multi-line rounded TextInput, 44×44 send button, disabled when empty/whitespace, submit on send or native submit.
  - `ChatMessage.tsx` + `ChatMessageList.tsx` — user/AI message rendering (distinct styling), streaming message footer, thinking indicator, error banner, auto-scroll.
  - `ChatThinking.tsx` — three-dot pulse animation with "Aikuaa está analizando" label.
  - `useChat.ts` — hook that consumes `getServices().ai.streamMessage()` and implements 60 ms batch-accumulator streaming; handles `thinking`/`text`/`error`/`done`; ignores `companies` (out of scope).
  - `chatReducer.ts` — reducer actions: `sendMessage`, `appendStreaming`, `setThinking`, `setError`, `completeStreaming`, `resetStream`.
  - `types.ts` — `ChatState`, `ChatAction`, message factories.
  - Component + integration + reducer tests.
- Updated `mobile/src/app/(app)/chat.tsx` to render `ChatScreen`.

## Divergences from spec
- None significant; mock adapters from PR-04 were reused in place rather than creating a separate adapter layer.

## Accepted technical debt
- `ChatScreen.tsx` local `isSending` duplicates reducer state; will be derived from reducer in a follow-up polish pass.
- Auto-scroll on every streaming-content/thinking change may over-fire; throttle candidate for PR-08 polish.
- Message IDs generated with `Date.now() + Math.random()`; will be hardened before PR-07 (history/persistence).
- Magic numbers (44, 60, 120, 2000, 500) not yet extracted to named constants.

## Review history
- Phase B (round 1): Approved with follow-ups.
- Architecture gate: Approved with recommendations.
- No C/D loop required because there were no blocking issues.

## Validations
- `npm run lint` — 0 errors (3 pre-existing warnings)
- `npm run typecheck` — pass
- `npm run test` — 23 suites / 90 tests pass
- `npx expo export` — pass

## Handoff to PR-06
Rich chat responses (PR-06) will extend `ChatMessage` rendering to sources/citations, company cards, and structured responses; streaming pipeline and reducer actions remain stable.