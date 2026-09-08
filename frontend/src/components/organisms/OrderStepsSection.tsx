import { CreditCard, FileText, MessageCircle, Ruler, ShoppingBag } from 'lucide-react'

const steps = [
  { number: '01', icon: Ruler, title: 'Periksa ukuran', description: 'Periksa kembali ukuran pada panduan size chart kaki.' },
  { number: '02', icon: MessageCircle, title: 'Tanyakan detail', description: 'Tanyakan ukuran dan warna sebelum order agar transaksi lancar.' },
  { number: '03', icon: FileText, title: 'Tuliskan pesanan', description: 'Tuliskan detail order dengan lengkap dan benar.' },
  { number: '04', icon: ShoppingBag, title: 'Cantumkan keterangan', description: 'Cantumkan ukuran dan warna pada kolom keterangan pembelian.' },
  { number: '05', icon: CreditCard, title: 'Lakukan pembayaran', description: 'Bayar sesuai metode dan unggah bukti jika diperlukan.' },
]

type OrderStepsSectionProps = {
  showHeading?: boolean
}

export function OrderStepsSection({ showHeading = true }: OrderStepsSectionProps) {
  return (
    <section id="how-to-order" className="scroll-mt-24 border-t border-border px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-[90rem]">
        {showHeading && <div className="text-left" data-aos="fade-up"><p className="text-xs font-bold uppercase tracking-[0.22em] text-muted-foreground">Cara memesan</p><h2 className="mt-2 text-3xl tracking-tight sm:text-4xl">Alur pembelian Crousel</h2></div>}
        <div className={`grid gap-4 sm:grid-cols-2 lg:grid-cols-5 ${showHeading ? 'mt-10' : ''}`}>
          {steps.map(({ number, icon: StepIcon, title, description }, index) => <article key={number} className="relative min-h-56 rounded-3xl border border-border bg-card p-7" data-aos="fade-up" data-aos-delay={String(index * 100)}><span className="absolute right-6 top-5 text-4xl font-black text-foreground">{number}</span><span className="inline-flex rounded-2xl bg-secondary p-3"><StepIcon aria-hidden="true" className="size-5" /></span><h3 className="mt-10 text-lg">{title}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p></article>)}
        </div>
      </div>
    </section>
  )
}
