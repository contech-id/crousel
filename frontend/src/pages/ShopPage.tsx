import { useEffect, useMemo, useState } from 'react'
import { CategoryFilter, CategoryFilterSkeleton } from '@/components/molecules/CategoryFilter'
import { ProductCard, ProductSkeleton } from '@/components/molecules/ProductCard'
import { InnerPageLayout } from '@/components/templates/InnerPageLayout'
import type { Product } from '@/lib/products'

const allCategories = 'Semua kategori'
export function ShopPage() {
  const parameters = new URLSearchParams(window.location.search)
  const searchQuery = parameters.get('search')?.trim() ?? ''
  const initialCategory = parameters.get('category')?.trim() ?? allCategories
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<string[]>([allCategories])
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory)
  const [categoriesLoading, setCategoriesLoading] = useState(true)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/categories`)
      .then((response) => response.ok ? response.json() : Promise.reject(new Error('Gagal memuat kategori')))
      .then((payload: { data?: Array<{ name: string }> }) => setCategories([allCategories, ...(payload.data ?? []).map((category) => category.name)]))
      .catch(() => setError('Kategori belum dapat dimuat.'))
      .finally(() => setCategoriesLoading(false))
  }, [])

  useEffect(() => {
    const categoryQuery = selectedCategory === allCategories ? '' : `?category=${encodeURIComponent(selectedCategory)}`
    const loadProducts = async () => {
      setLoading(true)
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/products${categoryQuery}`)
        if (!response.ok) throw new Error('Gagal memuat produk')
        const payload = await response.json() as { data?: Product[] }
        setProducts(payload.data ?? [])
        setError('')
      } catch {
        setError('Produk belum dapat dimuat. Pastikan layanan katalog sedang aktif.')
      } finally {
        setLoading(false)
      }
    }
    void loadProducts()
  }, [selectedCategory])

  const filteredProducts = useMemo(
    () => {
      const sortedProducts = [...products]
      if (!searchQuery) return sortedProducts
      const normalizedQuery = searchQuery.toLocaleLowerCase('id-ID')
      return sortedProducts.sort((a, b) => {
        const aMatch = a.name.toLocaleLowerCase('id-ID').includes(normalizedQuery)
        const bMatch = b.name.toLocaleLowerCase('id-ID').includes(normalizedQuery)
        return Number(bMatch) - Number(aMatch)
      })
    },
    [products, searchQuery],
  )

  return (
    <InnerPageLayout
      eyebrow="Belanja Crousel"
      title="Temukan pasangan favoritmu."
      description="Koleksi sandal nyaman dengan desain stylish untuk setiap langkah dan aktivitas."
    >
      <section className="mx-auto max-w-[90rem] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="mb-8 space-y-5">
          {categoriesLoading ? (
            <CategoryFilterSkeleton />
          ) : (
            <CategoryFilter
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />
          )}
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              Menampilkan {filteredProducts.length} produk
              {searchQuery && ` · Hasil pencarian “${searchQuery}”`}
              {selectedCategory !== allCategories && ` · ${selectedCategory}`}
            </p>
          </div>
        </div>
        {loading ? (
          <div className="grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-5">
            {Array.from({ length: 10 }).map((_, index) => (
              <ProductSkeleton key={index} />
            ))}
          </div>
        ) : error ? (
          <p role="alert" className="rounded-xl border border-destructive/30 bg-destructive/5 py-12 text-center text-sm text-destructive">{error}</p>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-5">
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
