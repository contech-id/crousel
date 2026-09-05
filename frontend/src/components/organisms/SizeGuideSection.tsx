import sizeGuideImage from '@/assets/ukuran.png'

const sizes = [
  ['36', '23,0 cm'],
  ['37', '23,7 cm'],
  ['38', '24,3 cm'],
  ['39', '25,0 cm'],
  ['40', '25,7 cm'],
  ['41', '26,3 cm'],
  ['42', '27,0 cm'],
  ['43', '27,7 cm'],
]

type SizeGuideSectionProps = {
  showLink?: boolean
}

export function SizeGuideSection({ showLink = true }: SizeGuideSectionProps) {
  return (
    <section id="size-guide" className="scroll-mt-24 border-t border-border bg-card px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-[90rem] items-start gap-8 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="overflow-hidden rounded-3xl bg-muted">
          <img src={sizeGuideImage} alt="Panduan visual pengukuran sandal Crousel" className="aspect-square h-full w-full object-cover" />
        </div>
        <div>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Panduan ukuran</p>
              <h2 className="mt-2 text-3xl tracking-tight">Tabel ukuran dewasa</h2>
            </div>
            {showLink && <a href="/panduan-ukuran" className="text-sm font-semibold">Panduan lengkap</a>}
          </div>
          <div className="mt-7 overflow-hidden rounded-2xl border border-border">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted text-xs uppercase tracking-wider text-muted-foreground"><tr><th className="px-5 py-4">Ukuran EU</th><th className="px-5 py-4">Panjang kaki</th></tr></thead>
              <tbody>{sizes.map(([size, length]) => <tr key={size} className="border-t border-border"><td className="px-5 py-3.5 font-semibold">{size}</td><td className="px-5 py-3.5 text-muted-foreground">{length}</td></tr>)}</tbody>
            </table>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">Jika berada di antara dua ukuran, pilih ukuran yang lebih besar.</p>
        </div>
      </div>
    </section>
  )
}
