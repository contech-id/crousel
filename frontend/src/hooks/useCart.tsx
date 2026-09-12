import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

import type { Product } from '@/lib/products'
import { useAuth } from '@/hooks/useAuth'

export type CartItem = {
  id: string
  product: Product
  size: string
  color: string
  quantity: number
  remoteId?: number
}

type CartContextValue = {
  items: readonly CartItem[]
  itemCount: number
  subtotal: number
  addToCart: (product: Product, size: string, color: string) => void
  updateQuantity: (id: string, quantity: number) => void
  removeFromCart: (id: string) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextValue | null>(null)
const storageKey = 'crousel-cart'

function readStoredItems(): CartItem[] {
  try {
    const stored = window.localStorage.getItem(storageKey)
    if (!stored) return []
    const parsed: unknown = JSON.parse(stored)
    return Array.isArray(parsed) ? (parsed as CartItem[]) : []
  } catch {
    return []
  }
}

// eslint-disable-next-line react-refresh/only-export-components
export function priceToNumber(price: string) {
  return Number(price.replace(/[^\d]/g, ''))
}

// eslint-disable-next-line react-refresh/only-export-components
export function formatPrice(value: number) {
  return `Rp${new Intl.NumberFormat('id-ID').format(value)}`
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(readStoredItems)
  const { isAuthenticated } = useAuth()
  const token = window.localStorage.getItem('crousel-api-token')
  const apiUrl = import.meta.env.VITE_API_URL

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(items))
  }, [items])

  useEffect(() => {
    if (!isAuthenticated || !token) return
    const controller = new AbortController()
    fetch(`${apiUrl}/cart`, {
      headers: { Accept: 'application/json', Authorization: `Bearer ${token}` },
      signal: controller.signal,
    })
      .then(async (response) => {
        if (!response.ok) throw new Error('Gagal memuat keranjang')
        return response.json() as Promise<{ data?: { items?: Array<{ id: number; product: Product; size: string; color: string; quantity: number }> } }>
      })
      .then((payload) => {
        if (controller.signal.aborted) return
        const serverItems = (payload.data?.items ?? []).map((item) => ({
          id: `${item.product.id}-${item.size}-${item.color}`,
          remoteId: item.id,
          product: item.product,
          size: item.size,
          color: item.color,
          quantity: item.quantity,
        }))
        setItems(serverItems)
      })
      .catch(() => undefined)
    return () => controller.abort()
  }, [apiUrl, isAuthenticated, token])

  const value = useMemo<CartContextValue>(() => {
    const itemCount = items.reduce((total, item) => total + item.quantity, 0)
    const subtotal = items.reduce(
      (total, item) => total + priceToNumber(item.product.price) * item.quantity,
      0,
    )

    return {
      items,
      itemCount,
      subtotal,
      addToCart: (product, size, color) => {
        const id = `${product.id}-${size}-${color}`
        setItems((currentItems) => {
          const existing = currentItems.find((item) => item.id === id)
          if (existing) {
            return currentItems.map((item) =>
              item.id === id ? { ...item, quantity: item.quantity + 1 } : item,
            )
          }

          return [...currentItems, { id, product, size, color, quantity: 1 }]
        })
        if (isAuthenticated && token) {
          void fetch(`${apiUrl}/cart`, {
            method: 'POST',
            headers: { Accept: 'application/json', 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify({ product_id: product.id, size, color, quantity: 1 }),
          }).then(async (response) => {
            if (!response.ok) return
            const payload = await response.json() as { data?: { id?: number; quantity?: number } }
            if (!payload.data?.id) return
            setItems((current) => current.map((item) => item.id === id ? { ...item, remoteId: payload.data?.id, quantity: payload.data?.quantity ?? item.quantity } : item))
          }).catch(() => undefined)
        }
      },
      updateQuantity: (id, quantity) => {
        setItems((currentItems) =>
          quantity > 0
            ? currentItems.map((item) => (item.id === id ? { ...item, quantity } : item))
            : currentItems.filter((item) => item.id !== id),
        )
        const item = items.find((entry) => entry.id === id)
        if (isAuthenticated && token && item?.remoteId) {
          if (quantity > 0) {
            void fetch(`${apiUrl}/cart/${item.remoteId}`, {
              method: 'PATCH',
              headers: { Accept: 'application/json', 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
              body: JSON.stringify({ quantity }),
            }).catch(() => undefined)
          } else {
            void fetch(`${apiUrl}/cart/${item.remoteId}`, { method: 'DELETE', headers: { Accept: 'application/json', Authorization: `Bearer ${token}` } }).catch(() => undefined)
          }
        }
      },
      removeFromCart: (id) => {
        const item = items.find((entry) => entry.id === id)
        setItems((currentItems) => currentItems.filter((entry) => entry.id !== id))
        if (isAuthenticated && token && item?.remoteId) {
          void fetch(`${apiUrl}/cart/${item.remoteId}`, { method: 'DELETE', headers: { Accept: 'application/json', Authorization: `Bearer ${token}` } }).catch(() => undefined)
        }
      },
      clearCart: () => {
        setItems([])
        if (isAuthenticated && token) {
          void fetch(`${apiUrl}/cart`, { method: 'DELETE', headers: { Accept: 'application/json', Authorization: `Bearer ${token}` } }).catch(() => undefined)
        }
      },
    }
  }, [apiUrl, isAuthenticated, items, token])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart must be used inside CartProvider')
  return context
}
