import { CATEGORIES, FILTER_TYPES } from '../utils/categories'

export default function Filters({ filters, onChange }) {
  const updateFilter = (key, value) => onChange({ ...filters, [key]: value })

  return (
    <section className="rounded-3xl border border-white/70 bg-white/80 p-5 shadow-lg shadow-slate-200/70 backdrop-blur">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-emerald-700">
            Filters
          </p>
          <h2 className="mt-2 text-2xl font-black text-slate-950">
            Find transactions fast
          </h2>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <label className="text-sm font-bold text-slate-600">
            Search
            <input
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              value={filters.search}
              onChange={(event) => updateFilter('search', event.target.value)}
              placeholder="Note or category"
            />
          </label>

          <label className="text-sm font-bold text-slate-600">
            Type
            <select
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              value={filters.type}
              onChange={(event) => updateFilter('type', event.target.value)}
            >
              {FILTER_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </label>

          <label className="text-sm font-bold text-slate-600">
            Category
            <select
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              value={filters.category}
              onChange={(event) =>
                updateFilter('category', event.target.value)
              }
            >
              <option value="all">All categories</option>
              {CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <button
          type="button"
          className={`rounded-full px-4 py-2 text-sm font-black transition ${
            filters.category === 'all'
              ? 'bg-slate-950 text-white'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
          onClick={() => updateFilter('category', 'all')}
        >
          All
        </button>
        {CATEGORIES.map((category) => (
          <button
            key={category}
            type="button"
            className={`rounded-full px-4 py-2 text-sm font-black transition ${
              filters.category === category
                ? 'bg-emerald-600 text-white'
                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
            }`}
            onClick={() => updateFilter('category', category)}
          >
            {category}
          </button>
        ))}
      </div>
    </section>
  )
}
