import { useMemo } from 'react'
import { loadExamResults, getAllResultsForExport } from '../data/examResults'
import { getMapById } from '../data/maps'
import { getSinglePlayerList } from '../data/singleUser'

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
  const teamMembers = getSinglePlayerList()
  const jugadorId = teamMembers[0]?.id ?? 'default'
  const results = useMemo(() => {
    const all = loadExamResults()
    return (all[jugadorId] ?? []).slice(0, 50)
  }, [jugadorId])

  const jugadorName = teamMembers.find((m) => m.id === jugadorId)?.name ?? 'Yo'
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
    a.download = `calloutlab-resultados-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleExportJSON = () => {
    const blob = new Blob([JSON.stringify(allForExport, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `calloutlab-resultados-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen">
      <div className="border-b border-[var(--valorant-cyan)]/10 bg-[var(--valorant-dark)]/30 px-6 py-8 lg:px-10">
        <h1 className="text-2xl font-bold text-white sm:text-3xl">Historial de exámenes</h1>
        <p className="mt-1 text-gray-400">
          Tus resultados de exámenes de callouts. Exporta CSV o JSON para guardar una copia.
        </p>
      </div>

      <div className="p-6 lg:p-10 max-w-4xl">
        <section className="mb-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleExportCSV}
            className="rounded-lg border border-[var(--valorant-cyan)]/40 bg-[var(--valorant-cyan)]/10 px-4 py-3 min-h-[44px] text-sm font-medium text-[var(--valorant-cyan)] transition hover:bg-[var(--valorant-cyan)]/20 touch-target"
          >
            Exportar CSV
          </button>
          <button
            type="button"
            onClick={handleExportJSON}
            className="rounded-lg border border-[var(--valorant-cyan)]/40 bg-[var(--valorant-cyan)]/10 px-4 py-3 min-h-[44px] text-sm font-medium text-[var(--valorant-cyan)] transition hover:bg-[var(--valorant-cyan)]/20 touch-target"
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
      </div>
    </div>
  )
}
