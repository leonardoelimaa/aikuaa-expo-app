# PR-02 Delta — Enterprise Workspace Context

Date: 2026-09-20  
Status: Closed (Phase E)  
Baseline PR-01 diff hash: `9268f48cfdf1f7faba00973195d001c26089adf5535aba459be47b167204c203`  
Final PR-02 diff hash: `81f5042edb0e92f5a65d422731520c0ff43b4474f0e4364659e7a225dde27bbb`  
Environment hash: `4d3ffa4c20c15af4fe79391f8a56ac07ed99582310326c5e270c5bae11ceac12`

## Planned versus proven

| Spec intent | PR-02 evidence |
| --- | --- |
| Replace the future-only company context with operational workspace context | Branded WorkspaceId and ConversationId, validated company-only AppContext, explicit workspace selection, demo entry/reset, and monotonic revision are implemented. |
| Keep deterministic enterprise demo data scoped | Acme/Beta fixtures and scoped Company, AI, and Conversation ports; TanStack workspace-company query; immutable conversation ownership and defensive copies. |
| Prevent stale work from crossing workspace changes | Token, incarnation, and AbortController isolation; create/save mutations check cancellation atomically at the commit boundary. Mutation isolation 10/10. |
| Retire event mode as an operational product path | Event operational mode is retired. Legacy routing and event adapters/fixtures remain only as unreachable compatibility. |

## Contract delta

Company/workspace context is operational in the frontend demo and is the scope consumed by subsequent UI work. Scoped service calls and query identity must preserve the selected workspace; asynchronous conversation mutations must honor cancellation before commit. This defines frontend stale-work isolation only. It does not provide production tenant authorization, server-side access checks, or durable persistence.

## Verification and gates

- Phase 0 public-interface contract: 22/22 passed; mutation isolation: 10/10.
- Final validation: 48/48 suites and 207/207 tests; lint and typecheck passed.
- Expo web, iOS, and Android exports passed; diff-check clean. Existing React `act` console warnings were non-blocking.
- Independent review: B round 1 found blocking stale pending create/save commits; C fixed with signal/atomic checks and tests; post-C gate passed; D round 2 approved with no findings.
- Architecture close attempt 1 was interrupted solely by model-route change; attempt 2 found the same blocker; attempt 3 approved with no conditions.
- No native/device validation is claimed.

## Compatibility, non-goals, and memory impact

Event adapters, fixtures, and legacy redirects remain unreachable compatibility only. No production auth, backend tenant enforcement, or durable persistence is claimed. Napkin architecture and DA-009 now record the operational workspace boundary and the requirement that future real adapters enforce server-side authorization and cancellation or conditional writes.

Next runnable PR: PR-03.
