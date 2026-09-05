import { ContactSection } from '@/components/organisms/ContactSection'
import { InnerPageLayout } from '@/components/templates/InnerPageLayout'

export function ContactPage() {
  return <InnerPageLayout eyebrow="Kontak & toko" title="Mari terhubung dengan Crousel." description="Temukan kami di channel resmi berikut atau kirim pesan. Tim kami siap membantu kebutuhanmu.">
    <ContactSection />
  </InnerPageLayout>
}
