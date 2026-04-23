<<<<<<< HEAD
# Personal Finance Tracker

A full-stack personal finance tracker built with React, Vite, Tailwind CSS, Recharts, and an Express backend with JSON-file persistence.

## Features

- Dashboard summary cards for total balance, income, and expenses
- Indian Rupee formatting with India-focused demo budgets and categories
- Dynamic tab navigation for Overview, Transactions, Analytics, Money Coach, and Data
- Add, edit, delete, and filter transactions
- Default categories: Food, Travel, Bills, Shopping, Salary, Rent, Fuel, UPI
- Expense category pie chart and income vs expenses bar chart
- Monthly income and expense trend chart
- Search, type filters, category dropdown, and category quick chips
- Savings rate, largest entry, and top spending insights
- Smart Money Coach with monthly budget alerts and a financial health score
- What-if savings simulator to compare future savings from spending cuts
- Savings Goals tab with target amounts, saved progress, deadlines, and notes
- Smart Calculator tab for EMI, SIP future value, and monthly goal-saving estimates
- Register-first login screen with token-protected backend API routes
- Per-user backend data separation for transactions, budgets, and savings goals
- JSON export/import, reset demo data, and clear all actions
- Backend REST API for transactions, budgets, summary data, and reset
- JSON-file persistence in `server/data/finance.json`
- Responsive Tailwind CSS interface with modal transaction forms

## Folder Structure

```text
src/
  components/
    AppNavigation.jsx
    Charts.jsx
    DataTools.jsx
    Filters.jsx
    InsightsPanel.jsx
    LoginScreen.jsx
    MoneyCoach.jsx
    PageHeader.jsx
    SavingsGoals.jsx
    SmartCalculator.jsx
    SummaryCard.jsx
    TransactionList.jsx
    TransactionModal.jsx
  hooks/
    useLocalStorage.js
  pages/
    Dashboard.jsx
  utils/
    categories.js
    formatters.js
    transactions.js
  App.jsx
  index.css
  main.jsx
server/
  index.js
  seed.js
  store.js
  data/
```

## Run Locally

Run frontend and backend together:

```bash
npm install
npm run dev:full
```

Then open the local URL printed by Vite, usually `http://localhost:5173/`.

Or run them separately:

```bash
npm install
npm run server
npm run dev
```

The backend runs at `http://localhost:4000` and Vite proxies `/api` requests to it.

## API Routes

```text
GET    /api/health
POST   /api/auth/login
POST   /api/auth/register
GET    /api/auth/me
POST   /api/auth/logout
GET    /api/summary
GET    /api/transactions
POST   /api/transactions
PUT    /api/transactions/:id
DELETE /api/transactions/:id
PUT    /api/transactions
GET    /api/budgets
PUT    /api/budgets
GET    /api/goals
POST   /api/goals
PUT    /api/goals/:id
DELETE /api/goals/:id
POST   /api/reset
```

Auth flow:

```text
1. Register with name, email, and password.
2. Login with the same email and password.
3. Use the protected finance dashboard.
```

Demo login still works:

```text
Email: demo@rupeewise.local
Password: demo1234
```

## Build

```bash
npm run build
```
=======
# expence_tracker
>>>>>>> 08e5110c3db8977a5b0da3db083ff8e1c88e0028
