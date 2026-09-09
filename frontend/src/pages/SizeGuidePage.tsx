import { SizeGuideSection } from '@/components/organisms/SizeGuideSection'
import { InnerPageLayout } from '@/components/templates/InnerPageLayout'
import type { StoreCustomization } from '@/lib/customization'

export function SizeGuidePage({ customization }: { customization: StoreCustomization }) {
  return <InnerPageLayout eyebrow="Panduan ukuran" title="Temukan ukuran yang paling pas." description="Ikuti panduan visual dan tabel ukuran berikut agar sandal Crousel terasa nyaman sejak pemakaian pertama.">
    <SizeGuideSection showLink={false} imageSrc={customization.size_guide_image ?? undefined} />
  </InnerPageLayout>
}
