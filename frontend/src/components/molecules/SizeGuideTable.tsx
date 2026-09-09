import type { SizeGuide } from '@/lib/sizeGuide'

type SizeGuideTableProps = {
  guide: SizeGuide
}

export function SizeGuideTable({ guide }: SizeGuideTableProps) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-border" data-scroll-static>
      <table className="w-full table-fixed text-left text-xs sm:text-sm">
        <caption className="sr-only">{guide.title}</caption>
        <thead className="bg-muted text-xs uppercase tracking-wider text-muted-foreground">
          <tr>
            <th className="w-[22%] break-words px-2 py-3 sm:px-5 sm:py-4">Ukuran EU</th>
            <th className="w-[35%] break-words px-2 py-3 sm:px-5 sm:py-4">Panjang sandal</th>
            <th className="w-[43%] break-words px-2 py-3 sm:px-5 sm:py-4">Rekomendasi telapak</th>
          </tr>
        </thead>
        <tbody>
          {guide.rows.map((row) => (
            <tr key={row.size} className="border-t border-border">
              <td className="px-2 py-3 font-semibold sm:px-5 sm:py-3.5">{row.size}</td>
              <td className="px-2 py-3 text-muted-foreground sm:px-5 sm:py-3.5">{row.sandalLength}</td>
              <td className="px-2 py-3 text-muted-foreground sm:px-5 sm:py-3.5">{row.footLength}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
