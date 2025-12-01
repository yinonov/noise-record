import { describe, expect, it } from 'vitest'
import { formatDate, truncateTitle } from '../../src/utils/gallery'

describe('formatting', () => {
  it('formats ISO dates consistently', () => {
    expect(formatDate('2025-11-20T23:15:00Z')).toMatch(/Nov|2025/)
  })

  it('returns original string on bad date', () => {
    expect(formatDate('not-a-date')).toBe('not-a-date')
  })

  it('truncates long titles and keeps tooltip', () => {
    const long = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
    const { display, full } = truncateTitle(long, 20)
    expect(display.endsWith('…')).toBe(true)
    expect(full).toBe(long)
  })
})
