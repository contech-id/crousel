import { BadgeCheck, Mail, Menu, Phone, Search, ShoppingBag, User, X } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'

import { Button } from '@/components/atoms/ui/button'
import { ProductSearchDialog } from '@/components/molecules/ProductSearchDialog'
import { useCart } from '@/hooks/useCart'
import { useAuth } from '@/hooks/useAuth'

const navLinks = [
  { label: 'Beranda', href: '/' },
  { label: 'Kategori', href: '/kategori' },
  { label: 'Belanja', href: '/belanja' },
  { label: 'Tentang', href: '/tentang' },
  { label: 'Panduan Ukuran', href: '/panduan-ukuran' },
  { label: 'Cara Memesan', href: '/cara-memesan' },
  { label: 'Kontak', href: '/kontak' },
]

export function StoreNavbar() {
  const { itemCount } = useCart()
  const { isAuthenticated } = useAuth()
  const [announcementVisible, setAnnouncementVisible] = useState(true)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [currentPath, setCurrentPath] = useState(() => window.location.pathname.replace(/\/+$/, '') || '/')
  const announcementState = useRef(true)
  const closeSearch = useCallback(() => setSearchOpen(false), [])

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY
      if (currentScroll > 72 && announcementState.current) {
        announcementState.current = false
        setAnnouncementVisible(false)
      } else if (currentScroll < 12 && !announcementState.current) {
        announcementState.current = true
        setAnnouncementVisible(true)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const updatePath = () => setCurrentPath(window.location.pathname.replace(/\/+$/, '') || '/')
    window.addEventListener('popstate', updatePath)
    window.addEventListener('hashchange', updatePath)
    return () => {
      window.removeEventListener('popstate', updatePath)
      window.removeEventListener('hashchange', updatePath)
    }
  }, [])

  const isActive = (href: string) => {
    if (href === '/') return currentPath === '/'
    const aliases: Record<string, string[]> = {
      '/belanja': ['/shop'],
      '/kategori': ['/collection'],
      '/tentang': ['/about'],
      '/panduan-ukuran': ['/size-guide'],
      '/cara-memesan': ['/how-to-order'],
      '/kontak': ['/contact'],
    }
    return currentPath === href || aliases[href]?.includes(currentPath) || (href === '/belanja' && currentPath.startsWith('/produk/'))
  }

  return (
    <header className="sticky top-0 z-50">
      <div
        className={`overflow-hidden bg-secondary text-secondary-foreground transition-all duration-200 ease-out ${announcementVisible ? 'max-h-14 opacity-100' : 'max-h-0 -translate-y-full opacity-0'}`}
        aria-hidden={!announcementVisible}
      >
        <div className="mx-auto flex max-w-[90rem] items-center justify-between gap-4 px-4 py-2.5 text-[11px] font-medium sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 sm:gap-6">
            <a href="tel:+6282120282823" className="hidden items-center gap-1.5 transition-opacity hover:opacity-80 sm:inline-flex"><Phone aria-hidden="true" className="size-3" /> +62 821 2028 2823</a>
            <a href="mailto:hello@crousel.id" className="hidden items-center gap-1.5 transition-opacity hover:opacity-80 md:inline-flex"><Mail aria-hidden="true" className="size-3" /> hello@crousel.id</a>
            <span className="inline-flex items-center gap-1.5"><BadgeCheck aria-hidden="true" className="size-3" /> Toko Resmi Crousel</span>
          </div>
          <span className="shrink-0 font-semibold">Gratis ongkir min. Rp500K <span aria-hidden="true">→</span></span>
        </div>
      </div>

      <nav className="border-b border-border/70 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="mx-auto flex h-[76px] max-w-[90rem] items-center justify-between gap-5 px-4 sm:px-6 lg:px-8">
          <a href="/" className="shrink-0 text-xl font-black tracking-[-0.08em] sm:text-2xl" aria-label="Beranda Crousel Official">
            CROUSEL<span className="text-secondary">.</span>
          </a>

          <div className="hidden items-center gap-5 lg:flex xl:gap-7">
            {navLinks.map((link) => (
              <a key={link.label} href={link.href} aria-current={isActive(link.href) ? 'page' : undefined} className={`relative border-b-2 py-7 text-[13px] font-medium transition-colors hover:text-foreground ${isActive(link.href) ? 'border-secondary text-foreground' : 'border-transparent text-muted-foreground'}`}>
                <span className="inline-flex items-center gap-1">{link.label}</span>
              </a>
            ))}
          </div>

          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="rounded-full" aria-label="Cari produk" aria-haspopup="dialog" aria-expanded={searchOpen} onClick={() => setSearchOpen(true)}><Search aria-hidden="true" className="size-[19px]" /></Button>
            <Button variant="ghost" size="icon" className="hidden rounded-full sm:inline-flex" aria-label={isAuthenticated ? 'Profil saya' : 'Masuk atau daftar'} asChild>
              <a href={isAuthenticated ? '/profil' : '/login'}><User aria-hidden="true" className="size-[19px]" /></a>
            </Button>
            <Button variant="ghost" size="icon" className="relative rounded-full" aria-label={`Keranjang belanja${itemCount > 0 ? `, ${itemCount} produk` : ''}`} asChild>
              <a href="/keranjang">
                <ShoppingBag aria-hidden="true" className="size-[19px]" />
                {itemCount > 0 && <span className="absolute -right-0.5 -top-0.5 flex min-w-4 items-center justify-center rounded-full bg-secondary px-1 text-[10px] font-bold leading-4 text-secondary-foreground">{itemCount > 99 ? '99+' : itemCount}</span>}
              </a>
            </Button>
            <Button variant="ghost" size="icon" className="ml-1 rounded-full lg:hidden" aria-label={mobileOpen ? 'Tutup menu' : 'Buka menu'} aria-expanded={mobileOpen} onClick={() => setMobileOpen((open) => !open)}>
              {mobileOpen ? <X aria-hidden="true" className="size-5" /> : <Menu aria-hidden="true" className="size-5" />}
            </Button>
          </div>
        </div>

        <div className={`border-t border-border/60 bg-background lg:hidden ${mobileOpen ? 'block' : 'hidden'}`}>
          <div className="mx-auto flex max-w-[90rem] flex-col px-4 py-3 sm:px-6">
            {navLinks.map((link) => <a key={link.label} href={link.href} onClick={() => setMobileOpen(false)} aria-current={isActive(link.href) ? 'page' : undefined} className={`border-b border-border/50 py-3 text-sm font-medium last:border-0 hover:text-foreground ${isActive(link.href) ? 'text-foreground' : 'text-muted-foreground'}`}>{link.label}</a>)}
            <a href={isAuthenticated ? '/profil' : '/login'} onClick={() => setMobileOpen(false)} className="flex items-center gap-2 py-3 text-sm font-medium text-muted-foreground sm:hidden"><User aria-hidden="true" className="size-4" /> {isAuthenticated ? 'Profil saya' : 'Masuk atau daftar'}</a>
          </div>
        </div>
      </nav>
      <ProductSearchDialog key={searchOpen ? 'open' : 'closed'} open={searchOpen} onClose={closeSearch} />
    </header>
  )
}
