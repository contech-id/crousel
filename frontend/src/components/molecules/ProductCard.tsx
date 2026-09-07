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
        href={`/produk/${product.id}`}
        className="relative block aspect-[1.08] overflow-hidden rounded-2xl bg-muted focus-visible:ring-2 focus-visible:ring-ring"
        aria-label={`Lihat detail ${product.name}`}
      >
        <img
          src={product.images[0]}
          alt={`${product.name} - ${product.color}`}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span data-scroll-static className="absolute left-3 top-3 rounded-full bg-background/90 px-2.5 py-1 text-[9px] font-semibold text-foreground backdrop-blur-sm sm:text-[10px]">
          {product.category}
        </span>
      </a>
      <div className="flex flex-1 flex-col pt-3 sm:pt-4" data-scroll-static>
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold sm:text-base">{product.name}</h3>
            <p className="mt-1 text-[11px] leading-4 text-muted-foreground sm:text-sm sm:leading-5">
              {product.category}
            </p>
          </div>
          <p className="shrink-0 text-xs font-semibold sm:text-sm">{product.price}</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="mt-3 w-full rounded-full text-[11px] sm:mt-4 sm:text-xs"
          asChild
        >
          <a href={`/produk/${product.id}`}>
            Lihat <ArrowRight aria-hidden="true" className="size-3.5" />
          </a>
        </Button>
      </div>
    </article>
  )
}
