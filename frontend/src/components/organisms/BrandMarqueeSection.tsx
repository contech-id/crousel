const brands = ['Lilya', 'Sakura', 'Serxes', 'Maxter', 'Vicenza', 'Nerona', 'Kiko Kids']

export function BrandMarqueeSection() {
  return (
    <section aria-label="Koleksi brand Crousel" className="overflow-hidden bg-background py-7 sm:py-9" data-aos="fade-up">
      <div className="mx-auto max-w-[90rem] px-4 sm:px-6 lg:px-8">
        <p className="mb-5 text-center text-[10px] font-bold uppercase tracking-[0.24em] text-muted-foreground sm:mb-7">Koleksi pilihan Crousel</p>
        <div className="brand-marquee" role="presentation" data-scroll-static>
          <div className="brand-marquee-track">
            {[...brands, ...brands].map((brand, index) => (
              <div key={`${brand}-${index}`} className="brand-marquee-item">
                {/* <span className="brand-mark" aria-hidden="true">{brand.slice(0, 1)}</span> */}
                <span className="text-lg">{brand}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
