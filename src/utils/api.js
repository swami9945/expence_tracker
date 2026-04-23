const API_BASE_URL = '/api'
const AUTH_TOKEN_KEY = 'rupeewise-auth-token'

export const authStorage = {
  getToken: () => localStorage.getItem(AUTH_TOKEN_KEY),
  setToken: (token) => localStorage.setItem(AUTH_TOKEN_KEY, token),
  clearToken: () => localStorage.removeItem(AUTH_TOKEN_KEY),
}

async function request(path, options = {}) {
  const token = authStorage.getToken()
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    ...options,
  })

  if (!response.ok) {
    if (response.status === 502) {
      throw new Error(
        'Backend server is not running. Start it with npm run server or npm run dev:full.',
      )
    }

    const contentType = response.headers.get('content-type') || ''

    if (contentType.includes('application/json')) {
      const error = await response.json().catch(() => ({}))
      throw new Error(error.message || `Request failed with ${response.status}.`)
    }

    const text = await response.text().catch(() => '')
    const cleanMessage = text
      .replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()

    throw new Error(cleanMessage || `Request failed with ${response.status}.`)
  }

  if (response.status === 204) {
    return null
  }

  return response.json()
}

export const financeApi = {
  register: (details) =>
    request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(details),
    }),
  login: (credentials) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),
  getCurrentUser: () => request('/auth/me'),
  logout: () => request('/auth/logout', { method: 'POST' }),
  getSummary: () => request('/summary'),
  createTransaction: (transaction) =>
    request('/transactions', {
      method: 'POST',
      body: JSON.stringify(transaction),
    }),
  updateTransaction: (transactionId, transaction) =>
    request(`/transactions/${transactionId}`, {
      method: 'PUT',
      body: JSON.stringify(transaction),
    }),
  deleteTransaction: (transactionId) =>
    request(`/transactions/${transactionId}`, { method: 'DELETE' }),
  replaceTransactions: (transactions) =>
    request('/transactions', {
      method: 'PUT',
      body: JSON.stringify(transactions),
    }),
  updateBudgets: (budgets) =>
    request('/budgets', {
      method: 'PUT',
      body: JSON.stringify(budgets),
    }),
  createGoal: (goal) =>
    request('/goals', {
      method: 'POST',
      body: JSON.stringify(goal),
    }),
  updateGoal: (goalId, goal) =>
    request(`/goals/${goalId}`, {
      method: 'PUT',
      body: JSON.stringify(goal),
    }),
  deleteGoal: (goalId) => request(`/goals/${goalId}`, { method: 'DELETE' }),
  reset: () => request('/reset', { method: 'POST' }),
}
