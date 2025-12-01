import { describe, expect, it } from 'vitest'
import { buildList, deriveBadge, formatDate, truncateTitle } from '../../src/utils/gallery'
import type { Category, MediaItem } from '../../src/utils/dataLoader'

describe('gallery utilities', () => {
  it('derives badge types', () => {
    const single: MediaItem = {
      id: '1',
      type: 'image',
      title: 'one',
      source: '/img1.jpg',
      originalFilename: 'img1.jpg',
    }
    const multiple: MediaItem = { ...single, id: '2' }
    expect(deriveBadge([single])).toBe('single')
    expect(deriveBadge([single, multiple])).toBe('multiple')
  })

  it('formats dates', () => {
    const formatted = formatDate('2025-11-20T23:15:00Z')
    expect(formatted).toMatch(/Nov|2025/)
  })

  it('truncates titles with tooltip value', () => {
    const long = 'a'.repeat(60)
    const { display, full } = truncateTitle(long, 10)
    expect(display.endsWith('…')).toBe(true)
    expect(full).toBe(long)
  })

  it('builds list with badges and dates', () => {
    const categories: Category[] = [
      {
        id: 'cat-1',
        title: 'Cat',
        description: null,
        records: [
          {
            id: 'rec-1',
            categoryId: 'cat-1',
            title: 'Record Title',
            occurredAt: '2025-11-20T23:15:00Z',
            media: [
              {
                id: 'm1',
                type: 'video',
                title: 'v',
                source: 's',
                originalFilename: 'f',
              },
            ],
          },
        ],
      },
    ]
    const list = buildList(categories)
    expect(list[0].items?.[0].badge).toBe('single')
    expect(list[0].items?.[0].date).toMatch(/2025/)
  })
})
