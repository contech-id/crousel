import { useState } from 'react'

type ProductGalleryProps = {
  name: string
  images: readonly string[]
}

export function ProductGallery({ name, images }: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0)

  return (
    <div className="grid gap-3 sm:grid-cols-[5.5rem_1fr]">
      <div className="order-2 flex gap-3 overflow-x-auto sm:order-1 sm:flex-col">
        {images.map((image, index) => (
          <button
            key={image}
            type="button"
            onClick={() => setSelectedImage(index)}
            className={`relative aspect-square w-20 shrink-0 overflow-hidden rounded-xl border-2 transition sm:w-full ${selectedImage === index ? 'border-foreground' : 'border-transparent opacity-65 hover:opacity-100'}`}
            aria-label={`Tampilkan foto ${name} ${index + 1}`}
            aria-pressed={selectedImage === index}
          >
            <img src={image} alt="" className="h-full w-full object-cover" />
          </button>
        ))}
      </div>
      <div className="order-1 aspect-[0.92] overflow-hidden rounded-3xl bg-muted sm:order-2">
        <img
          src={images[selectedImage]}
          alt={`${name}, foto ${selectedImage + 1}`}
          className="h-full w-full object-cover"
        />
      </div>
    </div>
  )
}
