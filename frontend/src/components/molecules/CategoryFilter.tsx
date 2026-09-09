import { Button } from "@/components/atoms/ui/button"
import { Skeleton } from "@/components/atoms/ui/skeleton"

type CategoryFilterProps = {
  categories: readonly string[]
  selectedCategory: string
  onCategoryChange: (category: string) => void
}

export function CategoryFilter({
  categories,
  selectedCategory,
  onCategoryChange,
}: CategoryFilterProps) {
  return (
    <div
      className="flex gap-2 overflow-x-auto pb-1"
      role="group"
      aria-label="Filter kategori produk"
    >
      {categories.map((category) => {
        const isSelected = category === selectedCategory

        return (
          <Button
            key={category}
            type="button"
            size="sm"
            variant={isSelected ? "secondary" : "outline"}
            className="rounded-full"
            aria-pressed={isSelected}
            onClick={() => onCategoryChange(category)}
          >
            {category}
          </Button>
        )
      })}
    </div>
  )
}

export function CategoryFilterSkeleton() {
  const widths = ["w-24", "w-32", "w-28", "w-36", "w-24"]

  return (
    <div className="flex gap-2 overflow-hidden pb-1" role="status" aria-label="Memuat kategori produk">
      <span className="sr-only">Memuat kategori produk...</span>
      {widths.map((width, index) => (
        <Skeleton key={index} className={`h-8 ${width} shrink-0 rounded-full`} />
      ))}
    </div>
  )
}
