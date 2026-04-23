import { useState } from 'react'

export default function LoginScreen({
  onLogin,
  onRegister,
  isLoading,
  error,
  success,
}) {
  const [mode, setMode] = useState('register')
  const [formData, setFormData] = useState({
    name: '',
    email: 'demo@rupeewise.local',
    password: 'demo1234',
  })

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    if (mode === 'register') {
      onRegister(formData, () => setMode('login'))
      return
    }

    onLogin({
      email: formData.email,
      password: formData.password,
    })
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#eef3ef] px-4 py-10 text-slate-900">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,#bbf7d0_0,transparent_30%),radial-gradient(circle_at_bottom_right,#fed7aa_0,transparent_28%)]" />

      <section className="w-full max-w-md rounded-[2rem] bg-white p-6 shadow-2xl shadow-slate-950/15 sm:p-8">
        <div className="text-center">
          <p className="text-sm font-black uppercase tracking-[0.24em] text-emerald-700">
            RupeeWise
          </p>
          <h1 className="mt-3 text-3xl font-black text-slate-950">
            {mode === 'register' ? 'Create Account' : 'Login'}
          </h1>
          <p className="mt-2 text-sm font-bold text-slate-500">
            {mode === 'register'
              ? 'Register once, then login with the same details.'
              : 'Enter your registered email and password.'}
          </p>
        </div>

        <div className="mt-6 grid grid-cols-2 rounded-2xl bg-slate-100 p-1">
          <button
            type="button"
            className={`rounded-xl px-4 py-2 text-sm font-black transition ${
              mode === 'register'
                ? 'bg-white text-slate-950 shadow'
                : 'text-slate-500'
            }`}
            onClick={() => setMode('register')}
          >
            Register
          </button>
          <button
            type="button"
            className={`rounded-xl px-4 py-2 text-sm font-black transition ${
              mode === 'login'
                ? 'bg-white text-slate-950 shadow'
                : 'text-slate-500'
            }`}
            onClick={() => setMode('login')}
          >
            Login
          </button>
        </div>

        <form className="mt-6" onSubmit={handleSubmit}>
          <div className="grid gap-4">
            {mode === 'register' && (
              <label className="text-sm font-bold text-slate-600">
                Name
                <input
                  required
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                  placeholder="Your name"
                />
              </label>
            )}

            <label className="text-sm font-bold text-slate-600">
              Email
              <input
                required
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              />
            </label>

            <label className="text-sm font-bold text-slate-600">
              Password
              <input
                required
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                minLength={6}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
              />
            </label>
          </div>

          {error && (
            <p className="mt-4 rounded-2xl bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700">
              {error}
            </p>
          )}

          {success && (
            <p className="mt-4 rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">
              {success}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="mt-6 w-full rounded-2xl bg-emerald-600 px-5 py-4 font-black text-white shadow-lg shadow-emerald-700/20 transition hover:-translate-y-0.5 hover:bg-emerald-700 disabled:opacity-60"
          >
            {isLoading
              ? mode === 'register'
                ? 'Creating account...'
                : 'Signing in...'
              : mode === 'register'
                ? 'Register'
                : 'Login'}
          </button>

          <div className="mt-5 rounded-2xl bg-slate-50 p-4 text-center text-sm font-bold text-slate-600">
            Demo: demo@rupeewise.local / demo1234
          </div>
        </form>
      </section>
    </main>
  )
}
