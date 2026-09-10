const brandLinks = [
  { label: 'Beranda', href: '/' },
  { label: 'Belanja', href: '/belanja' },
  { label: 'Kategori', href: '/kategori' },
  { label: 'Panduan ukuran', href: '/panduan-ukuran' },
]

const companyLinks = [
  { label: 'Tentang Crousel', href: '/tentang' },
  { label: 'Cara memesan', href: '/cara-memesan' },
  { label: 'Kontak & toko', href: '/kontak' },
]

export function FooterSection() {
  return (
    <footer className="bg-foreground text-background" data-scroll-static>
      <div className="mx-auto grid max-w-[90rem] gap-10 px-4 py-14 sm:grid-cols-2 sm:px-6 sm:py-16 lg:grid-cols-[1.5fr_1fr_1fr_1fr] lg:gap-12 lg:px-8 lg:py-20">
        <div className="max-w-sm">
          <a href="/" className="inline-flex" aria-label="Beranda Crousel Official">
            <img src="/logo.svg" alt="Crousel" className="h-12 w-auto" />
          </a>
          <p className="mt-6 max-w-xs text-sm leading-6 text-background/60">
            Sandal casual yang dirancang dengan passion untuk menemani setiap cerita dan aktivitasmu.
          </p>
        </div>

        <FooterColumn title="Brand" links={brandLinks} />
        <FooterColumn title="Perusahaan" links={companyLinks} />

        <div>
          <h2 className="text-xs font-bold uppercase tracking-[0.22em] text-background/80">Kontak</h2>
          <address className="mt-6 space-y-3 text-sm not-italic leading-6 text-background/60">
            <p>Muara Karang, Jakarta Utara</p>
            <a href="tel:+6282120282823" className="block transition-colors hover:text-background">+62 821 2028 2823</a>
            <a href="mailto:hello@crousel.id" className="block transition-colors hover:text-background">hello@crousel.id</a>
          </address>
        </div>
      </div>

      <div className="border-t border-background/15">
        <div className="mx-auto flex max-w-[90rem] items-center justify-center px-4 py-5 text-center text-xs text-background/45 sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} Crousel Official. Seluruh hak cipta dilindungi.</p>
        </div>
      </div>
    </footer>
  )
}

type FooterColumnProps = {
  title: string
  links: readonly { label: string; href: string }[]
}

function FooterColumn({ title, links }: FooterColumnProps) {
  return (
    <div>
      <h2 className="text-xs font-bold uppercase tracking-[0.22em] text-background/80">{title}</h2>
      <nav className="mt-6 space-y-3" aria-label={title}>
        {links.map((link) => (
          <a key={link.label} href={link.href} className="block text-sm text-background/60 transition-colors hover:text-background">
            {link.label}
          </a>
        ))}
      </nav>
    </div>
  )
}
