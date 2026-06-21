import { useState, useEffect, useCallback } from 'react'
import Header from './components/Header.jsx'
import PhotoGrid from './components/PhotoGrid.jsx'
import PhotoLightbox from './components/Lightbox.jsx'
import UploadButton from './components/UploadButton.jsx'
import UploadModal from './components/UploadModal.jsx'
import { storage, PHOTOS_BUCKET_ID } from './lib/appwrite.js'

function getImageDimensions(url) {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight })
    img.onerror = () => resolve({ width: 800, height: 800 })
    img.src = url
  })
}

export default function App() {
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
          return { id: file.$id, src: url, width, height, alt: file.name }
        })
      )
      setPhotos(items)
    } catch (err) {
      console.error('Failed to fetch photos:', err)
    }
  }, [])

  useEffect(() => {
    fetchPhotos()
  }, [fetchPhotos])

  return (
    <div className="min-h-screen bg-canvas">
      <Header />
      <PhotoGrid photos={photos} onPhotoClick={setLightboxIndex} />
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
