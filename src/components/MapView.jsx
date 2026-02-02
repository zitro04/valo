import { useState, useCallback, useRef } from 'react'

const VIEWBOX = '0 0 1000 1000'
const TOOLTIP_OFFSET = 14

export default function MapView({ editMode, callouts = [], editPoints = [], setEditPoints, onRequestNameForPolygon, mapImagePath, mapName, highlightZoneId, onClearHighlight, onZoneClick, practiceMode }) {
  const [hoveredId, setHoveredId] = useState(null)
  const [tooltip, setTooltip] = useState(null)
  const [editPreview, setEditPreview] = useState(null)
  const containerRef = useRef(null)

  const getSvgPoint = useCallback((e) => {
    const svg = e.currentTarget
    const rect = svg.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 1000
    const y = ((e.clientY - rect.top) / rect.height) * 1000
    return { x, y }
  }, [])

  const handleSvgClick = useCallback(
    (e) => {
      if (editMode) {
        const { x, y } = getSvgPoint(e)
        setEditPoints?.((prev) => [...(prev || []), [x, y]])
      } else if (e.target === e.currentTarget) {
        setTooltip(null)
        onClearHighlight?.()
      }
    },
    [editMode, getSvgPoint, setEditPoints, onClearHighlight]
  )

  const handleSvgMouseMove = useCallback(
    (e) => {
      if (editMode && editPoints.length > 0) {
        const { x, y } = getSvgPoint(e)
        setEditPreview([...editPoints, [x, y]])
      }
    },
    [editMode, editPoints, getSvgPoint]
  )

  const handleSvgMouseLeave = useCallback(() => {
    if (editMode) setEditPreview(null)
  }, [editMode])

  const hasImage = Boolean(mapImagePath)

  return (
    <div ref={containerRef} className="relative inline-block max-w-full">
      <div className="relative" style={{ aspectRatio: '1' }}>
        {hasImage ? (
          <img
            src={mapImagePath}
            alt={mapName ? `Mapa ${mapName}` : 'Mapa'}
            className="w-full h-full object-contain select-none pointer-events-none"
            draggable={false}
          />
        ) : (
          <div className="flex w-full h-full min-h-[280px] items-center justify-center rounded-lg border border-dashed border-[var(--valorant-cyan)]/30 bg-[var(--valorant-dark)] text-gray-500">
            <div className="text-center px-4">
              <p className="font-medium text-gray-400">Sin imagen del mapa</p>
              <p className="mt-1 text-sm">Añade la imagen en <code className="text-gray-500">public/</code> y configúrala en <code className="text-gray-500">src/data/maps.js</code></p>
            </div>
          </div>
        )}
        {hasImage && (
        <svg
          className={`absolute inset-0 w-full h-full object-contain ${editMode ? 'cursor-crosshair' : ''}`}
          viewBox={VIEWBOX}
          preserveAspectRatio="xMidYMid meet"
          onClick={handleSvgClick}
          onMouseMove={handleSvgMouseMove}
          onMouseLeave={handleSvgMouseLeave}
          style={{ pointerEvents: editMode ? 'auto' : 'auto' }}
        >
          {!editMode &&
            callouts.map((zone) => {
              const isHovered = hoveredId === zone.id
              const isHighlighted = highlightZoneId === zone.id
              const strong = isHovered || isHighlighted
              return (
                <polygon
                  key={zone.id}
                  points={zone.points}
                  fill="var(--valorant-cyan)"
                  fillOpacity={isHighlighted ? 0.25 : strong ? 0.2 : 0.06}
                  stroke="var(--valorant-cyan)"
                  strokeOpacity={strong || isHighlighted ? 1 : 0.5}
                  strokeWidth={isHighlighted ? 3 : strong ? 2.5 : 1}
                  className={`transition-all duration-150 ${isHighlighted ? 'animate-pulse' : ''}`}
                  style={{ cursor: 'pointer' }}
                  onMouseEnter={() => setHoveredId(zone.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  onClick={(e) => {
                    e.stopPropagation()
                    onZoneClick?.(zone)
                    if (!practiceMode) setTooltip((t) => (t?.id === zone.id ? null : { id: zone.id, name: zone.name, x: e.clientX, y: e.clientY }))
                  }}
                />
              )
            })}
          {editMode && editPoints.length > 0 && (
            <polygon
              points={editPoints.map(([x, y]) => `${x},${y}`).join(' ')}
              fill="var(--valorant-cyan-dim)"
              stroke="var(--valorant-cyan)"
              strokeWidth={1.5}
              strokeDasharray="4 2"
            />
          )}
          {editMode && editPreview && editPreview.length > 2 && (
            <polygon
              points={editPreview.map(([x, y]) => `${x},${y}`).join(' ')}
              fill="rgba(0,240,255,0.08)"
              stroke="var(--valorant-cyan)"
              strokeWidth={1}
              strokeDasharray="2 2"
            />
          )}
        </svg>
        )}
      </div>
      {tooltip && !editMode && !practiceMode && (
        <div
          className="fixed z-50 px-3 py-2 rounded-lg bg-[var(--valorant-panel)] border border-[var(--valorant-cyan)] text-[var(--valorant-cyan)] font-semibold text-sm shadow-xl shadow-cyan-500/20 pointer-events-none"
          style={{
            left: Math.min(tooltip.x + TOOLTIP_OFFSET, window.innerWidth - 120),
            top: Math.min(tooltip.y + TOOLTIP_OFFSET, window.innerHeight - 48),
          }}
        >
          {tooltip.name}
        </div>
      )}
    </div>
  )
}
