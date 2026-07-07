import { useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'

export default function Login() {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      await login(email.trim(), password)
    } catch (err) {
      setError(err.message || 'Sign in failed. Check your email and password.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-canvas flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm mb-8 text-center">
        <h1 className="text-3xl sm:text-4xl font-medium tracking-tightish text-ink mb-2">
          JHS Volunteer Picture Gallery
        </h1>
        <p className="text-sm text-muted">Sign in with your volunteer app account</p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="photo-card w-full max-w-sm p-6 sm:p-8 bg-canvas border-t-4"
        style={{ borderTopColor: 'var(--accent)' }}
      >
        <label className="block text-sm text-ink mb-1" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-line rounded-md px-3 py-2 text-sm mb-4 bg-canvas focus:outline-none focus:border-accent transition-colors"
          required
        />

        <label className="block text-sm text-ink mb-1" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-line rounded-md px-3 py-2 text-sm mb-4 bg-canvas focus:outline-none focus:border-accent transition-colors"
          required
        />

        {error && <p className="text-sm text-red-700 mb-3">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-accent text-white rounded-md py-2 text-sm font-medium hover:brightness-110 active:brightness-95 transition disabled:opacity-40"
        >
          {submitting ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  )
}
