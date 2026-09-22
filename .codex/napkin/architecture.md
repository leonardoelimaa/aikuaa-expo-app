# Project Architecture

## Overview

Aikuaa.ai is an AI assistant platform that answers questions about companies. This repo currently hosts the planning/spec artifacts for building a greenfield React Native + Expo MOBILE FRONTEND of the Aikuaa AI assistant (event demo first, later a corporate white-label assistant). The backend, web, and facial microservice do not yet exist in this repo; this initiative is FRONTEND ONLY.

## Modules

### 1. Mobile (`mobile/`) {#mobile}

Greenfield React Native + Expo (SDK 57 / RN 0.86.3 pinned, see DA-003) frontend of the Aikuaa AI assistant. iOS + Android, mobile-first and responsive (phones, tablets, eventual web). Feature-based Ports & Adapters connect UI, hooks/state, scoped service interfaces, and mock adapters. The operational demo context is company/workspace based; event adapters remain unreachable compatibility only.

Key elements:
- Expo Router (typed routes) with route groups for EVENT/COMPANY modes.
- Zustand for UI/session/chat state; TanStack Query for server state; React Context for service-port injection.
- Unistyles token theming; centralized design tokens (colors, typography, spacing, radius, shadows, animations) researched and VERIFIED from https://aikuaa.ai.
- Reanimated motion; FlashList long-list virtualization; expo-font (fonts verified on aikuaa.ai).
- Mock streaming via time-sliced batch accumulator (no per-token re-render).
- Service ports: AIService, ConversationService, EventService, CompanyService, AnalyticsService (mock adapters now, real later) — anti-over-abstraction applies.
- Tenancy: company-only operational AppContext owns a validated workspace and monotonic revision; WorkspaceId and ConversationId are stable and distinct.
- Deterministic demo reset clears transient/session/conversation state and restores workspace-partitioned fixtures.
- Tests: Jest + RNTL (unit/component/integration) + Maestro (E2E).

#### Mobile route groups

- `(app)` — authenticated/default shell: owns the core app chrome and the chat-first experience.
- `(event)` — isolated sub-shell for the EVENT mode (future), scoped out of the default shell.
- `(company)` — isolated sub-shell for the COMPANY mode (future), scoped out of the default shell.
- Every route group owns a `_layout.tsx` that defines its entry semantics and prevents route leaks between groups.

### 2. Web (`web/`) {#web}

Not present in this repo. Future admin/frontend surface. OUT OF SCOPE for the mobile frontend initiative.

### 3. Backend (`backend/`) {#backend}

Not present in this repo. Provider of the future Aikuaa AI services (RAG SQL, vector RAG, MCPs, HTTP tools, agents). OUT OF SCOPE and must remain untouched in the mobile frontend initiative.

### 4. Python Facial Microservice (`face_service/`) {#face-service}

Not present in this repo. OUT OF SCOPE for the mobile frontend initiative.

## Flows

### Enterprise workspace demo (operational)
Honest root entry -> guarded app Stack -> nested Assistant, Conversations, and Workspace tabs; Settings and workspace details remain stack screens. Lifecycle is resolving, ready-inactive, or ready-active, with AppContext and WorkspaceQuery owning their respective context. PR-03 adds the complete navigation surface. This mock isolation is not production authorization or durable persistence.

## Patterns and Conventions

- Feature-based folder structure: `src/features/{chat,conversations,events,companies,auth}`, `src/components/{ui,company,ai}`, `src/services/{api,ai,storage}`, `src/mocks`, `src/theme`, `src/stores`, `src/utils`.
- Ports & Adapters: service interfaces owned by UI consumers; mocks implement the same interfaces as future real HTTP adapters. Anti-over-abstraction: only interfaces at identified future integration boundaries.
- Centralized design tokens + centralized brand/business copy; no hardcoded colors/typography/tenant strings in components.
- The 2026-09-20 mobile product refresh PR-01 delivered official native brand assets, semantic cream/navy surfaces with compatibility aliases, and reusable accessible Button/TextField controls (minimum 48px); see `.codex/specs/aikuaa-mobile-product-refresh/deltas/delta-pr-01.md`.
- The 2026-09-20 refresh PR-02 made company/workspace context operational, scoped content ports and query keys, retired event-first operation, and added token/incarnation/AbortSignal isolation through the conversation commit boundary; see `.codex/specs/aikuaa-mobile-product-refresh/deltas/delta-pr-02.md`.
- The 2026-09-20 refresh PR-03 delivered the guarded mobile shell: honest root entry, nested Assistant/Conversations/Workspace tabs, stack Settings and workspace details, and a resolving/ready-inactive/ready-active lifecycle with stale-restore guards. It uses the existing AppContext and WorkspaceQuery ownership boundaries and adds no auth, network access, or durable persistence; see `.codex/specs/aikuaa-mobile-product-refresh/deltas/delta-pr-03.md`.
- Separated state: server / UI / session / chat (no single global store).
- White-label readiness = architecture note only (no theming plumbing now).
- Demo reset mechanism for consecutive on-device demos.

## Main Technologies

| Layer | Technology |
|------|-----------|
| Mobile | React Native 0.86.3 + Expo SDK 57 + Expo Router 57, TypeScript, Unistyles, Zustand, TanStack Query, Reanimated, FlashList, expo-font |
| Mobile testing | Jest + RNTL + Maestro |
| Web | _tbd (future)_ |
| Backend | _tbd (future)_ |
| ML Python | _tbd (future)_ |
| DevOps | EAS (future builds/updates) |
