/**
 * Mapas de Valorant disponibles para callouts.
 * imagePath: ruta en public/. Si es null, se muestra placeholder hasta que añadas la imagen.
 */
export const maps = [
  { id: 'pearl', name: 'Pearl', imagePath: '/pearl-icon.png' },
  { id: 'ascent', name: 'Ascent', imagePath: null },
  { id: 'bind', name: 'Bind', imagePath: null },
  { id: 'haven', name: 'Haven', imagePath: null },
  { id: 'icebox', name: 'Icebox', imagePath: null },
  { id: 'split', name: 'Split', imagePath: null },
  { id: 'breeze', name: 'Breeze', imagePath: null },
  { id: 'fracture', name: 'Fracture', imagePath: null },
  { id: 'lotus', name: 'Lotus', imagePath: null },
  { id: 'sunset', name: 'Sunset', imagePath: null },
]

export function getMapById(id) {
  return maps.find((m) => m.id === id) ?? maps[0]
}
