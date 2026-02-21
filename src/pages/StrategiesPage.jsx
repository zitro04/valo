import { useState, useCallback, useRef } from 'react'
import { maps, getMapById } from '../data/maps'

const PLAYER_COLORS = ['#ef4444', '#3b82f6', '#22c55e', '#f59e0b', '#a855f7']
const PLAYER_LABELS = ['J1', 'J2', 'J3', 'J4', 'J5']

function loadStrategies(mapId) {
  try {
    const raw = localStorage.getItem(`valoplant-strats-${mapId}`)
    if (raw) { const p = JSON.parse(raw); if (Array.isArray(p)) return p }
  } catch {}
  return []
}

function saveStrategies(mapId, strats) {
  localStorage.setItem(`valoplant-strats-${mapId}`, JSON.stringify(strats))
}

export default function StrategiesPage() {
  const [currentMapId, setCurrentMapId] = useState('pearl')
  const [strats, setStrats] = useState(() => loadStrategies('pearl'))
  const [editing, setEditing] = useState(null)
  const [currentPlayer, setCurrentPlayer] = useState(0)
  const [formName, setFormName] = useState('')
  const [paths, setPaths] = useState([[], [], [], [], []])
  const currentMap = getMapById(currentMapId)

  const switchMap = (id) => {
    setCurrentMapId(id)
    setStrats(loadStrategies(id))
    setEditing(null)
  }

  const startNew = () => {
    setFormName('')
    setPaths([[], [], [], [], []])
    setCurrentPlayer(0)
    setEditing('new')
  }

  const handleMapClick = useCallback((e) => {
    if (!editing) return
    const svg = e.currentTarget
    const rect = svg.getBoundingClientRect()
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 1000)
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 1000)
    setPaths((prev) => {
      const copy = prev.map((p) => [...p])
      copy[currentPlayer].push({ x, y })
      return copy
    })
  }, [editing, currentPlayer])

  const handleSave = () => {
    if (!formName.trim()) return
    const entry = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      name: formName.trim(),
      paths: paths,
    }
    const updated = [...strats, entry]
    saveStrategies(currentMapId, updated)
    setStrats(updated)
    setEditing(null)
  }

  const handleDelete = (id) => {
    if (!confirm('¿Eliminar esta estrategia?')) return
    const updated = strats.filter((s) => s.id !== id)
    saveStrategies(currentMapId, updated)
    setStrats(updated)
  }

  const handleView = (strat) => {
    setFormName(strat.name)
    setPaths(strat.paths || [[], [], [], [], []])
    setEditing('view')
  }

  const handleUndoLast = () => {
    setPaths((prev) => {
      const copy = prev.map((p) => [...p])
      copy[currentPlayer].pop()
      return copy
    })
  }

  const hasImage = Boolean(currentMap.simpleMapPath || currentMap.imagePath)

  const renderPaths = (pathsData) => {
    return pathsData.map((points, playerIdx) => {
      if (points.length < 2) return null
      const color = PLAYER_COLORS[playerIdx]
      return (
        <g key={playerIdx}>
          {points.slice(0, -1).map((p, i) => {
            const next = points[i + 1]
            return <line key={i} x1={p.x} y1={p.y} x2={next.x} y2={next.y} stroke={color} strokeWidth={3} strokeLinecap="round" markerEnd="url(#arrow)" />
          })}
          {points.map((p, i) => (
            <circle key={`dot-${i}`} cx={p.x} cy={p.y} r={i === 0 ? 8 : 4} fill={color} stroke="white" strokeWidth={1} />
          ))}
          {points.length > 0 && (
            <text x={points[0].x} y={points[0].y - 14} textAnchor="middle" fill={color} fontSize="12" fontWeight="bold" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}>
              {PLAYER_LABELS[playerIdx]}
            </text>
          )}
        </g>
      )
    })
  }

  return (
    <div className="min-h-screen">
      <header className="border-b border-[var(--valorant-cyan)]/10 bg-[var(--valorant-dark)]/30 px-6 py-6 lg:px-10">
        <h1 className="text-2xl font-bold text-white sm:text-3xl">Estrategias</h1>
        <p className="mt-1 text-gray-400">Dibuja rutas para cada jugador sobre el mapa. Planifica ejecuciones y rotaciones.</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {maps.filter((m) => m.imagePath || m.simpleMapPath).map((map) => (
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

      <div className="flex-1 mx-auto w-full max-w-6xl px-4 py-6 flex flex-col lg:flex-row gap-6 lg:px-10">
        <div className="flex-1 min-w-0 flex flex-col">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            {!editing && (
              <button type="button" onClick={startNew} className="rounded-lg bg-[var(--valorant-cyan)] text-[var(--valorant-black)] px-4 py-3 min-h-[44px] text-sm font-medium transition hover:opacity-90 touch-target">
                + Nueva estrategia
              </button>
            )}
            {editing === 'new' && (
              <>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Nombre de la jugada..."
                  className="rounded-lg border border-[var(--valorant-cyan)]/20 bg-[var(--valorant-black)] px-3 py-3 text-sm text-white placeholder-gray-500 focus:border-[var(--valorant-cyan)] focus:outline-none"
                />
                <div className="flex gap-1">
                  {PLAYER_COLORS.map((c, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setCurrentPlayer(i)}
                      className={`w-8 h-8 rounded-full text-xs font-bold text-white transition ${currentPlayer === i ? 'ring-2 ring-white scale-110' : 'opacity-50 hover:opacity-80'}`}
                      style={{ background: c }}
                    >
                      {PLAYER_LABELS[i]}
                    </button>
                  ))}
                </div>
                <button type="button" onClick={handleUndoLast} className="rounded-lg border border-gray-500 px-3 py-2 text-xs text-gray-300 hover:bg-white/5">Deshacer</button>
                <button type="button" onClick={handleSave} disabled={!formName.trim()} className="rounded-lg bg-[var(--valorant-cyan)] px-4 py-2 text-sm font-semibold text-[var(--valorant-black)] hover:opacity-90 disabled:opacity-50">Guardar</button>
                <button type="button" onClick={() => setEditing(null)} className="rounded-lg border border-gray-500 px-3 py-2 text-xs text-gray-300 hover:bg-white/5">Cancelar</button>
              </>
            )}
            {editing === 'view' && (
              <button type="button" onClick={() => setEditing(null)} className="rounded-lg border border-gray-500 px-3 py-2 text-xs text-gray-300 hover:bg-white/5">Cerrar vista</button>
            )}
          </div>

          {hasImage ? (
            <div className="rounded-xl overflow-hidden border border-[var(--valorant-cyan)]/30 bg-[var(--valorant-dark)] shadow-xl shadow-black/30">
              <div className="relative w-full max-w-[700px] mx-auto p-2 sm:p-4">
                <div className="relative w-full" style={{ aspectRatio: '1' }}>
                  <img
                    src={currentMap.simpleMapPath || currentMap.imagePath}
                    alt={`Mapa ${currentMap.name}`}
                    className="w-full h-full object-contain select-none pointer-events-none"
                    draggable={false}
                  />
                  <svg
                    className={`absolute inset-0 w-full h-full ${editing === 'new' ? 'cursor-crosshair' : ''}`}
                    viewBox="0 0 1000 1000"
                    preserveAspectRatio="xMidYMid meet"
                    onClick={editing === 'new' ? handleMapClick : undefined}
                  >
                    <defs>
                      <marker id="arrow" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
                        <polygon points="0 0, 8 3, 0 6" fill="white" fillOpacity={0.8} />
                      </marker>
                    </defs>
                    {(editing === 'new' || editing === 'view') && renderPaths(paths)}
                  </svg>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-[var(--valorant-cyan)]/30 bg-[var(--valorant-dark)] p-12 text-center text-gray-500">
              Sin imagen de mapa disponible.
            </div>
          )}
        </div>

        <aside className="w-full shrink-0 flex flex-col gap-4 lg:w-72">
          <section className="rounded-xl border border-[var(--valorant-cyan)]/20 bg-[var(--valorant-panel)] p-4">
            <h2 className="text-sm font-semibold text-[var(--valorant-cyan)] mb-3">
              {currentMap.name} — Estrategias ({strats.length})
            </h2>
            <ul className="max-h-80 space-y-2 overflow-y-auto">
              {strats.length === 0 && <li className="text-sm text-gray-500 py-2">Sin estrategias. Crea una nueva.</li>}
              {strats.map((s) => (
                <li key={s.id} className="group flex items-center justify-between gap-2 rounded-lg p-2 hover:bg-white/5 transition">
                  <button type="button" onClick={() => handleView(s)} className="flex-1 text-left text-sm text-white font-medium truncate">
                    {s.name}
                  </button>
                  <button type="button" onClick={() => handleDelete(s.id)} className="shrink-0 rounded p-1 text-gray-500 opacity-0 group-hover:opacity-100 hover:text-[var(--valorant-red)] transition">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
                  </button>
                </li>
              ))}
            </ul>
          </section>
          {editing === 'new' && (
            <section className="rounded-xl border border-[var(--valorant-cyan)]/20 bg-[var(--valorant-panel)] p-4">
              <h3 className="text-sm font-semibold text-[var(--valorant-cyan)] mb-2">Cómo usarlo</h3>
              <ul className="text-xs text-gray-400 space-y-1">
                <li>1. Selecciona un jugador (J1-J5)</li>
                <li>2. Haz clic en el mapa para trazar la ruta</li>
                <li>3. Cambia de jugador para otra ruta</li>
                <li>4. Ponle nombre y guarda</li>
              </ul>
            </section>
          )}
        </aside>
      </div>
    </div>
  )
}
