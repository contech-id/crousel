import { Skeleton } from '@/components/atoms/ui/skeleton'

export function ProductDetailSkeleton() {
  return (
    <section
      className="mx-auto max-w-[90rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-16"
      role="status"
      aria-label="Memuat detail produk"
      aria-busy="true"
    >
      <span className="sr-only">Memuat detail produk...</span>
      <Skeleton className="h-5 w-40" />

      <div className="mt-7 grid gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(25rem,0.95fr)] lg:gap-16">
        <div className="grid gap-3 sm:grid-cols-[5.5rem_1fr]" aria-hidden="true">
          <div className="order-2 flex gap-3 overflow-hidden sm:order-1 sm:flex-col">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="aspect-square w-20 shrink-0 rounded-xl sm:w-full" />
            ))}
          </div>
          <Skeleton className="order-1 aspect-[0.92] w-full rounded-3xl sm:order-2" />
        </div>

        <div className="space-y-5" aria-hidden="true">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-12 w-4/5 sm:h-14" />
          <div className="flex gap-2">
            <Skeleton className="h-7 w-24 rounded-full" />
            <Skeleton className="h-7 w-20 rounded-full" />
          </div>
          <Skeleton className="h-8 w-36" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-11/12" />
            <Skeleton className="h-4 w-3/4" />
          </div>
          <div className="space-y-5 rounded-2xl border border-border bg-card p-5">
            <Skeleton className="h-5 w-28" />
            <div className="flex gap-2">
              {Array.from({ length: 5 }).map((_, index) => (
                <Skeleton key={index} className="size-10 rounded-lg" />
              ))}
            </div>
            <Skeleton className="h-5 w-24" />
            <div className="flex gap-2">
              {Array.from({ length: 3 }).map((_, index) => (
                <Skeleton key={index} className="h-9 w-20 rounded-full" />
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Skeleton className="h-10 w-full rounded-full" />
            <Skeleton className="h-10 w-full rounded-full" />
          </div>
        </div>
      </div>

      <div className="mt-14 grid gap-8 border-t border-border pt-10 lg:grid-cols-2 lg:gap-16" aria-hidden="true">
        {Array.from({ length: 2 }).map((_, column) => (
          <div key={column} className="space-y-4">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-32 w-full rounded-2xl" />
          </div>
        ))}
      </div>
    </section>
  )
}
