# Delta — PR-06: Rich chat responses

- **Date:** 2026-09-11
- **Tier/model:** standard / mobile-developer (Phase A), impl-reviewer (Phase B)
- **Status:** closed

## Spec changes applied

- Added a lightweight custom Markdown renderer (`RichMessageContent`) covering paragraphs, headers H1–H6, unordered/ordered lists, code blocks, inline code, links, bold, italic, and tables.
- Added `SourcesCitations` component with expand/collapse behavior for source list + URLs.
- Added `CompanyCard` component with logo/placeholder, name, industry, optional location/website/tags, description, and optional press callback.
- Added `StructuredResponse` component supporting `company`, `companyList`, and `comparisonTable` variants.
- Added `ToolTransparency` component with non-technical mock tool steps and expand/collapse behavior.
- Extended `ChatMessage` to render rich assistant content using the new response components.
- Added `lineHeights` token scale to the theme (`typography.ts`, `theme.ts`) to avoid hardcoded line heights in PR-06 components.
- Added component tests for each verification (6.1–6.5) plus integration coverage in `ChatMessage.test.tsx`.

## Divergences found

- No markdown library dependency was added; a custom renderer was implemented instead of `react-native-markdown-display` or similar. This keeps the bundle small but means Markdown coverage is intentionally scoped to the subset needed for the demo.
- `SourcesCitations` and `ToolTransparency` currently share the same visible label ("Cómo Aikuaa encontró esto"); screen-reader labels are also identical. This is acceptable for the MVP but should be differentiated before rollout.
- Source URLs are rendered as static text, not pressable links.
- Structured responses are passed as optional props into `ChatMessage` rather than via a richer `Message` model; this avoids changing the shared `Message` contract in PR-06 and leaves a clean integration point for PR-07/PR-09.

## New decisions / thresholds

- None requiring Napkin update. The `lineHeights` token scale is a minor design-token evolution, not an architectural decision.

## Remaining gaps / technical debt

- Differentiate accessibility labels for `SourcesCitations` vs `ToolTransparency`.
- Make source URLs pressable (`Linking.openURL`).
- Add `onError` fallback for `CompanyCard` remote logos.
- Consider horizontal scroll for wide comparison tables on small screens.
- Consider extracting a reusable `ExpandableSection` component for the two collapsible panels.
- Consider memoizing Markdown block parsing in `RichMessageContent`.
- Future: nested inline formatting and escaped Markdown characters.

## Handoff to PR-07

PR-07 (Conversations + states) can rely on the rich-response components and focus on conversation history, visual states (offline/error/empty/timeout/no-answer), retry logic, and mock persistence. The `Message` contract may be extended in PR-07 or PR-09 to carry sources/tools/structured data more naturally.