---

description: "Task list for Noise Evidence Viewer implementation"
---

# Tasks: Noise Evidence Viewer

**Input**: Design documents from `/specs/001-noise-evidence-viewer/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Unit coverage for media gallery utilities and modal open/close/download flows plus a smoke/E2E path for record open and single/multi-download is REQUIRED by the constitution; extend with additional tests when the feature demands.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story. Ensure tasks also cover accessibility (layout consistency, badges, focus trap, keyboard/ARIA, mobile), performance (lazy-load media, lightweight assets, avoiding expensive nested renders), static JSON data handling with empty states, and download filename preservation.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/`, `tests/` at repository root
- Paths shown below assume single project - adjust based on plan.md structure

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Initialize project with Vite + TypeScript and lint/format/type-check configs in package.json
- [x] T002 Add base directories (`src/components`, `src/data`, `src/styles`, `src/utils`, `tests/unit`, `tests/e2e`)
- [x] T003 Configure ESLint + Prettier + TypeScript settings (`.eslintrc`, `.prettierrc`, `tsconfig.json`)
- [x] T004 Add npm scripts for dev/build/lint/type-check/unit/e2e in package.json

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

- [x] T005 Validate static JSON schema against `contracts/data-schema.json` and add sample data to `src/data/evidence.json`
- [x] T006 [P] Implement data loader utility for static JSON with graceful empty/malformed handling in `src/utils/dataLoader.ts`
- [x] T007 [P] Scaffold shared styles/tokens for layout, badges, modal spacing in `src/styles/tokens.css`
- [x] T008 [P] Implement accessibility helpers (focus trap, aria labeling helpers, keyboard handlers) in `src/utils/a11y.ts`
- [x] T009 [P] Implement download helper for single and sequential multi-download preserving filenames in `src/utils/downloads.ts`
- [x] T010 Set up Vitest config and first failing test harness in `tests/unit/setup.ts`
- [x] T011 Set up Playwright config and first failing smoke skeleton in `tests/e2e/setup.ts`

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Review Evidence List (Priority: P1) 🎯 MVP

**Goal**: Users browse categories/records with date/title and single vs multiple badges from static JSON; graceful empty state.

**Independent Test**: Load static JSON and verify list renders with badges and empty-state handling without opening modals.

### Tests for User Story 1 (REQUIRED per constitution) ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [x] T012 [US1] Unit tests for data loader and badge derivation in `tests/unit/list.spec.ts`
- [x] T032 [US1] Unit tests for date formatting, title truncation/tooltip, and 360px layout fit in `tests/unit/formatting.spec.ts`

### Implementation for User Story 1

- [x] T013 [P] [US1] Implement data parsing and badge derivation in `src/utils/gallery.ts`
- [x] T014 [P] [US1] Build category/record list component with date/title/badges and empty state in `src/components/List.tsx`
- [x] T015 [US1] Wire list component to static JSON loader in `src/components/App.tsx`
- [x] T033 [P] [US1] Add date formatter and title truncation with full-value tooltip in `src/utils/gallery.ts` and `src/components/List.tsx`

**Checkpoint**: User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - View & Navigate Media (Priority: P1)

**Goal**: Accessible modal to view/play media, navigate multiples, and close/return without losing context; lazy-load media.

**Independent Test**: Open a record with multiple media, navigate via keyboard/controls, and close with focus returning to trigger.

### Tests for User Story 2 (REQUIRED per constitution) ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [x] T016 [US2] Unit tests for modal open/close state, focus trap, keyboard navigation in `tests/unit/modal.spec.ts`
- [x] T017 [US2] Unit tests for media navigation and lazy-load triggers in `tests/unit/mediaNavigation.spec.ts`
- [ ] T034 [US2] Visual/regression checks for responsive layout at 360px and touch targets in `tests/unit/responsive.spec.ts`

### Implementation for User Story 2

- [x] T018 [P] [US2] Implement modal component with focus trap, ARIA labels, keyboard handlers in `src/components/Modal.tsx`
- [x] T019 [P] [US2] Implement media viewer (image/video) with lazy-load and basic video controls in `src/components/MediaViewer.tsx`
- [x] T020 [US2] Integrate modal trigger from list and restore focus on close in `src/components/App.tsx`
- [x] T021 [US2] Ensure nested render performance (avoid unnecessary re-renders) in `src/components/Modal.tsx`
- [x] T035 [P] [US2] Add responsive breakpoints and touch-friendly targets in `src/styles/tokens.css` and component styles

**Checkpoint**: User Story 2 should be fully functional and testable independently

---

## Phase 5: User Story 3 - Download Evidence (Priority: P2)

**Goal**: Download individual media or sequential multi-download while preserving filenames.

**Independent Test**: Trigger single download and sequential multi-download; verify filenames match JSON and all items present.

### Tests for User Story 3 (REQUIRED per constitution) ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T022 [US3] Unit tests for single and sequential multi-download helpers in `tests/unit/downloads.spec.ts`
- [x] T022 [US3] Unit tests for single and sequential multi-download helpers in `tests/unit/downloads.spec.ts`
- [x] T023 [US3] Smoke/E2E for record open and single/multi sequential downloads with filename checks in `tests/e2e/downloads.spec.ts`

### Implementation for User Story 3

- [x] T024 [P] [US3] Connect single download actions from list and modal using helper in `src/components/List.tsx` and `src/components/Modal.tsx`
- [x] T025 [US3] Implement multi-download trigger (sequential) with user feedback in `src/components/Modal.tsx`
- [x] T026 [US3] Ensure error handling and messaging for failed downloads in `src/components/Modal.tsx`

**Checkpoint**: User Story 3 should be fully functional and testable independently

---

## Phase N: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T027 [P] Documentation updates (spec/plan/quickstart) with final paths and commands in `specs/001-noise-evidence-viewer/`
- [x] T028 Code cleanup and dependency audit to confirm minimal deps in `package.json`
- [x] T029 Performance pass: verify payload budget, lazy-load behavior, and render profiling in `src/components/` (include 360px viewport check)
- [x] T030 [P] Accessibility audit (labels, focus order, keyboard support) in `src/components/`
- [x] T031 Run full test suite (lint, type-check, unit, e2e) and fix failures

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories proceed in priority order (P1 → P1 → P2)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: No dependencies on other stories
- **User Story 2 (P1)**: Depends on US1 list/selection to trigger modal
- **User Story 3 (P2)**: Depends on US2 modal/media context for downloads

### Within Each User Story

- Tests MUST be written and FAIL before implementation; required coverage includes gallery utilities,
  modal open/close/download logic, and record open/download flows
- Models/utilities before components
- Components before wiring/integration
- Story complete before moving to next priority

### Parallel Opportunities

- Setup tasks can run in parallel where marked [P]
- Foundational utilities/helpers/styles can proceed in parallel where marked [P]
- Within US1: T013/T014 can proceed in parallel; integration T015 follows
- Within US2: T018/T019 parallel; T020/T021 follow
- Within US3: T024 parallel to T025; T026 after wiring
- Docs/a11y/perf checks in Polish can parallel (T027, T030)

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1
   - Developer B: User Story 2
   - Developer C: User Story 3
3. Stories complete and integrate independently
