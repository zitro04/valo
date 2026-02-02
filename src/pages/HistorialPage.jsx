import { useMemo } from 'react'
import { loadExamResults, getAllResultsForExport } from '../data/examResults'
import { getMapById } from '../data/maps'

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
  const results = useMemo(() => loadExamResults().slice(0, 50), [])
  const allForExport = useMemo(() => getAllResultsForExport(), [])

  const handleExportCSV = () => {
    const headers = ['Fecha', 'Mapa', 'Puntuación', 'Total', 'Porcentaje']
    const rows = allForExport.map((r) => [
      formatDate(r.date),
      getMapById(r.mapId).name,
      r.score,
      r.total,
      (r.total ? Math.round((r.score / r.total) * 100) : 0) + '%',
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
      <div className="border-b border-[var(--valorant-cyan)]/15 bg-gradient-to-b from-[var(--valorant-dark)]/80 to-[var(--valorant-black)] px-6 py-10 lg:px-10">
        <h1 className="text-2xl font-bold text-white sm:text-3xl">Historial de exámenes</h1>
        <p className="mt-2 text-gray-400">Últimos resultados de exámenes de callouts. Exporta CSV o JSON.</p>
      </div>

      <div className="p-6 lg:p-10 max-w-4xl">
        <section className="mb-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleExportCSV}
            className="rounded-xl border border-[var(--valorant-cyan)]/40 bg-[var(--valorant-cyan)]/10 px-4 py-3 min-h-[44px] text-sm font-medium text-[var(--valorant-cyan)] transition hover:bg-[var(--valorant-cyan)]/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--valorant-cyan)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--valorant-black)] touch-target"
          >
            Exportar CSV
          </button>
          <button
            type="button"
            onClick={handleExportJSON}
            className="rounded-xl border border-[var(--valorant-cyan)]/40 bg-[var(--valorant-cyan)]/10 px-4 py-3 min-h-[44px] text-sm font-medium text-[var(--valorant-cyan)] transition hover:bg-[var(--valorant-cyan)]/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--valorant-cyan)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--valorant-black)] touch-target"
          >
            Exportar JSON
          </button>
        </section>

        <section className="rounded-xl border border-[var(--valorant-cyan)]/20 bg-[var(--valorant-panel)] overflow-hidden shadow-lg shadow-black/20">
          <h2 className="px-4 py-3 text-sm font-semibold text-[var(--valorant-cyan)] border-b border-[var(--valorant-cyan)]/10">
            Últimos exámenes
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
                    {r.score}/{r.total} ({r.total ? Math.round((r.score / r.total) * 100) : 0}%)
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
