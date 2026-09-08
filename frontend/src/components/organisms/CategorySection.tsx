import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

const fallbackCategories = [
  { name: 'Sandal Slide Women', products: 'Lilya White, Sakura White, Sakura Hexa White, Lantana White.', image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=800&q=80' },
  { name: 'Sandal Slop Unisex', products: 'Serxes, Santos, Chester, Maiden, Alexios, Althair, Claymore.', image: 'https://images.unsplash.com/photo-1603487742131-4160ec999306?auto=format&fit=crop&w=800&q=80' },
  { name: 'Sandal Slide Unisex', products: 'Maxter, Garthen, Vicenza, Invoker.', image: 'https://images.unsplash.com/photo-1575537302964-96cd47c06b1b?auto=format&fit=crop&w=800&q=80' },
  { name: 'Sandal Kids', products: 'Maxter Kids, Invoker Kids, Vicenza Kids, Sakura Kids.', image: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=800&q=80' },
  { name: 'Sandal Wedges Women', products: 'Nerona, Hestia, Caspine, Flavia, Joane, Roxana.', image: 'https://images.unsplash.com/photo-1515347619252-60a4bf4fff4f?auto=format&fit=crop&w=800&q=80' },
]

type CategorySectionProps = {
  showHeading?: boolean
}

export function CategorySection({ showHeading = true }: CategorySectionProps) {
  const [categories, setCategories] = useState(fallbackCategories)
  const carouselRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/categories`)
      .then((response) => response.ok ? response.json() : Promise.reject(new Error('Gagal memuat kategori')))
      .then((payload: { data?: Array<{ id: number; name: string; example_products: string; image?: string | null }> }) => {
        if (!payload.data?.length) return
        setCategories(payload.data.map((category) => ({
          name: category.name,
          products: category.example_products,
          image: category.image ?? fallbackCategories.find((fallback) => fallback.name.toLowerCase().includes(category.name))?.image ?? fallbackCategories[0].image,
        })))
      })
      .catch(() => undefined)
  }, [])

  const moveCarousel = (direction: -1 | 1) => {
    carouselRef.current?.scrollBy({ left: direction * carouselRef.current.clientWidth * 0.8, behavior: 'smooth' })
  }

  return (
    <section id="categories" className="scroll-mt-24 border-y border-border bg-card px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[90rem]">
        <span id="collections" className="relative -top-24 block" aria-hidden="true" />
        {showHeading && <div className="flex flex-wrap items-end justify-between gap-4" data-aos="fade-up"><div><p className="text-xs font-bold uppercase tracking-[0.22em] text-muted-foreground">Jelajahi kategori</p><h2 className="mt-2 text-3xl tracking-tight sm:text-4xl">Temukan sandal sesuai gayamu</h2></div><div className="flex items-center gap-2" data-aos="fade-left" data-aos-delay="100"><button type="button" onClick={() => moveCarousel(-1)} aria-label="Kategori sebelumnya" className="flex size-10 items-center justify-center rounded-full border border-border bg-background transition-colors hover:bg-muted"><ChevronLeft aria-hidden="true" className="size-4" /></button><button type="button" onClick={() => moveCarousel(1)} aria-label="Kategori berikutnya" className="flex size-10 items-center justify-center rounded-full border border-border bg-background transition-colors hover:bg-muted"><ChevronRight aria-hidden="true" className="size-4" /></button></div></div>}
        <div ref={carouselRef} className={`flex snap-x snap-mandatory gap-4 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${showHeading ? 'mt-8' : ''}`}>
          {categories.map(({ name, products, image }, index) => <article key={name} className="group w-[82%] shrink-0 snap-start overflow-hidden rounded-2xl border border-border bg-background transition-shadow hover:shadow-md sm:w-[calc(50%-0.5rem)] lg:w-[calc(20%-0.8rem)]" data-aos="fade-up" data-aos-delay={String(index * 100)}><div className="aspect-[1.2] overflow-hidden bg-muted"><img src={image} alt={`Produk ${name}`} loading="lazy" className="h-full w-full object-cover grayscale-[15%] transition-transform duration-500 group-hover:scale-105" /></div><div className="p-3 sm:p-5" data-scroll-static><h3 className="text-sm capitalize leading-snug sm:text-lg">{name}</h3><p className="mt-2 text-[10px] leading-4 text-muted-foreground sm:mt-3 sm:text-xs sm:leading-5">{products}</p><a href={`/belanja?category=${encodeURIComponent(name)}`} className="mt-4 inline-flex items-center gap-2 text-[10px] font-bold text-muted-foreground transition-colors group-hover:text-foreground sm:mt-5 sm:text-xs">Lihat produk <ArrowRight aria-hidden="true" className="size-3.5" /></a></div></article>)}
        </div>
      </div>
    </section>
  )
}
