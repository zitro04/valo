const STORAGE_KEY = 'valoplant-exam-results'

export function loadExamResults() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (parsed && typeof parsed === 'object') return parsed
    }
  } catch (_) {}
  return {}
}

export function saveExamResult(jugadorId, result) {
  const results = loadExamResults()
  const list = results[jugadorId] ?? []
  list.unshift({
    score: result.score,
    total: result.total,
    mapId: result.mapId,
    date: new Date().toISOString(),
  })
  if (list.length > 50) list.length = 50
  results[jugadorId] = list
  localStorage.setItem(STORAGE_KEY, JSON.stringify(results))
}

export function getLastResultsByJugador(jugadorId, limit = 5) {
  const results = loadExamResults()
  return (results[jugadorId] ?? []).slice(0, limit)
}

export function getAllResultsForExport(teamMembers) {
  const results = loadExamResults()
  const flat = []
  const nameById = Object.fromEntries((teamMembers || []).map((m) => [m.id, m.name]))
  for (const [jugadorId, list] of Object.entries(results)) {
    const jugadorName = nameById[jugadorId] ?? jugadorId
    for (const r of list) {
      flat.push({
        jugadorId,
        jugadorName,
        date: r.date,
        mapId: r.mapId,
        score: r.score,
        total: r.total,
        percent: r.total ? Math.round((r.score / r.total) * 100) : 0,
      })
    }
  }
  flat.sort((a, b) => new Date(b.date) - new Date(a.date))
  return flat
}
