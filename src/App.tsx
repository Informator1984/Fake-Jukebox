import { useState } from 'react'
import Header from './components/Header'
import LeftSidebar from './components/LeftSidebar'
import MainContent from './components/MainContent'
import RightPanel from './components/RightPanel'
import type { AppMode } from './types'
import './App.css'

function App() {
  const [mode, setMode] = useState<AppMode>('standard')
  const [query, setQuery] = useState('Haitianische Revolution')
  const [aiActive, setAiActive] = useState(true)

  return (
    <div className="app">
      <Header
        query={query}
        setQuery={setQuery}
        mode={mode}
        setMode={setMode}
        aiActive={aiActive}
        setAiActive={setAiActive}
      />
      <div className="app-body">
        <LeftSidebar mode={mode} />
        <MainContent mode={mode} query={query} />
        <RightPanel mode={mode} />
      </div>
    </div>
  )
}

export default App
