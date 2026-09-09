import { ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react'
import { useEffect, useState } from 'react'

const testimonials = [
  {
    quote: 'Tampilan: sangat amat bagus, ada bantalan kaki nya sangat empuk. Warna: putih. Suka sekali😍 Buat yang lagi liat-liat review aku saranin cepatan order karna emang sebagus itu. Cuma untuk ukuran size bisa konsultasi k admin (btw admin nya ramah banget) karena aku panjang kaki 24,5 cm biasa pakai size 38 harus naikin 1 size jadi 39. Overall semua nya bagus🥹',
    name: 'sylvialubis',
    role: '27 Juni 2022 · Variasi 39',
    product: 'Review Shopee',
    avatar: '/images/testimoni1.webp',
  },
  {
    quote: 'Panjang kaki: 23,5 cm ambil size 39, panjang sandalnya: 26 cm. Di gambar/video sabuk bagian belakang udah aku kecilin satu lubang. Ukuran 39 ini pas di kaki ku nyaman banget dipakainya. Biasanya aku pakai alas kaki ukuran 40, itu pas di kaki ku. Saran aja ambil sizenya turun satu yaaa. Suka bgt titik.',
    name: 'k*****a',
    role: '23 Agustus 2021 · Variasi 39',
    product: 'Review Shopee',
    avatar: '/images/testimoni2.webp',
  },
  {
    quote: 'Tampilan: cantik bgttbgt. Warna: putih. Empukkk nyamann bgt. Pas! Uk kakiku 23cm ambil 37 pas banget. Aku saranin uk kaki 23cm ambil 37 aja yaaaa biar gak terlalu pas kalau pake uk 36 takunya gk ada ruang gerak, bikin ga nyaman biasanya. Biasanya aku pake ukuran 38🤩 Alas paling atas itu warna cream kalau di cahaya lebih ke putih, enggak berat, kalau jalan bunyinya kaya pakai sepatu yaa, enggak mengganggu kok.',
    name: 'Pelanggan Crousel',
    role: '10 Agustus 2023 · Variasi 37',
    product: 'Review Shopee',
    avatar: '/images/testimoni3.webp',
  },
  {
    quote: 'Baguuuss pas di kaki aku sendalnyaaa. Aku biasa pake size 37 untuk panjang kaki 23,5, ternyata pas ambil yang size 37. Aslinya bagus banget sendal iniii aku sukaaaa. Terima kasiiiih.',
    name: 'rizaoktapahlepi',
    role: '29 Juli 2024 · Variasi 37',
    product: 'Review Shopee',
    avatar: '/images/testimoni4.webp',
  },
  {
    quote: 'Kualitas: sangat baik. Kenyamanan: empuk. Bagusss banget banget, empuk juga. Kulitnya juga ngga kasar, jadi aman buat kaki biar ngga lecet. Ukuran kaki aku 24 cm, aku ambil yang no. 39 pas bgt.',
    name: 'tinnoll234',
    role: '11 Mei 2023 · Variasi 39',
    product: 'Review Shopee',
    avatar: '/images/testimoni5.webp',
  },
  {
    quote: 'Untuk yang punya kaki 36 kecil ini muat, dan bisa diatur gede kecilnya untuk yang gak pengen ngepas banget. Ringan dan bahan tekstur dari sendalnya itu halus, ini ringan tapi bahan untuk tumpuan kakinya itu lembut, cantik.',
    name: 'reerlm',
    role: '22 Mei 2022 · Variasi 36',
    product: 'Review Shopee',
    avatar: '/images/testimoni6.webp',
  },
  {
    quote: 'Baguuuss banget barangnya. Packingannya juga sangat rapi. Nyaman dipakai juga. Sukaaa pol terima kasih kaka🤩🤩🤩🤩',
    name: 'agthinessawidiasari',
    role: '12 September 2021 · Variasi 42',
    product: 'Review Shopee',
    avatar: '/images/testimoni7.webp',
  },
  {
    quote: 'Tampilan: lucu. Warna: putih. Gemes sendalnyaaa. Lem nya juga rapi tapi biar tetep awet harus di sol sendiri lagi biar ga cepet mangap sendalnya. Rekomen banget sihh beli iniiiii.',
    name: 'nurouliah',
    role: '17 Agustus 2022 · Variasi 36',
    product: 'Review Shopee',
    avatar: '/images/testimoni8.webp',
  },
  {
    quote: 'Bagus banget bahannya enak gak berat dan warnanya cantik banget. Kemaren pesen sempat kebesaran akhirnya aku coba chat resellernya dan boleh ditukar. Best banget toko ini.',
    name: 'malofe.beauty',
    role: '2 Maret 2022 · Variasi 39',
    product: 'Review Shopee',
    avatar: '/images/testimoni1.webp',
  },
  {
    quote: 'Sumpah si sebagus itu🌈 Dan untuk modelnya super kece bangett kelihatan ke barang branded💜 Biasa aku pakai ukuran 38 tapi ini aku pakai ukuran 36 pun masih longgar hehe🥰',
    name: 'n*****2',
    role: '12 Desember 2021 · Variasi 36',
    product: 'Review Shopee',
    avatar: '/images/testimoni2.webp',
  },
  {
    quote: 'Lucu banget lo iniii aduu. Ukuran pass gaada masalah samasekali. Ada lem dikit yang keluar di bagian tempelan solnya tapi gapapa kumaafkan karna sendalnya lucuuu bagusss. Berkah selalu yaa usahanya.',
    name: 'g*****m',
    role: '31 Mei 2022 · Variasi 39',
    product: 'Review Shopee',
    avatar: '/images/testimoni3.webp',
  },
  {
    quote: 'Kenyamanan: sangat nyaman. Desain: bagus dan unik. Saya pikir ukurannya bakal kebesaran ternyata pas untuk panjang kaki 23,5 cm. Bagus banget, kalian wajib beli sih karena nyaman, dia ga bikin lecet soalnya lembut kayak ada bulu-bulunya gitu di bagian dalam. Bahannya juga ga kaku, empuk kokk. Bagus banget dehh.',
    name: 'del.krisanti',
    role: '14 November 2024 · Variasi 38',
    product: 'Review Shopee',
    avatar: '/images/testimoni4.webp',
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
        <div className="mb-8 flex flex-wrap items-end justify-between gap-5 sm:mb-10" data-aos="fade-up">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-muted-foreground">Kata mereka</p>
            <h2 className="mt-3 max-w-xl text-3xl font-black tracking-tight sm:text-5xl">Langkah nyaman yang diceritakan kembali.</h2>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={showPrevious} aria-label="Testimoni sebelumnya" className="flex size-10 items-center justify-center rounded-full border border-border bg-background transition-colors hover:bg-accent"><ChevronLeft aria-hidden="true" className="size-4" /></button>
            <button type="button" onClick={showNext} aria-label="Testimoni berikutnya" className="flex size-10 items-center justify-center rounded-full border border-border bg-background transition-colors hover:bg-accent"><ChevronRight aria-hidden="true" className="size-4" /></button>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-[2rem] bg-foreground p-6 text-background sm:p-10 lg:p-14" aria-live="polite" data-aos="fade-up" data-aos-delay="150">
          <Quote aria-hidden="true" className="absolute right-7 top-6 size-16 text-background/10 sm:right-12 sm:top-8 sm:size-24" />
          <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div className="min-w-0 max-w-3xl pr-4 sm:pr-0">
              <div className="flex items-center gap-1 text-secondary">
                {Array.from({ length: 5 }, (_, index) => <Star key={index} aria-hidden="true" className="size-4 fill-current" />)}
              </div>
              <blockquote className="mt-6 max-w-full break-words pr-3 text-lg font-bold leading-relaxed tracking-tight [overflow-wrap:anywhere] sm:pr-0 sm:text-2xl sm:leading-snug">&quot;{activeTestimonial.quote}&quot;</blockquote>
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
