export default function Header() {
  return (
    <header className="sticky top-0 z-40 bg-canvas flex items-center justify-between px-5 py-6 sm:px-8 sm:py-8 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl sm:text-4xl font-medium tracking-tightish text-ink">
          JHS Volunteer Picture Gallery
        </h1>
      </div>
      <button
        type="button"
        aria-label="Menu"
        className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-line/60 transition-colors"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#444441" strokeWidth="1.8" strokeLinecap="round">
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>
    </header>
  )
}
