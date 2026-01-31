import { defaultMembers, loadTeamMembers } from './team.js'
import { getProfilePassword } from './profiles.js'

const DEFAULT_PASSWORD = 'valoplant'

export const coachUser = {
  id: 'coach',
  name: 'Coach',
  password: DEFAULT_PASSWORD,
  role: 'coach',
}

export function getLoginUsers() {
  const members = loadTeamMembers()
  const memberUsers = members.map((m) => ({
    id: m.id,
    name: m.name,
    password: DEFAULT_PASSWORD,
    role: 'member',
  }))
  return [coachUser, ...memberUsers]
}

function getEffectivePassword(user) {
  const custom = getProfilePassword(user.id)
  return custom ?? user.password
}

export function findUserByCredentials(username, password) {
  const users = getLoginUsers()
  const trimmed = username.toLowerCase().trim()
  const byId = users.find((u) => u.id === trimmed)
  const byName = users.find((u) => u.name.toLowerCase() === trimmed)
  const user = byId ?? byName
  if (!user) return null
  const effectivePassword = getEffectivePassword(user)
  if (effectivePassword !== password) return null
  return { id: user.id, name: user.name, role: user.role }
}
