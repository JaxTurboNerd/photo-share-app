import PhotoAlbum from 'react-photo-album'

export default function PhotoGrid({ photos, onPhotoClick }) {
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
        render={{
          photo: (props, { photo }) => (
            <img
              {...props}
              alt={photo.alt}
              className="rounded-md cursor-pointer hover:opacity-90 transition-opacity"
            />
          ),
        }}
      />
    </div>
  )
}
