import { randomUUID } from 'node:crypto'
import cors from 'cors'
import express from 'express'
import {
  createDemoFinanceData,
  createEmptyFinanceData,
} from './seed.js'
import { readStore, writeStore } from './store.js'

const app = express()
const PORT = process.env.PORT || 4000
const activeTokens = new Map()

app.use(cors())
app.use(express.json())

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization || ''
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : ''

  if (!token || !activeTokens.has(token)) {
    return res.status(401).json({ message: 'Please login to continue.' })
  }

  req.user = activeTokens.get(token)
  return next()
}

const isValidTransaction = (transaction) =>
  Number(transaction.amount) > 0 &&
  ['income', 'expense'].includes(transaction.type) &&
  Boolean(transaction.category) &&
  Boolean(transaction.date)

const normalizeTransaction = (transaction) => ({
  id: transaction.id || randomUUID(),
  amount: Number(transaction.amount),
  type: transaction.type,
  category: transaction.category,
  date: transaction.date,
  note: transaction.note || '',
})

const isValidGoal = (goal) =>
  Boolean(goal.name) &&
  Number(goal.targetAmount) > 0 &&
  Number(goal.savedAmount) >= 0 &&
  Boolean(goal.deadline)

const normalizeGoal = (goal) => ({
  id: goal.id || randomUUID(),
  name: goal.name,
  targetAmount: Number(goal.targetAmount),
  savedAmount: Math.min(Number(goal.savedAmount), Number(goal.targetAmount)),
  deadline: goal.deadline,
  note: goal.note || '',
})

const normalizeEmail = (email) => String(email || '').trim().toLowerCase()

const toSafeUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
})

const ensureUsers = (data) => {
  data.users = data.users || [
    {
      id: 'demo-user',
      name: 'Demo User',
      email: 'demo@rupeewise.local',
      password: 'demo1234',
    },
  ]

  return data.users
}

const ensureFinanceByUser = (data) => {
  data.financeByUser = data.financeByUser || {}

  if (!data.financeByUser['demo-user']) {
    data.financeByUser['demo-user'] = {
      transactions: data.transactions || createDemoFinanceData().transactions,
      budgets: data.budgets || createDemoFinanceData().budgets,
      goals: data.goals || createDemoFinanceData().goals,
    }
  }

  return data.financeByUser
}

const getUserFinance = (data, userId) => {
  const financeByUser = ensureFinanceByUser(data)

  if (!financeByUser[userId]) {
    financeByUser[userId] = createEmptyFinanceData()
  }

  return financeByUser[userId]
}

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'personal-finance-api' })
})

app.post('/api/auth/register', async (req, res, next) => {
  try {
    const { name, email, password } = req.body || {}
    const cleanName = String(name || '').trim()
    const cleanEmail = normalizeEmail(email)
    const cleanPassword = String(password || '')

    if (!cleanName || !cleanEmail || cleanPassword.length < 6) {
      return res.status(400).json({
        message: 'Name, valid email, and 6+ character password are required.',
      })
    }

    const data = await readStore()
    const users = ensureUsers(data)
    const userExists = users.some((user) => user.email === cleanEmail)

    if (userExists) {
      return res.status(409).json({ message: 'Email is already registered.' })
    }

    const user = {
      id: randomUUID(),
      name: cleanName,
      email: cleanEmail,
      password: cleanPassword,
    }

    users.push(user)
    const financeByUser = ensureFinanceByUser(data)
    financeByUser[user.id] = createEmptyFinanceData()
    await writeStore(data)

    return res.status(201).json({
      message: 'Registration successful. Please login.',
      user: toSafeUser(user),
    })
  } catch (error) {
    return next(error)
  }
})

app.post('/api/auth/login', async (req, res, next) => {
  try {
    const { email, password } = req.body || {}
    const cleanEmail = normalizeEmail(email)
    const cleanPassword = String(password || '')
    const data = await readStore()
    const users = ensureUsers(data)
    const user = users.find(
      (storedUser) =>
        storedUser.email === cleanEmail && storedUser.password === cleanPassword,
    )

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' })
    }

    const token = randomUUID()
    const safeUser = toSafeUser(user)

    activeTokens.set(token, safeUser)

    return res.json({ token, user: safeUser })
  } catch (error) {
    return next(error)
  }
})

app.get('/api/auth/me', authenticate, (req, res) => {
  res.json({ user: req.user })
})

app.post('/api/auth/logout', authenticate, (req, res) => {
  const token = req.headers.authorization.slice(7)
  activeTokens.delete(token)
  res.status(204).send()
})

app.use('/api', authenticate)

app.get('/api/summary', async (req, res, next) => {
  try {
    const data = await readStore()
    const finance = getUserFinance(data, req.user.id)
    await writeStore(data)
    res.json(finance)
  } catch (error) {
    next(error)
  }
})

app.get('/api/transactions', async (req, res, next) => {
  try {
    const data = await readStore()
    res.json(getUserFinance(data, req.user.id).transactions)
  } catch (error) {
    next(error)
  }
})

app.post('/api/transactions', async (req, res, next) => {
  try {
    if (!isValidTransaction(req.body)) {
      return res.status(400).json({ message: 'Invalid transaction payload.' })
    }

    const data = await readStore()
    const transaction = normalizeTransaction(req.body)
    const finance = getUserFinance(data, req.user.id)
    finance.transactions = [transaction, ...finance.transactions]
    await writeStore(data)

    return res.status(201).json(transaction)
  } catch (error) {
    return next(error)
  }
})

