import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import CalloutsPage from './pages/CalloutsPage'
import HistorialPage from './pages/HistorialPage'
import LineupsPage from './pages/LineupsPage'
import AgentCompsPage from './pages/AgentCompsPage'
import NotesPage from './pages/NotesPage'
import StrategiesPage from './pages/StrategiesPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="callouts" element={<CalloutsPage />} />
          <Route path="lineups" element={<LineupsPage />} />
          <Route path="estrategias" element={<StrategiesPage />} />
          <Route path="historial" element={<HistorialPage />} />
          <Route path="composiciones" element={<AgentCompsPage />} />
          <Route path="notas" element={<NotesPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
