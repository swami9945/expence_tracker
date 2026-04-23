import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { formatCompactCurrency, formatCurrency } from '../utils/formatters'
import {
  getIncomeExpenseData,
  getMonthlyFlowData,
  groupExpensesByCategory,
} from '../utils/transactions'

const COLORS = ['#0f766e', '#f97316', '#e11d48', '#2563eb', '#7c3aed']

const tooltipFormatter = (value) => formatCurrency(value)

export default function Charts({ transactions }) {
  const expenseData = Object.entries(groupExpensesByCategory(transactions)).map(
    ([name, value]) => ({ name, value }),
  )
  const incomeExpenseData = getIncomeExpenseData(transactions)
  const monthlyFlowData = getMonthlyFlowData(transactions)

  return (
    <section className="grid gap-5 xl:grid-cols-3">
      <article className="rounded-[2rem] border border-white/70 bg-white/85 p-5 shadow-xl shadow-slate-200/70 backdrop-blur">
        <p className="text-sm font-bold uppercase tracking-[0.22em] text-emerald-700">
          Spending
        </p>
        <h2 className="mt-2 text-2xl font-black text-slate-950">
          Expense categories
        </h2>
        <div className="mt-5 h-72">
          {expenseData.length === 0 ? (
            <EmptyChart label="Add expense transactions to build this chart." />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={expenseData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={58}
                  outerRadius={96}
                  paddingAngle={4}
                >
                  {expenseData.map((entry, index) => (
                    <Cell
                      key={entry.name}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={tooltipFormatter} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </article>

      <article className="rounded-[2rem] border border-white/70 bg-white/85 p-5 shadow-xl shadow-slate-200/70 backdrop-blur">
        <p className="text-sm font-bold uppercase tracking-[0.22em] text-emerald-700">
          Cash flow
        </p>
        <h2 className="mt-2 text-2xl font-black text-slate-950">
          Income vs expenses
        </h2>
        <div className="mt-5 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={incomeExpenseData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tickLine={false} axisLine={false} />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickFormatter={formatCompactCurrency}
              />
              <Tooltip formatter={tooltipFormatter} />
              <Bar dataKey="amount" radius={[16, 16, 0, 0]}>
                <Cell fill="#059669" />
                <Cell fill="#f43f5e" />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </article>

      <article className="rounded-[2rem] border border-white/70 bg-white/85 p-5 shadow-xl shadow-slate-200/70 backdrop-blur">
        <p className="text-sm font-bold uppercase tracking-[0.22em] text-emerald-700">
          Trend
        </p>
        <h2 className="mt-2 text-2xl font-black text-slate-950">
          Monthly flow
        </h2>
        <div className="mt-5 h-72">
          {monthlyFlowData.length === 0 ? (
            <EmptyChart label="Add dated transactions to see monthly trends." />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyFlowData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={formatCompactCurrency}
                />
                <Tooltip formatter={tooltipFormatter} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="income"
                  stroke="#059669"
                  strokeWidth={4}
                  dot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="expenses"
                  stroke="#f43f5e"
                  strokeWidth={4}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </article>
    </section>
  )
}

function EmptyChart({ label }) {
  return (
    <div className="flex h-full items-center justify-center rounded-3xl bg-slate-50 text-center">
      <p className="max-w-xs text-sm font-bold text-slate-500">{label}</p>
    </div>
  )
}
