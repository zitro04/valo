import { useState, useCallback, useEffect, lazy, Suspense } from 'react'
import MapView from '../components/MapView'
import NameZoneModal from '../components/NameZoneModal'

const Map3DViewer = lazy(() => import('../components/Map3DViewer'))
import { maps, getMapById } from '../data/maps'
import { getDefaultCallouts } from '../data/callouts/index.js'
import { getSinglePlayerList } from '../data/singleUser'
import { saveExamResult, getLastResultsByJugador } from '../data/examResults'

const EXAM_SIZE = 20

function getStorageKey(mapId) {
  return `valoplant-callouts-${mapId}`
}

function loadCalloutsForMap(mapId) {
  try {
    const raw = localStorage.getItem(getStorageKey(mapId))
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) return parsed
    }
  } catch (_) {}
  return getDefaultCallouts(mapId)
}

function createCalloutFromPoints(points, name) {
  const pointsStr = points.map(([x, y]) => `${Math.round(x)},${Math.round(y)}`).join(' ')
  const id = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
  return { id, name: name.trim(), points: pointsStr }
}

export default function CalloutsPage() {
  const [currentMapId, setCurrentMapId] = useState('pearl')
  const [editMode, setEditMode] = useState(false)
  const [editPoints, setEditPoints] = useState([])
  const [callouts, setCallouts] = useState(() => loadCalloutsForMap('pearl'))
  const [lastJson, setLastJson] = useState(null)
  const [nameModalOpen, setNameModalOpen] = useState(false)
  const [pendingPoints, setPendingPoints] = useState(null)
  const [copyFeedback, setCopyFeedback] = useState(false)
  const [copyAllFeedback, setCopyAllFeedback] = useState(false)
  const [searchFilter, setSearchFilter] = useState('')
  const [selectedZoneId, setSelectedZoneId] = useState(null)
  const [practiceMode, setPracticeMode] = useState(false)
  const [practiceReverseMode, setPracticeReverseMode] = useState(false)
  const [practiceZoneId, setPracticeZoneId] = useState(null)
  const [practiceFeedback, setPracticeFeedback] = useState(null)
  const [practiceGuessInput, setPracticeGuessInput] = useState('')
  const [examStep, setExamStep] = useState('idle')
  const [examJugador, setExamJugador] = useState(null)
  const [examQuestions, setExamQuestions] = useState([])
  const [examCurrentIndex, setExamCurrentIndex] = useState(0)
  const [examScore, setExamScore] = useState(0)
  const [examFeedback, setExamFeedback] = useState(null)
  const [show3DViewer, setShow3DViewer] = useState(false)
  const [mapSection, setMapSection] = useState('zones')
  const [examTimer, setExamTimer] = useState(0)
  const [examTimerEnabled, setExamTimerEnabled] = useState(false)
  const [examTimeLimit, setExamTimeLimit] = useState(10)
  const allowedExamJugadores = getSinglePlayerList()

  const currentMap = getMapById(currentMapId)
  const filteredCallouts = searchFilter.trim()
    ? callouts.filter((z) => z.name.toLowerCase().includes(searchFilter.toLowerCase()))
    : callouts

  const practiceZone = practiceZoneId ? callouts.find((z) => z.id === practiceZoneId) : null
  const isExamActive = examStep === 'exam'
  const isPracticeReverse = practiceMode && practiceReverseMode
  const examQuestionZoneId = isExamActive && examQuestions[examCurrentIndex] != null ? examQuestions[examCurrentIndex] : null
  const examQuestionZone = examQuestionZoneId ? callouts.find((z) => z.id === examQuestionZoneId) : null

  const pickRandomZone = useCallback(() => {
    if (callouts.length === 0) return null
    return callouts[Math.floor(Math.random() * callouts.length)]
  }, [callouts])

  const startPractice = useCallback(() => {
    const z = pickRandomZone()
    setPracticeZoneId(z?.id ?? null)
    setPracticeFeedback(null)
  }, [pickRandomZone])

  useEffect(() => {
    if (practiceMode && callouts.length > 0 && !practiceZoneId) startPractice()
  }, [practiceMode, callouts.length, practiceZoneId, startPractice])

  const checkPracticeGuess = useCallback(() => {
    if (!practiceZone || !practiceGuessInput.trim()) return
    const normalized = (s) => s.trim().toLowerCase().replace(/\s+/g, ' ')
    const correct = normalized(practiceGuessInput) === normalized(practiceZone.name)
    setPracticeFeedback(correct ? 'correct' : 'incorrect')
    setPracticeGuessInput('')
    if (correct) {
      setTimeout(() => {
        const next = pickRandomZone()
        setPracticeZoneId(next?.id ?? null)
        setPracticeFeedback(null)
      }, 600)
    }
  }, [practiceZone, practiceGuessInput, pickRandomZone])

  const pick20RandomZones = useCallback(() => {
    if (callouts.length === 0) return []
    const shuffled = [...callouts].sort(() => Math.random() - 0.5)
    return shuffled.slice(0, Math.min(EXAM_SIZE, shuffled.length)).map((z) => z.id)
  }, [callouts])

  const pick20WeightedZones = useCallback(() => {
    if (callouts.length === 0) return []
    const failKey = `valoplant-fails-${currentMapId}`
    let fails = {}
    try { fails = JSON.parse(localStorage.getItem(failKey) || '{}') } catch {}
    const weighted = callouts.map((z) => ({ id: z.id, weight: 1 + (fails[z.id] || 0) * 2 }))
    const totalWeight = weighted.reduce((s, w) => s + w.weight, 0)
    const picked = []
    const used = new Set()
    const limit = Math.min(EXAM_SIZE, callouts.length)
    while (picked.length < limit) {
      let r = Math.random() * totalWeight
      for (const w of weighted) {
        if (used.has(w.id)) continue
        r -= w.weight
        if (r <= 0) { picked.push(w.id); used.add(w.id); break }
      }
      if (picked.length === used.size && picked.length < limit) {
        for (const z of callouts) {
          if (!used.has(z.id)) { picked.push(z.id); used.add(z.id); break }
        }
      }
    }
    return picked
  }, [callouts, currentMapId])

  const startExam = useCallback(
    (jugador) => {
      const questions = pick20WeightedZones()
      if (questions.length === 0) return
      setMapSection('zones')
      setExamJugador(jugador)
      setExamQuestions(questions)
      setExamCurrentIndex(0)
      setExamScore(0)
      setExamFeedback(null)
      setExamTimer(examTimerEnabled ? examTimeLimit : 0)
      setExamStep('exam')
      setPracticeMode(false)
      setEditMode(false)
    },
    [pick20WeightedZones, examTimerEnabled, examTimeLimit]
  )

  useEffect(() => {
    if (examStep !== 'exam' || !examTimerEnabled || examFeedback) return
    if (examTimer <= 0) {
      setExamFeedback('incorrect')
      const failKey = `valoplant-fails-${currentMapId}`
      let fails = {}
      try { fails = JSON.parse(localStorage.getItem(failKey) || '{}') } catch {}
      const correctId = examQuestions[examCurrentIndex]
      fails[correctId] = (fails[correctId] || 0) + 1
      localStorage.setItem(failKey, JSON.stringify(fails))
      setTimeout(() => {
        setExamFeedback(null)
        const nextIndex = examCurrentIndex + 1
        if (nextIndex >= examQuestions.length) {
          saveExamResult(examJugador.id, { score: examScore, total: examQuestions.length, mapId: currentMapId })
          setExamStep('result')
        } else {
          setExamCurrentIndex(nextIndex)
          setExamTimer(examTimeLimit)
        }
      }, 600)
      return
    }
    const id = setInterval(() => setExamTimer((t) => Math.max(0, t - 1)), 1000)
    return () => clearInterval(id)
  }, [examStep, examTimerEnabled, examTimer, examFeedback, examCurrentIndex, examQuestions, examJugador, examScore, currentMapId, examTimeLimit])

  const handleExamZoneClick = useCallback(
    (zone) => {
      if (examStep !== 'exam' || examCurrentIndex >= examQuestions.length) return
      const correctId = examQuestions[examCurrentIndex]
      const correct = zone.id === correctId
      if (!correct) {
        const failKey = `valoplant-fails-${currentMapId}`
        let fails = {}
        try { fails = JSON.parse(localStorage.getItem(failKey) || '{}') } catch {}
        fails[correctId] = (fails[correctId] || 0) + 1
        localStorage.setItem(failKey, JSON.stringify(fails))
      }
      setExamFeedback(correct ? 'correct' : 'incorrect')
      setTimeout(() => {
        setExamFeedback(null)
        const nextIndex = examCurrentIndex + 1
        const newScore = correct ? examScore + 1 : examScore
        if (nextIndex >= examQuestions.length) {
          saveExamResult(examJugador.id, {
            score: newScore,
            total: examQuestions.length,
            mapId: currentMapId,
          })
          setExamScore(newScore)
          setExamStep('result')
        } else {
          setExamScore(newScore)
          setExamCurrentIndex(nextIndex)
          if (examTimerEnabled) setExamTimer(examTimeLimit)
        }
      }, 600)
    },
    [examStep, examCurrentIndex, examQuestions, examJugador, examScore, currentMapId, examTimerEnabled, examTimeLimit]
  )

  const handleMapViewZoneClick = useCallback(
    (zone) => {
      if (isExamActive) {
        handleExamZoneClick(zone)
        return
      }
      if (!practiceMode) return
      if (zone.id === practiceZoneId) {
        setPracticeFeedback('correct')
        setTimeout(() => {
          const next = pickRandomZone()
          setPracticeZoneId(next?.id ?? null)
          setPracticeFeedback(null)
        }, 600)
      } else {
        setPracticeFeedback('incorrect')
      }
    },
    [practiceMode, practiceZoneId, pickRandomZone, isExamActive, handleExamZoneClick]
  )

  useEffect(() => {
    setCallouts(loadCalloutsForMap(currentMapId))
    setLastJson(null)
    setEditPoints([])
    setSelectedZoneId(null)
    setPracticeZoneId(null)
    setPracticeFeedback(null)
    if (examStep === 'exam' || examStep === 'result') setExamStep('idle')
  }, [currentMapId])

  useEffect(() => {
    localStorage.setItem(getStorageKey(currentMapId), JSON.stringify(callouts))
  }, [currentMapId, callouts])

  const handleRequestNameForPolygon = useCallback((points) => {
    setPendingPoints(points)
    setNameModalOpen(true)
  }, [])

  const handleConfirmName = useCallback(
    (name) => {
      if (!pendingPoints?.length) return
      const obj = createCalloutFromPoints(pendingPoints, name)
      setCallouts((prev) => [...prev, obj])
      setLastJson(obj)
      console.log('Callout creado. JSON para callouts.json:\n', JSON.stringify(obj, null, 2))
      setNameModalOpen(false)
      setPendingPoints(null)
    },
    [pendingPoints]
  )

  const handleCancelNameModal = useCallback(() => {
    setNameModalOpen(false)
    setPendingPoints(null)
  }, [])

  const handleFinishPolygon = useCallback(() => {
    if (editPoints.length < 3) return
    setPendingPoints(editPoints)
    setEditPoints([])
    setNameModalOpen(true)
  }, [editPoints])

  const handleUndoPoint = useCallback(() => {
    setEditPoints((prev) => prev.slice(0, -1))
  }, [])

  const handleCancelPolygon = useCallback(() => {
    setEditPoints([])
  }, [])

  const handleDeleteCallout = useCallback((id, name) => {
    if (!window.confirm(`¿Eliminar la zona "${name}"?`)) return
    setCallouts((prev) => prev.filter((c) => c.id !== id))
    setLastJson((prev) => (prev?.id === id ? null : prev))
  }, [])

  const handleExportCallouts = useCallback(() => {
    const blob = new Blob([JSON.stringify(callouts, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `callouts-${currentMapId}-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }, [callouts, currentMapId])

  const handleImportCallouts = useCallback(() => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = (e) => {
      const file = e.target.files?.[0]
      if (!file) return
      const reader = new FileReader()
      reader.onload = () => {
        try {
          const imported = JSON.parse(reader.result)
          if (!Array.isArray(imported)) { alert('El archivo no contiene un array válido'); return }
          const merge = confirm('¿Fusionar con los callouts existentes? (Cancelar = reemplazar)')
          if (merge) {
            setCallouts((prev) => {
              const ids = new Set(prev.map((c) => c.id))
              return [...prev, ...imported.filter((c) => !ids.has(c.id))]
            })
          } else {
            setCallouts(imported)
          }
        } catch { alert('Error al leer el archivo JSON') }
      }
      reader.readAsText(file)
    }
    input.click()
  }, [])

  const handleCopyJson = useCallback(() => {
    if (!lastJson) return
    const text = JSON.stringify(lastJson, null, 2)
    navigator.clipboard.writeText(text).then(() => {
      setCopyFeedback(true)
      setTimeout(() => setCopyFeedback(false), 2000)
    })
  }, [lastJson])

  const handleCopyAllCallouts = useCallback(() => {
    const text = JSON.stringify(callouts, null, 2)
    navigator.clipboard.writeText(text).then(() => {
      setCopyAllFeedback(true)
      setTimeout(() => setCopyAllFeedback(false), 2000)
    })
  }, [callouts])

  const handleResetCallouts = useCallback(() => {
    setCallouts(getDefaultCallouts(currentMapId))
    setLastJson(null)
  }, [currentMapId])

  return (
    <div className="min-h-screen flex flex-col">
      <header className="shrink-0 border-b border-[var(--valorant-cyan)]/10 bg-[var(--valorant-black)]/90 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl px-4 py-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between lg:px-10">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold tracking-wide text-white sm:text-2xl">
              <span className="text-[var(--valorant-cyan)]">Callouts</span>
            </h1>
            <div className="flex flex-wrap gap-2">
              {maps.map((map) => (
                <button
                  key={map.id}
                  type="button"
                  onClick={() => setCurrentMapId(map.id)}
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
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {mapSection === 'zones' && (currentMap.simpleMapPath || currentMap.imagePath) && callouts.length >= 5 && examStep === 'idle' && (
              <button
                type="button"
                onClick={() => setExamStep('select')}
                className="rounded-lg border border-[var(--valorant-cyan)]/40 bg-[var(--valorant-cyan)]/10 px-4 py-3 min-h-[44px] text-sm font-medium text-[var(--valorant-cyan)] transition hover:bg-[var(--valorant-cyan)]/20 touch-target"
              >
                Modo examen (hasta 20 preguntas)
              </button>
            )}
            {callouts.length > 0 && examStep === 'idle' && (
              <>
                <label className="flex items-center gap-2 cursor-pointer select-none min-h-[44px] touch-target">
                  <span className="text-sm text-gray-400">Modo práctica</span>
                  <span className="relative inline-flex h-7 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-[var(--valorant-panel)] transition-colors focus-within:ring-2 focus-within:ring-[var(--valorant-cyan)] focus-within:ring-offset-2 focus-within:ring-offset-[var(--valorant-black)]">
                    <input
                      type="checkbox"
                      checked={practiceMode}
                      onChange={(e) => {
                        const on = e.target.checked
                        setPracticeMode(on)
                        setPracticeGuessInput('')
                        if (on) {
                          setEditMode(false)
                          setEditPoints([])
                          startPractice()
                        } else setPracticeZoneId(null)
                        setPracticeFeedback(null)
                      }}
                      className="sr-only"
                    />
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-[var(--valorant-cyan)] shadow ring-0 transition ${
                        practiceMode ? 'translate-x-4' : 'translate-x-0.5'
                      }`}
                    />
                  </span>
                </label>
                {practiceMode && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">Tipo:</span>
                    <button
                      type="button"
                      onClick={() => {
                        setPracticeReverseMode(false)
                        setPracticeGuessInput('')
                        startPractice()
                        setPracticeFeedback(null)
                      }}
                      className={`rounded-lg px-3 py-2.5 min-h-[44px] text-xs font-medium transition touch-target ${
                        !practiceReverseMode ? 'bg-[var(--valorant-cyan)]/20 text-[var(--valorant-cyan)]' : 'text-gray-400 hover:bg-white/5'
                      }`}
                    >
                      ¿Dónde está?
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setPracticeReverseMode(true)
                        setPracticeGuessInput('')
                        startPractice()
                        setPracticeFeedback(null)
                      }}
                      className={`rounded-lg px-3 py-2.5 min-h-[44px] text-xs font-medium transition touch-target ${
                        practiceReverseMode ? 'bg-[var(--valorant-cyan)]/20 text-[var(--valorant-cyan)]' : 'text-gray-400 hover:bg-white/5'
                      }`}
                    >
                      ¿Cómo se llama?
                    </button>
                  </div>
                )}
              </>
            )}
            <label className={`flex items-center gap-3 cursor-pointer select-none min-h-[44px] touch-target ${examStep !== 'idle' ? 'opacity-50' : ''}`}>
              <span className="text-sm text-gray-400">Modo Edición</span>
              <span className="relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-[var(--valorant-panel)] transition-colors focus-within:ring-2 focus-within:ring-[var(--valorant-cyan)] focus-within:ring-offset-2 focus-within:ring-offset-[var(--valorant-black)]">
                <input
                  type="checkbox"
                  checked={editMode}
                  onChange={(e) => {
                    const on = e.target.checked
                    setEditMode(on)
                    setEditPoints([])
                    if (on) setPracticeMode(false)
                  }}
                  className="sr-only"
                  disabled={practiceMode || examStep !== 'idle'}
                />
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-[var(--valorant-cyan)] shadow ring-0 transition ${
                  editMode ? 'translate-x-5' : 'translate-x-0.5'
                } ${practiceMode ? 'opacity-50' : ''}`}
              />
            </span>
          </label>
        </div>
        </div>
      </header>

      <div className="flex-1 mx-auto w-full max-w-6xl px-4 py-6 flex flex-col lg:flex-row gap-6 lg:px-10">
        <div className="flex-1 min-w-0 flex flex-col">
          {examStep === 'select' && (
            <div className="mb-4 rounded-xl border border-[var(--valorant-cyan)]/30 bg-[var(--valorant-panel)] p-5">
              <h2 className="text-lg font-semibold text-[var(--valorant-cyan)] mb-3">
                Modo examen — Tu examen
              </h2>
              <p className="text-sm text-gray-400 mb-4">
                Hasta 20 preguntas en el mapa <strong className="text-gray-300">{currentMap.name}</strong>. El resultado se guardará en tu historial.
              </p>
              <div className="mb-4 flex flex-wrap items-center gap-3 rounded-lg border border-[var(--valorant-cyan)]/20 bg-[var(--valorant-dark)] p-3">
                <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-400">
                  <input type="checkbox" checked={examTimerEnabled} onChange={(e) => setExamTimerEnabled(e.target.checked)} className="accent-[var(--valorant-cyan)]" />
                  Contrarreloj
                </label>
                {examTimerEnabled && (
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min={3}
                      max={30}
                      value={examTimeLimit}
                      onChange={(e) => setExamTimeLimit(Number(e.target.value))}
                      className="w-24 accent-[var(--valorant-cyan)]"
                    />
                    <span className="text-sm font-medium text-[var(--valorant-cyan)]">{examTimeLimit}s</span>
                  </div>
                )}
                <span className="text-xs text-gray-500">Las zonas más falladas aparecen con más frecuencia.</span>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {allowedExamJugadores.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => startExam(m)}
                    className="rounded-lg border border-[var(--valorant-cyan)]/40 bg-[var(--valorant-cyan)]/10 px-4 py-3 min-h-[44px] text-sm font-medium text-[var(--valorant-cyan)] transition hover:bg-[var(--valorant-cyan)]/20 touch-target"
                  >
                    {m.name}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setExamStep('idle')}
                className="min-h-[44px] px-3 text-sm text-gray-500 hover:text-gray-300 transition touch-target"
              >
                Cancelar
              </button>
            </div>
          )}

          {examStep === 'result' && examJugador && (
            <div className="mb-4 rounded-xl border border-[var(--valorant-cyan)]/30 bg-[var(--valorant-panel)] p-5">
              <h2 className="text-lg font-semibold text-[var(--valorant-cyan)] mb-2">Resultado del examen</h2>
              <p className="text-2xl font-bold text-white mb-1">
                {examJugador.name}: {examScore}/{examQuestions.length} ({Math.round((examScore / examQuestions.length) * 100)}%)
              </p>
              <p className="text-sm text-gray-400 mb-4">Guardado para {examJugador.name}</p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setExamStep('select')}
                  className="rounded-lg bg-[var(--valorant-cyan)] px-4 py-3 min-h-[44px] text-sm font-semibold text-[var(--valorant-black)] transition hover:opacity-90 touch-target"
                >
                  Nuevo examen
                </button>
                <button
                  type="button"
                  onClick={() => setExamStep('idle')}
                  className="rounded-lg border border-gray-500 px-4 py-3 min-h-[44px] text-sm font-medium text-gray-400 transition hover:bg-white/5 touch-target"
                >
                  Volver
                </button>
              </div>
            </div>
          )}

          <div className="mb-4 flex flex-wrap items-center gap-2 rounded-xl border border-[var(--valorant-cyan)]/20 bg-[var(--valorant-panel)]/60 p-2">
            <button
              type="button"
              onClick={() => setMapSection('zones')}
              className={`rounded-lg px-4 py-3 min-h-[44px] text-sm font-medium transition touch-target ${
                mapSection === 'zones'
                  ? 'bg-[var(--valorant-cyan)] text-[var(--valorant-black)]'
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              Mapa con zonas
            </button>
            <button
              type="button"
              onClick={() => setMapSection('image')}
              className={`rounded-lg px-4 py-3 min-h-[44px] text-sm font-medium transition touch-target ${
                mapSection === 'image'
                  ? 'bg-[var(--valorant-cyan)] text-[var(--valorant-black)]'
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              Imagen detallada
            </button>
            {currentMap?.model3D && (
              <button
                type="button"
                onClick={() => setMapSection('3d')}
                className={`rounded-lg px-4 py-3 min-h-[44px] text-sm font-medium transition touch-target ${
                  mapSection === '3d'
                    ? 'bg-[var(--valorant-cyan)] text-[var(--valorant-black)]'
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                Vista 3D
              </button>
            )}
          </div>

          {mapSection === 'zones' && (
          <>
            {isExamActive && examQuestionZone && (
              <div className="mb-4 rounded-xl border border-[var(--valorant-cyan)]/20 bg-[var(--valorant-panel)]/60 p-4">
                <div className="flex flex-wrap items-center gap-3 rounded-lg border border-[var(--valorant-cyan)]/30 bg-[var(--valorant-dark)] p-3">
                  <span className="rounded bg-[var(--valorant-panel)] px-2 py-0.5 text-sm font-medium text-[var(--valorant-cyan)]">
                    Pregunta {examCurrentIndex + 1}/{examQuestions.length}
                  </span>
                  <p className="text-lg font-semibold text-[var(--valorant-cyan)]">
                    ¿Dónde está <span className="text-white">{examQuestionZone?.name}</span>?
                  </p>
                  {examTimerEnabled && !examFeedback && (
                    <span className={`ml-auto rounded px-2 py-0.5 text-sm font-bold ${examTimer <= 3 ? 'text-[var(--valorant-red)] animate-pulse' : 'text-[var(--valorant-cyan)]'}`}>
                      {examTimer}s
                    </span>
                  )}
                  {examFeedback === 'correct' && <span className="text-green-400 font-semibold">¡Correcto!</span>}
                  {examFeedback === 'incorrect' && <span className="text-[var(--valorant-red)] font-semibold">No, prueba otra zona.</span>}
                </div>
              </div>
            )}
            {!isExamActive && practiceMode && !practiceReverseMode && practiceZone && (
              <div className="mb-4 rounded-xl border border-[var(--valorant-cyan)]/20 bg-[var(--valorant-panel)]/60 p-4">
                <div className="flex flex-wrap items-center gap-3 rounded-lg border border-[var(--valorant-cyan)]/30 bg-[var(--valorant-dark)] p-3">
                  <p className="text-lg font-semibold text-[var(--valorant-cyan)]">
                    ¿Dónde está <span className="text-white">{practiceZone?.name}</span>?
                  </p>
                  {practiceFeedback === 'correct' && <span className="text-green-400 font-semibold">¡Correcto!</span>}
                  {practiceFeedback === 'incorrect' && <span className="text-[var(--valorant-red)] font-semibold">No, prueba otra zona.</span>}
                </div>
              </div>
            )}
            {!isExamActive && isPracticeReverse && practiceZone && (
              <div className="mb-4 rounded-xl border border-[var(--valorant-cyan)]/20 bg-[var(--valorant-panel)]/60 p-4">
                <div className="rounded-lg border border-[var(--valorant-cyan)]/30 bg-[var(--valorant-dark)] p-3">
                  <p className="text-lg font-semibold text-[var(--valorant-cyan)] mb-2">¿Cómo se llama esta zona?</p>
                  <div className="flex flex-wrap items-center gap-2">
                    <input
                      type="text"
                      value={practiceGuessInput}
                      onChange={(e) => setPracticeGuessInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && checkPracticeGuess()}
                      placeholder="Escribe el nombre del callout..."
                      className="flex-1 min-w-[200px] rounded-lg border border-[var(--valorant-cyan)]/30 bg-[var(--valorant-black)] px-3 py-3 min-h-[44px] text-base text-white placeholder-gray-500 focus:border-[var(--valorant-cyan)] focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={checkPracticeGuess}
                      disabled={!practiceGuessInput.trim()}
                      className="rounded-lg bg-[var(--valorant-cyan)] px-4 py-3 min-h-[44px] text-sm font-semibold text-[var(--valorant-black)] transition hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed touch-target"
                    >
                      Comprobar
                    </button>
                  </div>
                  {practiceFeedback === 'correct' && <span className="inline-block mt-2 text-green-400 font-semibold">¡Correcto!</span>}
                  {practiceFeedback === 'incorrect' && <span className="inline-block mt-2 text-[var(--valorant-red)] font-semibold">No, prueba otra vez.</span>}
                </div>
              </div>
            )}

            {editMode && (
              <div className="mb-4 flex flex-wrap items-center gap-3 rounded-xl border border-[var(--valorant-cyan)]/30 bg-[var(--valorant-panel)] p-3">
                <span className="text-sm text-gray-400">Puntos: <strong className="text-[var(--valorant-cyan)]">{editPoints.length}</strong></span>
                <button type="button" onClick={handleUndoPoint} disabled={editPoints.length === 0} className="rounded-lg border border-gray-500 px-4 py-3 min-h-[44px] text-sm text-gray-300 transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-50 touch-target">
                  Deshacer último
                </button>
                <button type="button" onClick={handleCancelPolygon} disabled={editPoints.length === 0} className="rounded-lg border border-gray-500 px-4 py-3 min-h-[44px] text-sm text-gray-300 transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-50 touch-target">
                  Cancelar polígono
                </button>
                <button type="button" onClick={handleFinishPolygon} disabled={editPoints.length < 3} className="rounded-lg bg-[var(--valorant-cyan)] px-4 py-3 min-h-[44px] text-sm font-semibold text-[var(--valorant-black)] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 touch-target">
                  Terminar y nombrar
                </button>
              </div>
            )}

            {(currentMap.simpleMapPath || currentMap.imagePath) ? (
              <div className="rounded-xl overflow-hidden border border-[var(--valorant-cyan)]/30 bg-[var(--valorant-dark)] shadow-xl shadow-black/30">
                <div className="flex justify-center p-2 sm:p-4">
                  <MapView
                    editMode={editMode}
                    callouts={callouts}
                    editPoints={editPoints}
                    setEditPoints={setEditPoints}
                    onRequestNameForPolygon={handleRequestNameForPolygon}
                    mapImagePath={currentMap.simpleMapPath || currentMap.imagePath}
                    mapName={currentMap.name}
                    highlightZoneId={isExamActive ? null : practiceMode ? (isPracticeReverse ? practiceZoneId : null) : selectedZoneId}
                    onClearHighlight={() => setSelectedZoneId(null)}
                    onZoneClick={isExamActive ? handleExamZoneClick : practiceMode && !practiceReverseMode ? handleMapViewZoneClick : undefined}
                    practiceMode={practiceMode || isExamActive}
                  />
                </div>
              </div>
            ) : (
              <p className="rounded-xl border border-[var(--valorant-cyan)]/20 bg-[var(--valorant-panel)]/60 p-4 text-gray-500">Sin imagen de mapa disponible.</p>
            )}
          </>
          )}

          {mapSection === 'image' && (
            <div className="rounded-xl overflow-hidden border border-[var(--valorant-cyan)]/30 bg-[var(--valorant-dark)] shadow-xl shadow-black/30">
              <p className="px-4 py-2 text-sm text-gray-400">Imagen de referencia detallada (sin zonas interactivas).</p>
              <div className="flex justify-center p-2 sm:p-4">
                {(currentMap.referenceImagePath || currentMap.imagePath) ? (
                  <img
                    src={currentMap.referenceImagePath || currentMap.imagePath}
                    alt={`Referencia ${currentMap.name}`}
                    className="max-w-full max-w-[700px] h-auto object-contain rounded-lg"
                  />
                ) : (
                  <p className="text-gray-500 py-8">Sin imagen de referencia para este mapa.</p>
                )}
              </div>
            </div>
          )}

          {mapSection === '3d' && currentMap?.model3D && (
            <div className="rounded-xl overflow-hidden border border-[var(--valorant-cyan)]/30 bg-[var(--valorant-dark)] shadow-xl shadow-black/30" style={{ height: '70vh' }}>
              <Suspense fallback={<div className="flex h-full items-center justify-center text-gray-400">Cargando modelo 3D...</div>}>
                <Map3DViewer modelPath={currentMap.model3D} />
              </Suspense>
            </div>
          )}
        </div>

        <aside className="w-full shrink-0 flex flex-col gap-4 lg:w-80">
          <section className="rounded-xl border border-[var(--valorant-cyan)]/20 bg-[var(--valorant-panel)] p-4">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-[var(--valorant-cyan)]">
                {currentMap.name} — Zonas ({callouts.length})
              </h2>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyAllCallouts}
                  className="min-h-[44px] px-2 text-xs text-gray-500 transition hover:text-[var(--valorant-cyan)] touch-target"
                  title="Copiar todos los callouts para guardar en el proyecto"
                >
                  {copyAllFeedback ? '¡Copiado!' : 'Exportar todo'}
                </button>
                <button
                  type="button"
                  onClick={handleResetCallouts}
                  className="min-h-[44px] px-2 text-xs text-gray-500 transition hover:text-[var(--valorant-cyan)] touch-target"
                >
                  Restablecer
                </button>
              </div>
            </div>
            <div className="mb-2 flex flex-wrap gap-1.5">
              <button type="button" onClick={handleExportCallouts} className="rounded border border-[var(--valorant-cyan)]/20 px-2 py-1 text-xs text-[var(--valorant-cyan)] hover:bg-[var(--valorant-cyan)]/10 transition">
                Descargar .json
              </button>
              <button type="button" onClick={handleImportCallouts} className="rounded border border-[var(--valorant-cyan)]/20 px-2 py-1 text-xs text-[var(--valorant-cyan)] hover:bg-[var(--valorant-cyan)]/10 transition">
                Importar .json
              </button>
            </div>
            <p className="mb-2 text-xs text-gray-500">
              Guardado en el navegador. Usa «Exportar todo» o descarga el .json para compartir.
            </p>
            <input
              type="search"
              placeholder="Buscar zona..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="mb-2 w-full rounded-lg border border-[var(--valorant-cyan)]/20 bg-[var(--valorant-black)] px-3 py-3 min-h-[44px] text-base text-white placeholder-gray-500 focus:border-[var(--valorant-cyan)] focus:outline-none"
            />
            <ul className="max-h-48 space-y-1.5 overflow-y-auto text-sm text-gray-300">
              {filteredCallouts.map((z) => (
                <li
                  key={z.id}
                  className={`group flex items-center justify-between gap-2 rounded px-2 py-2 min-h-[44px] transition touch-target ${
                    selectedZoneId === z.id ? 'bg-[var(--valorant-cyan)]/15 text-[var(--valorant-cyan)]' : 'hover:bg-white/5'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setSelectedZoneId((id) => (id === z.id ? null : z.id))}
                    className="min-w-0 flex-1 truncate text-left min-h-[44px] py-2 flex items-center touch-target"
                  >
                    {z.name}
                  </button>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); handleDeleteCallout(z.id, z.name) }}
                    className="shrink-0 rounded p-2 min-h-[44px] min-w-[44px] flex items-center justify-center text-gray-500 opacity-70 transition hover:bg-white/5 hover:text-[var(--valorant-red)] group-hover:opacity-100 touch-target"
                    title="Eliminar zona"
                    aria-label={`Eliminar ${z.name}`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      <line x1="10" y1="11" x2="10" y2="17" />
                      <line x1="14" y1="11" x2="14" y2="17" />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
            {searchFilter.trim() && <p className="mt-1 text-xs text-gray-500">{filteredCallouts.length} de {callouts.length} zonas</p>}
          </section>

          <section className="rounded-xl border border-[var(--valorant-cyan)]/20 bg-[var(--valorant-panel)] p-4">
            <h2 className="mb-3 text-sm font-semibold text-[var(--valorant-cyan)]">Mis últimos exámenes</h2>
            <ul className="space-y-1 text-sm text-gray-300">
              {(() => {
                const m = allowedExamJugadores[0]
                const lastResults = getLastResultsByJugador(m.id, 5)
                return (
                  <li className="flex items-center justify-between gap-2 rounded px-2 py-1">
                    <span className="font-medium text-white">{m.name}</span>
                    {lastResults.length > 0 ? (
                      <span className="text-xs text-gray-500">
                        Último: {lastResults[0].score}/{lastResults[0].total} ({Math.round((lastResults[0].score / lastResults[0].total) * 100)}%)
                      </span>
                    ) : (
                      <span className="text-xs text-gray-500">Sin exámenes</span>
                    )}
                  </li>
                )
              })()}
            </ul>
          </section>

          {lastJson && (
            <section className="rounded-xl border border-[var(--valorant-cyan)]/30 bg-[var(--valorant-panel)] p-4">
              <h2 className="mb-2 text-sm font-semibold text-[var(--valorant-cyan)]">Último callout generado</h2>
              <pre className="mb-3 max-h-32 overflow-x-auto overflow-y-auto whitespace-pre-wrap break-all rounded-lg bg-[var(--valorant-black)] p-3 text-xs text-gray-400">
                {JSON.stringify(lastJson, null, 2)}
              </pre>
              <button
                type="button"
                onClick={handleCopyJson}
                className="w-full rounded-lg bg-[var(--valorant-cyan)] px-3 py-3 min-h-[44px] text-sm font-semibold text-[var(--valorant-black)] transition hover:opacity-90 active:opacity-80 touch-target"
              >
                {copyFeedback ? '¡Copiado!' : 'Copiar JSON'}
              </button>
              <p className="mt-2 text-xs text-gray-500">Pega en <code className="text-gray-400">src/data/callouts/{currentMapId}.json</code></p>
            </section>
          )}
        </aside>
      </div>

      <NameZoneModal
        isOpen={nameModalOpen}
        onConfirm={handleConfirmName}
        onCancel={handleCancelNameModal}
      />

    </div>
  )
}
