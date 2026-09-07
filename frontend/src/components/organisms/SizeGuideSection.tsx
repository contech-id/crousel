import sizeGuideImage from '@/assets/ukuran.png'
import { useState } from 'react'

import { SizeGuideTable } from '@/components/molecules/SizeGuideTable'
import { sizeGuideTypes, sizeGuides, type SizeGuideType } from '@/lib/sizeGuide'

type SizeGuideSectionProps = {
  showLink?: boolean
}

export function SizeGuideSection({ showLink = true }: SizeGuideSectionProps) {
  const [selectedType, setSelectedType] = useState<SizeGuideType>('women')
  const selectedGuide = sizeGuides[selectedType]

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
              <h2 className="mt-2 text-3xl tracking-tight">Tabel ukuran {selectedGuide.label}</h2>
            </div>
            {showLink && <a href="/panduan-ukuran" className="text-sm font-semibold">Panduan lengkap</a>}
          </div>
          <div className="mt-6 flex flex-wrap gap-2" role="group" aria-label="Pilih jenis ukuran">
            {sizeGuideTypes.map((type) => {
              const guide = sizeGuides[type]
              const selected = selectedType === type

              return (
                <button
                  key={type}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => setSelectedType(type)}
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
  )
}
