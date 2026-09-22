---
title: Napkin Index
type: navigation
status: active
date: 2026-09-08
---

# Navigation Map

Navigation layer for the project's long-term memory. Add one entry per concept with `type`, `tags`, `module`, a 1-2 line summary, and a `file#anchor` pointer.

## Módulo: mobile

| Tipo | Tags | Resumo | Local |
|------|------|--------|-------|
| architecture | mobile, expo, react-native, design-system, workspace-isolation | React Native + Expo frontend with mock-backed scoped service interfaces; refresh PR-01 added brand primitives, PR-02 made company/workspace context operational with scoped cancellation, and PR-03 added the guarded nested product shell. | `architecture.md#mobile` |
| decision | architecture, stack, ports-adapters, streaming, theming | DA-001: validated stack (Expo SDK 57/RN 0.87/Expo Router, Zustand+TanStack Query, Unistyles, Reanimated, FlashList), feature-based Ports & Adapters, batch-accumulator streaming. | `decisions.md#da-001` |
| decision | architecture, workspace, isolation, cancellation | DA-009: operational workspace context and commit-aware demo isolation. | `decisions.md#da-009` |
| state | complete | Feature `aikuaa-app-frontend` MVP complete; 9 PRs closed; PR-07 Phase 2 (conversations) deferred. | `current_state.md#mobile` |
| state | active | `aikuaa-mobile-product-refresh`: PR-01, PR-02, and PR-03 closed 2026-09-20; PR-04 is next. PR-03 delivered the guarded mobile shell and verified navigation lifecycle. | `current_state.md` |
