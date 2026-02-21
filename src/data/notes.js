const KEY_PREFIX = 'valoplant-notes-'

export function loadNotes(mapId) {
  try {
    return localStorage.getItem(KEY_PREFIX + mapId) ?? ''
  } catch (_) {
    return ''
  }
}

export function saveNotes(mapId, text) {
  localStorage.setItem(KEY_PREFIX + mapId, text)
}
