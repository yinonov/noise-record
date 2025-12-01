import type { Category, RecordItem } from '../utils/dataLoader'
import { buildList, truncateTitle } from '../utils/gallery'
import './List.css'

type Props = {
  categories: Category[]
  onOpenRecord: (record: RecordItem) => void
  onDownloadRecord: (record: RecordItem) => void
}

export function List({ categories, onOpenRecord, onDownloadRecord }: Props) {
  const items = buildList(categories)

  if (items.length === 0) return <p className="status">No evidence available.</p>

  const recordMap = new Map<string, RecordItem>()
  categories.forEach((cat) => cat.records.forEach((r) => recordMap.set(r.id, r)))

  return (
    <section className="list">
      {items.map((category) => (
        <article key={category.id} className="category">
          <header className="category-header">
            <span className="category-title">{category.title}</span>
            <Badge label={category.badgeLabel} type={category.badge} />
          </header>
          <ul className="records">
            {category.items?.map((record) => {
              const fullRecord = recordMap.get(record.id)
              if (!fullRecord) return null
              const { display, full } = truncateTitle(record.title, 40)
              return (
                <li key={record.id} className="record">
                  <button className="record-main" onClick={() => onOpenRecord(fullRecord)}>
                    <span className="record-title" title={full}>
                      {display}
                    </span>
                    <span className="record-date">{record.date}</span>
                  </button>
                  <div className="record-actions">
                    <Badge label={record.badgeLabel} type={record.badge} />
                    <button
                      className="ghost"
                      onClick={() => onDownloadRecord(fullRecord)}
                      aria-label={`Download ${fullRecord.title}`}
                    >
                      Download
                    </button>
                  </div>
                </li>
              )
            })}
          </ul>
        </article>
      ))}
    </section>
  )
}

function Badge({ label, type }: { label: string; type: 'single' | 'multiple' }) {
  return <span className={`badge badge-${type}`}>{label}</span>
}
