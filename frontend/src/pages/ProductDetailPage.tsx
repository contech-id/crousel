import {
  ArrowLeft,
  Check,
  ExternalLink,
  Package,
  ShieldCheck,
  ShoppingCart,
  Truck,
} from 'lucide-react'
import { useEffect, useState } from 'react'

import { Button } from '@/components/atoms/ui/button'
import { ProductGallery } from '@/components/molecules/ProductGallery'
import { SizeGuideTable } from '@/components/molecules/SizeGuideTable'
import { AppShell } from '@/components/templates/AppShell'
import { useCart } from '@/hooks/useCart'
import { useAuth } from '@/hooks/useAuth'
import { sizeGuideTypes, sizeGuides, type SizeGuideType } from '@/lib/sizeGuide'
import type { Product } from '@/lib/products'

type ProductDetailPageProps = {
  id: string
}

export function ProductDetailPage({ id }: ProductDetailPageProps) {
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/products/${id}`)
      .then(res => res.json())
      .then(data => {
        setProduct(data.data?.product || null)
      })
      .catch(err => console.error("Gagal memuat produk:", err))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <AppShell>
         <section className="mx-auto max-w-[90rem] px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
            <p className="text-muted-foreground">Memuat produk...</p>
         </section>
      </AppShell>
    )
  }

  if (!product) {
    return (
      <AppShell>
        <section className="mx-auto max-w-[90rem] px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-muted-foreground">
            Produk tidak ditemukan
          </p>
          <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-6xl">
            Maaf, produk ini belum tersedia.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground">
            Silakan kembali ke katalog untuk melihat produk Crousel lainnya.
          </p>
          <Button variant="secondary" className="rounded-full" asChild>
            <a href="/belanja">
              <ArrowLeft aria-hidden="true" /> Kembali ke katalog
            </a>
          </Button>
        </section>
      </AppShell>
    )
  }

      return <ProductDetail key={product.id} product={product} />
}

type ProductDetailProps = {
  product: Product
}

function ProductDetail({ product }: ProductDetailProps) {
  const { addToCart } = useCart()
  const { isAuthenticated } = useAuth()
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [selectedColor, setSelectedColor] = useState<string | null>(null)
  const [addedToCart, setAddedToCart] = useState(false)
  const [selectedGuideType, setSelectedGuideType] = useState<SizeGuideType>(() => getSizeGuideType(product.target))
  const selectedGuide = sizeGuides[selectedGuideType]

  const hasSelection = Boolean(selectedSize && selectedColor)

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) return
    if (!isAuthenticated) {
      window.location.href = `/login?redirect=${encodeURIComponent(`/produk/${product.id}`)}`
      return
    }
    addToCart(product, selectedSize, selectedColor)
    setAddedToCart(true)
  }

  const handleBuyNow = () => {
    if (!selectedSize || !selectedColor) return
    if (!isAuthenticated) {
      window.location.href = `/login?redirect=${encodeURIComponent(`/produk/${product.id}`)}`
      return
    }
    addToCart(product, selectedSize, selectedColor)
    window.history.pushState({}, '', '/checkout')
    window.dispatchEvent(new PopStateEvent('popstate'))
  }

  return (
    <AppShell>
      <section className="mx-auto max-w-[90rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
        <a
          href="/belanja"
          className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
          data-scroll-static
        >
          <ArrowLeft aria-hidden="true" className="size-4" /> Kembali ke katalog
        </a>

        <div className="mt-7 grid gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(25rem,0.95fr)] lg:gap-16" data-scroll-static>
          <ProductGallery name={product.name} images={product.images} />

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-muted-foreground">
              {product.category}
            </p>
            <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
              {product.name}
            </h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-muted-foreground">
              {product.category}
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-secondary/25 px-3 py-1 text-xs font-semibold text-secondary-foreground">
                {product.availability}
              </span>
              <span className="text-xs text-muted-foreground">
                {product.target}
              </span>
            </div>
            <p className="mt-6 text-2xl font-semibold">{product.price}</p>
            <p className="mt-5 leading-7 text-muted-foreground">
              {product.description}
            </p>

            <div className="mt-7 rounded-2xl border border-border bg-card p-5">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold">Pilih ukuran</p>
                <a href="/panduan-ukuran" className="text-xs font-semibold text-muted-foreground underline-offset-4 hover:text-foreground hover:underline">Panduan ukuran</a>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {product.availableSizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    aria-pressed={selectedSize === size}
                    className={`inline-flex size-10 items-center justify-center rounded-lg border text-sm font-medium transition-colors ${selectedSize === size ? 'border-foreground bg-foreground text-background' : 'border-border hover:bg-accent'}`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
              <div className="mt-6">
                <p className="text-sm font-semibold">Pilih warna</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {product.availableColors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      aria-pressed={selectedColor === color}
                      className={`rounded-full border px-3.5 py-2 text-xs font-medium transition-colors ${selectedColor === color ? 'border-foreground bg-foreground text-background' : 'border-border hover:bg-accent'}`}
                      onClick={() => setSelectedColor(color)}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
              {(!selectedSize || !selectedColor) && (
                <p className="mt-4 text-xs text-muted-foreground">Pilih ukuran dan warna untuk melanjutkan.</p>
              )}
            </div>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <Button
                variant="outline"
                size="lg"
                className="w-full rounded-full bg-background sm:flex-1"
                disabled={!hasSelection}
                onClick={handleAddToCart}
              >
                <ShoppingCart aria-hidden="true" className="size-4" />
                {addedToCart ? 'Ditambahkan' : 'Masukkan keranjang'}
              </Button>
              <Button
                variant="secondary"
                size="lg"
                className="w-full rounded-full sm:flex-1"
                disabled={!hasSelection}
                onClick={handleBuyNow}
              >
                Beli sekarang <ExternalLink aria-hidden="true" className="size-4" />
              </Button>
            </div>

            <div className="mt-7 grid grid-cols-3 gap-3 border-y border-border py-5 text-center">
              <div className="space-y-2">
                <Truck aria-hidden="true" className="mx-auto size-5 text-muted-foreground" />
                <p className="text-[11px] leading-4 text-muted-foreground">Pengiriman aman</p>
              </div>
              <div className="space-y-2">
                <ShieldCheck aria-hidden="true" className="mx-auto size-5 text-muted-foreground" />
                <p className="text-[11px] leading-4 text-muted-foreground">Kualitas terjamin</p>
              </div>
              <div className="space-y-2">
                <Package aria-hidden="true" className="mx-auto size-5 text-muted-foreground" />
                <p className="text-[11px] leading-4 text-muted-foreground">Siap dikirim</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-14 grid gap-8 border-t border-border pt-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-muted-foreground">
              Detail produk
            </p>
            <h2 className="mt-2 text-2xl font-black tracking-tight">Dibuat untuk menemani langkahmu</h2>
            <p className="mt-4 max-w-2xl leading-7 text-muted-foreground">{product.description}</p>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {product.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-sm">
                  <span className="flex size-6 items-center justify-center rounded-full bg-secondary/25">
                    <Check aria-hidden="true" className="size-3.5" />
                  </span>
                  {feature}
                </li>
              ))}
            </ul>
            <div className="mt-8 border-t border-border pt-6">
              <h3 className="font-bold">Spesifikasi</h3>
              <dl className="mt-4 divide-y divide-border text-sm sm:grid sm:grid-cols-2 sm:gap-x-8 sm:divide-y-0">
                <div className="flex justify-between gap-4 border-b border-border py-3 sm:border-t"><dt className="text-muted-foreground">Kategori</dt><dd className="text-right font-medium">{product.category}</dd></div>
                <div className="flex justify-between gap-4 border-b border-border py-3 sm:border-t"><dt className="text-muted-foreground">Target</dt><dd className="text-right font-medium">{product.target}</dd></div>
              </dl>
            </div>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Panduan ukuran</p>
            <h2 className="mt-2 text-2xl font-black tracking-tight">Tabel ukuran {selectedGuide.label}</h2>
            <div className="mt-5 flex flex-wrap gap-2" role="group" aria-label="Pilih jenis ukuran">
              {sizeGuideTypes.map((type) => {
                const guide = sizeGuides[type]
                const selected = selectedGuideType === type

                return (
                  <button
                    key={type}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => setSelectedGuideType(type)}
                    className={`rounded-full border px-4 py-2 text-xs font-semibold transition-colors ${selected ? 'border-foreground bg-foreground text-background' : 'border-border bg-background hover:bg-accent'}`}
                  >
                    {guide.label}
                  </button>
                )
              })}
            </div>
            <div className="mt-4">
              <SizeGuideTable guide={selectedGuide} />
            </div>
            <p className="mt-4 text-xs text-muted-foreground">Jika berada di antara dua ukuran, pilih ukuran yang lebih besar.</p>
          </div>
        </div>
      </section>
    </AppShell>
  )
}

function getSizeGuideType(target: string): SizeGuideType {
  if (target === 'Women') return 'women'
  if (target === 'Kids') return 'kids'
  return 'unisex'
}
