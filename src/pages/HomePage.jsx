import { Link } from 'react-router-dom'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <div className="border-b border-[var(--valorant-cyan)]/10 bg-[var(--valorant-dark)]/30 px-6 py-8 lg:px-10">
        <h1 className="text-2xl font-bold text-white sm:text-3xl">
          Bienvenido a <span className="text-[var(--valorant-cyan)]">CalloutLab</span>
        </h1>
        <p className="mt-2 max-w-2xl text-gray-400">
          Centro de herramientas para tu equipo de esports. Callouts, estrategias, roster y más en un solo lugar.
        </p>
      </div>

      <div className="p-6 lg:p-10">
        <h2 className="text-lg font-semibold text-gray-300">Acceso rápido</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Link
            to="/callouts"
            className="group flex items-start gap-4 rounded-xl border border-[var(--valorant-cyan)]/20 bg-[var(--valorant-panel)]/60 p-5 transition hover:border-[var(--valorant-cyan)]/40 hover:bg-[var(--valorant-panel)]"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[var(--valorant-cyan)]/20 text-[var(--valorant-cyan)] transition group-hover:bg-[var(--valorant-cyan)]/30">
              <MapIcon className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-semibold text-white">Callouts</h3>
              <p className="mt-0.5 text-sm text-gray-400">Todos los mapas: Pearl, Ascent, Bind y más. Zonas interactivas y modo edición.</p>
            </div>
          </Link>

          <div className="flex items-start gap-4 rounded-xl border border-[var(--valorant-panel)] bg-[var(--valorant-panel)]/40 p-5 opacity-75">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gray-600/30 text-gray-500">
              <BookIcon className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-400">Estrategias</h3>
              <p className="mt-0.5 text-sm text-gray-500">Próximamente: plays, setups y notas por mapa.</p>
              <span className="mt-2 inline-block rounded bg-[var(--valorant-panel)] px-2 py-0.5 text-xs text-gray-500">Pronto</span>
            </div>
          </div>

          <div className="flex items-start gap-4 rounded-xl border border-[var(--valorant-panel)] bg-[var(--valorant-panel)]/40 p-5 opacity-75">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gray-600/30 text-gray-500">
              <UsersIcon className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-400">Roster</h3>
              <p className="mt-0.5 text-sm text-gray-500">Próximamente: jugadores, roles y estadísticas.</p>
              <span className="mt-2 inline-block rounded bg-[var(--valorant-panel)] px-2 py-0.5 text-xs text-gray-500">Pronto</span>
            </div>
          </div>
        </div>

        <div className="mt-10 rounded-xl border border-[var(--valorant-cyan)]/10 bg-[var(--valorant-dark)]/50 p-6">
          <h2 className="text-lg font-semibold text-gray-300">¿Qué es CalloutLab?</h2>
          <p className="mt-2 text-gray-400">
            Una suite de herramientas pensada para equipos de esports que quieren organizar callouts, estrategias y comunicación.
            Empieza con los callouts del mapa Pearl y mantén todo en un solo lugar cuando añadamos más funciones.
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
