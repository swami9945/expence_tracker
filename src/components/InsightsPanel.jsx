import { formatCurrency } from '../utils/formatters'
import {
  getLargestTransaction,
  getSavingsRate,
  getTopExpenseCategory,
} from '../utils/transactions'

export default function InsightsPanel({ transactions }) {
  const savingsRate = getSavingsRate(transactions)
  const topExpense = getTopExpenseCategory(transactions)
  const largestTransaction = getLargestTransaction(transactions)

  const insights = [
    {
      label: 'Savings rate',
      value: `${savingsRate}%`,
      detail:
        savingsRate >= 20
          ? 'Strong cash retention this period.'
          : 'Try nudging expenses down or income up.',
    },
    {
      label: 'Top expense area',
      value: topExpense.category,
      detail:
        topExpense.amount > 0
          ? `${formatCurrency(topExpense.amount)} spent here.`
          : 'No expense category has activity yet.',
    },
    {
      label: 'Largest entry',
      value: largestTransaction
        ? formatCurrency(largestTransaction.amount)
        : formatCurrency(0),
      detail: largestTransaction
        ? `${largestTransaction.category} - ${largestTransaction.note || largestTransaction.type}`
        : 'Add your first transaction to unlock insights.',
    },
  ]

  return (
    <section className="grid gap-4 lg:grid-cols-3">
      {insights.map((insight) => (
        <article
          key={insight.label}
          className="rounded-3xl border border-slate-200/80 bg-white/80 p-5 shadow-lg shadow-slate-200/70 backdrop-blur"
        >
          <p className="text-sm font-black uppercase tracking-[0.22em] text-slate-400">
            {insight.label}
          </p>
          <p className="mt-3 text-3xl font-black text-slate-950">
            {insight.value}
          </p>
          <p className="mt-2 text-sm font-bold text-slate-500">
            {insight.detail}
          </p>
        </article>
      ))}
    </section>
  )
}
