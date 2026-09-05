import { Heart, Sparkles, Users } from 'lucide-react'

import { InnerPageLayout } from '@/components/templates/InnerPageLayout'

const features = [
  { icon: Sparkles, title: 'Kualitas terpilih', description: 'Kami memilih material yang nyaman dan tahan menemani aktivitas.' },
  { icon: Heart, title: 'Dirancang sepenuh hati', description: 'Setiap detail dibuat dengan passion dan kebanggaan di setiap inci.' },
  { icon: Users, title: 'Untuk semua langkah', description: 'Pilihan casual untuk wanita, pria, unisex, hingga anak-anak.' },
]

export function AboutPage() {
  return <InnerPageLayout eyebrow="Tentang Crousel" title="Dibuat dengan passion, untuk menemani langkahmu." description="Crousel Official hadir sejak 2020 dengan misi sederhana: membuat sandal berkualitas yang terasa nyaman dan terlihat stylish.">
    <section className="mx-auto max-w-[90rem] px-4 py-12 sm:px-6 lg:px-8 lg:py-16"><div className="grid gap-5 md:grid-cols-3">{features.map(({ icon: FeatureIcon, title, description }) => <article key={title} className="rounded-3xl border border-border bg-card p-7"><span className="mb-12 inline-flex rounded-2xl bg-secondary p-3"><FeatureIcon aria-hidden="true" className="size-5" /></span><h2 className="text-xl font-bold">{title}</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p></article>)}</div><div className="mt-6 rounded-3xl bg-foreground p-8 text-background sm:p-12"><p className="text-xs font-bold uppercase tracking-[0.2em] text-background/50">Cerita kami</p><p className="mt-4 max-w-3xl text-2xl font-bold leading-snug sm:text-4xl">&quot;Perlengkapan kebahagiaanmu&quot; adalah pengingat bahwa kenyamanan kecil bisa membawa kebahagiaan besar dalam keseharian.</p></div></section>
  </InnerPageLayout>
}
