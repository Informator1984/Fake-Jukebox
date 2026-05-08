import { Info, Maximize2, Bookmark, Check } from 'lucide-react'
import NetworkGraph from './NetworkGraph'
import type { AppMode } from '../types'
import './RightPanel.css'

interface Props { mode: AppMode }

export default function RightPanel({ mode }: Props) {
  const isGnd = mode === 'gnd'

  return (
    <aside className="right-panel">
      <div className="rp-section rp-graph-section">
        <div className="rp-section-header">
          <span className="rp-section-title">{isGnd ? 'Wissensnetzwerk' : 'Was hängt zusammen?'}</span>
          <Info size={14} className="info-icon" />
          <button className="rp-fullbild-btn">
            <Maximize2 size={13} />
            Vollbild
          </button>
        </div>
        <div className="rp-graph-wrap">
          <NetworkGraph mode={mode} />
        </div>
      </div>

      {!isGnd && (
        <div className="rp-section">
          <div className="rp-section-header">
            <span className="rp-section-title">Kurz erklärt</span>
            <span className="gnd-id-badge">GND-ID: 4061765-1</span>
          </div>
          <div className="rp-entity-title">Haitianische Revolution</div>
          <p className="rp-entity-desc">
            Von 1791 bis 1804 erhoben sich versklavte Menschen in der französischen Kolonie
            Saint-Domingue für Freiheit und gegen Unterdrückung. 1804 entstand die unabhängige
            Republik Haïti – ein wichtiger Schritt für Gerechtigkeit und Menschenrechte.
          </p>
          <div className="rp-attr">
            <div className="rp-attr-label">Wichtige Begriffe</div>
            <div className="rp-tags">
              <span className="tag">Sklaverei (GND 4027967-7)</span>
              <span className="tag">Unabhängigkeit (GND 4123445-2)</span>
            </div>
          </div>
          <div className="rp-attr">
            <div className="rp-attr-label">Ähnliche Themen</div>
            <div className="rp-links">
              <a href="#" className="rp-link">Kolonialismus (GND 4027396-0)</a>
              <a href="#" className="rp-link">Emanzipation (GND 4034345-8)</a>
            </div>
          </div>
          <div className="rp-attr">
            <div className="rp-attr-label">Quellen</div>
            <a href="#" className="rp-link">Gemeinsame Normdatei (GND)</a>
          </div>
          <button className="rp-more-link">Mehr anzeigen →</button>
        </div>
      )}

      {isGnd && (
        <div className="rp-section">
          <div className="rp-section-header">
            <span className="rp-section-title">Entitätsinfo</span>
            <span className="gnd-id-badge">GND-ID: 4061765-1</span>
          </div>
          <div className="rp-entity-type-label">Haitianische Revolution (Sachbegriff)</div>
          <div className="rp-attr">
            <div className="rp-attr-label">Definition</div>
            <p className="rp-attr-text">
              Sklavenaufstand und Revolution in Saint-Domingue (1791–1804), der zur Abschaffung
              der Sklaverei und zur Unabhängigkeit Haitis als erstem unabhängigen Staat
              Lateinamerikas führte.
            </p>
          </div>
          <div className="rp-attr">
            <div className="rp-attr-label">Oberbegriff</div>
            <a href="#" className="rp-link">Revolution (GND 4010170-0)</a>
          </div>
          <div className="rp-attr">
            <div className="rp-attr-label">Engere Begriffe</div>
            <div className="rp-links">
              <a href="#" className="rp-link">Sklavenaufstand (GND 4034552-0)</a>
              <a href="#" className="rp-link">Unabhängigkeit (GND 4123456-2)</a>
            </div>
          </div>
          <div className="rp-attr">
            <div className="rp-attr-label">Quelle</div>
            <a href="#" className="rp-link">Gemeinsame Normdatei (GND)</a>
          </div>
          <button className="rp-more-link">Eintrag im GND-Katalog öffnen →</button>
        </div>
      )}

      <div className="rp-section rp-search-section">
        <div className="rp-section-header">
          <span className="rp-section-title">{isGnd ? 'Ihre Suche im Blick' : 'Ihre Suche'}</span>
        </div>
        <div className="rp-search-attrs">
          <div className="rp-search-row">
            <span className="rp-search-key">{isGnd ? 'Suchanfrage:' : 'Suchbegriff:'}</span>
            <span className="rp-search-val">Haitianische Revolution</span>
          </div>
          <div className="rp-search-row">
            <span className="rp-search-key">{isGnd ? 'Suchraum:' : 'Suchbereich:'}</span>
            <span className="rp-search-val">
              GND (alle Inhalte)
              {isGnd && <span className="gnd-active-badge"><Check size={10} /> aktiv</span>}
            </span>
          </div>
          <div className="rp-search-row">
            <span className="rp-search-key">{isGnd ? 'Letzte Aktualisierung:' : 'Zuletzt aktualisiert:'}</span>
            <span className="rp-search-val">heute, 09:18</span>
          </div>
        </div>
        <button className="rp-save-btn">
          <Bookmark size={13} />
          Suche speichern
        </button>
      </div>
    </aside>
  )
}
