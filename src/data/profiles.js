const STORAGE_KEY = 'valoplant-profiles'

function loadAll() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (parsed && typeof parsed === 'object') return parsed
    }
  } catch (_) {}
  return {}
}

export function loadProfile(userId) {
  const all = loadAll()
  return all[userId] ?? null
}

export function saveProfile(userId, data) {
  const all = loadAll()
  all[userId] = { ...(all[userId] ?? {}), ...data }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all))
}

export function getProfilePassword(userId) {
  const p = loadProfile(userId)
  return p?.password ?? null
}

export function clearProfilePassword(userId) {
  const all = loadAll()
  if (all[userId]) {
    const { password: _, ...rest } = all[userId]
    all[userId] = rest
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all))
  }
}
