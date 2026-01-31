import { useState, useMemo } from 'react'
import { useAuth } from '../context/AuthContext'
import { loadTeamMembers } from '../data/team'
import { loadExamResults, getAllResultsForExport } from '../data/examResults'
import { getMapById } from '../data/maps'
import { clearProfilePassword } from '../data/profiles'

function formatDate(iso) {
  const d = new Date(iso)
  return d.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function HistorialPage() {
  const { user, isCoach } = useAuth()
  const [teamMembers] = useState(() => loadTeamMembers())
  const [selectedJugadorId, setSelectedJugadorId] = useState(isCoach ? null : user?.id)
  const [resetConfirm, setResetConfirm] = useState(null)

  const jugadorId = selectedJugadorId ?? (isCoach ? teamMembers[0]?.id : user?.id)
  const results = useMemo(() => {
    const all = loadExamResults()
    return (all[jugadorId] ?? []).slice(0, 50)
  }, [jugadorId])

  const jugadorName = teamMembers.find((m) => m.id === jugadorId)?.name ?? jugadorId
  const allForExport = useMemo(() => getAllResultsForExport(teamMembers), [teamMembers])

  const handleExportCSV = () => {
    const headers = ['Jugador', 'Fecha', 'Mapa', 'Puntuación', 'Total', 'Porcentaje']
    const rows = allForExport.map((r) => [
      r.jugadorName,
      formatDate(r.date),
      getMapById(r.mapId).name,
      r.score,
      r.total,
      r.percent + '%',
    ])
    const csv = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n')
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `valoplant-resultados-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleExportJSON = () => {
    const blob = new Blob([JSON.stringify(allForExport, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `valoplant-resultados-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleResetPassword = (memberId) => {
    if (resetConfirm === memberId) {
      clearProfilePassword(memberId)
      setResetConfirm(null)
    } else {
      setResetConfirm(memberId)
    }
  }

  return (
    <div className="min-h-screen">
      <div className="border-b border-[var(--valorant-cyan)]/10 bg-[var(--valorant-dark)]/30 px-6 py-8 lg:px-10">
        <h1 className="text-2xl font-bold text-white sm:text-3xl">Historial de exámenes</h1>
        <p className="mt-1 text-gray-400">
          {isCoach ? 'Resultados de todos los jugadores. Exporta o restablece contraseñas.' : 'Tus resultados de exámenes de callouts.'}
        </p>
      </div>

      <div className="p-6 lg:p-10 max-w-4xl">
        {isCoach && (
          <section className="mb-6 rounded-xl border border-[var(--valorant-cyan)]/20 bg-[var(--valorant-panel)] p-4">
            <label className="block text-sm font-medium text-gray-400 mb-2">Ver historial de</label>
            <select
              value={selectedJugadorId ?? ''}
              onChange={(e) => setSelectedJugadorId(e.target.value || null)}
              className="w-full rounded-lg border border-[var(--valorant-cyan)]/30 bg-[var(--valorant-dark)] px-3 py-2 text-white focus:border-[var(--valorant-cyan)] focus:outline-none"
            >
              {teamMembers.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </section>
        )}

        <section className="mb-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleExportCSV}
            className="rounded-lg border border-[var(--valorant-cyan)]/40 bg-[var(--valorant-cyan)]/10 px-4 py-2 text-sm font-medium text-[var(--valorant-cyan)] transition hover:bg-[var(--valorant-cyan)]/20"
          >
            Exportar CSV
          </button>
          <button
            type="button"
            onClick={handleExportJSON}
            className="rounded-lg border border-[var(--valorant-cyan)]/40 bg-[var(--valorant-cyan)]/10 px-4 py-2 text-sm font-medium text-[var(--valorant-cyan)] transition hover:bg-[var(--valorant-cyan)]/20"
          >
            Exportar JSON
          </button>
        </section>

        <section className="rounded-xl border border-[var(--valorant-cyan)]/20 bg-[var(--valorant-panel)] overflow-hidden">
          <h2 className="px-4 py-3 text-sm font-semibold text-[var(--valorant-cyan)] border-b border-[var(--valorant-cyan)]/10">
            {jugadorName} — últimos exámenes
          </h2>
          {results.length === 0 ? (
            <p className="p-6 text-gray-500 text-sm">Sin exámenes todavía.</p>
          ) : (
            <ul className="divide-y divide-[var(--valorant-cyan)]/10">
              {results.map((r, i) => (
                <li key={i} className="flex items-center justify-between gap-4 px-4 py-3 text-sm">
                  <span className="text-gray-400">{formatDate(r.date)}</span>
                  <span className="text-gray-300">{getMapById(r.mapId).name}</span>
                  <span className="font-medium text-white">
                    {r.score}/{r.total} ({Math.round((r.score / r.total) * 100)}%)
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        {isCoach && jugadorId !== 'coach' && (
          <section className="mt-6 rounded-xl border border-[var(--valorant-cyan)]/20 bg-[var(--valorant-panel)] p-4">
            <h2 className="text-sm font-semibold text-[var(--valorant-cyan)] mb-2">Coach</h2>
            <p className="text-xs text-gray-400 mb-3">
              Restablecer la contraseña de {jugadorName} hará que pueda volver a entrar con la contraseña por defecto (valoplant).
            </p>
            <button
              type="button"
              onClick={() => handleResetPassword(jugadorId)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                resetConfirm === jugadorId
                  ? 'bg-[var(--valorant-red)]/20 text-[var(--valorant-red)] hover:bg-[var(--valorant-red)]/30'
                  : 'border border-gray-500 text-gray-400 hover:bg-white/5'
              }`}
            >
              {resetConfirm === jugadorId ? 'Confirmar restablecer contraseña' : 'Restablecer contraseña de ' + jugadorName}
            </button>
            {resetConfirm === jugadorId && (
              <button
                type="button"
                onClick={() => setResetConfirm(null)}
                className="ml-2 text-sm text-gray-500 hover:text-gray-300"
              >
                Cancelar
              </button>
            )}
          </section>
        )}
      </div>
    </div>
  )
}
