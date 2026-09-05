import { ArrowRight } from 'lucide-react'

const categories = [
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
  return (
    <section id="categories" className="scroll-mt-24 border-y border-border bg-card px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[90rem]">
        <span id="collections" className="relative -top-24 block" aria-hidden="true" />
        {showHeading && <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[0.22em] text-muted-foreground">Jelajahi kategori</p><h2 className="mt-2 text-3xl tracking-tight sm:text-4xl">Temukan sandal sesuai gayamu</h2></div><a href="/belanja" className="group inline-flex items-center gap-2 text-sm font-semibold">Lihat semua produk <ArrowRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-1" /></a></div>}
        <div className={`grid gap-4 sm:grid-cols-2 lg:grid-cols-5 ${showHeading ? 'mt-8' : ''}`}>
          {categories.map(({ name, products, image }) => <article key={name} className="group overflow-hidden rounded-2xl border border-border bg-background transition-shadow hover:shadow-md"><div className="aspect-[1.2] overflow-hidden bg-muted"><img src={image} alt={`Produk ${name}`} loading="lazy" className="h-full w-full object-cover grayscale-[15%] transition-transform duration-500 group-hover:scale-105" /></div><div className="p-5"><h3 className="text-lg leading-snug">{name}</h3><p className="mt-3 text-xs leading-5 text-muted-foreground"><span className="font-semibold text-foreground">Contoh:</span> {products}</p><a href="/belanja" className="mt-5 inline-flex items-center gap-2 text-xs font-bold text-muted-foreground transition-colors group-hover:text-foreground">Lihat produk <ArrowRight aria-hidden="true" className="size-3.5" /></a></div></article>)}
        </div>
      </div>
    </section>
  )
}
