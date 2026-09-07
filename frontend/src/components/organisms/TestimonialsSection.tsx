import { ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react'
import { useEffect, useState } from 'react'

const testimonials = [
  {
    quote: 'Lunanya ringan banget dan tetap nyaman dipakai seharian. Warnanya juga gampang dipadukan dengan outfit apa pun.',
    name: 'Nadia Putri',
    role: 'Pelanggan sejak 2023',
    product: 'Luna Sandal',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=160&q=80',
  },
  {
    quote: 'Milo jadi sandal andalan untuk kerja dan jalan sore. Solnya kokoh, tapi tetap terasa empuk di kaki.',
    name: 'Raka Pratama',
    role: 'Pelanggan sejak 2022',
    product: 'Milo Sandal',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&q=80',
  },
  {
    quote: 'Kiko Kids lucu dan strap-nya mudah diatur. Anak saya langsung betah memakainya untuk bermain.',
    name: 'Maya Lestari',
    role: 'Pelanggan sejak 2024',
    product: 'Kiko Kids',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80',
  },
  {
    quote: 'Sora memberi sedikit tinggi tanpa membuat kaki cepat lelah. Detailnya terlihat premium dan rapi.',
    name: 'Alana Sari',
    role: 'Pelanggan sejak 2021',
    product: 'Sora Wedges',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=160&q=80',
  },
] as const

export function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0)
  const activeTestimonial = testimonials[activeIndex]

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % testimonials.length)
    }, 5500)

    return () => window.clearInterval(timer)
  }, [])

  const showPrevious = () => setActiveIndex((index) => (index - 1 + testimonials.length) % testimonials.length)
  const showNext = () => setActiveIndex((index) => (index + 1) % testimonials.length)

  return (
    <section id="testimonials" className="border-t border-border bg-muted/40 px-4 py-16 sm:px-6 lg:px-8 lg:py-24" data-aos="fade-up">
      <div className="mx-auto max-w-[90rem]">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-5 sm:mb-10">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-muted-foreground">Kata mereka</p>
            <h2 className="mt-3 max-w-xl text-3xl font-black tracking-tight sm:text-5xl">Langkah nyaman yang diceritakan kembali.</h2>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={showPrevious} aria-label="Testimoni sebelumnya" className="flex size-10 items-center justify-center rounded-full border border-border bg-background transition-colors hover:bg-accent"><ChevronLeft aria-hidden="true" className="size-4" /></button>
            <button type="button" onClick={showNext} aria-label="Testimoni berikutnya" className="flex size-10 items-center justify-center rounded-full border border-border bg-background transition-colors hover:bg-accent"><ChevronRight aria-hidden="true" className="size-4" /></button>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-[2rem] bg-foreground p-6 text-background sm:p-10 lg:p-14" aria-live="polite">
          <Quote aria-hidden="true" className="absolute right-7 top-6 size-16 text-background/10 sm:right-12 sm:top-8 sm:size-24" />
          <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div className="max-w-3xl">
              <div className="flex items-center gap-1 text-secondary">
                {Array.from({ length: 5 }, (_, index) => <Star key={index} aria-hidden="true" className="size-4 fill-current" />)}
              </div>
              <blockquote className="mt-6 text-2xl font-bold leading-snug tracking-tight sm:text-4xl">&quot;{activeTestimonial.quote}&quot;</blockquote>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <img src={activeTestimonial.avatar} alt={activeTestimonial.name} loading="lazy" className="size-11 rounded-full object-cover ring-2 ring-background/20" />
                <div>
                  <p className="text-sm font-bold">{activeTestimonial.name}</p>
                  <p className="mt-0.5 text-xs text-background/55">{activeTestimonial.role}</p>
                </div>
                <span className="ml-0 rounded-full border border-background/20 px-3 py-1.5 text-[10px] font-semibold text-background/70 sm:ml-3">Memakai {activeTestimonial.product}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 lg:pb-1">
              {testimonials.map((testimonial, index) => <button key={testimonial.name} type="button" onClick={() => setActiveIndex(index)} aria-label={`Buka testimoni ${index + 1}`} aria-current={activeIndex === index ? 'true' : undefined} className={`h-1.5 rounded-full transition-all ${activeIndex === index ? 'w-10 bg-secondary' : 'w-5 bg-background/25 hover:bg-background/50'}`} />)}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

