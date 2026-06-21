import Lightbox from 'yet-another-react-lightbox'
import 'yet-another-react-lightbox/styles.css'

export default function PhotoLightbox({ photos, index, open, onClose }) {
  return (
    <Lightbox
      open={open}
      close={onClose}
      index={index}
      slides={photos.map((p) => ({ src: p.src, alt: p.alt }))}
      styles={{
        container: { backgroundColor: 'rgba(0, 0, 0, 0.9)' },
      }}
    />
  )
}
