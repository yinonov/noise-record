import { render, screen } from '@testing-library/react'
import { MediaViewer } from '../../src/components/MediaViewer'
import type { MediaItem } from '../../src/utils/dataLoader'

const media: MediaItem[] = [
  { id: 'm1', type: 'image', title: 'First', source: '/first.jpg', originalFilename: 'first.jpg' },
  { id: 'm2', type: 'image', title: 'Second', source: '/second.jpg', originalFilename: 'second.jpg' },
]

describe('MediaViewer navigation', () => {
  it('renders only the active media', () => {
    const { rerender } = render(<MediaViewer media={media} index={0} />)
    expect(screen.getByAltText('First')).toBeInTheDocument()
    rerender(<MediaViewer media={media} index={1} />)
    expect(screen.getByAltText('Second')).toBeInTheDocument()
  })

  it('supports lazy-loading attr on images', async () => {
    render(<MediaViewer media={media} index={0} />)
    const img = screen.getByTestId('image') as HTMLImageElement
    expect(img.getAttribute('loading')).toBe('lazy')
  })
})
