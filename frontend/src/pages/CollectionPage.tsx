import { ArrowRight } from 'lucide-react'

import { InnerPageLayout } from '@/components/templates/InnerPageLayout'

const collections = [
  ['Harian', 'Untuk rutinitas yang dinamis', 'bg-[#e7e1d6]'],
  ['Unggulan', 'Berani tampil beda', 'bg-[#e1e5e9]'],
  ['Langkah Kecil', 'Nyaman untuk si kecil', 'bg-[#eee2e1]'],
  ['Serbaguna', 'Satu gaya untuk semua', 'bg-[#e0e5dc]'],
]

export function CollectionPage() {
  return <InnerPageLayout eyebrow="Koleksi" title="Gaya yang bergerak bersamamu." description="Jelajahi cerita di balik setiap koleksi Crousel, dirancang untuk membuat langkahmu terasa lebih ringan.">
    <section className="mx-auto grid max-w-[90rem] gap-5 px-4 py-12 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8 lg:py-16">{collections.map(([title, description, tone]) => <a key={title} href="#/shop" className={`group relative min-h-64 overflow-hidden rounded-3xl p-7 ${tone}`}><div className="absolute -bottom-14 -right-10 size-48 rounded-full border-[22px] border-black/5 transition-transform duration-500 group-hover:scale-110" /><p className="text-xs font-bold uppercase tracking-[0.18em] text-black/45">Koleksi Crousel</p><h2 className="mt-28 text-2xl font-black tracking-tight">{title}</h2><p className="mt-1 text-sm text-black/60">{description}</p><ArrowRight aria-hidden="true" className="absolute right-6 top-7 size-5 -translate-x-2 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" /></a>)}</section>
  </InnerPageLayout>
}
