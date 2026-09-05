import { ArrowRight, Play, Sparkles, Star } from 'lucide-react'

import heroImage from '@/assets/hero.png'
import { Button } from '@/components/atoms/ui/button'
import { ProductVisual } from '@/components/molecules/ProductVisual'
import { ContactSection } from '@/components/organisms/ContactSection'
import { CategorySection } from '@/components/organisms/CategorySection'
import { OrderStepsSection } from '@/components/organisms/OrderStepsSection'
import { SizeGuideSection } from '@/components/organisms/SizeGuideSection'
import { AppShell } from '@/components/templates/AppShell'

const products = [
  { name: 'Luna Sandal', type: 'Sandal slide casual', price: 'Rp249.000', tone: 'bg-[#e6dfd1]', accent: 'bg-[#b8a487]' },
  { name: 'Milo Sandal', type: 'Sandal unisex harian', price: 'Rp279.000', tone: 'bg-[#d7dce1]', accent: 'bg-[#667482]' },
  { name: 'Sora Wedges', type: 'Wedges nyaman', price: 'Rp329.000', tone: 'bg-[#eee0df]', accent: 'bg-[#bb7774]' },
]

export function HomePage() {
  return <AppShell>
    <section id="home" className="overflow-hidden bg-muted/40"><div className="mx-auto grid max-w-[90rem] items-center gap-8 px-4 pb-16 pt-12 sm:px-6 sm:pb-20 sm:pt-16 lg:grid-cols-[0.9fr_1.1fr] lg:gap-8 lg:px-8 lg:pb-24 lg:pt-20"><div className="relative z-10"><p className="mb-6 inline-flex items-center gap-2 rounded-full bg-secondary/30 px-3.5 py-2 text-[11px] text-foreground"><Sparkles aria-hidden="true" className="size-3.5" /> Dibuat untuk aktivitas harianmu</p><h1 className="max-w-xl text-5xl font-black leading-[1.02] tracking-[-0.06em] sm:text-6xl lg:text-[4.5rem]">Langkah nyaman untuk <span className="text-muted-foreground">gaya tanpa batas.</span></h1><p className="mt-6 max-w-md text-base leading-7 text-muted-foreground sm:text-lg">Sandal pilihan yang dibuat dengan penuh passion untuk menemani setiap cerita dan aktivitasmu.</p><div className="mt-8 flex flex-wrap items-center gap-4"><Button variant="secondary" size="lg" className="rounded-lg px-6" asChild><a href="/belanja">Belanja sekarang <ArrowRight aria-hidden="true" /></a></Button><a href="#collections" className="group inline-flex items-center gap-2 text-sm font-semibold"><span className="flex size-10 items-center justify-center rounded-full border border-border bg-background"><Play aria-hidden="true" className="ml-0.5 size-3.5 fill-current" /></span> Lihat koleksi</a></div><div className="mt-12 flex items-center gap-7"><div className="text-xs leading-5 text-muted-foreground">Dipercaya oleh<br /><strong className="text-foreground">10.000+ langkah</strong></div><div className="h-9 w-px bg-border" /><div className="flex items-center gap-1 text-secondary-foreground">{Array.from({ length: 5 }, (_, index) => <Star key={index} aria-hidden="true" className="size-3.5 fill-secondary" />)}<span className="ml-1 text-xs font-semibold text-foreground">4,9/5</span></div></div></div><div className="relative mx-auto flex min-h-[390px] w-full max-w-[800px] items-center justify-center sm:min-h-[500px] lg:min-h-[600px]"><div className="absolute right-4 top-1/2 aspect-square w-[78%] -translate-y-1/2 rounded-full bg-gradient-to-br from-secondary/80 via-secondary/35 to-transparent blur-3xl" /><img src={heroImage} alt="Sandal Crousel dengan desain modern" className="relative z-10 w-[94%] max-w-[680px] object-contain drop-shadow-[0_30px_25px_rgba(0,0,0,0.2)]" /><span className="absolute bottom-[10%] left-[5%] z-20 rounded-full bg-foreground px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-background">Crousel / 01</span></div></div></section>

    <CategorySection />

    <section id="shop" className="mx-auto max-w-[90rem] px-4 py-16 sm:px-6 lg:px-8 lg:py-24"><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[0.22em] text-muted-foreground">Terlaris</p><h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Nyaman di setiap langkah</h2></div><a href="/belanja" className="text-sm font-semibold">Lihat katalog</a></div><div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{products.map((product) => <article key={product.name} className="group"><ProductVisual tone={product.tone} accent={product.accent} /><div className="flex items-start justify-between gap-3 pt-4"><div><h3 className="font-bold">{product.name}</h3><p className="mt-1 text-sm text-muted-foreground">{product.type}</p></div><p className="text-sm font-semibold">{product.price}</p></div></article>)}</div></section>

    <section id="about" className="overflow-hidden bg-card px-4 py-16 sm:px-6 lg:px-8 lg:py-20"><div className="mx-auto max-w-[90rem]"><div className="grid items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]"><div><p className="mb-4 inline-flex rounded-full border border-border bg-background px-3 py-1.5 text-[11px] font-semibold text-muted-foreground">Tentang kami</p><h2 className="max-w-2xl text-3xl font-black tracking-tight sm:text-5xl">Kenali Crousel, teman di setiap langkah.</h2><p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground">Kami percaya sandal yang baik bukan hanya terlihat stylish, tetapi juga membuat setiap aktivitas terasa lebih nyaman dan penuh percaya diri.</p><a href="/tentang" className="mt-7 inline-flex items-center gap-2 text-sm font-bold">Baca cerita Crousel <ArrowRight aria-hidden="true" className="size-4" /></a></div><div className="relative mx-auto w-full max-w-md"><div className="absolute -inset-4 rounded-[2rem] bg-secondary/30 blur-2xl" /><div className="relative overflow-hidden"><img src={heroImage} alt="Produk sandal Crousel" className="h-56 w-full object-contain sm:h-64" /><span className="absolute right-5 top-5 rounded-full bg-background px-3 py-1 text-[10px] font-bold uppercase tracking-wider">Sejak 2020</span></div></div></div><div className="relative mt-10 overflow-hidden rounded-[2rem] bg-foreground p-7 text-background sm:p-10"><div className="absolute -right-16 -top-24 size-72 rounded-full border-[34px] border-background/10" /><p className="relative text-4xl font-black tracking-tight sm:text-6xl">10.000+</p><p className="relative mt-2 text-sm text-background/60">langkah bahagia bersama Crousel</p><div className="relative mt-8 flex flex-wrap gap-2">{['Sandal casual', 'Unisex', 'Nyaman', 'Stylish', 'Kids'].map((tag) => <span key={tag} className="rounded-full border border-background/20 px-3 py-1.5 text-xs text-background/80">{tag}</span>)}</div></div></div></section>

    <SizeGuideSection />

    <OrderStepsSection />

    <ContactSection />
    <footer className="border-t border-border px-4 py-8 sm:px-6 lg:px-8"><div className="mx-auto flex max-w-[90rem] flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground"><span>(c) 2024 Crousel Official</span><a href="/kontak" className="font-semibold hover:text-foreground">Pusat bantuan dan informasi</a></div></footer>
  </AppShell>
}
