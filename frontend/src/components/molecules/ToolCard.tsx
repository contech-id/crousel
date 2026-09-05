import type { LucideIcon } from 'lucide-react'

import { StatusBadge } from '@/components/atoms/StatusBadge'

type ToolCardProps = {
  description: string
  icon: LucideIcon
  title: string
}

export function ToolCard({ description, icon: Icon, title }: ToolCardProps) {
  return (
    <article className="rounded-xl border bg-card p-5 text-card-foreground shadow-sm">
      <div className="mb-5 flex items-start justify-between gap-4">
        <span className="rounded-lg bg-secondary p-2.5 text-secondary-foreground">
          <Icon aria-hidden="true" className="size-5" />
        </span>
        <StatusBadge />
      </div>
      <h3 className="font-semibold">{title}</h3>
      <p className="mt-1.5 text-sm leading-6 text-muted-foreground">{description}</p>
    </article>
  )
}
