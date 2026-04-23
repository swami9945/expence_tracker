import { randomUUID } from 'node:crypto'

export const defaultBudgets = {
  Food: 12000,
  Travel: 6000,
  Bills: 9000,
  Shopping: 8000,
  Salary: 0,
  Rent: 25000,
  Fuel: 7000,
  UPI: 10000,
}

export const starterTransactions = [
  {
    id: randomUUID(),
    amount: 85000,
    type: 'income',
    category: 'Salary',
    date: '2026-03-01',
    note: 'Monthly salary',
  },
  {
    id: randomUUID(),
    amount: 85000,
    type: 'income',
    category: 'Salary',
    date: '2026-04-01',
    note: 'Monthly salary',
  },
  {
    id: randomUUID(),
    amount: 2350,
    type: 'expense',
    category: 'Food',
    date: '2026-04-05',
    note: 'Groceries and chai',
  },
  {
    id: randomUUID(),
    amount: 4200,
    type: 'expense',
    category: 'Shopping',
    date: '2026-03-18',
    note: 'Work shoes and jacket',
  },
  {
    id: randomUUID(),
    amount: 1800,
    type: 'expense',
    category: 'Travel',
    date: '2026-03-22',
    note: 'Weekend train tickets',
  },
  {
    id: randomUUID(),
    amount: 3600,
    type: 'expense',
    category: 'Bills',
    date: '2026-04-08',
    note: 'Utilities',
  },
  {
    id: randomUUID(),
    amount: 24000,
    type: 'expense',
    category: 'Rent',
    date: '2026-04-02',
    note: 'Apartment rent',
  },
  {
    id: randomUUID(),
    amount: 3200,
    type: 'expense',
    category: 'Fuel',
    date: '2026-04-12',
    note: 'Petrol refill',
  },
  {
    id: randomUUID(),
    amount: 1250,
    type: 'expense',
    category: 'UPI',
    date: '2026-04-15',
    note: 'UPI transfers and small payments',
  },
]

export const starterGoals = [
  {
    id: randomUUID(),
    name: 'Emergency fund',
    targetAmount: 150000,
    savedAmount: 65000,
    deadline: '2026-12-31',
    note: 'Six months of essential expenses',
  },
  {
    id: randomUUID(),
    name: 'Goa trip',
    targetAmount: 45000,
    savedAmount: 18000,
    deadline: '2026-08-15',
    note: 'Travel, stay, food, and activities',
  },
]

export const starterUsers = [
  {
    id: 'demo-user',
    name: 'Demo User',
    email: 'demo@rupeewise.local',
    password: 'demo1234',
  },
]

export const createDemoFinanceData = () => ({
  transactions: starterTransactions,
  budgets: defaultBudgets,
  goals: starterGoals,
})

export const createEmptyFinanceData = () => ({
  transactions: [],
  budgets: defaultBudgets,
  goals: [],
})

export const createInitialData = () => ({
  users: starterUsers,
  financeByUser: {
    'demo-user': createDemoFinanceData(),
  },
})
