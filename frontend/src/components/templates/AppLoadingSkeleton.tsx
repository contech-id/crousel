import { Skeleton } from '@/components/atoms/ui/skeleton'

export function AppLoadingSkeleton() {
  return (
    <div
      className="flex min-h-screen flex-col bg-background"
      role="status"
      aria-label="Memuat tampilan toko"
      aria-busy="true"
    >
      <span className="sr-only">Memuat tampilan toko...</span>
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <Skeleton className="h-9 w-full rounded-none" />
        <div className="mx-auto flex h-[76px] max-w-[90rem] items-center justify-between gap-5 px-4 sm:px-6 lg:px-8">
          <Skeleton className="h-7 w-32" />
          <div className="hidden items-center gap-6 lg:flex">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} className="h-4 w-16" />
            ))}
          </div>
          <div className="flex items-center gap-2">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="size-9 rounded-full" />
            ))}
          </div>
        </div>
      </header>
      <main className="flex-1 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[90rem] space-y-12">
          <div className="grid items-center gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="space-y-5">
              <Skeleton className="h-8 w-52 rounded-full" />
              <Skeleton className="h-16 w-full max-w-xl sm:h-24" />
              <Skeleton className="h-6 w-full max-w-md" />
              <Skeleton className="h-11 w-44 rounded-lg" />
            </div>
            <Skeleton className="min-h-[360px] w-full rounded-3xl sm:min-h-[500px]" />
          </div>
          <section className="space-y-5" aria-hidden="true">
            <Skeleton className="h-9 w-64" />
            <div className="grid grid-cols-2 gap-5 lg:grid-cols-5">
              {Array.from({ length: 5 }).map((_, index) => (
                <Skeleton key={index} className="aspect-[1.08] w-full rounded-2xl" />
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
