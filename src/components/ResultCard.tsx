import { Star, BookOpen, Users, MapPin, Building2, Lightbulb, ExternalLink } from 'lucide-react'
import type { CardData } from '../types'
import './ResultCard.css'

const ICON_MAP = {
  theme: Star,
  book: BookOpen,
  person: Users,
  place: MapPin,
  building: Building2,
  idea: Lightbulb,
}

const COLOR_CLASSES = {
  teal: 'card-icon--teal',
  purple: 'card-icon--purple',
  orange: 'card-icon--orange',
  yellow: 'card-icon--yellow',
}

interface Props {
  card: CardData
}

export default function ResultCard({ card }: Props) {
  const Icon = ICON_MAP[card.iconType]
  const colorClass = COLOR_CLASSES[card.color]

  return (
    <div className="result-card">
      <div className="card-header">
        <div className={`card-icon ${colorClass}`}>
          <Icon size={18} />
        </div>
        <div className="card-meta">
          <div className="card-title">{card.title}</div>
          <div className="card-desc">{card.description}</div>
        </div>
        <span className="card-count">{card.count}</span>
      </div>

      <div className="card-items">
        {card.items.map((item, i) => (
          <div key={i} className="card-item">
            {card.iconType === 'person' && (
              <div className="person-avatar">
                {item.title.charAt(0)}
              </div>
            )}
            {card.iconType === 'book' && (
              <div className="book-cover">
                <BookOpen size={14} />
              </div>
            )}
            <div className="item-content">
              <button className="item-title">{item.title}</button>
              {(item.author || item.year) && (
                <div className="item-meta">{item.author}{item.year && ` | ${item.year}`}</div>
              )}
              {item.subtitle && <div className="item-subtitle">{item.subtitle}</div>}
              {item.role && item.dates && (
                <div className="item-meta">{item.role} ({item.dates})</div>
              )}
              {item.gndId && !item.subtitle && !item.role && (
                <div className="item-gnd">GND {item.gndId}</div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="card-footer">
        {card.openLabel ? (
          <button className="card-link">
            {card.openLabel} <ExternalLink size={12} />
          </button>
        ) : (
          <button className="card-link">
            {card.viewAllLabel} →
          </button>
        )}
      </div>
    </div>
  )
}
