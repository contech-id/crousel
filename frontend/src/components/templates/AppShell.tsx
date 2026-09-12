import type { ReactNode } from 'react'

import { FooterSection } from '@/components/organisms/FooterSection'
import { StoreNavbar } from '@/components/organisms/StoreNavbar'
import { MessageCircle } from 'lucide-react'
import { useEffect, useState } from 'react'

type AppShellProps = {
  children: ReactNode
  hideFooter?: boolean
}

export function AppShell({ children, hideFooter }: AppShellProps) {
  const [whatsapp, setWhatsapp] = useState('6282120282823')
  useEffect(() => { fetch(`${import.meta.env.VITE_API_URL}/social-media`).then((r) => r.json()).then((p: { data?: Array<{ platform: string; account_name: string; url: string }> }) => { const item = p.data?.find((entry) => entry.platform.toLowerCase() === 'whatsapp'); if (item) setWhatsapp(item.url || `https://wa.me/${item.account_name.replace(/\D/g, '')}`) }).catch(() => undefined) }, [])
  const whatsappHref = whatsapp.startsWith('http') ? whatsapp : `https://wa.me/${whatsapp.replace(/\D/g, '')}`
  return (
    <div className="min-h-screen bg-background">
      <StoreNavbar />
      <main>{children}</main>
      {!hideFooter && <FooterSection />}
      <a href={whatsappHref} target="_blank" rel="noreferrer" aria-label="Chat WhatsApp" className="fixed bottom-5 right-5 z-40 flex size-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-105"><MessageCircle aria-hidden="true" className="size-7" /></a>
    </div>
  )
}
