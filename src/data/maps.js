export const maps = [
  { id: 'pearl', name: 'Pearl', imagePath: '/pearledit.png', referenceImagePath: '/pearledit.png', simpleMapPath: '/pearl-icon.png' },
  { id: 'ascent', name: 'Ascent', imagePath: null, referenceImagePath: null },
  { id: 'bind', name: 'Bind', imagePath: '/bindmapa.webp', referenceImagePath: null, simpleMapPath: '/bindmapa.webp', model3D: '/bind_full_map.glb' },
  { id: 'haven', name: 'Haven', imagePath: null, referenceImagePath: null },
  { id: 'icebox', name: 'Icebox', imagePath: null, referenceImagePath: null },
  { id: 'split', name: 'Split', imagePath: null, referenceImagePath: null },
  { id: 'breeze', name: 'Breeze', imagePath: null, referenceImagePath: null },
  { id: 'fracture', name: 'Fracture', imagePath: null, referenceImagePath: null },
  { id: 'lotus', name: 'Lotus', imagePath: null, referenceImagePath: null },
  { id: 'sunset', name: 'Sunset', imagePath: null, referenceImagePath: null },
  { id: 'corrode', name: 'Corrode', imagePath: '/corrode.png', referenceImagePath: '/corrode.png', simpleMapPath: '/corrode.png' },
]

export function getMapById(id) {
  return maps.find((m) => m.id === id) ?? maps[0]
}
