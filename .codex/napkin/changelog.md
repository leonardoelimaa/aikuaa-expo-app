# Changelog

_Record the history of changes here, newest first, grouped by date._

<!--

## _YYYY-MM-DD_

### _Fixed / Added / Changed / Closed — _short description_
- **What changed:** _description._
- **Why:** _motivation._
- **Files changed:** _list._
- **Tests/Validations:** _result._

-->

## 2026-09-20

### Closed — Aikuaa Mobile Product Refresh PR-03

- **What:** Delivered the guarded mobile product shell, honest demo entry, resolving/ready-inactive/ready-active lifecycle with stale-restore guards, nested Assistant/Conversations/Workspace tabs, stack Settings/workspace details, validated catalog IDs, truthful Conversations CTA, and one-way compatibility redirects.
- **Why:** Complete the planned enterprise entry and navigable product shell while preserving mock isolation and existing context ownership.
- **Impact:** No auth, network access, or durable persistence added. Native/device Maestro, VoiceOver, and TalkBack checks remain unverified.
- **Evidence:** Phase 0 4/4 suites and 20/20 tests; final Jest 52/52 suites and 226/226 tests; typecheck PASS; lint PASS (0 errors, 18 warnings); Expo export PASS for web/iOS/Android; diff check PASS. Independent B Approved with no findings; architecture Approved with no conditions. Diff hash `635c05b299f689cca3b08b68a4c678190aa3969d95de55126151f47239db6bf4`. See `.codex/specs/aikuaa-mobile-product-refresh/deltas/delta-pr-03.md`.
- **Next:** PR-04 assistant workflow.

### Closed — Aikuaa Mobile Product Refresh PR-02

- What: Delivered branded workspace/conversation IDs, operational company-only workspace context, deterministic Acme/Beta fixtures, scoped service/query behavior, immutable conversation ownership, and stale-work isolation through cancellable create/save commit boundaries. Retired operational event mode; compatibility adapters remain unreachable.
- Why: Make the enterprise demo context deterministic and prevent stale cross-workspace UI, query, and mutation results.
- Impact: PR-03 consumes workspace semantics. Future real adapters require server-side tenant authorization and cancellation/conditional writes. No durable persistence or production-auth claim.
- Evidence: 48 suites / 207 tests, lint, typecheck, Expo web/iOS/Android exports passed; review D and architecture closure approved. Final diff hash `81f5042edb0e92f5a65d422731520c0ff43b4474f0e4364659e7a225dde27bbb`; environment hash `4d3ffa4c20c15af4fe79391f8a56ac07ed99582310326c5e270c5bae11ceac12`.
- Next: PR-03.

### Closed — Aikuaa Mobile Product Refresh PR-01
- **What changed:** delivered official native brand assets, corrected semantic cream/navy tokens and compatibility aliases, and accessible reusable Button/TextField controls. PR-01 closed; PR-02 is next. No service/context/navigation contract changed.
- **Why:** complete the first brand and interface foundation slice of the mobile product refresh.
- **Files changed:** mobile app assets/configuration, theme and shared controls; `.codex/specs/aikuaa-mobile-product-refresh/**`.
- **Tests/Validations:** lint and typecheck passed; 42 suites / 176 tests passed; Expo web/iOS/Android exports passed. Native splash/adaptive-mask previews, VoiceOver/TalkBack, and native-device focus rendering remain unverified.

## 2026-09-11

- **2026-09-11 — Closed: Aikuaa AI Mobile Frontend MVP (PR-05 through PR-09)**
  - **What changed:** chat core (PR-05), rich chat responses (PR-06), chat states and retry (PR-07 core), premium polish (PR-08), demo/integration/observability (PR-09). Final suite: 38 suites / 163 tests passing; `npx expo export` green.
  - **Why:** deliver the first demonstrable MVP of the Aikuaa AI mobile assistant with mock-backed service interfaces and offline demo flow.
  - **Files changed:** `mobile/src/features/chat/**`, `mobile/src/dev/demo/**`, `mobile/src/services/**`, `mobile/docs/adapter-swap.md`, `mobile/e2e/flow.yaml`, `mobile/__mocks__/**`, etc.
  - **Tests/Validations:** lint 0 errors (3 pre-existing warnings), typecheck pass, 38 suites / 163 tests pass, `npx expo export` pass, Maestro E2E flow documented.

## 2026-09-09

### Closed — PR-04: Service architecture + mock adapters + demo reset
- **What changed:** typed service ports, mock adapters backed by in-memory stores, service registry, deterministic demo reset and AppContext multi-tenancy union for the frontend-only contract layer.
- **Why:** establish a stable frontend contract layer for the chat demo before PR-05, with real backend adapters swappable behind the same ports.
- **Files changed:** `mobile/src/services/**`, `mobile/src/stores/**`, `mobile/src/context/**`, `mobile/src/mocks/**`, `mobile/src/types/app.ts`.
- **Tests/Validations:** lint 0 errors, typecheck pass, 16 suites / 60 tests pass, expo export pass.

## 2026-09-19

### Changed — Canonical Codex project memory and specification layout
- **What changed:** migrated the canonical project memory and specification root from `.opencode/` to `.codex/`; preserved the Napkin and the historical `aikuaa-app-frontend` spec/evidence, including the original request as `source-request.pt.md`. OpenCode-only dependencies, package files, duplicated workflows, the skill catalog, the legacy template, and generated phase prompts were excluded from canonical Codex artifacts and moved to recoverable Trash by the root.
- **Why:** align repository-local SDD artifacts with Codex conventions without carrying obsolete OpenCode runtime/tooling.
- **Files changed:** `AGENTS.md`, `.gitignore`, `.codex/README.md`, `.codex/napkin/**`, and `.codex/specs/aikuaa-app-frontend/**`.
- **Tests/Validations:** documentation paths and retained artifacts are validated by the root; no application behavior or architecture contract changed.
