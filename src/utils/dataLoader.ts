export type EvidenceData = {
  categories: Category[]
}

export type Category = {
  id: string
  title: string
  description: string | null
  records: RecordItem[]
}

export type RecordItem = {
  id: string
  categoryId: string
  title: string
  occurredAt: string
  media: MediaItem[]
}

export type MediaItem = {
  id: string
  type: 'image' | 'video'
  title: string
  source: string
  durationSeconds?: number | null
  originalFilename: string
}

export type LoadResult = {
  data: EvidenceData | null
  error?: string
}

export async function loadEvidence(): Promise<LoadResult> {
  try {
    const response = await fetch('/data/evidence.json')
    if (!response.ok) {
      return { data: null, error: `Failed to load data: ${response.status}` }
    }
    const json = (await response.json()) as unknown
    if (!validateEvidence(json)) {
      return { data: null, error: 'Invalid data format' }
    }
    const data = json as EvidenceData
    return { data }
  } catch (error) {
    return { data: null, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

export function validateEvidence(json: unknown): boolean {
  if (!json || typeof json !== 'object') return false
  const root = json as { categories?: unknown }
  if (!Array.isArray(root.categories)) return false
  return root.categories.every((category) => validateCategory(category))
}

function validateCategory(category: unknown): boolean {
  if (!category || typeof category !== 'object') return false
  const c = category as Category
  return (
    typeof c.id === 'string' &&
    typeof c.title === 'string' &&
    Array.isArray(c.records) &&
    c.records.every((record) => validateRecord(record))
  )
}

function validateRecord(record: unknown): boolean {
  if (!record || typeof record !== 'object') return false
  const r = record as RecordItem
  return (
    typeof r.id === 'string' &&
    typeof r.categoryId === 'string' &&
    typeof r.title === 'string' &&
    typeof r.occurredAt === 'string' &&
    Array.isArray(r.media) &&
    r.media.length > 0 &&
    r.media.every((media) => validateMedia(media))
  )
}

function validateMedia(media: unknown): boolean {
  if (!media || typeof media !== 'object') return false
  const m = media as MediaItem
  const typeValid = m.type === 'image' || m.type === 'video'
  const durationValid =
    m.durationSeconds === undefined ||
    m.durationSeconds === null ||
    (typeof m.durationSeconds === 'number' && m.durationSeconds >= 0)
  return (
    typeof m.id === 'string' &&
    typeValid &&
    typeof m.title === 'string' &&
    typeof m.source === 'string' &&
    typeof m.originalFilename === 'string' &&
    durationValid
  )
}
