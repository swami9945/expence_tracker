import { useState } from 'react'
import { formatCurrency } from '../utils/formatters'
import { getBudgetStatus, getFinancialHealthScore } from '../utils/transactions'

export default function MoneyCoach({ transactions, budgets, onBudgetChange }) {
  const [monthlyCut, setMonthlyCut] = useState(2500)
  const [targetMonths, setTargetMonths] = useState(12)
  const budgetStatus = getBudgetStatus(transactions, budgets)
  const healthScore = getFinancialHealthScore(transactions, budgets)
  const projectedSavings = monthlyCut * targetMonths
  const scoreTone =
    healthScore >= 75
      ? 'text-emerald-300'
      : healthScore >= 50
        ? 'text-amber-300'
        : 'text-rose-300'

  return (
    <section className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
      <article className="relative overflow-hidden rounded-[2rem] bg-slate-950 p-6 text-white shadow-2xl shadow-slate-950/20">
        <div className="absolute -right-10 -top-10 h-44 w-44 rounded-full bg-emerald-400/20" />
        <div className="relative">
          <p className="text-sm font-black uppercase tracking-[0.24em] text-emerald-300">
            Smart Money Coach
          </p>
          <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-3xl font-black">What PhonePe history misses</h2>
              <p className="mt-2 max-w-2xl text-sm font-medium text-slate-300">
                This layer turns transactions into guidance: monthly budget
                warnings, a health score, and a simple savings simulator.
              </p>
            </div>
            <div className="rounded-3xl bg-white/10 px-6 py-4 text-center">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
                Health score
              </p>
              <p className={`mt-1 text-5xl font-black ${scoreTone}`}>
                {healthScore}
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-3">
            {budgetStatus.map((budget) => (
              <BudgetRow
                key={budget.category}
                budget={budget}
                value={budgets[budget.category]}
                onChange={onBudgetChange}
              />
            ))}
          </div>
        </div>
      </article>

      <article className="rounded-[2rem] border border-white/70 bg-white/85 p-6 shadow-xl shadow-slate-200/70 backdrop-blur">
        <p className="text-sm font-black uppercase tracking-[0.24em] text-emerald-700">
          What-if simulator
        </p>
        <h2 className="mt-3 text-3xl font-black text-slate-950">
          Turn small cuts into a goal
        </h2>
        <p className="mt-2 text-sm font-bold text-slate-500">
          Test a monthly reduction and see how much it could free up over time.
        </p>

        <div className="mt-6 grid gap-4">
          <label className="text-sm font-bold text-slate-600">
            Monthly cut amount
            <input
              min="0"
              type="number"
              value={monthlyCut}
              onChange={(event) => setMonthlyCut(Number(event.target.value))}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
            />
          </label>

          <label className="text-sm font-bold text-slate-600">
            Months
            <input
              min="1"
              type="number"
              value={targetMonths}
              onChange={(event) => setTargetMonths(Number(event.target.value))}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
            />
          </label>
        </div>

        <div className="mt-6 rounded-3xl bg-emerald-50 p-5">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-emerald-700">
            Potential savings
          </p>
          <p className="mt-2 text-4xl font-black text-emerald-800">
            {formatCurrency(projectedSavings)}
          </p>
          <p className="mt-2 text-sm font-bold text-emerald-700">
            This makes the tracker useful before spending happens, not only
            after payment history is recorded.
          </p>
        </div>
      </article>
    </section>
  )
}

function BudgetRow({ budget, value, onChange }) {
  const barColor = {
    safe: 'bg-emerald-400',
    warning: 'bg-amber-300',
    danger: 'bg-rose-400',
  }[budget.status]
  const usedWidth = `${Math.min(budget.usedPercent, 100)}%`

  return (
    <div className="rounded-3xl bg-white/10 p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-lg font-black">{budget.category}</p>
          <p className="text-sm font-bold text-slate-300">
            {formatCurrency(budget.spent)} spent of {formatCurrency(budget.budget)}
          </p>
        </div>
        <label className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">
          Budget
          <input
            min="0"
            type="number"
            value={value}
            onChange={(event) =>
              onChange(budget.category, Number(event.target.value))
            }
            className="mt-1 w-28 rounded-xl border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white outline-none focus:border-emerald-300"
          />
        </label>
      </div>
      <div className="mt-4 h-3 overflow-hidden rounded-full bg-white/10">
        <div className={`h-full rounded-full ${barColor}`} style={{ width: usedWidth }} />
      </div>
      <p className="mt-2 text-xs font-bold text-slate-400">
        {budget.remaining >= 0
          ? `${formatCurrency(budget.remaining)} left this month`
          : `${formatCurrency(Math.abs(budget.remaining))} over budget`}
      </p>
    </div>
  )
}
