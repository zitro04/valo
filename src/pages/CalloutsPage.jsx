import { useState, lazy, Suspense } from 'react'
import { maps, getMapById } from '../data/maps'

const Map3DViewer = lazy(() => import('../components/Map3DViewer'))

const MAP_ID_WITH_3D = 'bind'

export default function CalloutsPage() {
  const [currentMapId, setCurrentMapId] = useState('bind')
  const [show3DViewer, setShow3DViewer] = useState(false)
  const currentMap = getMapById(currentMapId)
  const has3D = currentMapId === MAP_ID_WITH_3D

  return (
    <div className="min-h-screen flex flex-col">
      <header className="shrink-0 border-b border-[var(--valorant-cyan)]/15 bg-[var(--valorant-black)]/95 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 py-4 lg:px-10">
          <h1 className="text-xl font-bold text-white sm:text-2xl">
            <span className="text-[var(--valorant-cyan)]">Callouts</span>
          </h1>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <div className="inline-flex flex-wrap gap-2 rounded-xl border border-[var(--valorant-cyan)]/15 bg-[var(--valorant-panel)]/80 p-2">
              {maps.map((map) => (
                <button
                  key={map.id}
                  type="button"
                  onClick={() => setCurrentMapId(map.id)}
                  className={`rounded-lg px-4 py-2.5 min-h-[44px] text-sm font-medium transition touch-target ${
                    currentMapId === map.id
                      ? 'bg-[var(--valorant-cyan)] text-[var(--valorant-black)]'
                      : 'bg-transparent text-gray-400 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {map.name}
                </button>
              ))}
            </div>
            {has3D && (
              <button
                type="button"
                onClick={() => setShow3DViewer(true)}
                className="rounded-lg border border-[var(--valorant-cyan)]/40 bg-[var(--valorant-cyan)]/10 px-4 py-3 min-h-[44px] text-sm font-medium text-[var(--valorant-cyan)] transition hover:bg-[var(--valorant-cyan)]/20 touch-target"
              >
                Ver Bind en 3D
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="flex-1 mx-auto w-full max-w-5xl px-4 py-6 lg:px-10">
        {currentMap.imagePath ? (
          <div className="rounded-xl overflow-hidden border border-[var(--valorant-cyan)]/30 bg-[var(--valorant-dark)]">
            <img
              src={currentMap.imagePath}
              alt={`Mapa ${currentMap.name}`}
              className="w-full h-auto object-contain"
            />
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-[var(--valorant-cyan)]/30 bg-[var(--valorant-panel)]/40 p-8 text-center text-gray-500">
            Sin imagen del mapa. Selecciona Bind para ver el mapa 2D o usa «Ver mapa en 3D».
          </div>
        )}
      </div>

      {show3DViewer && has3D && (
        <Suspense
          fallback={
            <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#1a1a1f]">
              <p className="text-[var(--valorant-cyan)] font-medium">Cargando vista 3D…</p>
            </div>
          }
        >
          <Map3DViewer onClose={() => setShow3DViewer(false)} />
        </Suspense>
      )}
    </div>
  )
}
