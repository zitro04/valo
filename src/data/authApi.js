/**
 * Llama a la API de auth en Vercel (Redis/KV).
 * Si la API no está disponible (dev local), el frontend usará el fallback local.
 */

export async function apiLogin(username, password) {
  const res = await fetch('/api/auth', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'login', username, password }),
  })
  const data = await res.json().catch(() => ({}))
  if (res.ok && data.user) return data.user
  if (res.status === 401) return null
  throw new Error(data.error || 'Error de conexión')
}

export async function apiSetPassword(userId, currentPassword, newPassword) {
  const res = await fetch('/api/auth', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'set-password',
      userId,
      currentPassword,
      newPassword,
    }),
  })
  const data = await res.json().catch(() => ({}))
  if (res.ok && data.ok) return true
  throw new Error(data.error || 'Error al cambiar contraseña')
}

export async function apiResetPassword(coachUserId, targetUserId) {
  const res = await fetch('/api/auth', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'reset-password',
      coachUserId,
      targetUserId,
    }),
  })
  const data = await res.json().catch(() => ({}))
  if (res.ok && data.ok) return true
  throw new Error(data.error || 'Error al restablecer contraseña')
}
