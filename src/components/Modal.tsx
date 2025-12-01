import { useEffect, useRef } from 'react'
import type { RecordItem } from '../utils/dataLoader'
import { badgeLabel, formatDate } from '../utils/gallery'
import { trapFocus } from '../utils/a11y'
import './Modal.css'
import { MediaViewer } from './MediaViewer'

type Props = {
  open: boolean
  record: RecordItem | null
  mediaIndex: number
  onClose: () => void
  onNavigate: (direction: 'next' | 'prev') => void
  onDownloadSingle: (mediaIndex: number) => void
  onDownloadAll: () => void
}

export function Modal({
  open,
  record,
  mediaIndex,
  onClose,
  onNavigate,
  onDownloadSingle,
  onDownloadAll,
}: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const closeRef = useRef<HTMLButtonElement | null>(null)

  useEffect(() => {
    if (open && containerRef.current) {
      const firstButton = containerRef.current.querySelector('button') ?? undefined
      const release = trapFocus(containerRef.current, firstButton)
      return () => release && release()
    }
    return undefined
  }, [open])

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (!open) return
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') onNavigate('next')
      if (e.key === 'ArrowLeft') onNavigate('prev')
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [open, onClose, onNavigate])

  if (!open || !record) return null

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal" ref={containerRef}>
        <header className="modal-header">
          <div>
            <p className="eyebrow">{formatDate(record.occurredAt)}</p>
            <h2>{record.title}</h2>
          </div>
          <div className="actions">
            <button onClick={() => onDownloadSingle(mediaIndex)}>Download</button>
            <button onClick={onDownloadAll}>Download all</button>
            <button ref={closeRef} onClick={onClose} aria-label="Close modal">
              Close
            </button>
          </div>
        </header>
        <div className="media-shell">
          <MediaViewer media={record.media} index={mediaIndex} />
        </div>
        <footer className="modal-footer">
          <span className="badge badge-multiple">{badgeLabel(record.media.length === 1 ? 'single' : 'multiple')}</span>
          <div className="nav">
            <button onClick={() => onNavigate('prev')} aria-label="Previous media">
              Prev
            </button>
            <button onClick={() => onNavigate('next')} aria-label="Next media">
              Next
            </button>
          </div>
        </footer>
      </div>
    </div>
  )
}
