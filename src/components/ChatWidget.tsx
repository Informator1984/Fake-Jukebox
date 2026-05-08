import { useState } from 'react'
import { Bot, Send, RefreshCw } from 'lucide-react'
import type { AppMode, ChatMessage } from '../types'
import { STANDARD_MESSAGES, GND_MESSAGES } from '../data'
import './ChatWidget.css'

interface Props { mode: AppMode }

export default function ChatWidget({ mode }: Props) {
  const isGnd = mode === 'gnd'
  const initial = isGnd ? GND_MESSAGES : STANDARD_MESSAGES
  const [messages, setMessages] = useState<ChatMessage[]>(initial)
  const [input, setInput] = useState('')
  const [collapsed, setCollapsed] = useState(isGnd)

  const send = () => {
    if (!input.trim()) return
    const now = new Date()
    const time = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
    setMessages(m => [
      ...m,
      { id: Date.now().toString(), text: input, time, isBot: false },
    ])
    setInput('')
    setTimeout(() => {
      setMessages(m => [
        ...m,
        {
          id: (Date.now() + 1).toString(),
          text: 'Danke für Ihre Frage! Ich analysiere Ihre Anfrage zu „Haitianische Revolution" und suche relevante Quellen.',
          time,
          isBot: true,
        },
      ])
    }, 800)
  }

  if (isGnd && collapsed) {
    return (
      <div className="chat-widget">
        <div className="chat-header">
          <Bot size={18} className="chat-bot-icon" />
          <div className="chat-title-block">
            <div className="chat-title">Recherchebot</div>
            <div className="chat-subtitle">Informationstherapeut</div>
          </div>
          <button className="chat-open-btn" onClick={() => setCollapsed(false)}>
            Chat öffnen
          </button>
        </div>
        {messages.length > 0 && (
          <div className="chat-preview">
            <div className="chat-message chat-message--bot">
              <p>{messages[0].text}</p>
              <span className="msg-time">{messages[0].time}</span>
            </div>
          </div>
        )}
        <div className="chat-quick-actions">
          <button className="quick-btn">Fragestellung schärfen</button>
          <button className="quick-btn">Suchraum erklären</button>
          <button className="quick-btn">Kontroversen sichtbar machen</button>
          <button className="quick-btn">Quellenlage prüfen</button>
        </div>
        <div className="chat-input-row">
          <input
            className="chat-input"
            placeholder="Stellen Sie eine Frage oder bitten Sie um Unterstützung..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && send()}
          />
          <button className="send-btn" onClick={send}><Send size={14} /></button>
        </div>
      </div>
    )
  }

  return (
    <div className="chat-widget">
      <div className="chat-header">
        <Bot size={18} className="chat-bot-icon" />
        <div className="chat-title-block">
          <div className="chat-title">{isGnd ? 'Recherchebot' : 'Recherche-Hilfe'}</div>
          {isGnd && <div className="chat-subtitle">Informationstherapeut</div>}
          {!isGnd && <div className="chat-desc">Hilft Ihnen, gute Fragen zu stellen und besser zu suchen.</div>}
        </div>
        <button className="new-chat-btn" onClick={() => {
          setMessages(isGnd ? GND_MESSAGES : STANDARD_MESSAGES)
        }}>
          <RefreshCw size={12} />
          {isGnd ? 'Chat öffnen' : 'Neuer Chat'}
        </button>
      </div>

      <div className="chat-messages">
        {messages.map(msg => (
          <div key={msg.id} className={`chat-message ${msg.isBot ? 'chat-message--bot' : 'chat-message--user'}`}>
            <p style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</p>
            <span className="msg-time">{msg.time}</span>
          </div>
        ))}
      </div>

      {!isGnd && (
        <div className="chat-quick-actions">
          <button className="quick-btn">Frage klären</button>
          <button className="quick-btn">Thema erklären</button>
          <button className="quick-btn">Unterschiedliche Sichtweisen</button>
          <button className="quick-btn">Quellen prüfen</button>
        </div>
      )}

      {isGnd && (
        <div className="chat-quick-actions">
          <button className="quick-btn">Fragestellung schärfen</button>
          <button className="quick-btn">Suchraum erklären</button>
          <button className="quick-btn">Kontroversen sichtbar machen</button>
          <button className="quick-btn">Quellenlage prüfen</button>
        </div>
      )}

      <div className="chat-input-row">
        <input
          className="chat-input"
          placeholder={isGnd ? 'Stellen Sie eine Frage oder bitten Sie um Unterstützung...' : 'Schreiben Sie Ihre Frage oder bitten Sie um Unterstützung...'}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
        />
        <button className="send-btn" onClick={send}><Send size={14} /></button>
      </div>
    </div>
  )
}
