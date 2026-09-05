import { ShoppingBag } from 'lucide-react'

import { Button } from '@/components/atoms/ui/button'
import { ProductVisual } from '@/components/molecules/ProductVisual'
import { InnerPageLayout } from '@/components/templates/InnerPageLayout'

const products = [
  { name: 'Luna Sandal', type: 'Sandal slide casual', price: 'Rp249.000', tone: 'bg-[#e6dfd1]', accent: 'bg-[#b8a487]' },
  { name: 'Milo Sandal', type: 'Sandal unisex harian', price: 'Rp279.000', tone: 'bg-[#d7dce1]', accent: 'bg-[#667482]' },
  { name: 'Sora Wedges', type: 'Wedges nyaman', price: 'Rp329.000', tone: 'bg-[#eee0df]', accent: 'bg-[#bb7774]' },
  { name: 'Kiko Kids', type: 'Sandal anak', price: 'Rp189.000', tone: 'bg-[#e9e2d4]', accent: 'bg-[#d09d53]' },
  { name: 'Nara Slop', type: 'Sandal slop', price: 'Rp229.000', tone: 'bg-[#dfe6df]', accent: 'bg-[#78917b]' },
  { name: 'Ayla Sandal', type: 'Sandal casual', price: 'Rp259.000', tone: 'bg-[#e5dce6]', accent: 'bg-[#92779c]' },
]

export function ShopPage() {
  return <InnerPageLayout eyebrow="Belanja Crousel" title="Temukan pasangan favoritmu." description="Koleksi sandal nyaman dengan desain stylish untuk setiap langkah dan aktivitas.">
    <section className="mx-auto max-w-[90rem] px-4 py-12 sm:px-6 lg:px-8 lg:py-16"><div className="mb-8 flex items-center justify-between"><p className="text-sm text-muted-foreground">Menampilkan {products.length} produk</p><Button variant="outline" size="sm" className="rounded-full">Urutkan <ShoppingBag aria-hidden="true" className="size-4" /></Button></div><div className="grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">{products.map((product) => <article key={product.name}><ProductVisual tone={product.tone} accent={product.accent} /><div className="flex items-start justify-between gap-3 pt-4"><div><h2 className="font-bold">{product.name}</h2><p className="mt-1 text-sm text-muted-foreground">{product.type}</p></div><p className="text-sm font-semibold">{product.price}</p></div><Button variant="outline" size="sm" className="mt-4 w-full rounded-full">Tambah ke keranjang</Button></article>)}</div></section>
  </InnerPageLayout>
}
