import { Search, X, Clock, Star, HelpCircle, User, Check, SlidersHorizontal } from 'lucide-react'
import type { AppMode } from '../types'
import './Header.css'

interface Props {
  query: string
  setQuery: (q: string) => void
  mode: AppMode
  setMode: (m: AppMode) => void
  aiActive: boolean
  setAiActive: (v: boolean) => void
}

export default function Header({ query, setQuery, mode, setMode, aiActive, setAiActive }: Props) {
  const isGnd = mode === 'gnd'

  return (
    <header className="header">
      <div className="header-logo">
        Quer<span className="logo-star">*</span>Find
      </div>

      <div className="header-center">
        <div className={`search-bar ${isGnd ? 'search-bar--gnd' : ''}`}>
          <Search size={16} className="search-icon" />
          <input
            className="search-input"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Suche..."
          />
          {query && (
            <button className="search-clear" onClick={() => setQuery('')}>
              <X size={15} />
            </button>
          )}
          {isGnd && (
            <div className="search-filter-btn">
              <SlidersHorizontal size={15} />
            </div>
          )}
        </div>

        {!isGnd && (
          <div className="header-pills">
            <button
              className={`pill pill--toggle ${aiActive ? 'pill--on' : ''}`}
              onClick={() => setAiActive(!aiActive)}
            >
              <span className="pill-dot" />
              KI-Assistent aktiv
            </button>
            <button className="pill pill--check">
              <Check size={12} />
              Gute Treffer
            </button>
          </div>
        )}

        {isGnd && (
          <div className="header-toggles">
            <label className="toggle-item">
              <span className="toggle-label">KI-Assistenten aktiv</span>
              <span className={`toggle-switch ${aiActive ? 'toggle-switch--on' : ''}`}
                onClick={() => setAiActive(!aiActive)}
              >
                <span className="toggle-knob" />
              </span>
            </label>
            <label className="toggle-item">
              <span className="toggle-label">GND-Suchraum aktiv</span>
              <span className="toggle-switch toggle-switch--on"
                onClick={() => setMode('standard')}
              >
                <span className="toggle-knob" />
              </span>
            </label>
          </div>
        )}
      </div>

      {!isGnd && (
        <button className="gnd-mode-btn" onClick={() => setMode('gnd')} title="GND-Modus aktivieren">
          GND-Modus
        </button>
      )}

      <nav className="header-nav">
        <button className="nav-item"><Clock size={18} /><span>Suchverlauf</span></button>
        <button className="nav-item"><Star size={18} /><span>Merkliste</span></button>
        <button className="nav-item"><HelpCircle size={18} /><span>Hilfe</span></button>
        <button className="nav-item"><User size={18} /><span>Anmelden</span></button>
      </nav>
    </header>
  )
}
