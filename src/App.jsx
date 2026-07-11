import { useState, useEffect, useCallback } from 'react'
import Header from './components/Header.jsx'
import PhotoGrid from './components/PhotoGrid.jsx'
import PhotoLightbox from './components/Lightbox.jsx'
import UploadButton from './components/UploadButton.jsx'
import UploadModal from './components/UploadModal.jsx'
import Login from './components/Login.jsx'
import { storage, PHOTOS_BUCKET_ID, ownerIdFromPermissions } from './lib/appwrite.js'
import { useAuth } from './context/AuthContext.jsx'

function renameFile(originalName, newName) {
  const ext = originalName.includes('.') ? originalName.split('.').pop() : ''
  return ext ? `${newName}.${ext}` : newName
}

function getImageDimensions(url) {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight })
    img.onerror = () => resolve({ width: 800, height: 800 })
    img.src = url
  })
}

export default function App() {
  const { user, loading } = useAuth()
  const [photos, setPhotos] = useState([])
  const [lightboxIndex, setLightboxIndex] = useState(-1)
  const [uploadOpen, setUploadOpen] = useState(false)

  const fetchPhotos = useCallback(async () => {
    try {
      const response = await storage.listFiles(PHOTOS_BUCKET_ID)
      const items = await Promise.all(
        response.files.map(async (file) => {
          const url = storage.getFilePreview(PHOTOS_BUCKET_ID, file.$id, 800)
          const { width, height } = await getImageDimensions(url)
          return {
            id: file.$id,
            src: url,
            width,
            height,
            alt: file.name,
            ownerId: ownerIdFromPermissions(file.$permissions),
          }
        })
      )
      setPhotos(items)
    } catch (err) {
      console.error('Failed to fetch photos:', err)
    }
  }, [])

  useEffect(() => {
    if (user) fetchPhotos()
  }, [user, fetchPhotos])

  async function handleRename(photo, newName) {
    const newFileName = renameFile(photo.alt, newName)
    await storage.updateFile(PHOTOS_BUCKET_ID, photo.id, newFileName)
    setPhotos((prev) =>
      prev.map((p) => (p.id === photo.id ? { ...p, alt: newFileName } : p))
    )
  }

  async function handleDelete(photo) {
    // Only the uploader may delete. Appwrite also enforces this server-side,
    // but we gate here so others get a clear message instead of a raw error.
    if (photo.ownerId !== user.$id) {
      window.alert('You can only delete photos that you uploaded.')
      return
    }
    if (!window.confirm('Delete this photo? This cannot be undone.')) return
    try {
      await storage.deleteFile(PHOTOS_BUCKET_ID, photo.id)
      setPhotos((prev) => prev.filter((p) => p.id !== photo.id))
    } catch (err) {
      console.error('Failed to delete photo:', err)
      window.alert('Something went wrong deleting this photo. Please try again.')
    }
  }

  if (loading) return <div className="min-h-screen bg-canvas" />

  if (!user) return <Login />

  return (
    <div className="min-h-screen bg-canvas">
      <Header />
      <PhotoGrid
        photos={photos}
        currentUserId={user.$id}
        onPhotoClick={setLightboxIndex}
        onRename={handleRename}
        onDelete={handleDelete}
      />
      <PhotoLightbox
        photos={photos}
        index={lightboxIndex}
        open={lightboxIndex >= 0}
        onClose={() => setLightboxIndex(-1)}
      />
      <UploadButton onClick={() => setUploadOpen(true)} />
      <UploadModal
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        onUploaded={fetchPhotos}
      />
    </div>
  )
}
