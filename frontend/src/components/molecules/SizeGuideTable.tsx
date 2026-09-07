import type { SizeGuide } from '@/lib/sizeGuide'

type SizeGuideTableProps = {
  guide: SizeGuide
}

export function SizeGuideTable({ guide }: SizeGuideTableProps) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-border" data-scroll-static>
      <table className="w-full min-w-[32rem] text-left text-sm">
        <caption className="sr-only">{guide.title}</caption>
        <thead className="bg-muted text-xs uppercase tracking-wider text-muted-foreground">
          <tr>
            <th className="px-5 py-4">Ukuran EU</th>
            <th className="px-5 py-4">Panjang sandal</th>
            <th className="px-5 py-4">Rekomendasi telapak</th>
          </tr>
        </thead>
        <tbody>
          {guide.rows.map((row) => (
            <tr key={row.size} className="border-t border-border">
              <td className="px-5 py-3.5 font-semibold">{row.size}</td>
              <td className="px-5 py-3.5 text-muted-foreground">{row.sandalLength}</td>
              <td className="px-5 py-3.5 text-muted-foreground">{row.footLength}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
