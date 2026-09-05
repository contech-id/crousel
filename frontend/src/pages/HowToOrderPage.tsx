import { ArrowRight } from 'lucide-react'

import { Button } from '@/components/atoms/ui/button'
import { OrderStepsSection } from '@/components/organisms/OrderStepsSection'
import { InnerPageLayout } from '@/components/templates/InnerPageLayout'

export function HowToOrderPage() {
  return <InnerPageLayout eyebrow="Cara memesan" title="Belanja jadi lebih mudah." description="Ikuti alur pembelian Crousel agar pesananmu diproses dengan cepat dan tepat.">
    <OrderStepsSection showHeading={false} />
    <div className="mx-auto max-w-[90rem] px-4 pb-12 sm:px-6 lg:px-8"><div className="flex flex-wrap items-center justify-between gap-5 rounded-3xl bg-muted p-7"><p className="text-sm text-muted-foreground">Butuh bantuan memilih produk?</p><Button variant="secondary" className="rounded-full" asChild><a href="/kontak">Hubungi kami <ArrowRight aria-hidden="true" /></a></Button></div></div>
  </InnerPageLayout>
}
