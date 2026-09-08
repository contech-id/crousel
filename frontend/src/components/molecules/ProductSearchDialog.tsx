import { ArrowRight, Search, X } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'

import { formatPrice, priceToNumber } from '@/hooks/useCart'
import { products } from '@/lib/products'

type ProductSearchDialogProps = {
  open: boolean
  onClose: () => void
}

export function ProductSearchDialog({ open, onClose }: ProductSearchDialogProps) {
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const normalizedQuery = query.trim().toLocaleLowerCase('id-ID')
  const results = useMemo(
    () => (normalizedQuery ? products.filter((product) => product.name.toLocaleLowerCase('id-ID').includes(normalizedQuery)) : products),
    [normalizedQuery],
  )

  useEffect(() => {
    if (!open) return

    inputRef.current?.focus()
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[70] flex items-start justify-center bg-black/70 px-4 py-20 backdrop-blur-[2px] sm:py-28" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
      <div role="dialog" aria-modal="true" aria-label="Cari produk" className="flex max-h-[min(680px,calc(100vh-7rem))] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
        <div className="flex items-center gap-3 border-b border-border px-4 py-3 sm:px-5 sm:py-4">
          <Search aria-hidden="true" className="size-5 shrink-0 text-muted-foreground" />
          <input ref={inputRef} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Cari nama produk..." className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground sm:text-base" aria-label="Nama produk" />
          <button type="button" onClick={onClose} className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground" aria-label="Tutup pencarian"><X aria-hidden="true" className="size-5" /></button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-2 py-3 sm:px-3">
          <p className="px-3 pb-2 text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground">{normalizedQuery ? `${results.length} produk ditemukan` : 'Semua produk'}</p>
          {results.length > 0 ? (
            <div className="divide-y divide-border/70">
              {results.map((product) => (
                <a key={product.slug} href={`/belanja?search=${encodeURIComponent(product.name)}`} onClick={onClose} className="group flex items-center gap-3 rounded-xl px-3 py-3 transition-colors hover:bg-muted sm:gap-4 sm:py-3.5">
                  <img src={product.images[0]} alt="" className="size-12 shrink-0 rounded-lg object-cover sm:size-14" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold text-foreground">{product.name}</span>
                    <span className="mt-0.5 block truncate text-xs text-muted-foreground">{product.category} · {formatPrice(priceToNumber(product.price))}</span>
                  </span>
                  <ArrowRight aria-hidden="true" className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-foreground" />
                </a>
              ))}
            </div>
          ) : (
            <p className="px-3 py-12 text-center text-sm text-muted-foreground">Produk dengan nama “{query}” belum ditemukan.</p>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-border bg-muted/40 px-4 py-2.5 text-[11px] text-muted-foreground sm:px-5">
          <span>{results.length} hasil</span>
          <span className="hidden sm:inline">Tekan ESC untuk menutup</span>
        </div>
      </div>
    </div>
  )
}
