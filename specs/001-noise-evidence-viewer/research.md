# Research: Noise Evidence Viewer

## Findings

### Decision: Use Vite + TypeScript with minimal dependencies
- Rationale: Fast dev/build with minimal config; supports TypeScript, lint/format/type checks; keeps bundle small.
- Alternatives considered: Plain ESBuild (less dev server tooling), Webpack (heavier), pure script tags (harder testing/build hygiene).

### Decision: Static JSON loaded from local asset (no runtime API)
- Rationale: Constitution mandates static data; simplifies hosting and removes auth/state complexity.
- Alternatives considered: Fetch from API (out of scope), inline JS object (harder to swap data files).

### Decision: Sequential browser-initiated multi-downloads (no zip)
- Rationale: Preserves filenames without adding zip dependency; aligns with minimal deps and small data sets.
- Alternatives considered: Client-side zip bundling (adds dependency), server-side bundling (out of scope).

### Decision: Accessible modal with focus trap and keyboard navigation
- Rationale: Meets constitution (focus trap, ARIA labels, keyboard support); improves reliability for evidence review.
- Alternatives considered: Lightbox without focus management (fails accessibility), native dialog without polyfill (inconsistent support).

### Decision: Lazy-load media and cap initial payload <500 KB pre-modal
- Rationale: Meets performance goal; reduces mobile load; prevents heavy nested renders.
- Alternatives considered: Eager load all media (exceeds budget), placeholder stubs without lazy-load (worse UX on slow networks).

### Decision: Testing stack Vitest (unit) + Playwright (smoke/E2E)
- Rationale: Minimal, works with Vite/TS; covers gallery utilities and modal/download flows plus smoke for record open/downloads.
- Alternatives considered: Jest (heavier config), Cypress (heavier dependency set).
