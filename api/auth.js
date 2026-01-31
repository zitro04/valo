import { kv } from '@vercel/kv'
import bcrypt from 'bcryptjs'
import { findUserByUsername, DEFAULT_PASSWORD } from './users-data.js'

const PW_PREFIX = 'pw:'

function json(res, status, data) {
  res.setHeader('Content-Type', 'application/json')
  res.status(status).json(data)
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return json(res, 405, { error: 'Method not allowed' })
  }

  let body
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body
  } catch {
    return json(res, 400, { error: 'Invalid JSON' })
  }

  const action = body.action

  try {
    if (action === 'login') {
      const { username, password } = body
      if (!username || password === undefined) {
        return json(res, 400, { error: 'username and password required' })
      }
      const user = findUserByUsername(username)
      if (!user) {
        return json(res, 401, { error: 'Usuario o contraseña incorrectos.' })
      }
      let hash = null
      try {
        hash = await kv.get(PW_PREFIX + user.id)
      } catch (e) {
        console.error('KV get:', e.message)
      }
      const match = hash
        ? await bcrypt.compare(password, hash)
        : password === DEFAULT_PASSWORD
      if (!match) {
        return json(res, 401, { error: 'Usuario o contraseña incorrectos.' })
      }
      return json(res, 200, { user: { id: user.id, name: user.name, role: user.role } })
    }

    if (action === 'set-password') {
      const { userId, currentPassword, newPassword } = body
      if (!userId || currentPassword === undefined || !newPassword || newPassword.length < 4) {
        return json(res, 400, { error: 'userId, currentPassword and newPassword (min 4) required' })
      }
      const user = findUserByUsername(userId)
      if (!user) {
        return json(res, 400, { error: 'Usuario no encontrado.' })
      }
      let hash = null
      try {
        hash = await kv.get(PW_PREFIX + user.id)
      } catch (e) {
        console.error('KV get:', e.message)
      }
      const currentMatch = hash
        ? await bcrypt.compare(currentPassword, hash)
        : currentPassword === DEFAULT_PASSWORD
      if (!currentMatch) {
        return json(res, 401, { error: 'La contraseña actual no es correcta.' })
      }
      const newHash = await bcrypt.hash(newPassword, 10)
      await kv.set(PW_PREFIX + user.id, newHash)
      return json(res, 200, { ok: true })
    }

    if (action === 'reset-password') {
      const { coachUserId, targetUserId } = body
      if (!coachUserId || !targetUserId) {
        return json(res, 400, { error: 'coachUserId and targetUserId required' })
      }
      const coach = findUserByUsername(coachUserId)
      if (!coach || coach.role !== 'coach') {
        return json(res, 403, { error: 'Solo el Coach puede restablecer contraseñas.' })
      }
      await kv.del(PW_PREFIX + targetUserId)
      return json(res, 200, { ok: true })
    }

    return json(res, 400, { error: 'Unknown action' })
  } catch (err) {
    console.error('auth API error:', err)
    return json(res, 500, { error: 'Error en el servidor.' })
  }
}
