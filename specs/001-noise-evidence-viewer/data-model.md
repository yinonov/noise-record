# Data Model: Noise Evidence Viewer

## Entities

### Category
- id: string (unique)
- title: string
- description: string | null
- records: Record[]

### Record
- id: string (unique)
- categoryId: string (FK -> Category.id)
- title: string
- occurredAt: string (ISO date-time)
- media: MediaItem[]
- badgeType: "single" | "multiple" (derived: media length)

### MediaItem
- id: string (unique within record)
- type: "image" | "video"
- title: string
- source: string (path/URL to asset)
- durationSeconds: number | null (videos only)
- originalFilename: string (used for download)

### DownloadRequest (interaction)
- recordId: string
- mediaIds: string[] | "all"
- expectedFilenames: string[] (from media.originalFilename)

## Validation Rules
- Category.id, Record.id, MediaItem.id MUST be unique in scope; Record.categoryId MUST match an existing Category.
- occurredAt MUST be parseable ISO 8601.
- MediaItem.type determines required fields: videos require durationSeconds ≥ 0; images ignore durationSeconds.
- badgeType derived: "single" when media length = 1, else "multiple".
- originalFilename MUST be non-empty and used verbatim for downloads.

## Relationships
- Category has many Records.
- Record belongs to one Category and has many MediaItems.
- MediaItem belongs to one Record.
- DownloadRequest references a Record and one or many MediaItems.

## State & Lifecycle
- Data loaded once from static JSON at startup; no runtime mutations.
- Modal state: closed → open (with selected record/media) → closed (restores focus to trigger).
- Download flow: initiate → per-file download dispatched → success/fail feedback.

## Scale & Performance Assumptions
- Expected tens of categories/records and dozens of media items total.
- Media assets lazy-loaded; initial JSON and shell remain under 500 KB before media fetches.
