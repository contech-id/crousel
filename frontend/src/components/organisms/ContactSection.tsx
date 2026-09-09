import { Camera, ExternalLink, MapPin, MessageCircle, ShoppingBag, Store } from 'lucide-react'

import { Button } from '@/components/atoms/ui/button'

const channels = [
  { icon: ShoppingBag, name: 'Shopee', detail: 'Crousel Official', href: 'https://shopee.co.id/crousel.official' },
  { icon: Camera, name: 'Instagram', detail: '@crousel.official', href: 'https://www.instagram.com/crousel.official/' },
  { icon: Store, name: 'Tokopedia', detail: 'Crousel', href: 'https://www.tokopedia.com/crousel' },
  { icon: ShoppingBag, name: 'Lazada', detail: 'Crousel Official', href: 'https://www.lazada.co.id/shop/crousel/?spm=a2o4j.pdp_revamp.seller.1.2e3a22d9udulj7&itemId=4524354366&channelSource=pdp' },
  { icon: Store, name: 'Blibli', detail: 'Crousel Flagship Store', href: 'https://www.blibli.com/merchant/crousel-flagship-store/CRO-70002?promoTab=false&pickupPointCode=PP-3189021&fbbActivated=false' },
  { icon: MessageCircle, name: 'WhatsApp', detail: '+62 821 2028 2823', href: 'https://wa.me/6282120282823' },
]

export function ContactSection() {
  return (
    <section id="contact" className="border-t border-border bg-muted/40 px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
      <div className="mx-auto grid max-w-[90rem] gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-3xl bg-secondary p-8 text-secondary-foreground sm:p-10" data-aos="fade-right">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-secondary-foreground/60">Pusat bantuan</p>
          <h2 className="mt-4 max-w-md text-3xl tracking-tight">Ada yang ingin ditanyakan?</h2>
          <form className="mt-8 space-y-4">
            <input aria-label="Nama" placeholder="Nama kamu" className="h-12 w-full rounded-xl border border-secondary-foreground/20 bg-card px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/40" />
            <input aria-label="Email" type="email" placeholder="Alamat email" className="h-12 w-full rounded-xl border border-secondary-foreground/20 bg-card px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/40" />
            <textarea aria-label="Pesan" placeholder="Tulis pesanmu di sini" rows={3} className="w-full resize-none rounded-xl border border-secondary-foreground/20 bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/40" />
            <Button className="rounded-full bg-foreground text-background hover:bg-foreground/90" type="button">Kirim pesan <MessageCircle aria-hidden="true" /></Button>
          </form>
        </div>

        <div className="space-y-4">
          <div data-aos="fade-up"><p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Kontak dan toko resmi</p><h2 className="mt-2 text-2xl tracking-tight">Temukan kami di channel favoritmu.</h2></div>
          {channels.map(({ icon: ChannelIcon, name, detail, href }, index) => <a key={name} href={href} target="_blank" rel="noreferrer" className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4 transition-colors hover:bg-muted" data-aos="fade-left" data-aos-delay={String(index * 75)}><span className="rounded-xl bg-secondary p-3"><ChannelIcon aria-hidden="true" className="size-5" /></span><span className="min-w-0 flex-1"><strong className="block text-sm">{name}</strong><span className="block truncate text-sm text-muted-foreground">{detail}</span></span><ExternalLink aria-hidden="true" className="size-4 shrink-0 text-muted-foreground" /></a>)}
          <a href="https://www.google.com/maps/place/Jl.+Nurpa'i+No.113b,+Citeureup,+Kec.+Cimahi+Utara,+Kota+Cimahi,+Jawa+Barat+40512/@-6.8656852,107.5489033,19z/data=!3m1!4b1!4m6!3m5!1s0x2e68e46b18921677:0xf01e3fb093dccd1a!8m2!3d-6.8656852!4d107.5489033!16s%2Fg%2F11fqq6mfmg?entry=ttu&g_ep=EgoyMDI2MDkwMi4wIKXMDSoASAFQAw%3D%3D" target="_blank" rel="noreferrer" className="flex items-start gap-3 rounded-2xl bg-card p-4 text-sm transition-colors hover:bg-muted" data-aos="fade-left" data-aos-delay="500"><MapPin aria-hidden="true" className="mt-0.5 size-5 shrink-0" /><span><strong className="block">Lokasi toko</strong><span className="text-muted-foreground">Jl. Nurpa'i No.113b, Citeureup, Cimahi Utara</span></span><ExternalLink aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-muted-foreground" /></a>
          <div className="flex items-start gap-3 rounded-2xl bg-card p-4 text-sm"><span className="size-5 shrink-0" aria-hidden="true" /><span><strong className="block">Jam layanan</strong><span className="text-muted-foreground">Senin - Sabtu, 09.00 - 17.00 WIB</span></span></div>
        </div>
      </div>
    </section>
  )
}
