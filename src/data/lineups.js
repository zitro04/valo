const KEY_PREFIX = 'valoplant-lineups-'

export function loadLineups(mapId) {
  try {
    const raw = localStorage.getItem(KEY_PREFIX + mapId)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) return parsed
    }
  } catch (_) {}
  return []
}

export function saveLineups(mapId, lineups) {
  localStorage.setItem(KEY_PREFIX + mapId, JSON.stringify(lineups))
}

export function addLineup(mapId, lineup) {
  const all = loadLineups(mapId)
  const entry = { ...lineup, id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6) }
  all.push(entry)
  saveLineups(mapId, all)
  return all
}

export function deleteLineup(mapId, lineupId) {
  const all = loadLineups(mapId).filter((l) => l.id !== lineupId)
  saveLineups(mapId, all)
  return all
}

export function updateLineup(mapId, lineupId, updates) {
  const all = loadLineups(mapId).map((l) => (l.id === lineupId ? { ...l, ...updates } : l))
  saveLineups(mapId, all)
  return all
}
