import { formatCurrency } from '../utils/formatters'

export default function SummaryCard({ label, value, tone, helper }) {
  const toneClasses = {
    balance: 'from-slate-950 to-slate-700 text-white',
    income: 'from-emerald-500 to-teal-600 text-white',
    expense: 'from-rose-500 to-orange-500 text-white',
  }

  return (
    <article
      className={`overflow-hidden rounded-3xl bg-gradient-to-br p-6 shadow-xl shadow-slate-900/10 ${toneClasses[tone]}`}
    >
      <p className="text-sm font-semibold uppercase tracking-[0.24em] opacity-75">
        {label}
      </p>
      <p className="mt-5 text-4xl font-black tracking-tight sm:text-5xl">
        {formatCurrency(value)}
      </p>
      <p className="mt-4 max-w-xs text-sm font-medium opacity-80">{helper}</p>
    </article>
  )
}
