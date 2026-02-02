import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import CalloutsPage from './pages/CalloutsPage'
import HistorialPage from './pages/HistorialPage'
import ComingSoonPage from './pages/ComingSoonPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="callouts" element={<CalloutsPage />} />
          <Route path="historial" element={<HistorialPage />} />
          <Route path="estrategias" element={<ComingSoonPage />} />
          <Route path="roster" element={<ComingSoonPage />} />
          <Route path="calendario" element={<ComingSoonPage />} />
          <Route path="comunicacion" element={<ComingSoonPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
