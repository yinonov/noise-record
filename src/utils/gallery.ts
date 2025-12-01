import type { Category, MediaItem, RecordItem } from './dataLoader'

export type BadgeType = 'single' | 'multiple'

export function deriveBadge(media: MediaItem[]): BadgeType {
  return media.length === 1 ? 'single' : 'multiple'
}

export function formatDate(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return iso
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function truncateTitle(title: string, max = 40): { display: string; full: string } {
  if (title.length <= max) return { display: title, full: title }
  return { display: `${title.slice(0, max - 1)}…`, full: title }
}

export type ListItem = {
  id: string
  title: string
  date: string
  badge: BadgeType
  badgeLabel: string
  isCategory: boolean
  items?: ListItem[]
}

export function buildList(categories: Category[]): ListItem[] {
  return categories.map((category) => ({
    id: category.id,
    title: category.title,
    date: '',
    badge: deriveBadge(category.records.flatMap((r) => r.media)),
    badgeLabel: badgeLabel(deriveBadge(category.records.flatMap((r) => r.media))),
    isCategory: true,
    items: category.records.map(toRecordItem),
  }))
}

function toRecordItem(record: RecordItem): ListItem {
  const badge = deriveBadge(record.media)
  return {
    id: record.id,
    title: record.title,
    date: formatDate(record.occurredAt),
    badge,
    badgeLabel: badgeLabel(badge),
    isCategory: false,
  }
}

export function badgeLabel(badge: BadgeType): string {
  return badge === 'single' ? 'Single item' : 'Multiple items'
}
