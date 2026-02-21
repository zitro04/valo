import { useState, useCallback, useEffect, useRef } from 'react'
import { maps, getMapById } from '../data/maps'
import { loadNotes, saveNotes } from '../data/notes'

export default function NotesPage() {
  const [currentMapId, setCurrentMapId] = useState('pearl')
  const [text, setText] = useState(() => loadNotes('pearl'))
  const [saved, setSaved] = useState(false)
  const timerRef = useRef(null)

  const currentMap = getMapById(currentMapId)

  const switchMap = (id) => {
    setCurrentMapId(id)
    setText(loadNotes(id))
    setSaved(false)
  }

  const handleChange = useCallback((e) => {
    const val = e.target.value
    setText(val)
    setSaved(false)
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      saveNotes(currentMapId, val)
      setSaved(true)
    }, 500)
  }, [currentMapId])

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current) }, [])

  useEffect(() => {
    if (saved) {
      const t = setTimeout(() => setSaved(false), 2000)
      return () => clearTimeout(t)
    }
  }, [saved])

  return (
    <div className="min-h-screen">
      <header className="border-b border-[var(--valorant-cyan)]/10 bg-[var(--valorant-dark)]/30 px-6 py-6 lg:px-10">
        <h1 className="text-2xl font-bold text-white sm:text-3xl">Notas por mapa</h1>
        <p className="mt-1 text-gray-400">Apunta tips, timings, strats o lo que quieras para cada mapa. Se guarda automáticamente.</p>
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

      <div className="p-6 lg:p-10 max-w-3xl">
        <div className="rounded-xl border border-[var(--valorant-cyan)]/20 bg-[var(--valorant-panel)] p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-[var(--valorant-cyan)]">
              {currentMap.name}
            </h2>
            {saved && (
              <span className="text-xs text-green-400 animate-pulse">Guardado</span>
            )}
          </div>
          <textarea
            value={text}
            onChange={handleChange}
            rows={16}
            placeholder={`Escribe tus notas para ${currentMap.name}...`}
            className="w-full rounded-lg border border-[var(--valorant-cyan)]/20 bg-[var(--valorant-black)] px-4 py-3 text-sm text-white placeholder-gray-500 focus:border-[var(--valorant-cyan)] focus:outline-none resize-y leading-relaxed"
          />
          <p className="mt-2 text-xs text-gray-500">{text.length} caracteres</p>
        </div>
      </div>
    </div>
  )
}
