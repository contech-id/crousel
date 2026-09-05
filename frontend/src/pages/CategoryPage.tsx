import { CategorySection } from '@/components/organisms/CategorySection'
import { InnerPageLayout } from '@/components/templates/InnerPageLayout'

export function CategoryPage() {
  return <InnerPageLayout eyebrow="Kategori produk" title="Temukan kategori yang cocok untukmu." description="Pilih model sandal berdasarkan kebutuhan, gaya, dan siapa yang akan memakainya.">
    <CategorySection showHeading={false} />
  </InnerPageLayout>
}
