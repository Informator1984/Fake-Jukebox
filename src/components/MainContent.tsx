import { useState } from 'react'
import {
  TrendingUp, Filter, GitMerge, HelpCircle,
  Search, ChevronDown
} from 'lucide-react'
import ResultCard from './ResultCard'
import ChatWidget from './ChatWidget'
import ReadingHelper from './ReadingHelper'
import VideosSection from './VideosSection'
import PressSection from './PressSection'
import { STANDARD_CARDS, GND_CARDS } from '../data'
import type { AppMode } from '../types'
import './MainContent.css'

interface Props { mode: AppMode; query: string }

const TABS_STANDARD = [
  { label: 'Mehr dazu', icon: TrendingUp },
  { label: 'Genauer suchen', icon: Filter },
  { label: 'Ähnliche Themen', icon: Search },
  { label: 'Zusammenhänge', icon: GitMerge },
  { label: 'Hilfe bei 0 Treffern', icon: HelpCircle },
]

const TABS_GND = [
  { label: 'Suchraum erweitern', icon: TrendingUp },
  { label: 'Suche einschränken', icon: Filter },
  { label: 'Ähnliche Entitäten', icon: Search },
  { label: 'Netzwerk anzeigen', icon: GitMerge },
  { label: 'Nulltreffer-Hilfe', icon: HelpCircle },
]

export default function MainContent({ mode, query }: Props) {
  const [activeTab, setActiveTab] = useState(0)
  const isGnd = mode === 'gnd'
  const tabs = isGnd ? TABS_GND : TABS_STANDARD
  const cards = isGnd ? GND_CARDS : STANDARD_CARDS

  return (
    <main className="main-content">
      <div className="main-tab-bar">
        <div className="main-tabs">
          {tabs.map((tab, i) => {
            const Icon = tab.icon
            return (
              <button
                key={i}
                className={`main-tab ${activeTab === i ? 'main-tab--active' : ''}`}
                onClick={() => setActiveTab(i)}
              >
                <Icon size={13} />
                {tab.label}
              </button>
            )
          })}
        </div>
        <div className="main-sort">
          <span className="sort-label">Sortieren nach</span>
          <button className="sort-btn">
            Relevanz <ChevronDown size={13} />
          </button>
        </div>
      </div>

      <div className="main-scroll">
        <div className="main-inner">
          <div className="result-header">
            <div>
              <h1 className="result-title">
                {isGnd
                  ? `Suchraum für „${query}"`
                  : `Alles zu „${query}"`}
              </h1>
              <p className="result-subtitle">
                {isGnd
                  ? 'Ergebnisse gruppiert nach Entitätstypen'
                  : 'Wir haben die Ergebnisse für Sie sortiert.'}
              </p>
            </div>
            <div className="result-count">
              12.846 Ergebnisse in 56 Gruppen
            </div>
          </div>

          <div className="cards-grid">
            {cards.map(card => (
              <ResultCard key={card.id} card={card} />
            ))}
          </div>

          <div className="widgets-row">
            <ChatWidget mode={mode} />
            <ReadingHelper mode={mode} />
          </div>

          <div className="bottom-row">
            <VideosSection mode={mode} />
            <PressSection mode={mode} />
          </div>
        </div>
      </div>
    </main>
  )
}
