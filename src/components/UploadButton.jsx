export default function UploadButton({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Upload a photo"
      className="fixed bottom-6 left-1/2 -translate-x-1/2 sm:left-auto sm:right-8 sm:translate-x-0
                 w-14 h-14 rounded-full bg-ink text-canvas flex items-center justify-center
                 shadow-[0_2px_12px_rgba(0,0,0,0.18)] hover:scale-105 active:scale-95 transition-transform"
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
      </svg>
    </button>
  )
}
