import './App.css'
import './styles/tokens.css'
import { useEffect, useState } from 'react'
import { List } from './components/List'
import { Modal } from './components/Modal'
import type { EvidenceData, RecordItem } from './utils/dataLoader'
import { loadEvidence } from './utils/dataLoader'
import { downloadAllSequential, downloadFile } from './utils/downloads'

type LoadState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; data: EvidenceData }

function App() {
  const [state, setState] = useState<LoadState>({ status: 'loading' })
  const [selected, setSelected] = useState<RecordItem | null>(null)
  const [mediaIndex, setMediaIndex] = useState(0)
  const [notice, setNotice] = useState<string | null>(null)

  useEffect(() => {
    loadEvidence().then((result) => {
      if (result.data) {
        setState({ status: 'ready', data: result.data })
      } else {
        setState({ status: 'error', message: result.error ?? 'Unknown error' })
      }
    })
  }, [])

  const categories = state.status === 'ready' ? state.data.categories : []
  const hasData = categories.length > 0

  const selectedMedia = selected ? selected.media[mediaIndex] : null

  if (state.status === 'loading') return <p className="status">Loading evidence…</p>
  if (state.status === 'error')
    return <p className="status error">Could not load evidence: {state.message}</p>

  const onOpenRecord = (record: RecordItem) => {
    setSelected(record)
    setMediaIndex(0)
  }

  const onNavigate = (direction: 'next' | 'prev') => {
    if (!selected) return
    const len = selected.media.length
    const nextIndex = direction === 'next' ? (mediaIndex + 1) % len : (mediaIndex - 1 + len) % len
    setMediaIndex(nextIndex)
  }

  const onDownloadSingle = (index: number) => {
    if (!selected) return
    const media = selected.media[index]
    downloadFile(media.source, media.originalFilename)
    setNotice(`Downloading ${media.originalFilename}`)
  }

  const onDownloadAll = async () => {
    if (!selected) return
    try {
      const urls = selected.media.map((m) => m.source)
      const names = selected.media.map((m) => m.originalFilename)
      await downloadAllSequential(urls, names)
      setNotice('Downloading all files…')
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Download failed')
    }
  }

  return (
    <main className="app-shell">
      <header className="app-header">
        <h1>Noise Evidence Viewer</h1>
        <p className="lede">Temporary viewer for static evidence records.</p>
      </header>
      {hasData ? (
        <List
          categories={categories}
          onOpenRecord={onOpenRecord}
          onDownloadRecord={(record) =>
            downloadFile(record.media[0].source, record.media[0].originalFilename)
          }
        />
      ) : (
        <p className="status">No evidence available.</p>
      )}
      {notice && <p className="status note">{notice}</p>}
      <Modal
        open={Boolean(selected)}
        record={selected}
        mediaIndex={mediaIndex}
        onClose={() => setSelected(null)}
        onNavigate={onNavigate}
        onDownloadSingle={onDownloadSingle}
        onDownloadAll={onDownloadAll}
      />
      {selected && selectedMedia && <div className="sr-only">Viewing {selectedMedia.title}</div>}
    </main>
  )
}

export default App
