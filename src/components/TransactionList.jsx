import { formatCurrency, formatDate } from '../utils/formatters'

export default function TransactionList({ transactions, onEdit, onDelete }) {
  return (
    <section className="rounded-[2rem] border border-white/70 bg-white/85 p-5 shadow-xl shadow-slate-200/70 backdrop-blur">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-emerald-700">
            Ledger
          </p>
          <h2 className="mt-2 text-2xl font-black text-slate-950">
            Transaction list
          </h2>
        </div>
        <p className="rounded-full bg-slate-100 px-4 py-2 text-sm font-bold text-slate-600">
          {transactions.length} shown
        </p>
      </div>

      <div className="mt-5 overflow-hidden rounded-3xl border border-slate-100">
        {transactions.length === 0 ? (
          <div className="bg-slate-50 px-5 py-12 text-center">
            <p className="text-lg font-black text-slate-800">
              No transactions found
            </p>
            <p className="mt-2 text-sm font-medium text-slate-500">
              Add a transaction or adjust your filters to see entries here.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {transactions.map((transaction) => (
              <article
                key={transaction.id}
                className="grid gap-4 bg-white p-4 transition hover:bg-emerald-50/60 lg:grid-cols-[1.2fr_0.8fr_0.8fr_auto]"
              >
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-black uppercase tracking-[0.16em] ${
                        transaction.type === 'income'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-rose-100 text-rose-700'
                      }`}
                    >
                      {transaction.type}
                    </span>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600">
                      {transaction.category}
                    </span>
                  </div>
                  <p className="mt-3 text-lg font-black text-slate-950">
                    {transaction.note || 'Untitled transaction'}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                    Date
                  </p>
                  <p className="mt-2 font-bold text-slate-700">
                    {formatDate(transaction.date)}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                    Amount
                  </p>
                  <p
                    className={`mt-2 text-xl font-black ${
                      transaction.type === 'income'
                        ? 'text-emerald-700'
                        : 'text-rose-600'
                    }`}
                  >
                    {transaction.type === 'income' ? '+' : '-'}
                    {formatCurrency(transaction.amount)}
                  </p>
                </div>

                <div className="flex gap-2 lg:items-center">
                  <button
                    type="button"
                    className="rounded-2xl bg-slate-100 px-4 py-2 text-sm font-black text-slate-700 transition hover:bg-slate-200"
                    onClick={() => onEdit(transaction)}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="rounded-2xl bg-rose-50 px-4 py-2 text-sm font-black text-rose-700 transition hover:bg-rose-100"
                    onClick={() => onDelete(transaction.id)}
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
