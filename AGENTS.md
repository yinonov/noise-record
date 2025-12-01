# Repository Guidelines

## Project Structure & Module Organization
- Root holds this guide and agent outputs; keep `.git` metadata intact.
- `.codex/prompts/` contains Speckit prompt packs—edit only when updating agent behaviors.
- `.specify/templates/` stores authoring templates for specs, plans, tasks, and agent files; `.specify/memory/` keeps process documentation.
- `.specify/scripts/bash/` provides the Spec-Driven workflow helpers. Feature work is expected under `specs/###-short-name/` with `spec.md`, `plan.md`, `tasks.md`, and optional `research.md`, `data-model.md`, `quickstart.md`, and `contracts/`.
- Application source/tests are not yet scaffolded; create language-appropriate `src/` and `tests/` inside the feature directory when implementation begins.

## Build, Test, and Development Commands
- `./.specify/scripts/bash/create-new-feature.sh "Add noise recorder"` — creates the next `specs/###-noise-recorder/` folder and (when git is present) a matching branch name suggestion.
- `./.specify/scripts/bash/setup-plan.sh` — copies the plan template into the current feature directory.
- `./.specify/scripts/bash/check-prerequisites.sh --json --include-tasks` — verifies required docs for the active feature branch; add `--paths-only` to print resolved paths.
- `./.specify/scripts/bash/update-agent-context.sh codex` — regenerates agent guides (including this file) from the latest `plan.md`; omit the argument to refresh all supported agents.
- Language/framework build and test commands should be captured in `plan.md` and mirrored in `quickstart.md` once code exists.

## Coding Style & Naming Conventions
- Branches follow `###-short-slug` (e.g., `001-noise-recorder`); scripts will warn otherwise.
- Feature directories mirror the branch name; doc filenames remain lowercase-kebab.
- Bash: prefer `set -euo pipefail`, 4-space indents, snake_case functions, and explicit `local` variables.
- Markdown: keep sections concise, follow template ordering, and avoid trailing whitespace.

## Testing Guidelines
- List planned tests and acceptance checks in `plan.md`; break execution steps into `tasks.md`.
- Name automated test files after the unit/feature (e.g., `noise_recorder_test.py`, `test_noise_recorder.js`) and keep them under `tests/` or the language’s standard path.
- Capture coverage or manual verification expectations in `quickstart.md` as the codebase appears; keep `check-prerequisites` passing before merges.

## Commit & Pull Request Guidelines
- Commit messages: short, imperative summaries prefixed with the feature number when applicable (`001: scaffold plan outline`); batch related changes together.
- PRs should link the corresponding spec directory/branch, describe scope and risk, and note any docs or scripts touched. Include screenshots or logs for tooling output when relevant.
- Before requesting review, ensure documentation files exist for the feature (`check-prerequisites`) and regenerate agent guides to keep assistants in sync.

## Active Technologies
- TypeScript 5.x + Vite (bundling/dev), ESLint, Prettier, TypeScript; no UI framework; optional (001-noise-evidence-viewer)
- Static JSON files (local assets) (001-noise-evidence-viewer)

## Recent Changes
- 001-noise-evidence-viewer: Added TypeScript 5.x + Vite (bundling/dev), ESLint, Prettier, TypeScript; no UI framework; optional
