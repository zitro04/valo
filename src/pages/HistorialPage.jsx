import { useMemo } from 'react'
import { loadExamResults, getAllResultsForExport } from '../data/examResults'
import { getMapById, maps } from '../data/maps'
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

  const stats = useMemo(() => {
    if (results.length === 0) return null
    const total = results.length
    const avgScore = results.reduce((s, r) => s + (r.score / r.total) * 100, 0) / total
    const best = Math.max(...results.map((r) => (r.score / r.total) * 100))
    const worst = Math.min(...results.map((r) => (r.score / r.total) * 100))
    const byMap = {}
    for (const r of results) {
      if (!byMap[r.mapId]) byMap[r.mapId] = []
      byMap[r.mapId].push(r)
    }
    const mapStats = Object.entries(byMap).map(([mapId, list]) => ({
      mapId,
      mapName: getMapById(mapId).name,
      count: list.length,
      avg: list.reduce((s, r) => s + (r.score / r.total) * 100, 0) / list.length,
    }))
    const last10 = results.slice(0, 10).reverse()
    return { total, avgScore, best, worst, mapStats, last10 }
  }, [results])

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

        {stats && (
          <section className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Total exámenes" value={stats.total} />
            <StatCard label="Media" value={`${Math.round(stats.avgScore)}%`} color={stats.avgScore >= 70 ? 'green' : stats.avgScore >= 50 ? 'yellow' : 'red'} />
            <StatCard label="Mejor" value={`${Math.round(stats.best)}%`} color="green" />
            <StatCard label="Peor" value={`${Math.round(stats.worst)}%`} color="red" />
          </section>
        )}

        {stats && stats.last10.length > 1 && (
          <section className="mb-6 rounded-xl border border-[var(--valorant-cyan)]/20 bg-[var(--valorant-panel)] p-4">
            <h2 className="mb-3 text-sm font-semibold text-[var(--valorant-cyan)]">Progreso (últimos 10)</h2>
            <div className="flex items-end gap-1.5 h-28">
              {stats.last10.map((r, i) => {
                const pct = Math.round((r.score / r.total) * 100)
                const color = pct >= 80 ? '#22c55e' : pct >= 50 ? '#eab308' : '#ef4444'
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-[10px] text-gray-400">{pct}%</span>
                    <div
                      className="w-full rounded-t"
                      style={{ height: `${Math.max(4, pct)}%`, background: color, minHeight: 4 }}
                    />
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {stats && stats.mapStats.length > 0 && (
          <section className="mb-6 rounded-xl border border-[var(--valorant-cyan)]/20 bg-[var(--valorant-panel)] p-4">
            <h2 className="mb-3 text-sm font-semibold text-[var(--valorant-cyan)]">Por mapa</h2>
            <div className="space-y-2">
              {stats.mapStats.map((ms) => (
                <div key={ms.mapId} className="flex items-center justify-between gap-3">
                  <span className="text-sm text-white font-medium">{ms.mapName}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-400">{ms.count} exámenes</span>
                    <div className="w-24 h-2 rounded-full bg-[var(--valorant-black)] overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${ms.avg}%`,
                          background: ms.avg >= 80 ? '#22c55e' : ms.avg >= 50 ? '#eab308' : '#ef4444',
                        }}
                      />
                    </div>
                    <span className="text-xs font-medium text-white w-10 text-right">{Math.round(ms.avg)}%</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="rounded-xl border border-[var(--valorant-cyan)]/20 bg-[var(--valorant-panel)] overflow-hidden">
          <h2 className="px-4 py-3 text-sm font-semibold text-[var(--valorant-cyan)] border-b border-[var(--valorant-cyan)]/10">
            {jugadorName} — últimos exámenes
          </h2>
          {results.length === 0 ? (
            <p className="p-6 text-gray-500 text-sm">Sin exámenes todavía.</p>
          ) : (
            <ul className="divide-y divide-[var(--valorant-cyan)]/10">
              {results.map((r, i) => {
                const pct = Math.round((r.score / r.total) * 100)
                return (
                  <li key={i} className="flex items-center justify-between gap-4 px-4 py-3 text-sm">
                    <span className="text-gray-400">{formatDate(r.date)}</span>
                    <span className="text-gray-300">{getMapById(r.mapId).name}</span>
                    <span className={`font-medium ${pct >= 80 ? 'text-green-400' : pct >= 50 ? 'text-yellow-400' : 'text-[var(--valorant-red)]'}`}>
                      {r.score}/{r.total} ({pct}%)
                    </span>
                  </li>
                )
              })}
            </ul>
          )}
        </section>
      </div>
    </div>
  )
}

function StatCard({ label, value, color }) {
  const colorClass = color === 'green' ? 'text-green-400' : color === 'red' ? 'text-[var(--valorant-red)]' : color === 'yellow' ? 'text-yellow-400' : 'text-white'
  return (
    <div className="rounded-xl border border-[var(--valorant-cyan)]/20 bg-[var(--valorant-panel)] p-4 text-center">
      <p className="text-xs text-gray-400 mb-1">{label}</p>
      <p className={`text-2xl font-bold ${colorClass}`}>{value}</p>
    </div>
  )
}