app.put('/api/transactions/:id', async (req, res, next) => {
  try {
    if (!isValidTransaction(req.body)) {
      return res.status(400).json({ message: 'Invalid transaction payload.' })
    }

    const data = await readStore()
    const finance = getUserFinance(data, req.user.id)
    const transactionIndex = finance.transactions.findIndex(
      (transaction) => transaction.id === req.params.id,
    )

    if (transactionIndex === -1) {
      return res.status(404).json({ message: 'Transaction not found.' })
    }

    const updatedTransaction = normalizeTransaction({
      ...req.body,
      id: req.params.id,
    })
    finance.transactions[transactionIndex] = updatedTransaction
    await writeStore(data)

    return res.json(updatedTransaction)
  } catch (error) {
    return next(error)
  }
})

app.delete('/api/transactions/:id', async (req, res, next) => {
  try {
    const data = await readStore()
    const finance = getUserFinance(data, req.user.id)
    const nextTransactions = finance.transactions.filter(
      (transaction) => transaction.id !== req.params.id,
    )

    if (nextTransactions.length === finance.transactions.length) {
      return res.status(404).json({ message: 'Transaction not found.' })
    }

    finance.transactions = nextTransactions
    await writeStore(data)

    return res.status(204).send()
  } catch (error) {
    return next(error)
  }
})

app.put('/api/transactions', async (req, res, next) => {
  try {
    if (!Array.isArray(req.body)) {
      return res.status(400).json({ message: 'Expected an array.' })
    }

    const data = await readStore()
    const finance = getUserFinance(data, req.user.id)
    finance.transactions = req.body
      .filter(isValidTransaction)
      .map(normalizeTransaction)
    await writeStore(data)

    return res.json(finance.transactions)
  } catch (error) {
    return next(error)
  }
})

app.get('/api/budgets', async (req, res, next) => {
  try {
    const data = await readStore()
    res.json(getUserFinance(data, req.user.id).budgets)
  } catch (error) {
    next(error)
  }
})

app.put('/api/budgets', async (req, res, next) => {
  try {
    const data = await readStore()
    const finance = getUserFinance(data, req.user.id)
    finance.budgets = Object.fromEntries(
      Object.entries(req.body || {}).map(([category, amount]) => [
        category,
        Math.max(Number(amount) || 0, 0),
      ]),
    )
    await writeStore(data)

    return res.json(finance.budgets)
  } catch (error) {
    return next(error)
  }
})

app.get('/api/goals', async (req, res, next) => {
  try {
    const data = await readStore()
    res.json(getUserFinance(data, req.user.id).goals || [])
  } catch (error) {
    next(error)
  }
})

app.post('/api/goals', async (req, res, next) => {
  try {
    if (!isValidGoal(req.body)) {
      return res.status(400).json({ message: 'Invalid savings goal payload.' })
    }

    const data = await readStore()
    const finance = getUserFinance(data, req.user.id)
    finance.goals = finance.goals || []
    const goal = normalizeGoal(req.body)
    finance.goals = [goal, ...finance.goals]
    await writeStore(data)

    return res.status(201).json(goal)
  } catch (error) {
    return next(error)
  }
})

app.put('/api/goals/:id', async (req, res, next) => {
  try {
    if (!isValidGoal(req.body)) {
      return res.status(400).json({ message: 'Invalid savings goal payload.' })
    }

    const data = await readStore()
    const finance = getUserFinance(data, req.user.id)
    finance.goals = finance.goals || []
    const goalIndex = finance.goals.findIndex((goal) => goal.id === req.params.id)

    if (goalIndex === -1) {
      return res.status(404).json({ message: 'Savings goal not found.' })
    }

    const updatedGoal = normalizeGoal({ ...req.body, id: req.params.id })
    finance.goals[goalIndex] = updatedGoal
    await writeStore(data)

    return res.json(updatedGoal)
  } catch (error) {
    return next(error)
  }
})

app.delete('/api/goals/:id', async (req, res, next) => {
  try {
    const data = await readStore()
    const finance = getUserFinance(data, req.user.id)
    finance.goals = finance.goals || []
    const nextGoals = finance.goals.filter((goal) => goal.id !== req.params.id)

    if (nextGoals.length === finance.goals.length) {
      return res.status(404).json({ message: 'Savings goal not found.' })
    }

    finance.goals = nextGoals
    await writeStore(data)

    return res.status(204).send()
  } catch (error) {
    return next(error)
  }
})

app.post('/api/reset', async (req, res, next) => {
  try {
    const data = await readStore()
    const financeByUser = ensureFinanceByUser(data)
    financeByUser[req.user.id] =
      req.user.id === 'demo-user'
        ? createDemoFinanceData()
        : createEmptyFinanceData()
    await writeStore(data)
    res.json(financeByUser[req.user.id])
  } catch (error) {
    next(error)
  }
})

app.use((error, _req, res, _next) => {
  console.error(error)
  res.status(500).json({ message: 'Server error. Please try again.' })
})

app.listen(PORT, () => {
  console.log(`Finance API running on http://localhost:${PORT}`)
})
