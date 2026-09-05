import { ArrowRight } from 'lucide-react'

import { Button } from '@/components/atoms/ui/button'
import type { Product } from '@/lib/products'

type ProductCardProps = {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="group flex h-full flex-col">
      <a
        href={`/produk/${product.slug}`}
        className="relative block aspect-[1.08] overflow-hidden rounded-2xl bg-muted focus-visible:ring-2 focus-visible:ring-ring"
        aria-label={`Lihat detail ${product.name}`}
      >
        <img
          src={product.images[0]}
          alt={`${product.name} - ${product.color}`}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 rounded-full bg-background/90 px-2.5 py-1 text-[10px] font-semibold text-foreground backdrop-blur-sm">
          {product.category}
        </span>
      </a>
      <div className="flex flex-1 flex-col pt-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-bold">{product.name}</h3>
            <p className="mt-1 text-sm leading-5 text-muted-foreground">
              {product.shortDescription}
            </p>
          </div>
          <p className="shrink-0 text-sm font-semibold">{product.price}</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="mt-4 w-full rounded-full"
          asChild
        >
          <a href={`/produk/${product.slug}`}>
            Lihat <ArrowRight aria-hidden="true" className="size-3.5" />
          </a>
        </Button>
      </div>
    </article>
  )
}
