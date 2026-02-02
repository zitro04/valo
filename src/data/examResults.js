const STORAGE_KEY = 'calloutlab-exam-results'

export function loadExamResults() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) return parsed
    }
  } catch (_) {}
  return []
}

export function saveExamResult(result) {
  const list = loadExamResults()
  list.unshift({
    score: result.score,
    total: result.total,
    mapId: result.mapId,
    date: new Date().toISOString(),
  })
  if (list.length > 50) list.length = 50
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
}

export function getLastResults(limit = 10) {
  return loadExamResults().slice(0, limit)
}

export function getAllResultsForExport() {
  return loadExamResults()
}
