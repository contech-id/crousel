import { Boxes, Palette, Sparkles } from 'lucide-react'

import { ToolCard } from '@/components/molecules/ToolCard'

const tools = [
  {
    title: 'Tailwind CSS',
    description: 'Utility-first styling melalui plugin resmi Vite.',
    icon: Palette,
  },
  {
    title: 'shadcn/ui',
    description: 'Primitive UI yang dapat dimiliki dan dikustomisasi penuh.',
    icon: Boxes,
  },
  {
    title: 'Lucide React',
    description: 'Ikon SVG konsisten dengan named import yang tree-shakeable.',
    icon: Sparkles,
  },
]

export function ToolkitOverview() {
  return (
    <section aria-labelledby="toolkit-title">
      <h2 id="toolkit-title" className="sr-only">
        Toolkit proyek
      </h2>
      <div className="grid gap-4 md:grid-cols-3">
        {tools.map((tool) => (
          <ToolCard key={tool.title} {...tool} />
        ))}
      </div>
    </section>
  )
}
