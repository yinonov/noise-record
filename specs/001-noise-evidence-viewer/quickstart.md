# Quickstart: Noise Evidence Viewer

## Prerequisites
- Node.js 20+
- npm

## Setup
```bash
npm install
```

## Scripts
- `npm run dev` — start Vite dev server
- `npm run build` — production build
- `npm run lint` — ESLint + Prettier checks
- `npm run type-check` — TypeScript type checking
- `npm run test` — Vitest unit tests (gallery utilities, modal open/close/download logic)
- `npm run test:e2e` — Playwright smoke (record open, single/multi sequential downloads)

## Data
- Static JSON lives under `src/data/` (or `public/` if fetched). Must match `contracts/data-schema.json`.

## Usage
1. Run `npm run dev` and open the provided URL.
2. Browse categories/records with date/title and single/multiple badges.
3. Open a record to view/play media; navigate with keyboard or controls; close to return focus.
4. Download items individually or trigger sequential multi-downloads (filenames preserved).

## Performance & Accessibility Checks
- Initial payload before modal should remain <500 KB.
- Verify focus trap, keyboard navigation, ARIA labels in modal.
- Confirm lazy-loaded media and responsive layout at 360px width.

## Testing Focus
- Unit: gallery utilities, modal open/close/download handlers.
- E2E: record open, single download, multi sequential download, filename fidelity.

## Notes
- Avoid adding new runtime dependencies unless justified; keep bundle light.
