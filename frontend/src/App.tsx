import { useEffect, useState } from 'react'

import { AppLoadingSkeleton } from '@/components/templates/AppLoadingSkeleton'

import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { CartProvider } from '@/hooks/useCart'
import { AuthProvider } from '@/hooks/useAuth'
import { defaultCustomization, type StoreCustomization } from '@/lib/customization'
import { AboutPage } from '@/pages/AboutPage'
import { CollectionPage } from '@/pages/CollectionPage'
import { ContactPage } from '@/pages/ContactPage'
import { CategoryPage } from '@/pages/CategoryPage'

import { CartPage } from '@/pages/CartPage'
import { CheckoutPage } from '@/pages/CheckoutPage'
import { HomePage } from '@/pages/HomePage'
import { HowToOrderPage } from '@/pages/HowToOrderPage'
import { LoginPage } from '@/pages/LoginPage'
import { ProductDetailPage } from '@/pages/ProductDetailPage'
import { PaymentPage } from '@/pages/PaymentPage'
import { ProfilePage } from '@/pages/ProfilePage'
import { RegisterPage } from '@/pages/RegisterPage'
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
  '/payment': '/pembayaran',
}

function App() {
  useScrollAnimation()
  const [route, setRoute] = useState(getRoute)
  const [isInitializing, setIsInitializing] = useState(true)
  const [customization, setCustomization] = useState<StoreCustomization>(defaultCustomization)

  useEffect(() => {
    const API_URL = import.meta.env.VITE_API_URL
    const controller = new AbortController()
    let active = true

    fetch(`${API_URL}/settings/customization`, {
      headers: { Accept: 'application/json' },
      signal: controller.signal,
    })
      .then((response) => {
        if (!response.ok) throw new Error('Gagal memuat tema')
        return response.json()
      })
      .then((payload: { data?: Partial<StoreCustomization> }) => {
        if (active) {
          const next = { ...defaultCustomization, ...payload.data, story_images: payload.data?.story_images ?? defaultCustomization.story_images }
          setCustomization(next)
          document.documentElement.style.setProperty('--secondary', next.secondary_color)
        }
      })
      .catch(() => undefined)
      .finally(() => {
        if (active) setIsInitializing(false)
      })

    return () => {
      active = false
      controller.abort()
    }
  }, [])

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

  let page

  if (route.startsWith('produk/')) {
    const productId = decodeURIComponent(route.slice('produk/'.length))
    page = <ProductDetailPage key={productId} id={productId} />
  } else {
    switch (route) {
      case 'belanja':
      case 'shop': page = <ShopPage />; break
      case 'kategori': page = <CategoryPage />; break
      case 'koleksi':
      case 'collection': page = <CollectionPage />; break
      case 'tentang':
      case 'about': page = <AboutPage />; break
      case 'panduan-ukuran':
      case 'size-guide': page = <SizeGuidePage customization={customization} />; break
      case 'cara-memesan':
      case 'how-to-order': page = <HowToOrderPage />; break
      case 'kontak':
      case 'contact': page = <ContactPage />; break
      case 'keranjang':
      case 'cart': page = <CartPage />; break
      case 'checkout': page = <CheckoutPage />; break
      case 'pembayaran':
      case 'payment': page = <PaymentPage />; break
      case 'login': page = <LoginPage />; break
      case 'daftar':
      case 'register': page = <RegisterPage />; break
      case 'profil':
      case 'profile': page = <ProfilePage />; break
      default: page = <HomePage customization={customization} />
    }
  }

  if (isInitializing) {
    return <AppLoadingSkeleton />
  }

  return <AuthProvider><CartProvider>{page}</CartProvider></AuthProvider>
}

export default App
