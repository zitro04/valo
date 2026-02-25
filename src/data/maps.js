export const maps = [
  { id: 'pearl', name: 'Pearl', imagePath: '/pearledit.png', referenceImagePath: '/pearledit.png', simpleMapPath: '/pearl-icon.png' },
  { id: 'ascent', name: 'Ascent', imagePath: '/ascent.png', referenceImagePath: '/ascent.png', simpleMapPath: '/ascent.png' },
  { id: 'bind', name: 'Bind', imagePath: '/bind.png', referenceImagePath: '/bind.png', simpleMapPath: '/bind.png', model3D: '/bind_full_map.glb' },
  { id: 'haven', name: 'Haven', imagePath: '/haven.png', referenceImagePath: '/haven.png', simpleMapPath: '/haven.png' },
  { id: 'icebox', name: 'Icebox', imagePath: '/icebox.png', referenceImagePath: '/icebox.png', simpleMapPath: '/icebox.png' },
  { id: 'split', name: 'Split', imagePath: '/split.png', referenceImagePath: '/split.png', simpleMapPath: '/split.png' },
  { id: 'breeze', name: 'Breeze', imagePath: '/breeze.png', referenceImagePath: '/breeze.png', simpleMapPath: '/breeze.png' },
  { id: 'fracture', name: 'Fracture', imagePath: '/fracture.png', referenceImagePath: '/fracture.png', simpleMapPath: '/fracture.png' },
  { id: 'lotus', name: 'Lotus', imagePath: '/lotus.png', referenceImagePath: '/lotus.png', simpleMapPath: '/lotus.png' },
  { id: 'sunset', name: 'Sunset', imagePath: '/sunset.png', referenceImagePath: '/sunset.png', simpleMapPath: '/sunset.png' },
  { id: 'corrode', name: 'Corrode', imagePath: '/corrode.png', referenceImagePath: '/corrode.png', simpleMapPath: '/corrode.png' },
]

export function getMapById(id) {
  return maps.find((m) => m.id === id) ?? maps[0]
}
