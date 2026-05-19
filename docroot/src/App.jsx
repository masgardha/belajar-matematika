import './App.css'
import RenderPage from './RenderPage'
import { useState } from 'react'

function App() {
  const [view, setView] = useState('mainMenu')
  const appState = {
    'view': view,
    'setView': setView,
  }

  return (
     <RenderPage appState={appState} />
  )
}

export default App
