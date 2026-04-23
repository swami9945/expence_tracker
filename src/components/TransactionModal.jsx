import { useState } from 'react'
import { CATEGORIES } from '../utils/categories'
import { todayInputValue } from '../utils/formatters'

const createEmptyForm = () => ({
  amount: '',
  type: 'expense',
  category: CATEGORIES[0],
  date: todayInputValue(),
  note: '',
})

const createFormFromTransaction = (transaction) => {
  if (!transaction) {
    return createEmptyForm()
  }

  return {
    amount: String(transaction.amount),
    type: transaction.type,
    category: transaction.category,
    date: transaction.date,
    note: transaction.note,
  }
}

export default function TransactionModal({
  isOpen,
  onClose,
  onSubmit,
  transaction,
}) {
  const [formData, setFormData] = useState(() =>
    createFormFromTransaction(transaction),
  )

  if (!isOpen) {
    return null
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    onSubmit({
      ...formData,
      amount: Number(formData.amount),
      note: formData.note.trim(),
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-[2rem] bg-white p-6 shadow-2xl shadow-slate-950/20">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-emerald-700">
              Transaction
            </p>
            <h2 className="mt-2 text-3xl font-black text-slate-950">
              {transaction ? 'Edit entry' : 'Add new entry'}
            </h2>
          </div>
          <button
            type="button"
            className="rounded-full bg-slate-100 px-4 py-2 font-bold text-slate-600 transition hover:bg-slate-200"
            onClick={onClose}
          >
            Close
          </button>
        </div>

        <form className="mt-6 grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit}>
          <label className="text-sm font-bold text-slate-600">
            Amount
            <input
              required
              min="0.01"
              step="0.01"
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              placeholder="2500"
            />
          </label>

          <label className="text-sm font-bold text-slate-600">
            Type
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
            >
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </label>

          <label className="text-sm font-bold text-slate-600">
            Category
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
            >
              {CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </label>

          <label className="text-sm font-bold text-slate-600">
            Date
            <input
              required
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
            />
          </label>

          <label className="text-sm font-bold text-slate-600 sm:col-span-2">
            Note
            <textarea
              name="note"
              value={formData.note}
              onChange={handleChange}
              className="mt-2 min-h-28 w-full resize-none rounded-2xl border border-slate-200 px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              placeholder="Optional details"
            />
          </label>

          <div className="flex flex-col-reverse gap-3 sm:col-span-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              className="rounded-2xl border border-slate-200 px-5 py-3 font-black text-slate-600 transition hover:bg-slate-50"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-2xl bg-slate-950 px-5 py-3 font-black text-white shadow-lg shadow-slate-950/20 transition hover:-translate-y-0.5 hover:bg-emerald-700"
            >
              {transaction ? 'Save changes' : 'Add transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
