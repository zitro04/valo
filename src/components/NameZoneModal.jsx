import { useState, useEffect, useRef } from 'react'
import Modal from './Modal'

export default function NameZoneModal({ isOpen, onConfirm, onCancel }) {
  const [name, setName] = useState('')
  const inputRef = useRef(null)

  useEffect(() => {
    if (isOpen) {
      setName('')
      setTimeout(() => inputRef.current?.focus(), 0)
    }
  }, [isOpen])

  const handleSubmit = (e) => {
    e.preventDefault()
    const trimmed = name.trim()
    if (trimmed) onConfirm(trimmed)
  }

  return (
    <Modal isOpen={isOpen} title="Nombre de la zona" onClose={onCancel}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          ref={inputRef}
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ej: Restaurante, B Link..."
          className="w-full px-4 py-3 rounded-lg bg-[var(--valorant-dark)] border border-[var(--valorant-cyan)]/40 text-white placeholder-gray-500 focus:border-[var(--valorant-cyan)] focus:ring-2 focus:ring-[var(--valorant-cyan)]/30 outline-none transition"
          autoComplete="off"
        />
        <div className="flex gap-3 justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-lg border border-gray-500 text-gray-400 hover:bg-white/5 transition"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={!name.trim()}
            className="px-4 py-2 rounded-lg bg-[var(--valorant-cyan)] text-[var(--valorant-black)] font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            Crear callout
          </button>
        </div>
      </form>
    </Modal>
  )
}
