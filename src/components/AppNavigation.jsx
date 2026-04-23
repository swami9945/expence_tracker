const navItems = [
  { id: 'overview', label: 'Overview' },
  { id: 'transactions', label: 'Transactions' },
  { id: 'analytics', label: 'Analytics' },
  { id: 'coach', label: 'Money Coach' },
  { id: 'goals', label: 'Goals' },
  { id: 'calculator', label: 'Calculator' },
  { id: 'data', label: 'Data' },
]

export default function AppNavigation({ activeView, onNavigate }) {
  return (
    <nav className="sticky top-3 z-30 rounded-[1.5rem] border border-white/80 bg-white/80 p-2 shadow-xl shadow-slate-200/70 backdrop-blur-xl">
      <div className="flex gap-2 overflow-x-auto">
        {navItems.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`whitespace-nowrap rounded-2xl px-4 py-3 text-sm font-black transition ${
              activeView === item.id
                ? 'bg-slate-950 text-white shadow-lg shadow-slate-950/20'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950'
            }`}
            onClick={() => onNavigate(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>
    </nav>
  )
}
