# Delta — PR-04: Service architecture + mock adapters + demo reset

## Status
Closed (2026-09-09)

## What was implemented
- Typed service ports in `mobile/src/services/types.ts`:
  - `AIService` with `streamMessage(request): AsyncIterableIterator<AIChunk>` and `searchCompanies(query)`.
  - `ConversationService` with `listConversations`, `createConversation`, `getConversation`, `saveConversation`, `deleteConversation`.
  - `EventService.getEventById`.
  - `CompanyService.searchCompanies` (with `limit`/`offset`) and `getCompanyById`.
  - `AnalyticsService.trackEvent`.
- Mock adapters for every port (`ai.service.ts`, `conversation.service.ts`, `event.service.ts`, `company.service.ts`, `analytics.service.ts`).
- In-memory module-level stores (`sessionStore.ts`, `conversationStore.ts`) and deterministic `resetDemoState()` in `demoStore.ts`.
- Service registry (`serviceRegistry.ts`) exposing `createMockServices()`, `getServices()`, and `resetServices()`.
- Typed multi-tenancy `AppContext` in `mobile/src/types/app.ts` with runtime guard `requireEventMode()`.
- React Context provider (`AppContext.tsx`) and demo-event resolver (`resolveEvent.ts`) for EVENT mode; COMPANY documented but non-operational.
- Mock datasets (`mobile/src/mocks/data/*`) covering success, thinking, companies, error, empty, offline, and no-answer AI response scenarios.
- Full test coverage: `services.test.ts`, `appContext.test.ts`, `demoReset.test.ts`, and existing `datasets.test.ts`.

## Divergences from spec
- Mock adapters are implemented as factory functions in the same files as the port files (`ai.service.ts`, etc.) rather than a separate `mocks/adapters/` directory. This is acceptable under anti-over-abstraction and matches the existing PR-04 implementation.
- `AIService.searchCompanies` overlaps with `CompanyService.searchCompanies`; kept as convenience for future AI retrieval scenarios, to be revisited in later PRs.

## Accepted technical debt
- Module-level mutable stores are temporary demo infrastructure; comments added to `conversationStore.ts` and `sessionStore.ts` noting replacement by persistent stores later.
- `DEMO_EVENT` in `resolveEvent.ts` and `demoEventContext` in `demoStore.ts` both encode the same demo constants; future PR may consolidate to a single source of truth.

## Review history
- Phase B (round 1): Required blocking fixes — corrupted mock data fields, invalid test syntax, inconsistent demo context shape.
- Phase C: Fixes applied; test gate re-certified green.
- Phase D (round 2): Approved with follow-ups.
- Architecture gate (round 1): Approved with recommendations.
- Architecture-gate fixes applied and revalidated in a second C/D round: circular dependency broken, `useServices` alias removed, `DEMO_EVENT` typed as `Readonly<EventAppContext>`, temporary-store comments added.

## Validations
- `npm run lint` — 0 errors (3 pre-existing warnings)
- `npm run typecheck` — pass
- `npm run test` — 16 suites / 60 tests pass
- `npx expo export` — pass

## Handoff to PR-05
Chat core (PR-05) can now rely on stable service contracts: consume `getServices().ai.streamMessage()` for streaming, `conversationService` for chat state, and `EventAppContext` from `useAppContext()` for event-only demo context.