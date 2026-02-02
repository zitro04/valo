import { Link } from 'react-router-dom'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <div className="relative overflow-hidden border-b border-[var(--valorant-cyan)]/15 bg-gradient-to-b from-[var(--valorant-dark)]/80 to-[var(--valorant-black)] px-6 py-12 lg:px-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(0,240,255,0.08),transparent)]" aria-hidden />
        <div className="relative">
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Bienvenido a <span className="text-[var(--valorant-cyan)] drop-shadow-[0_0_20px_rgba(0,240,255,0.3)]">CalloutLab</span>
          </h1>
          <p className="mt-3 max-w-2xl text-base text-gray-400 sm:text-lg">
            Centro de herramientas para tu equipo de esports. Callouts, estrategias, roster y más en un solo lugar.
          </p>
        </div>
      </div>

      <div className="p-6 lg:p-10">
        <h2 className="text-lg font-semibold text-gray-300 sm:text-xl">Acceso rápido</h2>
        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <Link
            to="/callouts"
            className="group flex items-start gap-4 rounded-xl border border-[var(--valorant-cyan)]/25 bg-[var(--valorant-panel)]/70 p-6 shadow-lg shadow-black/20 transition-all duration-200 hover:scale-[1.02] hover:border-[var(--valorant-cyan)]/50 hover:bg-[var(--valorant-panel)] hover:shadow-[var(--valorant-cyan)]/10 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--valorant-cyan)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--valorant-black)]"
          >
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[var(--valorant-cyan)]/20 text-[var(--valorant-cyan)] shadow-inner transition group-hover:bg-[var(--valorant-cyan)]/30 group-hover:shadow-[0_0_24px_rgba(0,240,255,0.15)]">
              <MapIcon className="h-7 w-7" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-bold text-white">Callouts</h3>
              <p className="mt-1 text-sm leading-relaxed text-gray-400">Pearl, Bind y más. Zonas interactivas, práctica y examen.</p>
            </div>
          </Link>

          <div className="flex items-start gap-4 rounded-xl border border-white/5 bg-[var(--valorant-panel)]/40 p-6 opacity-80">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gray-600/20 text-gray-500">
              <BookIcon className="h-7 w-7" />
            </div>
            <div>
              <h3 className="font-bold text-gray-500">Estrategias</h3>
              <p className="mt-1 text-sm text-gray-500">Próximamente: plays, setups y notas por mapa.</p>
              <span className="mt-3 inline-block rounded-md bg-[var(--valorant-panel)] px-2.5 py-1 text-xs font-medium uppercase tracking-wider text-gray-500">Pronto</span>
            </div>
          </div>

          <div className="flex items-start gap-4 rounded-xl border border-white/5 bg-[var(--valorant-panel)]/40 p-6 opacity-80">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gray-600/20 text-gray-500">
              <UsersIcon className="h-7 w-7" />
            </div>
            <div>
              <h3 className="font-bold text-gray-500">Roster</h3>
              <p className="mt-1 text-sm text-gray-500">Próximamente: jugadores, roles y estadísticas.</p>
              <span className="mt-3 inline-block rounded-md bg-[var(--valorant-panel)] px-2.5 py-1 text-xs font-medium uppercase tracking-wider text-gray-500">Pronto</span>
            </div>
          </div>
        </div>

        <div className="mt-12 rounded-xl border-l-4 border-[var(--valorant-cyan)]/50 border-[var(--valorant-cyan)]/10 bg-[var(--valorant-dark)]/60 p-6 shadow-inner">
          <h2 className="text-lg font-semibold text-gray-200 sm:text-xl">¿Qué es CalloutLab?</h2>
          <p className="mt-3 leading-relaxed text-gray-400">
            Suite de herramientas para equipos de esports: organiza callouts, estrategias y comunicación. Empieza con los mapas Pearl y Bind y mantén todo en un solo lugar.
          </p>
        </div>
      </div>
    </div>
  )
}

function MapIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
    </svg>
  )
}
function BookIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  )
}
function UsersIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  )
}
