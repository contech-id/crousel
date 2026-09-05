import { Button } from "@/components/atoms/ui/button"

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
