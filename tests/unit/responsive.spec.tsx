import { render, screen } from '@testing-library/react'
import { List } from '../../src/components/List'
import type { Category } from '../../src/utils/dataLoader'

const categories: Category[] = [
  {
    id: 'cat',
    title: 'Category',
    description: null,
    records: [
      {
        id: 'rec',
        categoryId: 'cat',
        title: 'A record with a long title to test truncation and layout on small screens',
        occurredAt: '2025-11-20T23:15:00Z',
        media: [{ id: 'm1', type: 'image', title: 'Img', source: '/img.jpg', originalFilename: 'img.jpg' }],
      },
    ],
  },
]

describe('Responsive list', () => {
  it('renders badges and titles at small viewport widths', () => {
    const original = globalThis.innerWidth
    globalThis.innerWidth = 360
    render(
      <List
        categories={categories}
        onOpenRecord={() => {}}
        onDownloadRecord={() => {}}
      />
    )
    expect(screen.getByText(/Category/)).toBeInTheDocument()
    expect(screen.getAllByText(/Single item/).length).toBeGreaterThan(0)
    globalThis.innerWidth = original
  })
})
