import { useState, useCallback } from 'react'
import { maps, getMapById } from '../data/maps'
import { loadComps, addComp, deleteComp } from '../data/agentComps'
import { agents, ROLES, ROLE_COLORS } from '../data/agents'

export default function AgentCompsPage() {
  const [currentMapId, setCurrentMapId] = useState('pearl')
  const [comps, setComps] = useState(() => loadComps('pearl'))
  const [adding, setAdding] = useState(false)
  const [formName, setFormName] = useState('')
  const [formSide, setFormSide] = useState('attack')
  const [formAgents, setFormAgents] = useState([])

  const currentMap = getMapById(currentMapId)

  const switchMap = (id) => {
    setCurrentMapId(id)
    setComps(loadComps(id))
    setAdding(false)
  }

  const toggleAgent = useCallback((name) => {
    setFormAgents((prev) => {
      if (prev.includes(name)) return prev.filter((a) => a !== name)
      if (prev.length >= 5) return prev
      return [...prev, name]
    })
  }, [])

  const handleSave = useCallback(() => {
    if (!formName.trim() || formAgents.length === 0) return
    const updated = addComp(currentMapId, {
      name: formName.trim(),
      side: formSide,
      agents: formAgents,
    })
    setComps(updated)
    setAdding(false)
    setFormName('')
    setFormAgents([])
  }, [currentMapId, formName, formSide, formAgents])

  const handleDelete = useCallback((id) => {
    if (!confirm('¿Eliminar esta composición?')) return
    setComps(deleteComp(currentMapId, id))
  }, [currentMapId])

  return (
    <div className="min-h-screen">
      <header className="border-b border-[var(--valorant-cyan)]/10 bg-[var(--valorant-dark)]/30 px-6 py-6 lg:px-10">
        <h1 className="text-2xl font-bold text-white sm:text-3xl">Composiciones de agentes</h1>
        <p className="mt-1 text-gray-400">Guarda tus composiciones favoritas por mapa y lado.</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {maps.map((map) => (
            <button
              key={map.id}
              type="button"
              onClick={() => switchMap(map.id)}
              className={`rounded-lg px-4 py-2.5 min-h-[44px] text-sm font-medium transition touch-target ${
                currentMapId === map.id
                  ? 'bg-[var(--valorant-cyan)] text-[var(--valorant-black)]'
                  : 'bg-[var(--valorant-panel)] text-gray-400 hover:bg-white/10 hover:text-white'
              }`}
            >
              {map.name}
            </button>
          ))}
        </div>
      </header>

      <div className="p-6 lg:p-10 max-w-4xl">
        <div className="mb-6">
          <button
            type="button"
            onClick={() => setAdding(!adding)}
            className={`rounded-lg px-4 py-3 min-h-[44px] text-sm font-medium transition touch-target ${
              adding ? 'bg-[var(--valorant-red)] text-white' : 'bg-[var(--valorant-cyan)] text-[var(--valorant-black)]'
            }`}
          >
            {adding ? 'Cancelar' : '+ Nueva composición'}
          </button>
        </div>

        {adding && (
          <div className="mb-6 rounded-xl border border-[var(--valorant-cyan)]/30 bg-[var(--valorant-panel)] p-5">
            <div className="grid gap-4 sm:grid-cols-2 mb-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Nombre</label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Ej: Comp agresiva A"
                  className="w-full rounded-lg border border-[var(--valorant-cyan)]/20 bg-[var(--valorant-black)] px-3 py-3 text-sm text-white placeholder-gray-500 focus:border-[var(--valorant-cyan)] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Lado</label>
                <div className="flex gap-2">
                  {[['attack', 'Ataque'], ['defense', 'Defensa']].map(([val, lbl]) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setFormSide(val)}
                      className={`flex-1 rounded-lg px-3 py-3 text-sm font-medium transition ${
                        formSide === val
                          ? 'bg-[var(--valorant-cyan)] text-[var(--valorant-black)]'
                          : 'bg-[var(--valorant-black)] text-gray-400 hover:bg-white/5'
                      }`}
                    >
                      {lbl}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-400 mb-3">Selecciona hasta 5 agentes ({formAgents.length}/5):</p>
            {ROLES.map((role) => (
              <div key={role} className="mb-3">
                <p className="text-xs font-semibold mb-1.5" style={{ color: ROLE_COLORS[role] }}>{role}</p>
                <div className="flex flex-wrap gap-1.5">
                  {agents.filter((a) => a.role === role).map((a) => {
                    const selected = formAgents.includes(a.name)
                    return (
                      <button
                        key={a.name}
                        type="button"
                        onClick={() => toggleAgent(a.name)}
                        disabled={!selected && formAgents.length >= 5}
                        className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                          selected
                            ? 'bg-[var(--valorant-cyan)] text-[var(--valorant-black)]'
                            : 'bg-[var(--valorant-black)] text-gray-400 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed'
                        }`}
                      >
                        {a.name}
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={handleSave}
              disabled={!formName.trim() || formAgents.length === 0}
              className="mt-4 w-full rounded-lg bg-[var(--valorant-cyan)] px-4 py-3 text-sm font-semibold text-[var(--valorant-black)] transition hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Guardar composición
            </button>
          </div>
        )}

        <div className="space-y-3">
          {comps.length === 0 && !adding && (
            <p className="text-gray-500 text-sm">Sin composiciones para {currentMap.name}. Crea una con el botón de arriba.</p>
          )}
          {comps.map((c) => (
            <div key={c.id} className="group rounded-xl border border-[var(--valorant-cyan)]/20 bg-[var(--valorant-panel)] p-4">
              <div className="flex items-center justify-between gap-3 mb-2">
                <div>
                  <h3 className="text-sm font-semibold text-white">{c.name}</h3>
                  <span className={`text-xs font-medium ${c.side === 'attack' ? 'text-[var(--valorant-red)]' : 'text-[var(--valorant-cyan)]'}`}>
                    {c.side === 'attack' ? 'Ataque' : 'Defensa'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleDelete(c.id)}
                  className="rounded p-2 text-gray-500 opacity-0 group-hover:opacity-100 hover:text-[var(--valorant-red)] transition"
                  title="Eliminar"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {c.agents.map((name) => {
                  const ag = agents.find((a) => a.name === name)
                  const color = ag ? ROLE_COLORS[ag.role] : '#6b7280'
                  return (
                    <span
                      key={name}
                      className="rounded-lg px-2.5 py-1 text-xs font-medium text-white"
                      style={{ background: color + '33', border: `1px solid ${color}55` }}
                    >
                      {name}
                    </span>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
