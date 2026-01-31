const STORAGE_KEY = 'valoplant-team-members'

export const defaultMembers = [
  { id: 'dragio', name: 'Dragio' },
  { id: 'spavy', name: 'Spavy' },
  { id: 'orion', name: 'Orion' },
  { id: 'karma', name: 'Karma' },
  { id: 'cris', name: 'Cris' },
  { id: 'zitro', name: 'Zitro' },
]

export function loadTeamMembers() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed) && parsed.length > 0) return parsed
    }
  } catch (_) {}
  return defaultMembers
}

export function saveTeamMembers(members) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(members))
}
