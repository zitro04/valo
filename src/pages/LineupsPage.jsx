import { useState, useCallback, useRef } from 'react'
import { maps, getMapById } from '../data/maps'
import { loadLineups, addLineup, deleteLineup } from '../data/lineups'
import { agents, ABILITY_TYPES, ROLE_COLORS } from '../data/agents'
import Modal from '../components/Modal'

const ABILITY_COLORS = {
  Humo: '#8b5cf6',
  Flash: '#fbbf24',
  Molotov: '#ef4444',
  Recon: '#3b82f6',
  Muro: '#06b6d4',
  Ulti: '#f97316',
  Otro: '#6b7280',
}

export default function LineupsPage() {
  const [currentMapId, setCurrentMapId] = useState('pearl')
  const [lineups, setLineups] = useState(() => loadLineups('pearl'))
  const [addMode, setAddMode] = useState(false)
  const [pendingPos, setPendingPos] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedLineup, setSelectedLineup] = useState(null)
  const [filterAgent, setFilterAgent] = useState('')
  const [filterType, setFilterType] = useState('')
  const fileInputRef = useRef(null)

  const [formName, setFormName] = useState('')
  const [formAgent, setFormAgent] = useState('')
  const [formType, setFormType] = useState('Humo')
  const [formLink, setFormLink] = useState('')
  const [formImage, setFormImage] = useState('')
  const [formNotes, setFormNotes] = useState('')

  const currentMap = getMapById(currentMapId)

  const switchMap = (id) => {
    setCurrentMapId(id)
    setLineups(loadLineups(id))
    setSelectedLineup(null)
    setAddMode(false)
    setPendingPos(null)
  }

  const handleMapClick = useCallback((e) => {
    if (!addMode) return
    const svg = e.currentTarget
    const rect = svg.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 1000
    const y = ((e.clientY - rect.top) / rect.height) * 1000
    setPendingPos({ x: Math.round(x), y: Math.round(y) })
    setFormName('')
    setFormAgent('')
    setFormType('Humo')
    setFormLink('')
    setFormImage('')
    setFormNotes('')
    setModalOpen(true)
  }, [addMode])

  const handleImageUpload = useCallback((e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) {
      alert('La imagen es demasiado grande (máx 2MB)')
      return
    }
    const reader = new FileReader()
    reader.onload = () => setFormImage(reader.result)
    reader.readAsDataURL(file)
  }, [])

  const handleSaveLineup = useCallback(() => {
    if (!formName.trim() || !pendingPos) return
    const updated = addLineup(currentMapId, {
      name: formName.trim(),
      agent: formAgent,
      abilityType: formType,
      x: pendingPos.x,
      y: pendingPos.y,
      link: formLink.trim(),
      imageData: formImage,
      notes: formNotes.trim(),
    })
    setLineups(updated)
    setModalOpen(false)
    setPendingPos(null)
    setAddMode(false)
  }, [currentMapId, formName, formAgent, formType, formLink, formImage, formNotes, pendingPos])

  const handleDelete = useCallback((id) => {
    if (!confirm('¿Eliminar este lineup?')) return
    const updated = deleteLineup(currentMapId, id)
    setLineups(updated)
    if (selectedLineup?.id === id) setSelectedLineup(null)
  }, [currentMapId, selectedLineup])

  const filtered = lineups.filter((l) => {
    if (filterAgent && l.agent !== filterAgent) return false
    if (filterType && l.abilityType !== filterType) return false
    return true
  })

  const hasImage = Boolean(currentMap.simpleMapPath || currentMap.imagePath)

  return (
    <div className="min-h-screen">
      <header className="border-b border-[var(--valorant-cyan)]/10 bg-[var(--valorant-dark)]/30 px-6 py-6 lg:px-10">
        <h1 className="text-2xl font-bold text-white sm:text-3xl">Lineups</h1>
        <p className="mt-1 text-gray-400">Marca posiciones en el mapa y guarda links de TikTok o capturas para cada lineup.</p>
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
            <button
              type="button"
              onClick={() => { setAddMode(!addMode); setSelectedLineup(null) }}
              className={`rounded-lg px-4 py-3 min-h-[44px] text-sm font-medium transition touch-target ${
                addMode
                  ? 'bg-[var(--valorant-red)] text-white'
                  : 'bg-[var(--valorant-cyan)] text-[var(--valorant-black)]'
              }`}
            >
              {addMode ? 'Cancelar' : '+ Añadir lineup'}
            </button>
            {addMode && (
              <span className="text-sm text-[var(--valorant-cyan)] animate-pulse">
                Haz clic en el mapa para colocar el marcador
              </span>
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
                    className={`absolute inset-0 w-full h-full ${addMode ? 'cursor-crosshair' : ''}`}
                    viewBox="0 0 1000 1000"
                    preserveAspectRatio="xMidYMid meet"
                    onClick={handleMapClick}
                  >
                    {filtered.map((l) => {
                      const color = ABILITY_COLORS[l.abilityType] || '#6b7280'
                      const isSelected = selectedLineup?.id === l.id
                      return (
                        <g key={l.id} onClick={(e) => { e.stopPropagation(); setSelectedLineup(l) }} style={{ cursor: 'pointer' }}>
                          <circle cx={l.x} cy={l.y} r={isSelected ? 22 : 16} fill={color} fillOpacity={0.3} stroke={color} strokeWidth={isSelected ? 3 : 2} className={isSelected ? 'animate-pulse' : ''} />
                          <circle cx={l.x} cy={l.y} r={6} fill={color} />
                          <text x={l.x} y={l.y - 24} textAnchor="middle" fill="white" fontSize="11" fontWeight="bold" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}>
                            {l.name.length > 12 ? l.name.slice(0, 12) + '…' : l.name}
                          </text>
                        </g>
                      )
                    })}
                    {pendingPos && (
                      <circle cx={pendingPos.x} cy={pendingPos.y} r={14} fill="var(--valorant-cyan)" fillOpacity={0.4} stroke="var(--valorant-cyan)" strokeWidth={2} strokeDasharray="4 2" />
                    )}
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

        <aside className="w-full shrink-0 flex flex-col gap-4 lg:w-80">
          <section className="rounded-xl border border-[var(--valorant-cyan)]/20 bg-[var(--valorant-panel)] p-4">
            <h2 className="text-sm font-semibold text-[var(--valorant-cyan)] mb-3">
              {currentMap.name} — Lineups ({filtered.length})
            </h2>
            <div className="flex flex-wrap gap-2 mb-3">
              <select
                value={filterAgent}
                onChange={(e) => setFilterAgent(e.target.value)}
                className="rounded-lg border border-[var(--valorant-cyan)]/20 bg-[var(--valorant-black)] px-2 py-2 text-xs text-white"
              >
                <option value="">Todos los agentes</option>
                {agents.map((a) => <option key={a.name} value={a.name}>{a.name}</option>)}
              </select>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="rounded-lg border border-[var(--valorant-cyan)]/20 bg-[var(--valorant-black)] px-2 py-2 text-xs text-white"
              >
                <option value="">Todos los tipos</option>
                {ABILITY_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <ul className="max-h-80 space-y-2 overflow-y-auto">
              {filtered.length === 0 && <li className="text-sm text-gray-500 py-2">Sin lineups. Pulsa «+ Añadir lineup» para empezar.</li>}
              {filtered.map((l) => (
                <li
                  key={l.id}
                  className={`group rounded-lg p-3 transition cursor-pointer ${
                    selectedLineup?.id === l.id ? 'bg-[var(--valorant-cyan)]/15 ring-1 ring-[var(--valorant-cyan)]/30' : 'hover:bg-white/5'
                  }`}
                  onClick={() => setSelectedLineup(selectedLineup?.id === l.id ? null : l)}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-white truncate">{l.name}</p>
                      <p className="text-xs text-gray-400">{l.agent || 'Sin agente'} · {l.abilityType}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="w-3 h-3 rounded-full shrink-0" style={{ background: ABILITY_COLORS[l.abilityType] || '#6b7280' }} />
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); handleDelete(l.id) }}
                        className="shrink-0 rounded p-1 text-gray-500 opacity-0 group-hover:opacity-100 hover:text-[var(--valorant-red)] transition"
                        title="Eliminar"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {selectedLineup && (
            <section className="rounded-xl border border-[var(--valorant-cyan)]/30 bg-[var(--valorant-panel)] p-4">
              <h3 className="text-sm font-semibold text-[var(--valorant-cyan)] mb-2">{selectedLineup.name}</h3>
              <div className="space-y-2 text-sm">
                <p className="text-gray-400">Agente: <span className="text-white">{selectedLineup.agent || '—'}</span></p>
                <p className="text-gray-400">Tipo: <span className="text-white">{selectedLineup.abilityType}</span></p>
                <p className="text-gray-400">Posición: <span className="text-white font-mono">{selectedLineup.x}, {selectedLineup.y}</span></p>
                {selectedLineup.notes && <p className="text-gray-400">Notas: <span className="text-gray-300">{selectedLineup.notes}</span></p>}
                {selectedLineup.link && (
                  <a
                    href={selectedLineup.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--valorant-cyan)]/10 border border-[var(--valorant-cyan)]/30 px-3 py-2 text-xs font-medium text-[var(--valorant-cyan)] hover:bg-[var(--valorant-cyan)]/20 transition"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" /></svg>
                    Abrir link
                  </a>
                )}
                {selectedLineup.imageData && (
                  <div className="mt-2 rounded-lg overflow-hidden border border-[var(--valorant-cyan)]/20">
                    <img src={selectedLineup.imageData} alt="Captura del lineup" className="w-full h-auto" />
                  </div>
                )}
              </div>
            </section>
          )}
        </aside>
      </div>

      <Modal isOpen={modalOpen} onClose={() => { setModalOpen(false); setPendingPos(null) }} title="Nuevo lineup">
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Nombre *</label>
            <input
              type="text"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              placeholder="Ej: Humo A corto desde spawn"
              className="w-full rounded-lg border border-[var(--valorant-cyan)]/20 bg-[var(--valorant-black)] px-3 py-3 text-sm text-white placeholder-gray-500 focus:border-[var(--valorant-cyan)] focus:outline-none"
              autoFocus
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Agente</label>
              <select
                value={formAgent}
                onChange={(e) => setFormAgent(e.target.value)}
                className="w-full rounded-lg border border-[var(--valorant-cyan)]/20 bg-[var(--valorant-black)] px-3 py-3 text-sm text-white"
              >
                <option value="">Seleccionar...</option>
                {agents.map((a) => <option key={a.name} value={a.name}>{a.name} ({a.role})</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Tipo de habilidad</label>
              <select
                value={formType}
                onChange={(e) => setFormType(e.target.value)}
                className="w-full rounded-lg border border-[var(--valorant-cyan)]/20 bg-[var(--valorant-black)] px-3 py-3 text-sm text-white"
              >
                {ABILITY_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Link (TikTok, YouTube, etc.)</label>
            <input
              type="url"
              value={formLink}
              onChange={(e) => setFormLink(e.target.value)}
              placeholder="https://www.tiktok.com/..."
              className="w-full rounded-lg border border-[var(--valorant-cyan)]/20 bg-[var(--valorant-black)] px-3 py-3 text-sm text-white placeholder-gray-500 focus:border-[var(--valorant-cyan)] focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Captura / imagen</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="rounded-lg border border-[var(--valorant-cyan)]/30 bg-[var(--valorant-cyan)]/10 px-3 py-2 text-xs text-[var(--valorant-cyan)] hover:bg-[var(--valorant-cyan)]/20 transition"
              >
                Subir imagen
              </button>
              {formImage && (
                <button type="button" onClick={() => setFormImage('')} className="text-xs text-gray-500 hover:text-[var(--valorant-red)]">
                  Quitar
                </button>
              )}
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            {formImage && <img src={formImage} alt="Preview" className="mt-2 max-h-32 rounded-lg border border-[var(--valorant-cyan)]/20" />}
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Notas</label>
            <textarea
              value={formNotes}
              onChange={(e) => setFormNotes(e.target.value)}
              rows={2}
              placeholder="Alinear con la esquina del tejado..."
              className="w-full rounded-lg border border-[var(--valorant-cyan)]/20 bg-[var(--valorant-black)] px-3 py-3 text-sm text-white placeholder-gray-500 focus:border-[var(--valorant-cyan)] focus:outline-none resize-none"
            />
          </div>
          <button
            type="button"
            onClick={handleSaveLineup}
            disabled={!formName.trim()}
            className="w-full rounded-lg bg-[var(--valorant-cyan)] px-4 py-3 text-sm font-semibold text-[var(--valorant-black)] transition hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Guardar lineup
          </button>
        </div>
      </Modal>
    </div>
  )
}
