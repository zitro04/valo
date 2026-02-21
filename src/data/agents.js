export const ROLES = ['Duelista', 'Controlador', 'Iniciador', 'Centinela']

export const agents = [
  { name: 'Jett', role: 'Duelista' },
  { name: 'Reyna', role: 'Duelista' },
  { name: 'Raze', role: 'Duelista' },
  { name: 'Yoru', role: 'Duelista' },
  { name: 'Neon', role: 'Duelista' },
  { name: 'Phoenix', role: 'Duelista' },
  { name: 'Iso', role: 'Duelista' },
  { name: 'Waylay', role: 'Duelista' },
  { name: 'Brimstone', role: 'Controlador' },
  { name: 'Viper', role: 'Controlador' },
  { name: 'Omen', role: 'Controlador' },
  { name: 'Astra', role: 'Controlador' },
  { name: 'Harbor', role: 'Controlador' },
  { name: 'Clove', role: 'Controlador' },
  { name: 'Sova', role: 'Iniciador' },
  { name: 'Breach', role: 'Iniciador' },
  { name: 'Skye', role: 'Iniciador' },
  { name: 'Fade', role: 'Iniciador' },
  { name: 'KAY/O', role: 'Iniciador' },
  { name: 'Gekko', role: 'Iniciador' },
  { name: 'Cypher', role: 'Centinela' },
  { name: 'Killjoy', role: 'Centinela' },
  { name: 'Sage', role: 'Centinela' },
  { name: 'Chamber', role: 'Centinela' },
  { name: 'Deadlock', role: 'Centinela' },
  { name: 'Vyse', role: 'Centinela' },
  { name: 'Tejo', role: 'Centinela' },
]

export const ABILITY_TYPES = ['Humo', 'Flash', 'Molotov', 'Recon', 'Muro', 'Ulti', 'Otro']

export const ROLE_COLORS = {
  Duelista: '#ff4655',
  Controlador: '#8b5cf6',
  Iniciador: '#22c55e',
  Centinela: '#f59e0b',
}

export function getAgentsByRole(role) {
  return agents.filter((a) => a.role === role)
}
