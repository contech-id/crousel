type ProductVisualProps = {
  tone: string
  accent: string
}

export function ProductVisual({ tone, accent }: ProductVisualProps) {
  return (
    <div className={`relative aspect-[1.08] overflow-hidden rounded-2xl ${tone}`}>
      <div className="absolute -right-10 -top-10 size-40 rounded-full bg-white/30" />
      <div className={`absolute bottom-10 left-1/2 h-14 w-44 -translate-x-1/2 rotate-[-12deg] rounded-[55%_45%_48%_52%] shadow-[0_18px_18px_-12px_rgba(0,0,0,0.35)] ${accent}`}>
        <span className="absolute left-7 top-1/2 h-8 w-28 -translate-y-1/2 rotate-[12deg] rounded-full border-[5px] border-b-transparent border-l-transparent border-white/70" />
      </div>
      <span className={`absolute bottom-7 left-1/2 h-2 w-36 -translate-x-1/2 rounded-full blur-sm ${accent} opacity-60`} />
    </div>
  )
}
