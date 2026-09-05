import { ArrowLeft, Minus, Package, Plus, Trash2 } from 'lucide-react'

import { Button } from '@/components/atoms/ui/button'
import { AppShell } from '@/components/templates/AppShell'
import { formatPrice, useCart } from '@/hooks/useCart'

export function CartPage() {
  const { items, subtotal, updateQuantity, removeFromCart } = useCart()

  return (
    <AppShell>
      <section className="mx-auto max-w-[90rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
        <a
          href="/belanja"
          className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft aria-hidden="true" className="size-4" /> Lanjut belanja
        </a>
        <div className="mt-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-muted-foreground">
              Crousel checkout
            </p>
            <h1 className="mt-2 text-4xl font-black tracking-tight sm:text-6xl">
              Keranjangmu
            </h1>
          </div>
          <p className="text-sm text-muted-foreground">{items.length} pilihan produk</p>
        </div>

        {items.length === 0 ? (
          <div className="mt-10 rounded-3xl border border-dashed border-border bg-card px-6 py-16 text-center">
            <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-secondary/25">
              <Package aria-hidden="true" className="size-6" />
            </span>
            <h2 className="mt-5 text-2xl font-black tracking-tight">Keranjang masih kosong</h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
              Pilih sandal favoritmu dan tambahkan ke keranjang untuk melanjutkan.
            </p>
            <Button variant="secondary" className="mt-6 rounded-full" asChild>
              <a href="/belanja">Lihat katalog</a>
            </Button>
          </div>
        ) : (
          <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_22rem] lg:items-start">
            <div className="space-y-4">
              {items.map((item) => (
                <article
                  key={item.id}
                  className="flex gap-4 rounded-2xl border border-border bg-card p-4 sm:gap-5 sm:p-5"
                >
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="size-24 shrink-0 rounded-xl object-cover sm:size-32"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs text-muted-foreground">{item.product.category}</p>
                        <h2 className="mt-1 font-bold">{item.product.name}</h2>
                        <p className="mt-1 text-xs text-muted-foreground">
                          Ukuran {item.size} · {item.color}
                        </p>
                      </div>
                      <button
                        type="button"
                        aria-label={`Hapus ${item.product.name} dari keranjang`}
                        className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <Trash2 aria-hidden="true" className="size-4" />
                      </button>
                    </div>
                    <div className="mt-4 flex items-center justify-between gap-3">
                      <div className="flex items-center rounded-full border border-border">
                        <button
                          type="button"
                          aria-label="Kurangi jumlah"
                          className="flex size-8 items-center justify-center rounded-l-full hover:bg-accent"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus aria-hidden="true" className="size-3.5" />
                        </button>
                        <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                        <button
                          type="button"
                          aria-label="Tambah jumlah"
                          className="flex size-8 items-center justify-center rounded-r-full hover:bg-accent"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus aria-hidden="true" className="size-3.5" />
                        </button>
                      </div>
                      <p className="text-sm font-bold">
                        {formatPrice(Number(item.product.price.replace(/[^\d]/g, '')) * item.quantity)}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <aside className="rounded-2xl border border-border bg-card p-6 lg:sticky lg:top-28">
              <h2 className="text-lg font-bold">Ringkasan pesanan</h2>
              <div className="mt-5 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-semibold">{formatPrice(subtotal)}</span>
              </div>
              <div className="mt-3 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Pengiriman</span>
                <span className="font-semibold text-secondary-foreground">Gratis</span>
              </div>
              <div className="my-5 border-t border-border" />
              <div className="flex items-center justify-between">
                <span className="font-bold">Total</span>
                <span className="text-xl font-black">{formatPrice(subtotal)}</span>
              </div>
              <Button variant="secondary" size="lg" className="mt-6 w-full rounded-full" asChild>
                <a href="/checkout">Lanjut Checkout</a>
              </Button>
              <p className="mt-3 text-center text-[11px] leading-4 text-muted-foreground">
                Kami akan membantu konfirmasi ukuran, warna, dan alamat pengirimanmu.
              </p>
            </aside>
          </div>
        )}
      </section>
    </AppShell>
  )
}
