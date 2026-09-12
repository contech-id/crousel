import { Camera, ExternalLink, MessageCircle, ShoppingBag, Store } from 'lucide-react'
import { useEffect, useState, type FormEvent } from 'react'

import { Button } from '@/components/atoms/ui/button'

const fallbackChannels = [
  { icon: ShoppingBag, name: 'Shopee', detail: 'Crousel Official', href: 'https://shopee.co.id/crousel.official' },
  { icon: Camera, name: 'Instagram', detail: '@crousel.official', href: 'https://www.instagram.com/crousel.official/' },
  { icon: Store, name: 'Tokopedia', detail: 'Crousel', href: 'https://www.tokopedia.com/crousel' },
  { icon: ShoppingBag, name: 'Lazada', detail: 'Crousel Official', href: 'https://www.lazada.co.id/shop/crousel/?spm=a2o4j.pdp_revamp.seller.1.2e3a22d9udulj7&itemId=4524354366&channelSource=pdp' },
  { icon: Store, name: 'Blibli', detail: 'Crousel Flagship Store', href: 'https://www.blibli.com/merchant/crousel-flagship-store/CRO-70002?promoTab=false&pickupPointCode=PP-3189021&fbbActivated=false' },
  { icon: MessageCircle, name: 'WhatsApp', detail: '+62 821 2028 2823', href: 'https://wa.me/6282120282823' },
]

export function ContactSection() {
  const [channels, setChannels] = useState(fallbackChannels)
  const [email, setEmail] = useState('hello@crousel.id')
  const [sent, setSent] = useState('')
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/social-media`).then((r) => r.json()).then((p: { data?: Array<{ platform: string; account_name: string; url: string }> }) => {
      if (p.data?.length) setChannels(p.data.filter((item) => item.platform.toLowerCase() !== 'email').map((item) => ({ icon: item.platform.toLowerCase().includes('instagram') ? Camera : item.platform.toLowerCase().includes('whatsapp') ? MessageCircle : Store, name: item.platform, detail: item.account_name, href: item.url })))
      const mail = p.data?.find((item) => item.platform.toLowerCase() === 'email')
      if (mail) setEmail(mail.account_name)
    }).catch(() => undefined)
  }, [])
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setSent('Mengirim...')
    const form = new FormData(event.currentTarget)
    try { const response = await fetch(`${import.meta.env.VITE_API_URL}/contact`, { method: 'POST', headers: { Accept: 'application/json', 'Content-Type': 'application/json' }, body: JSON.stringify(Object.fromEntries(form)) }); if (!response.ok) throw new Error(); setSent('Pesan berhasil dikirim.'); event.currentTarget.reset() } catch { setSent('Pesan gagal dikirim. Silakan coba lagi.') }
  }
  return (
    <section id="contact" className="border-t border-border bg-muted/40 px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
      <div className="mx-auto grid max-w-[90rem] gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="h-fit self-start rounded-3xl bg-secondary p-8 text-secondary-foreground sm:p-10" data-aos="fade-right">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-secondary-foreground/60">Pusat bantuan</p>
          <h2 className="mt-4 max-w-md text-3xl tracking-tight">Ada yang ingin ditanyakan?</h2>
          <form className="mt-8 space-y-4" onSubmit={submit}>
            <input name="name" required aria-label="Nama" placeholder="Nama kamu" className="h-12 w-full rounded-xl border border-secondary-foreground/20 bg-card px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/40" />
            <input name="email" required aria-label="Email" type="email" placeholder="Alamat email" className="h-12 w-full rounded-xl border border-secondary-foreground/20 bg-card px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/40" />
            <textarea name="message" required aria-label="Pesan" placeholder="Tulis pesanmu di sini" rows={3} className="w-full resize-none rounded-xl border border-secondary-foreground/20 bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground/40" />
            <Button className="rounded-full bg-foreground text-background hover:bg-foreground/90" type="submit">Kirim pesan <MessageCircle aria-hidden="true" /></Button>
            {sent && <p className="text-xs">{sent}</p>}
          </form>
        </div>

        <div className="space-y-4">
          <div data-aos="fade-up"><p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Kontak dan toko resmi</p><h2 className="mt-2 text-2xl tracking-tight">Temukan kami di channel favoritmu.</h2></div>
          <div className="grid gap-4 sm:grid-cols-2">
            {channels.map(({ icon: ChannelIcon, name, detail, href }, index) => <a key={name} href={href} target="_blank" rel="noreferrer" className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4 transition-colors hover:bg-muted" data-aos="fade-left" data-aos-delay={String(index * 75)}><span className="rounded-xl bg-secondary p-3"><ChannelIcon aria-hidden="true" className="size-5" /></span><span className="min-w-0 flex-1"><strong className="block text-sm">{name}</strong><span className="block truncate text-sm text-muted-foreground">{detail}</span></span><ExternalLink aria-hidden="true" className="size-4 shrink-0 text-muted-foreground" /></a>)}
            <a href={`mailto:${email}`} className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4 text-sm transition-colors hover:bg-muted"><span className="rounded-xl bg-secondary p-3"><MessageCircle aria-hidden="true" className="size-5" /></span><span className="min-w-0 flex-1"><strong className="block">Email bantuan</strong><span className="block truncate text-sm text-muted-foreground">{email}</span></span><ExternalLink aria-hidden="true" className="size-4 shrink-0 text-muted-foreground" /></a>
            <div className="flex items-start gap-3 rounded-2xl bg-card p-4 text-sm sm:col-span-2"><span className="size-5 shrink-0" aria-hidden="true" /><span><strong className="block">Jam layanan</strong><span className="text-muted-foreground">Senin - Sabtu, 09.00 - 17.00 WIB</span></span></div>
          </div>
        </div>
      </div>
    </section>
  )
}
