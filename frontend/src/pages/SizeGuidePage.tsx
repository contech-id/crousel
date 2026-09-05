import { SizeGuideSection } from '@/components/organisms/SizeGuideSection'
import { InnerPageLayout } from '@/components/templates/InnerPageLayout'

export function SizeGuidePage() {
  return <InnerPageLayout eyebrow="Panduan ukuran" title="Temukan ukuran yang paling pas." description="Ikuti panduan visual dan tabel ukuran berikut agar sandal Crousel terasa nyaman sejak pemakaian pertama.">
    <SizeGuideSection showLink={false} />
  </InnerPageLayout>
}
