import { useState, useEffect } from 'react'

const CONTROL_URL = 'https://gist.githubusercontent.com/zitro04/2c02e9f7cbcdda1300684932828cb9b3/raw/control.json'

const CHECK_INTERVAL = 30 * 60 * 1000

export default function KillSwitch({ children }) {
  const [status, setStatus] = useState('checking')
  const [message, setMessage] = useState('')

  useEffect(() => {
    let timer

    async function check() {
      try {
        const res = await fetch(CONTROL_URL + '?t=' + Date.now(), { cache: 'no-store' })
        if (!res.ok) throw new Error('fetch failed')
        const data = await res.json()

        if (data.active === false) {
          setStatus('blocked')
          setMessage(data.message || 'Aplicación desactivada por el administrador.')
          return
        }

        setStatus('ok')
        timer = setTimeout(check, CHECK_INTERVAL)
      } catch {
        setStatus('ok')
        timer = setTimeout(check, CHECK_INTERVAL)
      }
    }

    check()
    return () => clearTimeout(timer)
  }, [])

  if (status === 'checking') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0f0f0f]">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-[var(--valorant-cyan)] border-t-transparent" />
          <p className="text-gray-400">Verificando licencia...</p>
        </div>
      </div>
    )
  }

  if (status === 'blocked') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0f0f0f] p-4">
        <div className="max-w-md rounded-2xl border border-red-500/40 bg-[#1a1a2e] p-8 text-center shadow-2xl">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/20">
            <svg className="h-8 w-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
            </svg>
          </div>
          <h1 className="mb-2 text-2xl font-bold text-red-400">Acceso Denegado</h1>
          <p className="text-gray-300">{message}</p>
        </div>
      </div>
    )
  }

  return children
}
