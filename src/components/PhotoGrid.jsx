import { useState } from 'react'
import PhotoAlbum from 'react-photo-album'

export default function PhotoGrid({ photos, onPhotoClick, onRename }) {
  const [editingId, setEditingId] = useState(null)
  const [editValue, setEditValue] = useState('')
  const [editError, setEditError] = useState(null)

  function startEditing(photo, name) {
    setEditingId(photo.id)
    setEditValue(name)
    setEditError(null)
  }

  function cancelEditing() {
    setEditingId(null)
    setEditValue('')
    setEditError(null)
  }

  async function commitEditing(photo) {
    const trimmed = editValue.trim()
    if (!trimmed) {
      setEditError("Name can't be empty.")
      return
    }
    try {
      await onRename?.(photo, trimmed)
      cancelEditing()
    } catch (err) {
      setEditError(err.message || 'Failed to rename.')
    }
  }

  return (
    <div className="px-3 sm:px-6 max-w-6xl mx-auto pb-28">
      <PhotoAlbum
        layout="masonry"
        photos={photos}
        columns={(containerWidth) => {
          if (containerWidth < 480) return 2
          if (containerWidth < 900) return 3
          return 4
        }}
        spacing={16}
        onClick={({ index }) => onPhotoClick(index)}
        renderPhoto={({ photo, wrapperStyle, renderDefaultPhoto }) => {
          const name = photo.alt?.replace(/\.[^.]+$/, '')
          const isEditing = editingId === photo.id
          return (
            <div className="relative" style={wrapperStyle}>
              {renderDefaultPhoto({ wrapped: true })}
              {isEditing ? (
                <div
                  className="absolute bottom-0 left-0 right-0 bg-black/50 px-3 py-2 rounded-b-md flex gap-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  <input
                    type="text"
                    autoFocus
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') commitEditing(photo)
                      if (e.key === 'Escape') cancelEditing()
                    }}
                    className="flex-1 min-w-0 bg-transparent text-white text-base placeholder-white/60 focus:outline-none border-b border-white/40"
                  />
                  <button
                    type="button"
                    aria-label="Save name"
                    onClick={() => commitEditing(photo)}
                    className="text-white shrink-0"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    aria-label="Cancel"
                    onClick={cancelEditing}
                    className="text-white shrink-0"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
              ) : (
                name && (
                  <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-base px-3 py-2 rounded-b-md flex items-center gap-2">
                    <span className="truncate flex-1 pointer-events-none">{name}</span>
                    <button
                      type="button"
                      aria-label="Edit name"
                      onClick={(e) => {
                        e.stopPropagation()
                        startEditing(photo, name)
                      }}
                      className="shrink-0 opacity-80 hover:opacity-100"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 20h9" />
                        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
                      </svg>
                    </button>
                  </div>
                )
              )}
              {isEditing && editError && (
                <p className="absolute -bottom-6 left-0 right-0 text-red-700 text-xs px-1" onClick={(e) => e.stopPropagation()}>
                  {editError}
                </p>
              )}
            </div>
          )
        }}
      />
    </div>
  )
}
