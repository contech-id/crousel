import { useMemo, useState } from 'react'
import { ShoppingBag } from 'lucide-react'

import { Button } from '@/components/atoms/ui/button'
import { CategoryFilter } from '@/components/molecules/CategoryFilter'
import { ProductCard } from '@/components/molecules/ProductCard'
import { InnerPageLayout } from '@/components/templates/InnerPageLayout'
import { products } from '@/lib/products'

const allCategories = 'Semua kategori'
const categories = [
  allCategories,
  'Sandal Slide Women',
  'Sandal Slop Unisex',
  'Sandal Slide Unisex',
  'Sandal Kids',
  'Sandal Wedges Women',
] as const

export function ShopPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>(allCategories)
  const filteredProducts = useMemo(
    () =>
      selectedCategory === allCategories
        ? products
        : products.filter((product) => product.category === selectedCategory),
    [selectedCategory],
  )

  return (
    <InnerPageLayout
      eyebrow="Belanja Crousel"
      title="Temukan pasangan favoritmu."
      description="Koleksi sandal nyaman dengan desain stylish untuk setiap langkah dan aktivitas."
    >
      <section className="mx-auto max-w-[90rem] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="mb-8 space-y-5">
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              Menampilkan {filteredProducts.length} produk
              {selectedCategory !== allCategories && ` · ${selectedCategory}`}
            </p>
            <Button variant="outline" size="sm" className="rounded-full">
              Urutkan <ShoppingBag aria-hidden="true" className="size-4" />
            </Button>
          </div>
        </div>
        {filteredProducts.length > 0 ? (
          <div className="grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-5">
            {filteredProducts.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        ) : (
          <p className="rounded-xl border border-dashed border-border py-12 text-center text-sm text-muted-foreground">
            Belum ada produk di kategori ini.
          </p>
        )}
      </section>
    </InnerPageLayout>
  )
}
