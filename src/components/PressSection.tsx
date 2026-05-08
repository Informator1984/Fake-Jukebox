import { useState } from 'react'
import { Filter } from 'lucide-react'
import type { AppMode } from '../types'
import { ARTICLES, GND_ARTICLES } from '../data'
import './PressSection.css'

interface Props { mode: AppMode }

type Tab = 'Alle' | 'Presse' | 'Rundfunk' | 'Online' | 'Debatte'
const TABS: Tab[] = ['Alle', 'Presse', 'Rundfunk', 'Online', 'Debatte']

const GND_FILTERS = ['Kolonialismus', 'Sklaverei', 'Karibik', 'Revolution', 'Erinnerungskultur']

export default function PressSection({ mode }: Props) {
  const isGnd = mode === 'gnd'
  const [activeTab, setActiveTab] = useState<Tab>('Alle')
  const [activeFilter, setActiveFilter] = useState<string | null>(null)
  const articles = isGnd ? GND_ARTICLES : ARTICLES

  const filtered = activeTab === 'Alle'
    ? articles
    : articles.filter(a => a.type === activeTab.toLowerCase())

  return (
    <div className="press-section">
      <div className="press-header">
        <h3 className="press-title">Pressespiegel</h3>
        <span className="press-subtitle">
          {isGnd
            ? 'ergänzt über das Netz der ARD-Normdaten'
            : 'Artikel und Beiträge zum Thema'}
        </span>
      </div>

      {isGnd && (
        <div className="press-filter-chips">
          {GND_FILTERS.map(f => (
            <button
              key={f}
              className={`filter-chip ${activeFilter === f ? 'filter-chip--active' : ''}`}
              onClick={() => setActiveFilter(activeFilter === f ? null : f)}
            >
              {f}
            </button>
          ))}
          <button className="filter-icon-btn"><Filter size={13} /></button>
        </div>
      )}

      <div className="press-tabs">
        {TABS.map(tab => (
          <button
            key={tab}
            className={`press-tab ${activeTab === tab ? 'press-tab--active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="press-articles">
        {filtered.map((art, i) => (
          <div key={art.id} className={`press-article ${i < filtered.length - 1 ? 'press-article--bordered' : ''}`}>
            <div className="article-num">{i + 1}</div>
            <div className="article-content">
              <button className="article-title">{art.title}</button>
              <div className="article-meta">
                <span className="article-date">{art.date}</span>
                {art.source && <span className="article-source">{art.source}</span>}
                <span className={`article-cat article-cat--${art.type}`}>{art.category}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="press-footer">
        <button className="press-all-link">Alle Artikel anzeigen →</button>
      </div>
    </div>
  )
}
