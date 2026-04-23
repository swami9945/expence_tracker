export const createTransactionId = () => {
  if (crypto.randomUUID) {
    return crypto.randomUUID()
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

export const calculateTotals = (transactions) =>
  transactions.reduce(
    (totals, transaction) => {
      if (transaction.type === 'income') {
        totals.income += transaction.amount
      } else {
        totals.expenses += transaction.amount
      }

      totals.balance = totals.income - totals.expenses
      return totals
    },
    { balance: 0, income: 0, expenses: 0 },
  )

export const groupExpensesByCategory = (transactions) =>
  transactions
    .filter((transaction) => transaction.type === 'expense')
    .reduce((groups, transaction) => {
      groups[transaction.category] =
        (groups[transaction.category] || 0) + transaction.amount
      return groups
    }, {})

export const getIncomeExpenseData = (transactions) => {
  const totals = calculateTotals(transactions)

  return [
    { name: 'Income', amount: totals.income },
    { name: 'Expenses', amount: totals.expenses },
  ]
}

export const getSavingsRate = (transactions) => {
  const totals = calculateTotals(transactions)

  if (totals.income === 0) {
    return 0
  }

  return Math.round((totals.balance / totals.income) * 100)
}

export const getTopExpenseCategory = (transactions) => {
  const groupedExpenses = groupExpensesByCategory(transactions)
  const [category = 'No expenses yet', amount = 0] =
    Object.entries(groupedExpenses).sort((a, b) => b[1] - a[1])[0] || []

  return { category, amount }
}

export const getLargestTransaction = (transactions) =>
  [...transactions].sort((a, b) => b.amount - a.amount)[0]

export const getMonthlyFlowData = (transactions) => {
  const groupedByMonth = transactions.reduce((months, transaction) => {
    const month = transaction.date.slice(0, 7)

    if (!months[month]) {
      months[month] = { month, income: 0, expenses: 0 }
    }

    if (transaction.type === 'income') {
      months[month].income += transaction.amount
    } else {
      months[month].expenses += transaction.amount
    }

    return months
  }, {})

  return Object.values(groupedByMonth)
    .sort((a, b) => a.month.localeCompare(b.month))
    .map((entry) => ({
      ...entry,
      month: new Date(`${entry.month}-01T00:00:00`).toLocaleDateString(
        'en-US',
        {
          month: 'short',
          year: '2-digit',
        },
      ),
    }))
}

export const getCurrentMonthTransactions = (transactions) => {
  const currentMonth = new Date().toISOString().slice(0, 7)

  return transactions.filter((transaction) =>
    transaction.date.startsWith(currentMonth),
  )
}

export const getBudgetStatus = (transactions, budgets) => {
  const currentMonthExpenses = groupExpensesByCategory(
    getCurrentMonthTransactions(transactions),
  )

  return Object.entries(budgets)
    .filter(([, budget]) => budget > 0)
    .map(([category, budget]) => {
      const spent = currentMonthExpenses[category] || 0
      const remaining = budget - spent
      const usedPercent = budget === 0 ? 0 : Math.round((spent / budget) * 100)

      return {
        category,
        budget,
        spent,
        remaining,
        usedPercent,
        status:
          usedPercent >= 100 ? 'danger' : usedPercent >= 80 ? 'warning' : 'safe',
      }
    })
}

export const getFinancialHealthScore = (transactions, budgets) => {
  const totals = calculateTotals(getCurrentMonthTransactions(transactions))
  const savingsRate = totals.income === 0 ? 0 : (totals.balance / totals.income) * 100
  const budgetStatuses = getBudgetStatus(transactions, budgets)
  const overBudgetCount = budgetStatuses.filter(
    (budget) => budget.status === 'danger',
  ).length

  const savingsScore = Math.min(Math.max(savingsRate, 0), 50)
  const budgetScore = Math.max(30 - overBudgetCount * 12, 0)
  const activityScore = transactions.length > 0 ? 20 : 0

  return Math.round(savingsScore + budgetScore + activityScore)
}
