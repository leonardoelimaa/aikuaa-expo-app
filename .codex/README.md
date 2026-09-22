# Canonical Codex Project Layout

- `.codex/napkin/` contains project memory. Begin with `index.md` to find the relevant context.
- `.codex/specs/<feature-slug>/` contains living specifications, tasks, sequential PR documents, chronology, deltas, and runtime state.
- Reusable skills and workflows live in the user's Codex skills installation; they are not vendored into this repository.
- Do not add `node_modules`, package manifests, duplicated workflow catalogs, or generated phase prompts under `.codex/`.
- Historical source requests may be retained inside their feature directory.
