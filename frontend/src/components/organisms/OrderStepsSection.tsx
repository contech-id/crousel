import { CreditCard, FileText, Ruler, Search, ShoppingBag } from 'lucide-react'

const steps = [
  { number: '01', icon: Search, title: 'Pilih produk', description: 'Temukan produk sepatu atau sandal favorit dari katalog kami.' },
  { number: '02', icon: Ruler, title: 'Pilih warna & ukuran', description: 'Pastikan ukuran dan warna pilihan Anda sudah sesuai panduan.' },
  { number: '03', icon: ShoppingBag, title: 'Masuk keranjang', description: 'Tambahkan produk ke keranjang untuk melanjutkan transaksi.' },
  { number: '04', icon: FileText, title: 'Checkout & pesanan', description: 'Isi detail alamat pengiriman dengan lengkap dan benar.' },
  { number: '05', icon: CreditCard, title: 'Lakukan pembayaran', description: 'Bayar pesanan menggunakan metode pembayaran yang tersedia.' },
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
