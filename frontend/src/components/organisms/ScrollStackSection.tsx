import { ArrowRight } from 'lucide-react'

import { ScrollStack, ScrollStackItem } from '@/components/molecules/ScrollStack'

const stories = [
  {
    eyebrow: '01 / Material',
    title: 'Dibuat untuk langkah yang panjang.',
    description: 'Material pilihan dan bantalan yang nyaman menemani rutinitasmu dari pagi hingga sore.',
    image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=1400&q=85',
    className: 'bg-secondary text-secondary-foreground',
  },
  {
    eyebrow: '02 / Detail',
    title: 'Detail kecil, rasa nyaman yang besar.',
    description: 'Setiap siluet dirancang agar mudah dipadukan dan tetap terasa ringan di setiap suasana.',
    image: 'https://images.unsplash.com/photo-1562273138-f46be4ebdf33?auto=format&fit=crop&w=1400&q=85',
    className: 'bg-foreground text-background',
  },
  {
    eyebrow: '03 / Everyday',
    title: 'Satu pasangan untuk banyak cerita.',
    description: 'Dari perjalanan singkat hingga hangout sore, Crousel siap bergerak bersamamu.',
    image: 'https://images.unsplash.com/photo-1603487742131-4160ec999306?auto=format&fit=crop&w=1400&q=85',
    className: 'bg-muted text-foreground',
  },
  {
    eyebrow: '04 / Comfort',
    title: 'Nyaman mengikuti ritmemu.',
    description: 'Sol yang fleksibel memberi pijakan mantap tanpa terasa berat saat aktivitas semakin padat.',
    image: 'https://images.unsplash.com/photo-1575537302964-96cd47c06b1b?auto=format&fit=crop&w=1400&q=85',
    className: 'bg-card text-foreground',
  },
  {
    eyebrow: '05 / Crousel',
    title: 'Temukan langkah versimu.',
    description: 'Pilih warna dan model favorit, lalu biarkan Crousel menjadi bagian dari cerita sehari-harimu.',
    image: 'https://images.unsplash.com/photo-1515347619252-60a4bf4fff4f?auto=format&fit=crop&w=1400&q=85',
    className: 'bg-secondary text-secondary-foreground',
  },
]

export function ScrollStackSection() {
  return (
    <section id="stories" className="overflow-hidden border-t border-border bg-background px-4 py-16 sm:px-6 lg:px-8 lg:py-24" data-scroll-stack data-aos="fade-up">
      <div className="mx-auto max-w-[90rem]">
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-muted-foreground">Cerita di setiap langkah</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-5xl">Scroll untuk mengenal Crousel lebih dekat.</h2>
          <p className="mt-4 text-sm leading-6 text-muted-foreground sm:text-base">Tiga prinsip yang membuat setiap pasangan Crousel terasa nyaman dan mudah menjadi bagian dari harimu.</p>
        </div>

        <ScrollStack className="mt-4" itemDistance={70} itemStackDistance={24} baseScale={0.9} scaleEndPosition="8%" stackPosition="18%" useWindowScroll>
          {stories.map((story) => (
            <ScrollStackItem key={story.eyebrow} itemClassName={`overflow-hidden rounded-[2rem] p-0 shadow-xl ${story.className}`}>
              <div className="grid h-full min-h-0 items-stretch md:grid-cols-[1fr_0.9fr]">
                <div className="flex flex-col justify-between p-6 sm:p-8">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] opacity-60">{story.eyebrow}</p>
                  <div className="mt-8">
                    <h3 className="max-w-lg text-2xl font-black tracking-tight sm:text-4xl">{story.title}</h3>
                    <p className="mt-3 max-w-md text-sm leading-6 opacity-70">{story.description}</p>
                    <a href="/belanja" className="mt-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider">Lihat koleksi <ArrowRight aria-hidden="true" className="size-4" /></a>
                  </div>
                </div>
                <div className="min-h-52 overflow-hidden md:min-h-full">
                  <img src={story.image} alt="Koleksi sandal Crousel" loading="lazy" className="h-full w-full object-cover transition-transform duration-700 hover:scale-105" />
                </div>
              </div>
            </ScrollStackItem>
          ))}
        </ScrollStack>
      </div>
    </section>
  )
}
