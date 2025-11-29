# Implementation Plan: Noise Evidence Viewer

**Branch**: `001-noise-evidence-viewer` | **Date**: 2025-11-29 | **Spec**: specs/001-noise-evidence-viewer/spec.md
**Input**: Feature specification from `/specs/001-noise-evidence-viewer/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/scripts/bash/setup-plan.sh` for the execution workflow.

## Summary

Deliver a temporary, dependency-light noise-evidence viewer that lists categories/records from static
JSON with date/title and single vs multiple badges. Users open an accessible modal to view/play media,
navigate multiples, and download items individually or sequentially in bulk while preserving
filenames. Media is lazy-loaded; empty states are graceful; layouts are responsive and keyboard/ARIA
compliant.

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: TypeScript 5.x  
**Primary Dependencies**: React 18 + Vite (bundling/dev), ESLint, Prettier, TypeScript; Playwright/Vitest
for tests  
**Storage**: Static JSON files (local assets)  
**Testing**: Vitest for unit, Playwright for smoke/E2E  
**Target Platform**: Modern desktop/mobile browsers  
**Project Type**: Web (single frontend)  
**Performance Goals**: Initial payload <500 KB pre-modal; first media render within 2s on mid-tier
mobile; avoid unnecessary re-renders  
**Constraints**: Minimal runtime dependencies (React + Vite + TS); no auth/complex state; accessibility
required (focus trap, keyboard, ARIA); static/offline-friendly data  
**Scale/Scope**: Dozens of records/media items; short-lived viewer

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Simplicity: keep the viewer temporary, avoid auth/complex state, and stay within static JSON scope.
- Quality: include lint/format/type-check commands and keep dependency additions minimal and justified.
- Testing: list unit coverage for media gallery utilities and modal open/close/download logic, plus a
  smoke/E2E path for record open and single/multi-download flows.
- UX & accessibility: plan consistent category/record layout (date/title, single vs multiple badges),
  modal focus trap + keyboard navigation + ARIA labels, and mobile responsiveness.
- Performance: define lazy-loading for media, lightweight assets, and protections against costly
  nested renders.
- Downloads: document how single and batched downloads preserve filenames.
- Empty states: describe behavior for missing or empty JSON data.

Status: Gate satisfied. Plan uses static JSON only, no auth or complex state. Dependencies limited to
tooling (Vite/TS/ESLint/Prettier/Vitest/Playwright). Tests cover gallery utilities, modal
open/close/download flows, and smoke/E2E for record open plus single/multi (sequential) downloads.
Layouts include badges, date/title, focus trap, keyboard/ARIA, and responsive targets. Lazy-loading
used; payload budget <500 KB pre-modal. Downloads preserve filenames via sequential browser-initiated
flows. Empty/malformed JSON yields graceful state.

## Project Structure

### Documentation (this feature)

```text
specs/001-noise-evidence-viewer/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)
<!--
  ACTION REQUIRED: Replace the placeholder tree below with the concrete layout
  for this feature. Delete unused options and expand the chosen structure with
  real paths (e.g., apps/admin, packages/something). The delivered plan must
  not include Option labels.
-->

```text
src/
├── components/        # list, badges, modal, media viewer
├── data/              # static JSON, loaders
├── styles/            # shared styles/tokens
└── utils/             # gallery utilities, download helpers

tests/
├── unit/              # gallery utilities, modal open/close/download logic
└── e2e/               # smoke: record open, single/multi downloads
```

**Structure Decision**: Single frontend project with Vite + TypeScript under `src/` and tests under
`tests/unit` and `tests/e2e`. Static JSON lives in `src/data/` (or `public/` if needed for fetch).

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None | — | — |
