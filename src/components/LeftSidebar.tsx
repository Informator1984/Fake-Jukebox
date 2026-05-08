import { useState } from 'react'
import { Info, ChevronDown, ChevronRight } from 'lucide-react'
import type { AppMode, ThemeTerm } from '../types'
import {
  STANDARD_CLOSER_TERMS,
  STANDARD_ALSO_IMPORTANT,
  STANDARD_RELATED,
  GND_NARROWER,
  GND_BROADER,
  GND_RELATED,
} from '../data'
import './LeftSidebar.css'

interface Props { mode: AppMode }

function TermList({ terms, expanded }: { terms: ThemeTerm[]; expanded: boolean }) {
  const visible = expanded ? terms : terms.slice(0, 5)
  return (
    <>
      {visible.map(t => (
        <button key={t.name} className="term-item">
          <span className="term-name">{t.name}</span>
          <span className="term-count">{t.count.toLocaleString('de')}</span>
        </button>
      ))}
    </>
  )
}

interface SectionProps {
  label: string
  count: number
  terms: ThemeTerm[]
  uppercase?: boolean
  defaultOpen?: boolean
}

function Section({ label, count, terms, uppercase, defaultOpen = true }: SectionProps) {
  const [open, setOpen] = useState(defaultOpen)
  const [showAll, setShowAll] = useState(false)

  return (
    <div className="sidebar-section">
      <button className="section-header" onClick={() => setOpen(!open)}>
        <span className={`section-label ${uppercase ? 'section-label--upper' : ''}`}>
          {label}
        </span>
        <span className="section-count">{count}</span>
        {open
          ? <ChevronDown size={14} className="chevron" />
          : <ChevronRight size={14} className="chevron" />
        }
      </button>
      {open && (
        <div className="term-list">
          <TermList terms={terms} expanded={showAll} />
          {terms.length > 5 && (
            <button className="show-more" onClick={() => setShowAll(!showAll)}>
              {showAll ? 'Weniger anzeigen' : 'Mehr anzeigen'}
            </button>
          )}
        </div>
      )}
    </div>
  )
}

function CollapsedRow({ icon, label, count }: { icon: string; label: string; count: number }) {
  const [open, setOpen] = useState(false)
  return (
    <button className={`collapsed-row ${open ? 'collapsed-row--open' : ''}`} onClick={() => setOpen(!open)}>
      <span className="collapsed-icon">{icon}</span>
      <span className="collapsed-label">{label}</span>
      <span className="collapsed-count">{count}</span>
      {open ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
    </button>
  )
}

export default function LeftSidebar({ mode }: Props) {
  if (mode === 'standard') {
    return (
      <aside className="left-sidebar">
        <div className="sidebar-title">
          <span>Passende Themen</span>
          <Info size={14} className="info-icon" />
        </div>

        <Section label="Genauer passend" count={5} terms={STANDARD_CLOSER_TERMS} />
        <Section label="Auch wichtig" count={7} terms={STANDARD_ALSO_IMPORTANT} />
        <Section label="Das passt auch dazu" count={6} terms={STANDARD_RELATED} />

        <div className="collapsed-rows">
          <CollapsedRow icon="🔖" label="Früher so genannt" count={4} />
          <CollapsedRow icon="📍" label="Orte dazu" count={8} />
          <CollapsedRow icon="📅" label="Zeit" count={6} />
          <CollapsedRow icon="👁" label="Was möchten Sie sehen?" count={10} />
        </div>

        <div className="sidebar-info-box">
          <div className="info-box-title">So ist das verbunden</div>
          <p className="info-box-text">
            Unser Wissen kommt aus vielen Bibliotheken, Archiven und Museen.
            Die Themen sind verknüpft – deshalb finden Sie hier mehr, als nur Ihren Suchbegriff.
          </p>
          <button className="info-box-link">Mehr dazu</button>
        </div>
      </aside>
    )
  }

  return (
    <aside className="left-sidebar">
      <div className="sidebar-title">
        <span>Semantische Navigation</span>
        <Info size={14} className="info-icon" />
        <ChevronDown size={14} className="chevron ml-auto" />
      </div>

      <Section label="ENGERE BEGRIFFE" count={5} terms={GND_NARROWER} uppercase />
      <Section label="WEITERE BEGRIFFE" count={7} terms={GND_BROADER} uppercase />
      <Section label="VERWANDTE BEGRIFFE" count={6} terms={GND_RELATED} uppercase />

      <div className="collapsed-rows">
        <CollapsedRow icon="" label="HISTORISCHE BEGRIFFE" count={4} />
        <CollapsedRow icon="" label="REGIONALE BEZÜGE" count={8} />
        <CollapsedRow icon="" label="ZEITRÄUME" count={6} />
        <CollapsedRow icon="" label="MEDIENARTEN" count={10} />
      </div>

      <div className="sidebar-info-box sidebar-info-box--gnd">
        <div className="info-box-title">GND-basiert</div>
        <p className="info-box-text">
          Diese Navigation basiert auf der Gemeinsamen Normdatei (GND) und
          vernetzt Personen, Orte, Themen, Werke und Körperschaften semantisch.
        </p>
        <button className="info-box-link">Mehr zur GND</button>
      </div>
    </aside>
  )
}
