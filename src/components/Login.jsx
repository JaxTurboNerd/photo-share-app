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
    <div className="min-h-screen bg-canvas flex items-center justify-center px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm p-6 border border-line rounded-lg">
        <h1 className="text-2xl font-medium text-ink mb-1">Sign in</h1>
        <p className="text-sm text-muted mb-6">
          Use the same email and password from the volunteer app.
        </p>

        <label className="block text-sm text-ink mb-1" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-line rounded-md px-3 py-2 text-sm mb-4 bg-canvas focus:outline-none focus:border-ink/40"
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
          className="w-full border border-line rounded-md px-3 py-2 text-sm mb-4 bg-canvas focus:outline-none focus:border-ink/40"
          required
        />

        {error && <p className="text-sm text-red-700 mb-3">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-ink text-canvas rounded-md py-2 text-sm disabled:opacity-40"
        >
          {submitting ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  )
}
