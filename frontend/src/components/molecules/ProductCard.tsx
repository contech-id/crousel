import { ArrowRight } from 'lucide-react'

import { Button } from '@/components/atoms/ui/button'
import { Skeleton } from '@/components/atoms/ui/skeleton'
import { formatPrice, priceToNumber } from '@/hooks/useCart'
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
          <p className="shrink-0 text-xs font-semibold sm:text-sm">{formatPrice(priceToNumber(product.price))}</p>
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

export function ProductSkeleton() {
  return (
    <div className="flex h-full flex-col">
      <Skeleton className="aspect-[1.08] w-full rounded-2xl" />
      <div className="flex flex-1 flex-col pt-3 sm:pt-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <Skeleton className="h-5 w-3/4 sm:h-6" />
            <Skeleton className="mt-1 h-3 w-1/2 sm:h-4" />
          </div>
          <Skeleton className="h-4 w-12 sm:h-5 sm:w-16" />
        </div>
        <Skeleton className="mt-3 h-8 w-full rounded-full sm:mt-4 sm:h-9" />
      </div>
    </div>
  )
}
