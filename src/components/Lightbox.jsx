import Lightbox from 'yet-another-react-lightbox'
import Download from 'yet-another-react-lightbox/plugins/download'
import 'yet-another-react-lightbox/styles.css'
import { storage, PHOTOS_BUCKET_ID } from '../lib/appwrite'

export default function PhotoLightbox({ photos, index, open, onClose }) {
  return (
    <Lightbox
      open={open}
      close={onClose}
      index={index}
      plugins={[Download]}
      slides={photos.map((p) => ({
        src: p.src,
        alt: p.alt,
        downloadUrl: storage.getFileDownload(PHOTOS_BUCKET_ID, p.id),
        downloadFilename: p.alt,
      }))}
      styles={{
        container: { backgroundColor: 'rgba(0, 0, 0, 0.9)' },
      }}
    />
  )
}
