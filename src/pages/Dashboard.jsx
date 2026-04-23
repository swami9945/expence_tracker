import { useEffect, useMemo, useState } from 'react'
import AppNavigation from '../components/AppNavigation'
import Charts from '../components/Charts'
import DataTools from '../components/DataTools'
import Filters from '../components/Filters'
import InsightsPanel from '../components/InsightsPanel'
import MoneyCoach from '../components/MoneyCoach'
import PageHeader from '../components/PageHeader'
import SavingsGoals from '../components/SavingsGoals'
import SmartCalculator from '../components/SmartCalculator'
import SummaryCard from '../components/SummaryCard'
import TransactionList from '../components/TransactionList'
import TransactionModal from '../components/TransactionModal'
import { financeApi } from '../utils/api'
import { DEFAULT_BUDGETS } from '../utils/categories'
import { calculateTotals } from '../utils/transactions'

export default function Dashboard({ user, onLogout }) {
  const [transactions, setTransactions] = useState([])
  const [budgets, setBudgets] = useState(DEFAULT_BUDGETS)
  const [goals, setGoals] = useState([])
  const [filters, setFilters] = useState({
    search: '',
    type: 'all',
    category: 'all',
  })
  const [activeView, setActiveView] = useState('overview')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [statusMessage, setStatusMessage] = useState('')

  const totals = useMemo(() => calculateTotals(transactions), [transactions])

  useEffect(() => {
    let isMounted = true

    const loadFinanceData = async () => {
      try {
        const data = await financeApi.getSummary()

        if (!isMounted) {
          return
        }

        setTransactions(data.transactions || [])
        setBudgets(data.budgets || DEFAULT_BUDGETS)
        setGoals(data.goals || [])
        setStatusMessage('')
      } catch (error) {
        if (isMounted) {
          setStatusMessage(
            `Backend connection failed: ${error.message}. Start the server with npm run server.`,
          )
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadFinanceData()

    return () => {
      isMounted = false
    }
  }, [])

  const filteredTransactions = useMemo(
    () =>
      transactions
        .filter((transaction) => {
          const searchTerm = filters.search.trim().toLowerCase()

          if (!searchTerm) {
            return true
          }

          return [transaction.note, transaction.category, transaction.type]
            .join(' ')
            .toLowerCase()
            .includes(searchTerm)
        })
        .filter((transaction) =>
          filters.type === 'all' ? true : transaction.type === filters.type,
        )
        .filter((transaction) =>
          filters.category === 'all'
            ? true
            : transaction.category === filters.category,
        )
        .sort((a, b) => new Date(b.date) - new Date(a.date)),
    [filters, transactions],
  )

  const validateTransactions = (incomingTransactions) =>
    incomingTransactions
      .filter(
        (transaction) =>
          Number(transaction.amount) > 0 &&
          ['income', 'expense'].includes(transaction.type) &&
          transaction.category &&
          transaction.date,
      )
      .map((transaction) => ({
        id: transaction.id,
        amount: Number(transaction.amount),
        type: transaction.type,
        category: transaction.category,
        date: transaction.date,
        note: transaction.note || '',
      }))

  const openAddModal = () => {
    setEditingTransaction(null)
    setIsModalOpen(true)
  }

  const openEditModal = (transaction) => {
    setEditingTransaction(transaction)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingTransaction(null)
  }

  const handleSaveTransaction = async (transactionData) => {
    try {
      if (editingTransaction) {
        const updatedTransaction = await financeApi.updateTransaction(
          editingTransaction.id,
          transactionData,
        )
        setTransactions((currentTransactions) =>
          currentTransactions.map((transaction) =>
            transaction.id === editingTransaction.id
              ? updatedTransaction
              : transaction,
          ),
        )
      } else {
        const createdTransaction =
          await financeApi.createTransaction(transactionData)
        setTransactions((currentTransactions) => [
          createdTransaction,
          ...currentTransactions,
        ])
      }

      setStatusMessage('')
      closeModal()
    } catch (error) {
      setStatusMessage(`Could not save transaction: ${error.message}`)
    }
  }

  const handleDeleteTransaction = async (transactionId) => {
    try {
      await financeApi.deleteTransaction(transactionId)
      setTransactions((currentTransactions) =>
        currentTransactions.filter(
          (transaction) => transaction.id !== transactionId,
        ),
      )
      setStatusMessage('')
    } catch (error) {
      setStatusMessage(`Could not delete transaction: ${error.message}`)
    }
  }

  const handleImportTransactions = async (incomingTransactions) => {
    try {
      const importedTransactions = await financeApi.replaceTransactions(
        validateTransactions(incomingTransactions),
      )
      setTransactions(importedTransactions)
      setStatusMessage('')
    } catch (error) {
      setStatusMessage(`Could not import transactions: ${error.message}`)
    }
  }

  const handleBudgetChange = async (category, amount) => {
    const nextBudgets = {
      ...budgets,
      [category]: Math.max(Number(amount) || 0, 0),
    }

    setBudgets(nextBudgets)

    try {
      const savedBudgets = await financeApi.updateBudgets(nextBudgets)
      setBudgets(savedBudgets)
      setStatusMessage('')
    } catch (error) {
      setStatusMessage(`Could not save budgets: ${error.message}`)
    }
  }

  const handleResetData = async () => {
    try {
      const data = await financeApi.reset()
      setTransactions(data.transactions)
      setBudgets(data.budgets)
      setStatusMessage('Demo data restored from the backend.')
    } catch (error) {
      setStatusMessage(`Could not reset data: ${error.message}`)
    }
  }

  const handleClearTransactions = async () => {
    try {
      const clearedTransactions = await financeApi.replaceTransactions([])
      setTransactions(clearedTransactions)
      setStatusMessage('Transactions cleared on the backend.')
    } catch (error) {
      setStatusMessage(`Could not clear transactions: ${error.message}`)
    }
  }

  const handleCreateGoal = async (goalData) => {
    try {
      const createdGoal = await financeApi.createGoal(goalData)
      setGoals((currentGoals) => [createdGoal, ...currentGoals])
      setStatusMessage('')
    } catch (error) {
      setStatusMessage(`Could not create goal: ${error.message}`)
    }
  }

  const handleUpdateGoal = async (goalId, goalData) => {
    try {
      const updatedGoal = await financeApi.updateGoal(goalId, goalData)
      setGoals((currentGoals) =>
        currentGoals.map((goal) => (goal.id === goalId ? updatedGoal : goal)),
      )
      setStatusMessage('')
    } catch (error) {
      setStatusMessage(`Could not update goal: ${error.message}`)
    }
  }

  const handleDeleteGoal = async (goalId) => {
    try {
      await financeApi.deleteGoal(goalId)
      setGoals((currentGoals) => currentGoals.filter((goal) => goal.id !== goalId))
      setStatusMessage('')
    } catch (error) {
      setStatusMessage(`Could not delete goal: ${error.message}`)
    }
  }

  const addTransactionButton = (
    <button
      type="button"
      className="rounded-2xl bg-emerald-400 px-6 py-4 font-black text-slate-950 shadow-xl shadow-emerald-500/20 transition hover:-translate-y-0.5 hover:bg-emerald-300"
      onClick={openAddModal}
    >
      Add transaction
    </button>
  )

  return (
    <main
      id="finance-dashboard"
      className="min-h-screen overflow-hidden bg-[#eef3ef] text-slate-900"
    >
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,#bbf7d0_0,transparent_28%),radial-gradient(circle_at_bottom_right,#fed7aa_0,transparent_26%)]" />

      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8">
        <header className="relative overflow-hidden rounded-[2rem] bg-slate-950 p-6 text-white shadow-2xl shadow-slate-950/20 sm:p-8">
          <div className="absolute right-0 top-0 h-40 w-40 rounded-bl-full bg-emerald-400/30" />
          <div className="absolute bottom-0 right-28 h-28 w-28 rounded-t-full bg-orange-300/30" />
          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.28em] text-emerald-300">
                Personal Finance Tracker
              </p>
              <h1 className="mt-4 max-w-3xl text-4xl font-black tracking-tight sm:text-6xl">
                See your money clearly, then make the next move.
              </h1>
              <p className="mt-4 max-w-2xl text-base font-medium text-slate-300">
                Track income, expenses, categories, dates, and notes locally in
                your browser with responsive dashboards and charts.
              </p>
              {user && (
                <p className="mt-4 inline-flex rounded-full bg-white/10 px-4 py-2 text-sm font-black text-emerald-200">
                  Logged in as {user.name}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
              {addTransactionButton}
              <button
                type="button"
                className="rounded-2xl border border-white/20 px-6 py-4 font-black text-white transition hover:-translate-y-0.5 hover:bg-white/10"
                onClick={onLogout}
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        <AppNavigation activeView={activeView} onNavigate={setActiveView} />

        {(isLoading || statusMessage) && (
          <section
            className={`rounded-3xl border px-5 py-4 text-sm font-bold ${
              statusMessage.includes('failed') || statusMessage.includes('Could not')
                ? 'border-rose-200 bg-rose-50 text-rose-700'
                : 'border-emerald-200 bg-emerald-50 text-emerald-700'
            }`}
          >
            {isLoading ? 'Loading data from backend...' : statusMessage}
          </section>
        )}

        {activeView === 'overview' && (
          <>
            <PageHeader
              eyebrow="Overview"
              title="Your money command center"
              description="A quick, dynamic summary of balance, income, expenses, and important money signals."
              action={addTransactionButton}
            />
            <section className="grid gap-5 lg:grid-cols-3">
              <SummaryCard
                label="Total balance"
                value={totals.balance}
                tone="balance"
                helper="Income minus every saved expense."
              />
              <SummaryCard
                label="Total income"
                value={totals.income}
                tone="income"
                helper="All income entries currently stored."
              />
              <SummaryCard
                label="Total expenses"
                value={totals.expenses}
                tone="expense"
                helper="Every outgoing transaction by category."
              />
            </section>
            <InsightsPanel transactions={transactions} />
          </>
        )}

        {activeView === 'transactions' && (
          <>
            <PageHeader
              eyebrow="Transactions"
              title="Search, filter, edit, and clean your records"
              description="This section is focused on day-to-day money entries, with quick filters and full edit/delete controls."
              action={addTransactionButton}
            />
            <Filters filters={filters} onChange={setFilters} />
            <TransactionList
              transactions={filteredTransactions}
              onEdit={openEditModal}
              onDelete={handleDeleteTransaction}
            />
          </>
        )}

        {activeView === 'analytics' && (
          <>
            <PageHeader
              eyebrow="Analytics"
              title="Turn transactions into patterns"
              description="Charts help compare income, expenses, monthly cash flow, and where spending concentrates."
            />
            <Charts transactions={transactions} />
          </>
        )}

        {activeView === 'coach' && (
          <>
            <PageHeader
              eyebrow="Money Coach"
              title="Budget alerts and what-if planning"
              description="This is the special layer over payment apps: it warns before overspending and simulates future savings."
            />
            <MoneyCoach
              transactions={transactions}
              budgets={budgets}
              onBudgetChange={handleBudgetChange}
            />
          </>
        )}

        {activeView === 'goals' && (
          <>
            <PageHeader
              eyebrow="Savings Goals"
              title="Plan beyond transactions"
              description="Create personal savings targets and track progress toward big decisions, not only day-to-day expenses."
            />
            <SavingsGoals
              goals={goals}
              onCreate={handleCreateGoal}
              onUpdate={handleUpdateGoal}
              onDelete={handleDeleteGoal}
            />
          </>
        )}

        {activeView === 'calculator' && (
          <>
            <PageHeader
              eyebrow="Smart Calculator"
              title="Plan loans, SIPs, and future goals"
              description="Use quick calculators for EMI, investment growth, and monthly savings needed before making a money decision."
            />
            <SmartCalculator />
          </>
        )}

        {activeView === 'data' && (
          <>
            <PageHeader
              eyebrow="Data"
              title="Backup, restore, or reset your local records"
              description="Everything stays in the browser. Export JSON for backup or import a saved file when needed."
            />
            <DataTools
              transactions={transactions}
              onImport={handleImportTransactions}
              onReset={handleResetData}
              onClear={handleClearTransactions}
            />
          </>
        )}
      </div>

      {isModalOpen && (
        <TransactionModal
          isOpen={isModalOpen}
          transaction={editingTransaction}
          onClose={closeModal}
          onSubmit={handleSaveTransaction}
        />
      )}
    </main>
  )
}
