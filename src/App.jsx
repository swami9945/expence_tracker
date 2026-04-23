import { useEffect, useState } from 'react'
import LoginScreen from './components/LoginScreen'
import Dashboard from './pages/Dashboard'
import { authStorage, financeApi } from './utils/api'

const appDetails = {
  name: 'RupeeWise',
  tagline: 'Track, plan, and calculate smarter money decisions.',
  version: '1.0.0',
}

function App() {
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [user, setUser] = useState(null)
  const [authError, setAuthError] = useState('')
  const [authSuccess, setAuthSuccess] = useState('')
  const [isAuthLoading, setIsAuthLoading] = useState(Boolean(authStorage.getToken()))

  useEffect(() => {
    document.title = `${appDetails.name} | Personal Finance Tracker`

    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  useEffect(() => {
    let isMounted = true

    const verifySession = async () => {
      if (!authStorage.getToken()) {
        return
      }

      try {
        const data = await financeApi.getCurrentUser()

        if (isMounted) {
          setUser(data.user)
          setAuthError('')
        }
      } catch (error) {
        authStorage.clearToken()

        if (isMounted) {
          setAuthError(`Session expired: ${error.message}`)
        }
      } finally {
        if (isMounted) {
          setIsAuthLoading(false)
        }
      }
    }

    verifySession()

    return () => {
      isMounted = false
    }
  }, [])

  const handleLogin = async (credentials) => {
    setIsAuthLoading(true)
    setAuthError('')
    setAuthSuccess('')

    try {
      const data = await financeApi.login(credentials)
      authStorage.setToken(data.token)
      setUser(data.user)
    } catch (error) {
      authStorage.clearToken()
      setAuthError(error.message)
    } finally {
      setIsAuthLoading(false)
    }
  }

  const handleRegister = async (details, onRegistered) => {
    setIsAuthLoading(true)
    setAuthError('')
    setAuthSuccess('')

    try {
      await financeApi.register(details)
      setAuthSuccess('Registration successful. Please login with your details.')
      onRegistered()
    } catch (error) {
      setAuthError(error.message)
    } finally {
      setIsAuthLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await financeApi.logout()
    } catch {
      // The local token is still cleared even if the server was already closed.
    } finally {
      authStorage.clearToken()
      setUser(null)
    }
  }

  return (
    <div className="min-h-screen bg-[#eef3ef]">
      <a
        href="#finance-dashboard"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-2xl focus:bg-slate-950 focus:px-4 focus:py-3 focus:font-black focus:text-white"
      >
        Skip to finance dashboard
      </a>

      {!isOnline && (
        <div className="fixed inset-x-0 top-0 z-50 bg-amber-300 px-4 py-3 text-center text-sm font-black text-slate-950 shadow-lg">
          You are offline. The backend may not sync until your connection is
          restored.
        </div>
      )}

      {user ? (
        <Dashboard user={user} onLogout={handleLogout} />
      ) : (
        <LoginScreen
          onLogin={handleLogin}
          onRegister={handleRegister}
          isLoading={isAuthLoading}
          error={authError}
          success={authSuccess}
        />
      )}

      <footer className="bg-slate-950 px-4 py-5 text-center text-sm font-bold text-slate-300">
        <span className="text-emerald-300">{appDetails.name}</span>
        <span className="mx-2 text-slate-600">/</span>
        {appDetails.tagline}
        <span className="mx-2 text-slate-600">/</span>v{appDetails.version}
      </footer>
    </div>
  )
}

export default App
