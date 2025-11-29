<!--
Sync Impact Report
Version change: N/A → 1.0.0
Modified principles: (new) Simplicity for Temporary Noise Evidence Viewer; (new) Code Quality & Minimal Dependencies; (new) Testing Discipline for Media Gallery & Modal Flows; (new) Accessible UX & Layout Consistency; (new) Performance & Rendering Efficiency; (new) Data Boundaries & Empty States; (new) Download Fidelity
Added sections: Scope Boundaries & Non-Goals; Development Workflow & Quality Gates
Removed sections: none
Templates requiring updates: ✅ .specify/templates/plan-template.md; ✅ .specify/templates/spec-template.md; ✅ .specify/templates/tasks-template.md
Follow-up TODOs: none
-->
# Noise Record Constitution

## Core Principles

### Simplicity for Temporary Noise Evidence Viewer
Build only what the current noise-evidence viewer needs: lightweight structure, clear functions, and no
overbuilt abstractions. Keep scope intentionally narrow to avoid long-lived complexity and make the
temporary deliverable easy to reason about. Rationale: fast delivery with low maintenance overhead.

### Code Quality & Minimal Dependencies
Run linting, formatting, and type checks on every change; keep naming explicit and self-documenting.
Favor zero or low-dependency solutions; introduce third-party packages only when they materially
reduce risk or effort and are vetted. Rationale: clarity and safety for a small, time-boxed codebase.

### Testing Discipline for Media Gallery & Modal Flows
Provide unit coverage for media gallery utilities and modal open/close/download logic. Add a
lightweight smoke/E2E path that covers record open plus single and multi-download flows. Tests must
be deterministic; red-green cycles precede implementation. Rationale: protect critical evidence
handling.

### Accessible UX & Layout Consistency
Present categories and records with consistent date/title formatting and badges that distinguish
single versus multiple items. Modals must include a focus trap, keyboard navigation, and descriptive
ARIA labels. Designs remain usable on mobile viewports. Rationale: guarantee legible, accessible
evidence review.

### Performance & Rendering Efficiency
Lazy-load media whenever possible, keep assets small, and avoid expensive renders in nested groups.
Prefer simple view logic that minimizes re-renders. Rationale: maintain snappy viewing on constrained
devices.

### Data Boundaries & Empty States
Use static JSON as the sole data source; no live backends or dynamic fetchers. Handle missing or empty
datasets gracefully with clear messaging and stable layout. Rationale: reduce moving parts and keep
evidence handling predictable.

### Download Fidelity
Preserve original filenames for both single and batched downloads; avoid transformations that mask
source identity. Rationale: maintain chain-of-evidence clarity.

## Scope Boundaries & Non-Goals
No authentication, authorization, or complex state management layers will be added. Avoid patterns
that imply long-term productization; prefer straightforward flows aligned with the temporary viewer
scope. Document any necessary deviation with justification in plan.md before implementation.

## Development Workflow & Quality Gates
Plans, specs, and tasks must describe how lint/format/type checks run, which tests cover media gallery
utilities and modal open/close/download flows, and how smoke/E2E exercises record open plus download
paths. UX work must enumerate accessibility hooks (focus trap, keyboard support, ARIA labels) and
mobile responsiveness. Data and performance choices must confirm static JSON usage, lazy-loading
strategy, lightweight assets, and render efficiency. Download handling must state filename
preservation for single and multi-item cases.

## Governance
This constitution governs all repository work; deviations require explicit approval and justification
in plan.md and tasks.md. Amendments require updating this document and affected templates, documenting
changes in the Sync Impact Report, and bumping the version before merging. Compliance is reviewed
during plan/spec/tasks creation and at PR review, with checks covering simplicity, quality gates,
testing coverage, accessibility, performance, data boundaries, and download fidelity. Version policy:
MAJOR for incompatible governance changes or removed/redefined principles; MINOR for new principles or
materially expanded rules; PATCH for clarifications without behavioral change. Record ratification and
amendment dates in ISO format; proposals must include impact assessment and rollout steps.

**Version**: 1.0.0 | **Ratified**: 2025-11-29 | **Last Amended**: 2025-11-29
