import './MediaViewer.css'
import type { MediaItem } from '../utils/dataLoader'

type Props = {
  media: MediaItem[]
  index: number
}

export function MediaViewer({ media, index }: Props) {
  const item = media[index]
  if (!item) return null

  if (item.type === 'video') {
    return (
      <video controls preload="metadata" className="media" data-testid="video">
        <source src={item.source} type="video/mp4" />
        <track kind="captions" src="" label="Captions placeholder" />
        Your browser does not support the video tag.
      </video>
    )
  }

  return <img className="media" src={item.source} alt={item.title} loading="lazy" data-testid="image" />
}
