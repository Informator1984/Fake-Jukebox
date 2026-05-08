import { useRef, useState, useEffect } from 'react'
import {
  Play, Pause, SkipForward, Volume2, Settings,
  Maximize2, Info, ChevronRight
} from 'lucide-react'
import type { AppMode } from '../types'
import { TRACKS } from '../data'
import './VideosSection.css'

interface Props { mode: AppMode }

export default function VideosSection({ mode }: Props) {
  const isGnd = mode === 'gnd'
  const audioRef = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)
  const [currentTrack, setCurrentTrack] = useState(0)
  const [progress, setProgress] = useState(0)
  const [currentTime, setCurrentTime] = useState('00:00')
  const [volume, setVolume] = useState(0.8)

  const track = TRACKS[currentTrack]

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    const onTime = () => {
      const p = audio.duration ? (audio.currentTime / audio.duration) * 100 : 0
      setProgress(p)
      const m = Math.floor(audio.currentTime / 60)
      const s = Math.floor(audio.currentTime % 60)
      setCurrentTime(`${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`)
    }
    audio.addEventListener('timeupdate', onTime)
    return () => audio.removeEventListener('timeupdate', onTime)
  }, [currentTrack])

  const togglePlay = () => {
    const audio = audioRef.current
    if (!audio) return
    if (playing) { audio.pause(); setPlaying(false) }
    else { audio.play().catch(() => {}); setPlaying(true) }
  }

  const nextTrack = () => {
    const next = (currentTrack + 1) % TRACKS.length
    setCurrentTrack(next)
    setPlaying(false)
    setProgress(0)
    setCurrentTime('00:00')
  }

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current
    if (!audio || !audio.duration) return
    const rect = e.currentTarget.getBoundingClientRect()
    const pct = (e.clientX - rect.left) / rect.width
    audio.currentTime = pct * audio.duration
  }

  const changeVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = Number(e.target.value)
    setVolume(v)
    if (audioRef.current) audioRef.current.volume = v
  }

  const selectTrack = (i: number) => {
    setCurrentTrack(i)
    setPlaying(false)
    setProgress(0)
    setCurrentTime('00:00')
  }

  return (
    <div className="videos-section">
      <audio ref={audioRef} src={track.src} />

      <div className="vs-header">
        <h3 className="vs-title">
          {isGnd ? 'Audiovisuelle Inhalte' : 'Videos & Audio'}
          {isGnd && <Info size={13} style={{ marginLeft: 5, color: 'var(--text-muted)' }} />}
        </h3>
        <span className="vs-count">3</span>
      </div>

      <div className="vs-body">
        <div className="vs-featured">
          <div className="vs-thumbnail">
            <div className="vs-thumb-bg">
              <span className="vs-play-overlay">▶</span>
              <div className="vs-thumb-title">{TRACKS[0].title}</div>
            </div>
          </div>
        </div>

        <div className="vs-list">
          {TRACKS.map((t, i) => (
            <button
              key={i}
              className={`vs-track-item ${i === currentTrack ? 'vs-track-item--active' : ''}`}
              onClick={() => selectTrack(i)}
            >
              <div className="vs-track-thumb">
                <span>{playing && i === currentTrack ? '⏸' : '▶'}</span>
              </div>
              <div className="vs-track-info">
                <div className="vs-track-title">{t.title}</div>
                <div className="vs-track-meta">{t.type}</div>
              </div>
              <div className="vs-track-duration">{t.duration}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="vs-player">
        <div className="player-controls">
          <button className="player-btn" onClick={togglePlay}>
            {playing ? <Pause size={16} /> : <Play size={16} />}
          </button>
          <button className="player-btn" onClick={nextTrack}>
            <SkipForward size={14} />
          </button>
          <span className="player-time">{currentTime}</span>
          <div className="player-progress" onClick={seek}>
            <div className="player-progress-bar" style={{ width: `${progress}%` }} />
            <div className="player-progress-thumb" style={{ left: `calc(${progress}% - 5px)` }} />
          </div>
          <span className="player-time">{track.duration}</span>
          <Volume2 size={14} className="player-vol-icon" />
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volume}
            onChange={changeVolume}
            className="player-vol-slider"
          />
          <button className="player-btn"><Settings size={14} /></button>
          <button className="player-btn"><Maximize2 size={14} /></button>
        </div>

        <div className="player-meta-row">
          <span className="player-tag">Video</span>
          <span className="player-tag">{isGnd ? 'Vortrag / Doku' : 'Audio'}</span>
          {isGnd && <span className="player-tag">mit Transkript</span>}
          {!isGnd && <span className="player-tag">Transkript</span>}
          <span className="player-tag">{track.duration}</span>
          <span className="player-tag">Deutsch</span>
        </div>
      </div>

      <div className="vs-footer">
        <button className="vs-all-link">
          Alle 3 {isGnd ? 'audiovisuelle Angebote' : 'Videos & Audio'} anzeigen
          <ChevronRight size={13} />
        </button>
      </div>
    </div>
  )
}
