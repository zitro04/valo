import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getLoginUsers, findUserByCredentials } from '../data/users'

export default function LoginPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { login, user } = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const users = getLoginUsers()
  const redirectTo = searchParams.get('redirect') || '/'

  if (user) {
    navigate(redirectTo, { replace: true })
    return null
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    const user = findUserByCredentials(username, password)
    if (!user) {
      setError('Usuario o contraseña incorrectos.')
      return
    }
    login(user)
    navigate(redirectTo, { replace: true })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--valorant-black)] px-4">
      <div className="w-full max-w-sm rounded-2xl border border-[var(--valorant-cyan)]/20 bg-[var(--valorant-panel)] p-8 shadow-xl">
        <div className="mb-6 flex justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--valorant-cyan)]/20 text-[var(--valorant-cyan)]">
            <TargetIcon className="h-7 w-7" />
          </div>
        </div>
        <h1 className="text-center text-xl font-bold text-white">Valoplant</h1>
        <p className="mt-1 text-center text-sm text-gray-400">Inicia sesión con tu usuario</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="user" className="block text-sm font-medium text-gray-400">
              Usuario
            </label>
            <input
              id="user"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Escribe tu usuario"
              autoComplete="username"
              className="mt-1 w-full rounded-lg border border-[var(--valorant-cyan)]/30 bg-[var(--valorant-dark)] px-3 py-2.5 text-white placeholder-gray-500 focus:border-[var(--valorant-cyan)] focus:outline-none focus:ring-1 focus:ring-[var(--valorant-cyan)]"
              required
            />
            <p className="mt-1.5 text-xs text-gray-500">
              Usuarios: {users.map((u) => u.name).join(', ')}
            </p>
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-400">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña"
              autoComplete="current-password"
              className="mt-1 w-full rounded-lg border border-[var(--valorant-cyan)]/30 bg-[var(--valorant-dark)] px-3 py-2.5 text-white placeholder-gray-500 focus:border-[var(--valorant-cyan)] focus:outline-none focus:ring-1 focus:ring-[var(--valorant-cyan)]"
              required
            />
            <p className="mt-1 text-xs text-gray-500">Por defecto: valoplant (o la que hayas puesto en tu perfil)</p>
            <p className="mt-1 text-xs text-gray-500">Si eres Coach, puedes restablecer contraseñas desde Historial.</p>
          </div>
          {error && (
            <p className="text-sm text-[var(--valorant-red)]">{error}</p>
          )}
          <button
            type="submit"
            className="w-full rounded-lg bg-[var(--valorant-cyan)] py-2.5 font-semibold text-[var(--valorant-black)] transition hover:opacity-90"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  )
}

function TargetIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}
