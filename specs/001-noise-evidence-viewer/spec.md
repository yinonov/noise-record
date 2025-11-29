# Feature Specification: Noise Evidence Viewer

**Feature Branch**: `001-noise-evidence-viewer`  
**Created**: 2025-11-29  
**Status**: Draft  
**Input**: User description: "Build a temporary noise-evidence viewer: list categories/records with date/title and single/multiple badge; clicking opens an accessible modal to view/play media (images/videos), navigate multiples, and download each or all. Data comes from static JSON; graceful empty state. Responsive for mobile, minimal dependencies, lazy-load media where possible."  
**Constitution Alignment**: Temporary viewer with static JSON only, no auth or complex state. Listing shows dates/titles with single vs multiple badges; modal includes focus trap, keyboard navigation, ARIA labels, and mobile support. Media is lazy-loaded to keep assets light. Downloads preserve filenames for single and multi-item flows. Components are built with React 18 + Vite. Tests cover gallery utilities, modal open/close/download logic, and smoke/E2E for record open plus downloads.

## Clarifications

### Session 2025-11-29

- Q: How should multi-item downloads be packaged? → A: Use sequential browser-initiated downloads for each file, preserving filenames; no zip bundling/dependency.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Review Evidence List (Priority: P1)

Users browse categories and records with clear date/title and a badge that distinguishes single vs multiple media items.

**Why this priority**: Without a clear list and badges, users cannot locate relevant evidence or know when more than one item exists.

**Independent Test**: Load the viewer with static JSON containing multiple categories/records and verify list rendering, badges, and empty-state handling without opening modals.

**Acceptance Scenarios**:

1. **Given** static JSON with categories/records, **When** the viewer loads, **Then** categories and records display with dates, titles, and badges indicating single vs multiple items.
2. **Given** missing or empty JSON, **When** the viewer loads, **Then** an empty-state message and stable layout appear with no console errors.

---

### User Story 2 - View & Navigate Media (Priority: P1)

Users open a record to view/play media in an accessible modal, navigate between multiple items, and close or return without losing context.

**Why this priority**: Viewing and navigating media is the core experience; accessibility requirements must be met to make evidence review reliable.

**Independent Test**: Select a record with multiple media items, open the modal, navigate via keyboard and controls, and close the modal, confirming focus returns to the triggering record.

**Acceptance Scenarios**:

1. **Given** a record with media, **When** the record is activated, **Then** an accessible modal opens with focus trapped, meaningful ARIA labels, and a close control that restores focus to the trigger.
2. **Given** a record with multiple media items, **When** the user uses keyboard or buttons to move next/previous, **Then** the correct media item loads (lazy-loaded) and is announced/visible without page scroll jumps.

---

### User Story 3 - Download Evidence (Priority: P2)

Users download individual media items or all media in a record while preserving filenames.

**Why this priority**: Downloading is necessary to share or archive evidence while keeping chain-of-evidence clarity via filenames.

**Independent Test**: From the modal or list, trigger single-item download and multi-item download, verifying filenames match the source JSON and all items are present.

**Acceptance Scenarios**:

1. **Given** a record with one media item, **When** the user downloads it, **Then** the saved file name matches the original filename from JSON.
2. **Given** a record with multiple media items, **When** the user triggers "download all," **Then** all items are downloaded with original filenames and no duplicates or omissions.

---

### Edge Cases

- Static JSON missing, empty, or malformed should show a graceful message without breaking layout or controls.
- Media item missing URL or unsupported type should show a fallback message while keeping navigation and close controls available.
- Downloads started while offline or failing should surface a clear error without leaving partial archives or hanging UI states.
- Lazy-loading on slow networks or in nested groups should not trigger multiple concurrent loads that freeze the UI; retry behavior must be bounded.
- Mobile viewports and screen rotations must keep modals readable and controls reachable without overflowing the screen.

## Requirements *(mandatory)*

Ensure requirements cover: static JSON as the only data source; consistent category/record layout with single vs multiple badges; accessible modal (focus trap, keyboard navigation, ARIA labels); responsive design; lazy-loading and lightweight assets; filename preservation for single and batched downloads; unit coverage for gallery utilities and modal open/close/download flows plus smoke/E2E for record open and downloads.

### Functional Requirements

- **FR-001**: Display categories and records from static JSON only; the list renders titles, dates, and badges indicating single vs multiple media items.
- **FR-002**: Provide a stable empty-state view when JSON is missing, empty, or malformed, with no blocking errors.
- **FR-003**: Support consistent date formatting across list and modal contexts; titles remain untruncated or gracefully truncated with full value accessible.
- **FR-004**: Enable opening a record into an accessible modal with focus trap, labelled controls, ESC support, and close actions that restore focus to the trigger.
- **FR-005**: Allow navigation between multiple media items via keyboard and on-screen controls without resetting modal context.
- **FR-006**: Render and play supported media types (images and videos) inside the modal with basic transport controls for video (play/pause/seek).
- **FR-007**: Lazy-load media assets so initial list load excludes media payloads; load each item on demand when brought into view or selected.
- **FR-008**: Provide responsive layouts for small viewports, ensuring list readability, modal fit on screen, and touch-friendly targets.
- **FR-009**: Offer single-item download from list or modal, preserving the original filename from the JSON source.
- **FR-010**: Offer "download all" for a record with multiple items via sequential browser-initiated downloads (no zip bundling), ensuring every file is included with its original filename and clear feedback on success/failure.
- **FR-011**: Avoid adding new dependencies unless they materially reduce risk/effort and are documented; lint/format/type checks must be runnable for the feature.
- **FR-012**: Provide deterministic tests covering media gallery utilities, modal open/close/download flows, and a smoke/E2E path for record open plus single/multi-downloads.

### Key Entities *(include if feature involves data)*

- **Category**: Grouping of records; attributes include id, title/name, optional description, records collection.
- **Record**: Noise evidence entry; attributes include id, title, date/time, list of media items, and derived badge for single vs multiple attachments.
- **Media Item**: Individual attachment; attributes include id, type (image/video), display name/title, source URL/path, duration (videos), and original filename used for downloads.
- **Download Request**: User action to fetch one or all media items; includes target record id and list of filenames expected.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can open a record and view the first media item within 2 seconds of clicking/tapping on mid-tier mobile hardware with standard connectivity.
- **SC-002**: Keyboard-only users can open the modal, navigate to next/previous media, and close it with focus restored to the trigger in 100% of tested flows.
- **SC-003**: Single-item downloads save with the exact filename from JSON in 100% of attempts; multi-downloads include all listed files with matching filenames.
- **SC-004**: Initial page load transfers exclude media payloads, keeping initial downloadable assets under 500 KB before any modal is opened.
- **SC-005**: Layout remains readable and scrollable without horizontal overflow at 360px viewport width, with all controls reachable via touch and keyboard.
