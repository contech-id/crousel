import { Check } from 'lucide-react'

type StatusBadgeProps = {
  label?: string
}

export function StatusBadge({ label = 'Terpasang' }: StatusBadgeProps) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 ring-1 ring-emerald-600/20 ring-inset">
      <Check aria-hidden="true" className="size-3.5" />
      {label}
    </span>
  )
}
