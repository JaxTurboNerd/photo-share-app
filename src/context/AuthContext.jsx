import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { account } from '../lib/appwrite'

const AuthContext = createContext(null)

// Consume a one-time login token handed off from the iOS app via the URL
// fragment (#userId=…&secret=…). Establishes a real session, then strips the
// token from the URL so it isn't left in browser history.
async function consumeLoginHandoff() {
  const hash = window.location.hash.replace(/^#/, '')
  if (!hash) return
  const params = new URLSearchParams(hash)
  const userId = params.get('userId')
  const secret = params.get('secret')
  if (!userId || !secret) return

  try {
    await account.createSession(userId, secret)
  } catch (err) {
    console.error('App login handoff failed:', err)
  } finally {
    // Remove the token from the URL + history immediately.
    history.replaceState(null, '', window.location.pathname + window.location.search)
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    ;(async () => {
      await consumeLoginHandoff()          // <-- runs before the session check
      try {
        const current = await account.get()
        if (active) setUser(current)
      } catch {
        // TEMP: auto-guest access so testers can view/upload/delete without
        // signing in. Remove this inner try/catch (and restore `setUser(null)`)
        // to bring back the login requirement.
        try {
          await account.createAnonymousSession()
          if (active) setUser(await account.get())
        } catch (err) {
          console.error('Anonymous session failed:', err)
          if (active) setUser(null)
        }
      } finally {
        if (active) setLoading(false)
      }
    })()
    return () => { active = false }
  }, [])

  const login = useCallback(async (email, password) => {
    await account.createEmailPasswordSession(email, password)
    setUser(await account.get())
  }, [])

  const logout = useCallback(async () => {
    await account.deleteSession('current')
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}