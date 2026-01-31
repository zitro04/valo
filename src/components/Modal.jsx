import { useEffect, useRef } from 'react'

export default function Modal({ isOpen, title, children, onClose }) {
  const dialogRef = useRef(null)
  const previousActive = useRef(null)

  useEffect(() => {
    if (!isOpen) return
    previousActive.current = document.activeElement
    dialogRef.current?.focus()
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose?.()
    }
    document.addEventListener('keydown', handleEscape)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
      previousActive.current?.focus()
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        tabIndex={-1}
        className="relative w-full max-w-md rounded-xl bg-[var(--valorant-panel)] border border-[var(--valorant-cyan)]/50 shadow-2xl shadow-cyan-500/10 outline-none"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <h2 id="modal-title" className="text-lg font-semibold text-[var(--valorant-cyan)] mb-4">
            {title}
          </h2>
          {children}
        </div>
      </div>
    </div>
  )
}
