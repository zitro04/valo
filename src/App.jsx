import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import HomePage from './pages/HomePage'
import CalloutsPage from './pages/CalloutsPage'
import LoginPage from './pages/LoginPage'
import ProfilePage from './pages/ProfilePage'
import HistorialPage from './pages/HistorialPage'
import ComingSoonPage from './pages/ComingSoonPage'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<HomePage />} />
            <Route path="callouts" element={<CalloutsPage />} />
            <Route path="perfil" element={<ProfilePage />} />
            <Route path="historial" element={<HistorialPage />} />
            <Route path="estrategias" element={<ComingSoonPage />} />
            <Route path="roster" element={<ComingSoonPage />} />
            <Route path="calendario" element={<ComingSoonPage />} />
            <Route path="comunicacion" element={<ComingSoonPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
