import { useState } from 'react'
import { BookOpen, Upload, Play } from 'lucide-react'
import type { AppMode } from '../types'
import './ReadingHelper.css'

interface Props { mode: AppMode }

const TABS_STANDARD = ['Text ansehen', 'Abschnitte', 'Wichtige Begriffe', 'Zitate', 'Vergleichen']
const TABS_GND = ['Literatur-basiert', 'Dokumentationseinheiten', 'Schlüsselbegriffe extrahieren', 'Zitate & Stellen sammeln', 'Werke vergleichen']

const KEYWORDS = ['Sklavenaufstand', 'Plantagenwirtschaft', 'Kolonialismus', 'Unabhängigkeit', 'Toussaint', 'Jean-Jacques Dessalines', 'Karibik', 'Frankreich', 'Abolitionismus']

const GND_KEYWORDS = ['Sklavenaufstand', 'Plantagenwirtschaft', 'Kolonialismus', 'Unabhängigkeit', 'Revolution', 'Toussaint Louverture', 'Saint-Domingue']

export default function ReadingHelper({ mode }: Props) {
  const [activeTab, setActiveTab] = useState(0)
  const isGnd = mode === 'gnd'
  const tabs = isGnd ? TABS_GND : TABS_STANDARD

  return (
    <div className="reading-helper">
      <div className="rh-header">
        <BookOpen size={18} className="rh-icon" />
        <div className="rh-title-block">
          <div className="rh-title">{isGnd ? 'Dokumentarischer Literaturassistent' : 'Lese- und Analysehilfe'}</div>
          <div className="rh-subtitle">{isGnd ? 'Analysiert Literatur, extrahiert und Schlüsselwissen.' : 'Hilft beim Verstehen von Texten und sammelt wichtige Punkte.'}</div>
        </div>
        <button className="rh-action-btn">
          {isGnd ? <><Play size={12} /> Analyse starten</> : <><Upload size={12} /> Datei hochladen</>}
        </button>
      </div>

      <div className="rh-tabs">
        {tabs.map((tab, i) => (
          <button
            key={tab}
            className={`rh-tab ${i === activeTab ? 'rh-tab--active' : ''}`}
            onClick={() => setActiveTab(i)}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="rh-body">
        <div className="rh-selected-text">
          <span className="rh-selected-label">Ausgewählter Text: </span>
          <span className="rh-selected-val">C. L. R. James – Die haitianische Revolution (1938)</span>
        </div>

        {activeTab === 0 && (
          <div className="rh-content">
            <div className="rh-columns">
              <div className="rh-col">
                <div className="rh-col-title">{isGnd ? 'Dokumentationseinheiten (Auszug)' : 'Kurze Zusammenfassung'}</div>
                {isGnd ? (
                  <ol className="rh-list">
                    <li><strong>Aufbruch des Aufstands (1791)</strong><br /><span>Ursachen und erste Reaktionen auf die versklavte Bevölkerung.</span></li>
                    <li><strong>Krieg & Revolution (1791–1794)</strong><br /><span>Bürgerkrieg, internationale Verflechtungen, Rolle Frankreichs und Großbritanniens.</span></li>
                    <li><strong>Unabhängigkeit & Staatsgründung (1804)</strong><br /><span>Dessalines und die Erklärung der Unabhängigkeit.</span></li>
                    <li><strong>Nachwirkungen & globale Bedeutung</strong><br /><span>Einfluss auf Abolitionismus und Kolonialordnung.</span></li>
                  </ol>
                ) : (
                  <ul className="rh-list">
                    <li>Aufstand der Versklavten (1791) gegen die französische Kolonialherrschaft.</li>
                    <li>Wichtige Führung: Toussaint Louverture, später Jean-Jacques Dessalines.</li>
                    <li>1804 Ausrufung der Unabhängigkeit – erste freie Republik in Lateinamerika.</li>
                    <li>Nachwirkungen: Aufbau des Staates, Widerstand gegen neue Abhängigkeiten.</li>
                  </ul>
                )}
              </div>
              <div className="rh-col">
                <div className="rh-col-title">Schlüsselbegriffe</div>
                <div className="rh-keywords">
                  {(isGnd ? GND_KEYWORDS : KEYWORDS).map(k => (
                    <span key={k} className="tag">{k}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab !== 0 && (
          <div className="rh-empty">
            <p>Wählen Sie einen Text oder laden Sie eine Datei hoch, um diese Funktion zu nutzen.</p>
          </div>
        )}

        <div className="rh-footer">
          <button className="rh-full-link">Vollständige Analyse öffnen →</button>
        </div>
      </div>
    </div>
  )
}
