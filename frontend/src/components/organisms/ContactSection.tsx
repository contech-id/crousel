import { Camera, Mail, MapPin, MessageCircle, ShoppingBag } from 'lucide-react'

import { Button } from '@/components/atoms/ui/button'

const channels = [
  { icon: Camera, name: 'Instagram', detail: '@crousel.official' },
  { icon: ShoppingBag, name: 'Shopee', detail: 'Crousel Official' },
  { icon: MessageCircle, name: 'TikTok', detail: '@crousel.official' },
  { icon: Mail, name: 'WhatsApp', detail: '+62 821 2028 2823' },
]

export function ContactSection() {
  return (
    <section id="contact" className="border-t border-border bg-muted/40 px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
      <div className="mx-auto grid max-w-[90rem] gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-3xl bg-secondary p-8 text-secondary-foreground sm:p-10">
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
          <div><p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Kontak dan toko resmi</p><h2 className="mt-2 text-2xl tracking-tight">Temukan kami di channel favoritmu.</h2></div>
          {channels.map(({ icon: ChannelIcon, name, detail }) => <a key={name} href="/kontak" className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4 transition-colors hover:bg-muted"><span className="rounded-xl bg-secondary p-3"><ChannelIcon aria-hidden="true" className="size-5" /></span><span><strong className="block text-sm">{name}</strong><span className="text-sm text-muted-foreground">{detail}</span></span></a>)}
          <div className="flex items-start gap-3 rounded-2xl bg-card p-4 text-sm"><MapPin aria-hidden="true" className="mt-0.5 size-5 shrink-0" /><span><strong className="block">Jam layanan</strong><span className="text-muted-foreground">Senin - Sabtu, 09.00 - 17.00 WIB</span></span></div>
        </div>
      </div>
    </section>
  )
}
