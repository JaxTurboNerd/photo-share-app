import { useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'

export default function Header() {
  const { user, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 bg-canvas flex items-center justify-between px-5 py-6 sm:px-8 sm:py-8 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl sm:text-4xl font-medium tracking-tightish text-ink">
          JHS Volunteer Picture Gallery
        </h1>
      </div>
      <div className="relative">
        <button
          type="button"
          aria-label="Menu"
          onClick={() => setMenuOpen((open) => !open)}
          className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-line/60 transition-colors"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#444441" strokeWidth="1.8" strokeLinecap="round">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>

        {menuOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
            <div className="absolute right-0 top-11 z-50 w-48 bg-canvas border border-line rounded-md shadow-[0_2px_12px_rgba(0,0,0,0.12)] py-1">
              {user?.email && (
                <p className="px-3 py-2 text-xs text-muted truncate border-b border-line">
                  {user.email}
                </p>
              )}
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false)
                  logout()
                }}
                className="w-full text-left px-3 py-2 text-sm text-ink hover:bg-line/30 transition-colors"
              >
                Sign out
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  )
}
