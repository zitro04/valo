export default function ComingSoonPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 py-16">
      <div className="rounded-2xl border border-[var(--valorant-cyan)]/20 bg-[var(--valorant-panel)]/60 p-10 text-center max-w-md">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--valorant-cyan)]/20 text-[var(--valorant-cyan)]">
          <RocketIcon className="h-8 w-8" />
        </div>
        <h1 className="text-xl font-bold text-white">Próximamente</h1>
        <p className="mt-2 text-gray-400">
          Esta sección está en desarrollo. Volveremos con nuevas herramientas para tu equipo.
        </p>
      </div>
    </div>
  )
}

function RocketIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
  )
}
