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
        renderPhoto={({ photo, wrapperStyle, renderDefaultPhoto }) => {
          const name = photo.alt?.replace(/\.[^.]+$/, '')
          return (
            <div className="relative" style={wrapperStyle}>
              {renderDefaultPhoto({ wrapped: true })}
              {name && (
                <span className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-base px-3 py-2 rounded-b-md truncate pointer-events-none">
                  {name}
                </span>
              )}
            </div>
          )
        }}
      />
    </div>
  )
}
