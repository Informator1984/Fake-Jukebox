import type { AppMode } from '../types'
import { NETWORK_NODES_STANDARD, NETWORK_NODES_GND } from '../data'
import './NetworkGraph.css'

const TYPE_COLORS = {
  person: '#9c27b0',
  place: '#f57c00',
  work: '#00897b',
  theme: '#546e7a',
  org: '#78909c',
}

const CENTER_COLOR = '#00897b'

interface Props { mode: AppMode }

function midpoint(ax: number, ay: number, bx: number, by: number) {
  return [(ax + bx) / 2, (ay + by) / 2]
}

export default function NetworkGraph({ mode }: Props) {
  const isGnd = mode === 'gnd'
  const nodes = isGnd ? NETWORK_NODES_GND : NETWORK_NODES_STANDARD

  const nodeMap = Object.fromEntries(nodes.map(n => [n.id, n]))

  const edges = [
    { from: 'louverture', to: 'center', label: isGnd ? 'befasst sich mit' : 'führte' },
    { from: 'center', to: 'haiti', label: isGnd ? 'wirkt in' : 'spielte sich ab in' },
    { from: 'work', to: 'center', label: isGnd ? 'verwandt mit' : 'ist ein' },
    { from: 'center', to: 'sklaverei', label: 'führte zu' },
    { from: 'kol', to: 'center', label: 'verwaltete' },
  ]

  const legendItems = [
    { label: 'Person', color: TYPE_COLORS.person },
    { label: 'Ort', color: TYPE_COLORS.place },
    { label: 'Werk', color: TYPE_COLORS.work },
    { label: 'Thema', color: TYPE_COLORS.theme },
    { label: isGnd ? 'Körperschaft' : 'Organisation', color: TYPE_COLORS.org },
  ]

  return (
    <div className="network-graph">
      <svg viewBox="0 0 376 360" width="100%" height="100%">
        <defs>
          <marker id="arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L0,6 L6,3 z" fill="#999" />
          </marker>
        </defs>

        {edges.map((edge, i) => {
          const from = nodeMap[edge.from]
          const to = nodeMap[edge.to]
          if (!from || !to) return null

          const dx = to.x - from.x
          const dy = to.y - from.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist === 0) return null

          const toR = to.isCenter ? to.r + 4 : to.r + 2
          const fromR = from.isCenter ? from.r + 4 : from.r + 2

          const startX = from.x + (dx / dist) * fromR
          const startY = from.y + (dy / dist) * fromR
          const endX = to.x - (dx / dist) * toR
          const endY = to.y - (dy / dist) * toR

          const [mx, my] = midpoint(startX, startY, endX, endY)

          return (
            <g key={i}>
              <line
                x1={startX} y1={startY}
                x2={endX} y2={endY}
                stroke="#b0bec5"
                strokeWidth="1.5"
                markerEnd="url(#arrow)"
              />
              <text
                x={mx}
                y={my - 4}
                fontSize="8"
                fill="#78909c"
                textAnchor="middle"
                dominantBaseline="auto"
              >
                {edge.label}
              </text>
            </g>
          )
        })}

        {nodes.map(node => {
          const color = node.isCenter ? CENTER_COLOR : TYPE_COLORS[node.type]
          const textColor = node.isCenter ? 'white' : (node.type === 'person' || node.type === 'place' ? 'white' : 'white')

          return (
            <g key={node.id} style={{ cursor: 'pointer' }}>
              <circle
                cx={node.x}
                cy={node.y}
                r={node.r}
                fill={color}
                opacity={node.isCenter ? 1 : 0.85}
                stroke="white"
                strokeWidth={node.isCenter ? 3 : 1.5}
              />
              {node.label.map((line, i) => {
                const lineCount = node.label.length
                const startY = node.y - ((lineCount - 1) * 7) / 2
                return (
                  <text
                    key={i}
                    x={node.x}
                    y={startY + i * 8}
                    fontSize={node.isCenter ? 8 : 7}
                    fontWeight={node.isCenter ? '700' : '500'}
                    fill={textColor}
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    {line}
                  </text>
                )
              })}
            </g>
          )
        })}
      </svg>

      <div className="network-legend">
        {legendItems.map(item => (
          <div key={item.label} className="legend-item">
            <span className="legend-dot" style={{ background: item.color }} />
            <span className="legend-label">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
