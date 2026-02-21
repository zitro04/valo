const KEY_PREFIX = 'valoplant-comps-'

export function loadComps(mapId) {
  try {
    const raw = localStorage.getItem(KEY_PREFIX + mapId)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) return parsed
    }
  } catch (_) {}
  return []
}

export function saveComps(mapId, comps) {
  localStorage.setItem(KEY_PREFIX + mapId, JSON.stringify(comps))
}

export function addComp(mapId, comp) {
  const all = loadComps(mapId)
  const entry = { ...comp, id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6) }
  all.push(entry)
  saveComps(mapId, all)
  return all
}

export function deleteComp(mapId, compId) {
  const all = loadComps(mapId).filter((c) => c.id !== compId)
  saveComps(mapId, all)
  return all
}
