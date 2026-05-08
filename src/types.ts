export type AppMode = 'standard' | 'gnd'

export interface ThemeTerm {
  name: string
  count: number
  gndId?: string
}

export interface ResultItem {
  title: string
  subtitle?: string
  gndId?: string
  author?: string
  year?: string
  role?: string
  dates?: string
  image?: string
}

export interface CardData {
  id: string
  title: string
  description: string
  count: number
  iconType: 'theme' | 'book' | 'person' | 'place' | 'building' | 'idea'
  color: 'teal' | 'purple' | 'orange' | 'yellow'
  items: ResultItem[]
  viewAllLabel: string
  openLabel?: string
}

export interface ChatMessage {
  id: string
  text: string
  time: string
  isBot: boolean
}

export interface Article {
  id: string
  title: string
  date: string
  category: string
  source?: string
  type: 'presse' | 'rundfunk' | 'online' | 'debatte'
}

export interface Track {
  title: string
  duration: string
  type: string
  src: string
}

export interface NetworkNode {
  id: string
  label: string[]
  type: 'person' | 'place' | 'work' | 'theme' | 'org'
  x: number
  y: number
  r: number
  isCenter?: boolean
}

export interface NetworkEdge {
  from: string
  to: string
  label: string
  labelOffset?: [number, number]
}
