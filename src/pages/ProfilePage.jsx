import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../context/AuthContext'
import { loadProfile, saveProfile, getProfilePassword } from '../data/profiles'

export default function ProfilePage() {
  const { user } = useAuth()
  const [displayName, setDisplayName] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [description, setDescription] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const fileInputRef = useRef(null)

  useEffect(() => {
    if (!user) return
    const p = loadProfile(user.id)
    setDisplayName(p?.displayName ?? '')
    setAvatarUrl(p?.avatarUrl ?? '')
    setDescription(p?.description ?? '')
  }, [user])

  const handleSave = (e) => {
    e.preventDefault()
    setError('')
    setSaved(false)

    if (newPassword.trim() || confirmPassword.trim()) {
      const profilePass = getProfilePassword(user.id)
      const defaultPass = 'valoplant'
      const effectiveCurrent = profilePass ?? defaultPass
      if (currentPassword !== effectiveCurrent) {
        setError('La contraseña actual no es correcta.')
        return
      }
      if (newPassword.length > 0 && newPassword.length < 4) {
        setError('La nueva contraseña debe tener al menos 4 caracteres.')
        return
      }
      if (newPassword !== confirmPassword) {
        setError('La nueva contraseña y la confirmación no coinciden.')
        return
      }
    }

    const data = {
      displayName: displayName.trim() || undefined,
      avatarUrl: avatarUrl.trim() || undefined,
      description: description.trim() || undefined,
    }
    if (newPassword.trim()) data.password = newPassword

    saveProfile(user.id, data)
    setSaved(true)
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
    window.dispatchEvent(new CustomEvent('valoplant-profile-updated'))
  }

  const MAX_FILE_SIZE_MB = 2
  const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024
  const MAX_IMAGE_SIZE = 400
  const JPEG_QUALITY = 0.82

  const compressImage = (dataUrl) => {
    return new Promise((resolve) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        let { width, height } = img
        if (width > MAX_IMAGE_SIZE || height > MAX_IMAGE_SIZE) {
          if (width > height) {
            height = Math.round((height / width) * MAX_IMAGE_SIZE)
            width = MAX_IMAGE_SIZE
          } else {
            width = Math.round((width / height) * MAX_IMAGE_SIZE)
            height = MAX_IMAGE_SIZE
          }
        }
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, width, height)
        resolve(canvas.toDataURL('image/jpeg', JPEG_QUALITY))
      }
      img.onerror = () => resolve(dataUrl)
      img.src = dataUrl
    })
  }

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (!file || !file.type.startsWith('image/')) return
    if (file.size > MAX_FILE_SIZE_BYTES) {
      setError(`La imagen no debe superar ${MAX_FILE_SIZE_MB} MB. Esta pesa ${(file.size / 1024 / 1024).toFixed(2)} MB.`)
      return
    }
    setError('')
    const reader = new FileReader()
    reader.onload = async () => {
      let dataUrl = reader.result
      if (file.type !== 'image/gif') {
        dataUrl = await compressImage(dataUrl)
      }
      setAvatarUrl(dataUrl)
    }
    reader.readAsDataURL(file)
  }

  const displayTitle = displayName.trim() || user?.name

  return (
    <div className="min-h-screen">
      <div className="border-b border-[var(--valorant-cyan)]/10 bg-[var(--valorant-dark)]/30 px-6 py-8 lg:px-10">
        <h1 className="text-2xl font-bold text-white sm:text-3xl">Mi perfil</h1>
        <p className="mt-1 text-gray-400">Personaliza tu usuario, foto y contraseña.</p>
      </div>

      <div className="p-6 lg:p-10 max-w-2xl">
        <form onSubmit={handleSave} className="space-y-6">
          <section className="rounded-xl border border-[var(--valorant-cyan)]/20 bg-[var(--valorant-panel)] p-6">
            <h2 className="text-lg font-semibold text-[var(--valorant-cyan)] mb-4">Datos del perfil</h2>

            <div className="flex flex-col sm:flex-row gap-6 items-start">
              <div className="flex flex-col items-center gap-2">
                <div className="relative">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt="Avatar"
                      className="h-24 w-24 rounded-full object-cover border-2 border-[var(--valorant-cyan)]/40"
                    />
                  ) : (
                    <div className="h-24 w-24 rounded-full bg-[var(--valorant-cyan)]/20 flex items-center justify-center text-2xl font-bold text-[var(--valorant-cyan)] border-2 border-[var(--valorant-cyan)]/40">
                      {(displayTitle || user?.name || '?').charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs text-[var(--valorant-cyan)] hover:underline"
                >
                  Subir foto
                </button>
                <p className="text-[10px] text-gray-500">Máx. {MAX_FILE_SIZE_MB} MB, se redimensiona a {MAX_IMAGE_SIZE}px.</p>
              </div>
              <div className="flex-1 w-full space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Nombre para mostrar</label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder={user?.name}
                    className="w-full rounded-lg border border-[var(--valorant-cyan)]/30 bg-[var(--valorant-dark)] px-3 py-2 text-white placeholder-gray-500 focus:border-[var(--valorant-cyan)] focus:outline-none"
                  />
                  <p className="mt-1 text-xs text-gray-500">Si está vacío se usa el nombre del usuario.</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">URL de la foto (alternativa)</label>
                  <input
                    type="url"
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full rounded-lg border border-[var(--valorant-cyan)]/30 bg-[var(--valorant-dark)] px-3 py-2 text-white placeholder-gray-500 focus:border-[var(--valorant-cyan)] focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-400 mb-1">Descripción</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Rol, frase, o lo que quieras..."
                rows={3}
                className="w-full rounded-lg border border-[var(--valorant-cyan)]/30 bg-[var(--valorant-dark)] px-3 py-2 text-white placeholder-gray-500 focus:border-[var(--valorant-cyan)] focus:outline-none resize-none"
              />
            </div>
          </section>

          <section className="rounded-xl border border-[var(--valorant-cyan)]/20 bg-[var(--valorant-panel)] p-6">
            <h2 className="text-lg font-semibold text-[var(--valorant-cyan)] mb-4">Cambiar contraseña</h2>
            <p className="text-sm text-gray-400 mb-4">Deja en blanco si no quieres cambiarla.</p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Contraseña actual</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Solo si vas a cambiar la contraseña"
                  className="w-full rounded-lg border border-[var(--valorant-cyan)]/30 bg-[var(--valorant-dark)] px-3 py-2 text-white placeholder-gray-500 focus:border-[var(--valorant-cyan)] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Nueva contraseña</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Mínimo 4 caracteres"
                  className="w-full rounded-lg border border-[var(--valorant-cyan)]/30 bg-[var(--valorant-dark)] px-3 py-2 text-white placeholder-gray-500 focus:border-[var(--valorant-cyan)] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Confirmar nueva contraseña</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repite la nueva contraseña"
                  className="w-full rounded-lg border border-[var(--valorant-cyan)]/30 bg-[var(--valorant-dark)] px-3 py-2 text-white placeholder-gray-500 focus:border-[var(--valorant-cyan)] focus:outline-none"
                />
              </div>
            </div>
          </section>

          {error && <p className="text-sm text-[var(--valorant-red)]">{error}</p>}
          {saved && <p className="text-sm text-green-400">Perfil guardado correctamente.</p>}

          <button
            type="submit"
            className="rounded-lg bg-[var(--valorant-cyan)] px-6 py-2.5 font-semibold text-[var(--valorant-black)] transition hover:opacity-90"
          >
            Guardar cambios
          </button>
        </form>
      </div>
    </div>
  )
}
