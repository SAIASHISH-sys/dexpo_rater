import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Mail, Lock, ArrowRight } from 'lucide-react'
import { useApp } from '../context/AppContext'
import type { LoginRole } from '../types'

export default function LoginPage() {
  const [role, setRole] = useState<LoginRole>('user')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const { loginWithCredentials, error, clearError } = useApp()
  const navigate = useNavigate()

  const dest = role === 'user' ? '/user/dashboard' : '/stall/profile'

  const handleGoogleLogin = () => {
    // Redirect to Google OAuth endpoint
    window.location.href = 'http://localhost:5000/api/auth/google'
  }

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim() || !password.trim()) {
      setErrorMsg('Please enter both email and password')
      return
    }
    
    setIsLoading(true)
    setErrorMsg('')
    clearError()
    
    try {
      const success = await loginWithCredentials(role, email, password)
      if (success) {
        navigate(dest)
      } else {
        setErrorMsg(error || 'Login failed')
      }
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center app-bg px-4 py-10 text-slate-100">
      {/* Floating ambient orbs for decoration */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-24 top-1/4 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="absolute -right-20 top-1/3 h-56 w-56 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute bottom-1/4 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full bg-emerald-400/8 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-md">
        {/* Logo area */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400/20 to-cyan-400/20 shadow-lg shadow-emerald-500/10">
            <span className="text-3xl font-black text-emerald-300">Δ</span>
          </div>
          <p className="text-[11px] font-semibold tracking-[0.32em] text-cyan-200/80">
            DELTA EXPO 2026
          </p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-white">
            Rating & Investment
          </h1>
          <p className="mt-1.5 text-sm text-cyan-50/60">
            Login to explore, invest, and rate amazing startups
          </p>
        </div>

        {/* Login card */}
        <div className="glass-panel overflow-hidden">
          {/* Role toggle */}
          <div className="grid grid-cols-2 border-b border-cyan-200/10">
            <button
              onClick={() => setRole('user')}
              className={`relative px-4 py-3.5 text-sm font-semibold transition-all duration-300 ${
                role === 'user'
                  ? 'text-white'
                  : 'text-cyan-100/50 hover:text-cyan-100/80'
              }`}
            >
              <span className="relative z-10">👤 Attendee</span>
              {role === 'user' && (
                <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-emerald-400 to-cyan-300" />
              )}
            </button>
            <button
              onClick={() => setRole('stall')}
              className={`relative px-4 py-3.5 text-sm font-semibold transition-all duration-300 ${
                role === 'stall'
                  ? 'text-white'
                  : 'text-cyan-100/50 hover:text-cyan-100/80'
              }`}
            >
              <span className="relative z-10">🏢 Stall / Company</span>
              {role === 'stall' && (
                <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-emerald-400 to-cyan-300" />
              )}
            </button>
          </div>

          {/* Body */}
          <div className="p-5 sm:p-6">
            <p className="mb-5 text-sm text-cyan-100/50">
              {role === 'user'
                ? 'Sign in to scan stalls, invest virtual currency and discover ideas.'
                : 'Sign in to manage your stall profile and track your leaderboard.'}
            </p>

            {/* Email + Password */}
            <form onSubmit={handleEmailLogin} className="space-y-3">
              {errorMsg && (
                <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-3 py-2 text-sm text-red-300">
                  {errorMsg}
                </div>
              )}
              <div className="relative">
                <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-200/35" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address"
                  className="input-field"
                />
              </div>
              <div className="relative">
                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-200/35" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="input-field"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-300 py-3 text-sm font-bold text-slate-900 transition hover:shadow-lg hover:shadow-emerald-400/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Signing In...' : 'Sign In'} {!isLoading && <ArrowRight size={15} />}
              </button>
            </form>

            {/* Divider */}
            <div className="my-5 flex items-center gap-3">
              <div className="h-px flex-1 bg-cyan-200/10" />
              <span className="text-[10px] font-medium tracking-wider text-cyan-100/30">OR</span>
              <div className="h-px flex-1 bg-cyan-200/10" />
            </div>

            {/* Google OAuth */}
            {role === 'stall' && (
              <button
                onClick={handleGoogleLogin}
                className="flex w-full items-center justify-center gap-3 rounded-xl border border-cyan-200/12 bg-white/5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                <svg width="16" height="16" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1Z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23Z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A11.96 11.96 0 0 0 1 12c0 1.94.46 3.77 1.18 5.42l3.66-3.33Z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53Z" />
                </svg>
                Continue with Google
              </button>
            )}

            <p className="mt-4 text-center text-[10px] text-cyan-100/30">
              By signing in you agree to the event terms & conditions
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
