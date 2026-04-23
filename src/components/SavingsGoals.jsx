import { useState } from 'react'
import { formatCurrency, todayInputValue } from '../utils/formatters'

const emptyGoal = {
  name: '',
  targetAmount: '',
  savedAmount: '',
  deadline: todayInputValue(),
  note: '',
}

export default function SavingsGoals({ goals, onCreate, onUpdate, onDelete }) {
  const [formData, setFormData] = useState(emptyGoal)
  const [editingGoalId, setEditingGoalId] = useState(null)

  const totalTarget = goals.reduce((sum, goal) => sum + goal.targetAmount, 0)
  const totalSaved = goals.reduce((sum, goal) => sum + goal.savedAmount, 0)
  const overallProgress =
    totalTarget === 0 ? 0 : Math.round((totalSaved / totalTarget) * 100)

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((current) => ({ ...current, [name]: value }))
  }

  const resetForm = () => {
    setFormData(emptyGoal)
    setEditingGoalId(null)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const payload = {
      ...formData,
      targetAmount: Number(formData.targetAmount),
      savedAmount: Number(formData.savedAmount),
      note: formData.note.trim(),
      name: formData.name.trim(),
    }

    if (editingGoalId) {
      await onUpdate(editingGoalId, payload)
    } else {
      await onCreate(payload)
    }

    resetForm()
  }

  const handleEdit = (goal) => {
    setEditingGoalId(goal.id)
    setFormData({
      name: goal.name,
      targetAmount: String(goal.targetAmount),
      savedAmount: String(goal.savedAmount),
      deadline: goal.deadline,
      note: goal.note,
    })
  }

  return (
    <section className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
      <article className="rounded-[2rem] border border-white/70 bg-white/85 p-6 shadow-xl shadow-slate-200/70 backdrop-blur">
        <p className="text-sm font-black uppercase tracking-[0.24em] text-emerald-700">
          Goal builder
        </p>
        <h2 className="mt-3 text-3xl font-black text-slate-950">
          {editingGoalId ? 'Edit savings goal' : 'Create savings goal'}
        </h2>
        <p className="mt-2 text-sm font-bold text-slate-500">
          Track goals that payment apps do not understand: emergency funds,
          travel, gadgets, fees, or big purchases.
        </p>

        <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
          <label className="text-sm font-bold text-slate-600">
            Goal name
            <input
              required
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              placeholder="Emergency fund"
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-bold text-slate-600">
              Target amount
              <input
                required
                min="1"
                type="number"
                name="targetAmount"
                value={formData.targetAmount}
                onChange={handleChange}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                placeholder="150000"
              />
            </label>

            <label className="text-sm font-bold text-slate-600">
              Already saved
              <input
                required
                min="0"
                type="number"
                name="savedAmount"
                value={formData.savedAmount}
                onChange={handleChange}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                placeholder="25000"
              />
            </label>
          </div>

          <label className="text-sm font-bold text-slate-600">
            Deadline
            <input
              required
              type="date"
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
            />
          </label>

          <label className="text-sm font-bold text-slate-600">
            Note
            <textarea
              name="note"
              value={formData.note}
              onChange={handleChange}
              className="mt-2 min-h-24 w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              placeholder="Why this goal matters"
            />
          </label>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            {editingGoalId && (
              <button
                type="button"
                className="rounded-2xl border border-slate-200 px-5 py-3 font-black text-slate-600 transition hover:bg-slate-50"
                onClick={resetForm}
              >
                Cancel edit
              </button>
            )}
            <button
              type="submit"
              className="rounded-2xl bg-slate-950 px-5 py-3 font-black text-white shadow-lg shadow-slate-950/20 transition hover:-translate-y-0.5 hover:bg-emerald-700"
            >
              {editingGoalId ? 'Save goal' : 'Add goal'}
            </button>
          </div>
        </form>
      </article>

      <article className="rounded-[2rem] border border-white/70 bg-slate-950 p-6 text-white shadow-2xl shadow-slate-950/20">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.24em] text-emerald-300">
              Progress
            </p>
            <h2 className="mt-3 text-3xl font-black">Savings roadmap</h2>
          </div>
          <div className="rounded-3xl bg-white/10 px-5 py-4">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
              Overall
            </p>
            <p className="mt-1 text-4xl font-black text-emerald-300">
              {overallProgress}%
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-4">
          {goals.length === 0 ? (
            <div className="rounded-3xl bg-white/10 p-8 text-center">
              <p className="text-lg font-black">No goals yet</p>
              <p className="mt-2 text-sm font-bold text-slate-300">
                Create your first target to start tracking progress.
              </p>
            </div>
          ) : (
            goals.map((goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                onEdit={handleEdit}
                onDelete={onDelete}
              />
            ))
          )}
        </div>
      </article>
    </section>
  )
}

function GoalCard({ goal, onEdit, onDelete }) {
  const progress = Math.min(
    Math.round((goal.savedAmount / goal.targetAmount) * 100),
    100,
  )
  const remaining = Math.max(goal.targetAmount - goal.savedAmount, 0)

  return (
    <div className="rounded-3xl bg-white/10 p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xl font-black">{goal.name}</p>
          <p className="mt-1 text-sm font-bold text-slate-300">
            {goal.note || 'No note added'}
          </p>
          <p className="mt-2 text-xs font-black uppercase tracking-[0.18em] text-slate-400">
            Deadline: {goal.deadline}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            className="rounded-2xl bg-white px-4 py-2 text-sm font-black text-slate-950 transition hover:bg-emerald-100"
            onClick={() => onEdit(goal)}
          >
            Edit
          </button>
          <button
            type="button"
            className="rounded-2xl bg-rose-500 px-4 py-2 text-sm font-black text-white transition hover:bg-rose-400"
            onClick={() => onDelete(goal.id)}
          >
            Delete
          </button>
        </div>
      </div>

      <div className="mt-5 h-3 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-emerald-300"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="mt-4 grid gap-3 text-sm font-bold text-slate-300 sm:grid-cols-3">
        <p>{progress}% complete</p>
        <p>{formatCurrency(goal.savedAmount)} saved</p>
        <p>{formatCurrency(remaining)} remaining</p>
      </div>
    </div>
  )
}
