import { ArrowRight } from 'lucide-react'

const portraits = [
  { src: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=240&q=80', alt: 'Pelanggan Crousel' },
  { src: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=240&q=80', alt: 'Pelanggan Crousel' },
  { src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=240&q=80', alt: 'Pelanggan Crousel' },
  { src: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=240&q=80', alt: 'Pelanggan Crousel' },
  { src: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=240&q=80', alt: 'Pelanggan Crousel' },
  { src: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=240&q=80', alt: 'Pelanggan Crousel' },
  { src: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=240&q=80', alt: 'Pelanggan Crousel' },
  { src: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=240&q=80', alt: 'Pelanggan Crousel' },
]

export function TrustedLeadersSection() {
  return (
    <section id="trusted-leaders" className="px-4 py-16 sm:px-6 lg:px-8 lg:py-24" data-aos="fade-up">
      <div className="mx-auto max-w-[90rem]">
        <div className="relative overflow-hidden rounded-[2rem] border-0 bg-card px-5 pb-8 pt-8 shadow-none sm:px-10 sm:pb-10 sm:pt-10 lg:px-16 lg:pb-12">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-muted/80 to-transparent" />
          <div className="relative mx-auto flex max-w-3xl flex-wrap justify-center gap-2 sm:gap-3" aria-label="Komunitas Crousel" data-scroll-static>
            {portraits.map((portrait, index) => (
              <img
                key={portrait.src}
                src={portrait.src}
                alt={portrait.alt}
                loading="lazy"
                className={`size-14 rounded-xl object-cover shadow-sm sm:size-16 sm:rounded-2xl lg:size-[4.5rem] ${index % 3 === 0 ? 'translate-y-5' : index % 3 === 1 ? '-translate-y-1' : 'translate-y-8'}`}
              />
            ))}
          </div>

          <div className="relative mx-auto mt-14 max-w-xl text-center sm:mt-16">
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-muted-foreground">Cerita pelanggan</p>
            <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-5xl">Dipercaya untuk setiap langkah.</h2>
            <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-muted-foreground">Temani aktivitasmu dengan sandal yang nyaman, stylish, dan dibuat dengan perhatian pada setiap detail.</p>
            <a href="/belanja" className="mt-7 inline-flex items-center gap-2 rounded-full bg-secondary px-5 py-3 text-xs font-bold text-secondary-foreground transition-transform hover:-translate-y-0.5">Lihat koleksi <ArrowRight aria-hidden="true" className="size-4" /></a>
          </div>
        </div>
      </div>
    </section>
  )
}
