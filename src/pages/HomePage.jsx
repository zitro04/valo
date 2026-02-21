import { Link } from 'react-router-dom'

const sections = [
  { to: '/callouts', label: 'Callouts', desc: 'Zonas interactivas, práctica, examen con contrarreloj y dificultad progresiva.', icon: MapIcon, key: '2' },
  { to: '/lineups', label: 'Lineups', desc: 'Marca posiciones en el mapa con links de TikTok o capturas.', icon: CrosshairIcon, key: '3' },
  { to: '/estrategias', label: 'Estrategias', desc: 'Dibuja rutas de 5 jugadores sobre el mapa. Planifica ejecuciones.', icon: BookIcon, key: '4' },
  { to: '/historial', label: 'Historial', desc: 'Estadísticas, gráficos de progreso y resultados por mapa.', icon: ChartIcon, key: '5' },
  { to: '/composiciones', label: 'Composiciones', desc: 'Guarda comps de agentes por mapa y lado (ataque/defensa).', icon: UsersIcon, key: '6' },
  { to: '/notas', label: 'Notas', desc: 'Bloc de notas por mapa con autoguardado.', icon: NoteIcon, key: '7' },
]

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
            Centro de herramientas para Valorant. Callouts, lineups, estrategias, composiciones y más.
          </p>
          <p className="mt-2 text-sm text-gray-500">
            Atajos: pulsa <kbd className="rounded bg-[var(--valorant-panel)] px-1.5 py-0.5 text-xs text-[var(--valorant-cyan)]">1</kbd>-<kbd className="rounded bg-[var(--valorant-panel)] px-1.5 py-0.5 text-xs text-[var(--valorant-cyan)]">7</kbd> para navegar, <kbd className="rounded bg-[var(--valorant-panel)] px-1.5 py-0.5 text-xs text-[var(--valorant-cyan)]">T</kbd> para cambiar tema.
          </p>
        </div>
      </div>

      <div className="p-6 lg:p-10">
        <h2 className="text-lg font-semibold text-gray-300 sm:text-xl">Acceso rápido</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sections.map((s) => (
            <Link
              key={s.to}
              to={s.to}
              className="group flex items-start gap-4 rounded-xl border border-[var(--valorant-cyan)]/25 bg-[var(--valorant-panel)]/70 p-5 shadow-lg shadow-black/20 transition-all duration-200 hover:scale-[1.02] hover:border-[var(--valorant-cyan)]/50 hover:bg-[var(--valorant-panel)] hover:shadow-[var(--valorant-cyan)]/10 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--valorant-cyan)]"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--valorant-cyan)]/20 text-[var(--valorant-cyan)] transition group-hover:bg-[var(--valorant-cyan)]/30">
                <s.icon className="h-6 w-6" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-white">{s.label}</h3>
                  <kbd className="rounded bg-[var(--valorant-dark)] px-1.5 py-0.5 text-[10px] text-gray-500">{s.key}</kbd>
                </div>
                <p className="mt-1 text-sm leading-relaxed text-gray-400">{s.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

function MapIcon({ className }) {
  return (<svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>)
}
function CrosshairIcon({ className }) {
  return (<svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" strokeWidth={2} /><line x1="22" y1="12" x2="18" y2="12" strokeWidth={2} /><line x1="6" y1="12" x2="2" y2="12" strokeWidth={2} /><line x1="12" y1="6" x2="12" y2="2" strokeWidth={2} /><line x1="12" y1="22" x2="12" y2="18" strokeWidth={2} /></svg>)
}
function BookIcon({ className }) {
  return (<svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>)
}
function ChartIcon({ className }) {
  return (<svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>)
}
function UsersIcon({ className }) {
  return (<svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>)
}
function NoteIcon({ className }) {
  return (<svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>)
}
