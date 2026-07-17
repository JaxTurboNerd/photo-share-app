import { useState } from 'react'
import { storage, ID, Permission, Role, PHOTOS_BUCKET_ID } from '../lib/appwrite'
import { useAuth } from '../context/AuthContext.jsx'

export default function UploadModal({ open, onClose, onUploaded }) {
  const { user } = useAuth()
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [caption, setCaption] = useState('')
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(null)

  if (!open) return null

  function handleFileChange(e) {
    const selected = e.target.files?.[0]
    if (!selected) return
    setFile(selected)
    setPreview(URL.createObjectURL(selected))
  }

  async function handleUpload() {
    if (!file) return
    if (!caption.trim()) {
      setError("Please enter the dog's name before sharing.")
      return
    }
    setUploading(true)
    setError(null)
    try {
      const ext = file.name.split('.').pop()
      const fileName = caption.trim() ? `${caption.trim()}.${ext}` : file.name
      const namedFile = new File([file], fileName, { type: file.type })
      // Any signed-in user can view and rename the photo, but only the uploader
      // can delete it. Appwrite enforces this server-side (bucket file
      // security), so delete ownership can't be bypassed from the client.
      const permissions = [
        Permission.read(Role.users()),
        Permission.update(Role.users()),
        Permission.delete(Role.user(user.$id)),
      ]
      await storage.createFile(PHOTOS_BUCKET_ID, ID.unique(), namedFile, permissions)

      onUploaded?.()
      handleClose()
    } catch (err) {
      setError(err.message || 'Upload failed. Check your Appwrite config in .env')
    } finally {
      setUploading(false)
    }
  }

  function handleClose() {
    setFile(null)
    setPreview(null)
    setCaption('')
    setError(null)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
      <div className="bg-canvas rounded-lg w-full max-w-sm p-6 border border-ink/15 shadow-[0_10px_40px_rgba(0,0,0,0.35)]">
        <h2 className="text-lg font-medium text-ink mb-4">Share a photo</h2>

        {preview ? (
          <img src={preview} alt="Selected preview" className="w-full rounded-md mb-4 max-h-64 object-cover" />
        ) : (
          <label className="flex flex-col items-center justify-center border border-dashed border-ink/25 rounded-md h-40 mb-4 cursor-pointer bg-black/5 hover:bg-black/10 transition-colors">
            <span className="text-sm text-muted">Tap to choose a photo</span>
            <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
          </label>
        )}

        <input
          type="text"
          placeholder="Dog's name"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="w-full border-2 border-muted rounded-md px-3 py-2 text-sm mb-4 bg-canvas focus:outline-none focus:border-accent"
          required
        />

        {error && <p className="text-sm text-red-700 mb-3">{error}</p>}

        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleClose}
            className="flex-1 border-2 border-muted rounded-md py-2 text-sm text-ink hover:bg-line/30 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleUpload}
            disabled={!file || uploading}
            className="flex-1 bg-accent text-white rounded-md py-2 text-sm font-medium hover:brightness-110 transition disabled:opacity-40"
          >
            {uploading ? 'Uploading…' : 'Share'}
          </button>
        </div>
      </div>
    </div>
  )
}
