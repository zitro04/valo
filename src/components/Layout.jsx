import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { APP_VERSION, APP_NAME } from '../version'

const navItems = [
  { to: '/', label: 'Inicio', icon: HomeIcon, exact: true },
  { to: '/callouts', label: 'Callouts', icon: MapIcon, exact: false },
  { to: '/historial', label: 'Historial', icon: HistoryIcon, exact: false },
  { to: '/estrategias', label: 'Estrategias', icon: BookIcon, soon: true },
  { to: '/roster', label: 'Roster', icon: UsersIcon, soon: true },
  { to: '/calendario', label: 'Calendario', icon: CalendarIcon, soon: true },
  { to: '/comunicacion', label: 'Comunicación', icon: MessageIcon, soon: true },
]

export default function Layout() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-[var(--valorant-black)]">
      <div
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
        style={{ opacity: menuOpen ? 1 : 0, pointerEvents: menuOpen ? 'auto' : 'none' }}
        onClick={() => setMenuOpen(false)}
        aria-hidden
      />

      <aside
        className={`fixed left-0 top-0 z-50 flex h-full w-64 flex-col border-r border-[var(--valorant-cyan)]/15 bg-[var(--valorant-dark)] shadow-2xl shadow-black/40 transition-transform duration-200 ease-out lg:w-64 lg:translate-x-0 ${
          menuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center justify-between gap-2 border-b border-[var(--valorant-cyan)]/15 px-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--valorant-cyan)]/20 text-[var(--valorant-cyan)] shadow-sm ring-1 ring-[var(--valorant-cyan)]/20">
              <TargetIcon className="h-5 w-5" />
            </div>
            <span className="font-bold tracking-tight text-white">{APP_NAME}</span>
          </div>
          <button
            type="button"
            onClick={() => setMenuOpen(false)}
            className="rounded-lg p-2 min-h-[44px] min-w-[44px] flex items-center justify-center text-gray-400 hover:bg-white/5 hover:text-white lg:hidden touch-target"
            aria-label="Cerrar menú"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>
        <nav className="flex-1 space-y-0.5 overflow-y-auto p-3">
          {navItems.map(({ to, label, icon: Icon, exact, soon }) =>
            soon ? (
              <span
                key={to}
                className="flex items-center gap-3 rounded-lg px-3 py-3 min-h-[44px] text-sm font-medium text-gray-500 opacity-80"
              >
                <Icon className="h-5 w-5 shrink-0" />
                <span className="truncate">{label}</span>
                <span className="ml-auto shrink-0 rounded bg-[var(--valorant-panel)] px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-gray-500">
                  Pronto
                </span>
              </span>
            ) : (
              <NavLink
                key={to}
                to={to}
                end={exact}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                    `flex items-center gap-3 rounded-xl px-3 py-3 min-h-[44px] touch-target text-sm font-medium transition ${
                      isActive
                        ? 'bg-[var(--valorant-cyan)]/15 text-[var(--valorant-cyan)] ring-1 ring-[var(--valorant-cyan)]/40 shadow-[0_0_20px_rgba(0,240,255,0.06)]'
                        : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'
                  }`
                }
              >
                <Icon className="h-5 w-5 shrink-0" />
                <span className="truncate">{label}</span>
              </NavLink>
            )
          )}
        </nav>
        <div className="border-t border-[var(--valorant-cyan)]/10 p-3">
          <p className="pt-2 text-center text-[10px] text-gray-600" title="Acerca de">
            {APP_NAME} v{APP_VERSION}
          </p>
        </div>
      </aside>

      <main className="flex-1 min-w-0 lg:pl-64">
        <div className="sticky top-0 z-30 flex h-14 items-center gap-2 border-b border-[var(--valorant-cyan)]/10 bg-[var(--valorant-black)]/90 px-4 backdrop-blur-sm lg:hidden">
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="rounded-lg p-2 min-h-[44px] min-w-[44px] flex items-center justify-center text-gray-400 hover:bg-white/5 hover:text-white touch-target"
            aria-label="Abrir menú"
          >
            <MenuIcon className="h-6 w-6" />
          </button>
          <span className="font-semibold text-white">{APP_NAME}</span>
        </div>
        <Outlet />
      </main>
    </div>
  )
}

function MenuIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  )
}
function CloseIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  )
}
function HomeIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  )
}
function MapIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
    </svg>
  )
}
function HistoryIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
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
function CalendarIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  )
}
function MessageIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  )
}
function TargetIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}
