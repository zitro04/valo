/** Lista de usuarios para la API (misma que team.js + coach). */
export const DEFAULT_PASSWORD = 'valoplant'

const defaultMembers = [
  { id: 'dragio', name: 'Dragio' },
  { id: 'spavy', name: 'Spavy' },
  { id: 'orion', name: 'Orion' },
  { id: 'karma', name: 'Karma' },
  { id: 'cris', name: 'Cris' },
  { id: 'zitro', name: 'Zitro' },
]

export function getUsers() {
  return [
    { id: 'coach', name: 'Coach', role: 'coach' },
    ...defaultMembers.map((m) => ({ id: m.id, name: m.name, role: 'member' })),
  ]
}

export function findUserByUsername(username) {
  const trimmed = (username || '').toLowerCase().trim()
  const users = getUsers()
  return users.find((u) => u.id === trimmed || u.name.toLowerCase() === trimmed) ?? null
}
