import { useEffect, useState } from 'react'

import { AboutPage } from '@/pages/AboutPage'
import { CollectionPage } from '@/pages/CollectionPage'
import { ContactPage } from '@/pages/ContactPage'
import { CategoryPage } from '@/pages/CategoryPage'
import { HomePage } from '@/pages/HomePage'
import { HowToOrderPage } from '@/pages/HowToOrderPage'
import { ShopPage } from '@/pages/ShopPage'
import { SizeGuidePage } from '@/pages/SizeGuidePage'

function getRoute() {
  if (window.location.hash.startsWith('#/')) {
    return window.location.hash.replace(/^#\/?/, '') || 'home'
  }
  const path = window.location.pathname.replace(/^\/+|\/+$/g, '')
  return path || 'home'
}

const localizedRoutes: Record<string, string> = {
  '/shop': '/belanja',
  '/collection': '/kategori',
  '/about': '/tentang',
  '/size-guide': '/panduan-ukuran',
  '/how-to-order': '/cara-memesan',
  '/contact': '/kontak',
}

function App() {
  const [route, setRoute] = useState(getRoute)

  useEffect(() => {
    const handleHashChange = () => setRoute(getRoute())
    const handleInternalLink = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      const link = target.closest('a')
      const href = link?.getAttribute('href')
      if (!href?.startsWith('#/')) return

      event.preventDefault()
      const path = localizedRoutes[href.slice(1)] ?? href.slice(1)
      window.history.pushState({}, '', path)
      setRoute(getRoute())
    }

    window.addEventListener('popstate', handleHashChange)
    document.addEventListener('click', handleInternalLink)
    return () => {
      window.removeEventListener('popstate', handleHashChange)
      document.removeEventListener('click', handleInternalLink)
    }
  }, [])

  switch (route) {
    case 'belanja':
    case 'shop': return <ShopPage />
    case 'kategori': return <CategoryPage />
    case 'koleksi':
    case 'collection': return <CollectionPage />
    case 'tentang':
    case 'about': return <AboutPage />
    case 'panduan-ukuran':
    case 'size-guide': return <SizeGuidePage />
    case 'cara-memesan':
    case 'how-to-order': return <HowToOrderPage />
    case 'kontak':
    case 'contact': return <ContactPage />
    default: return <HomePage />
  }
}

export default App
