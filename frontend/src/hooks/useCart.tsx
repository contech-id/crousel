import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

import type { Product } from '@/lib/products'

export type CartItem = {
  id: string
  product: Product
  size: string
  color: string
  quantity: number
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

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(items))
  }, [items])

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
      },
      updateQuantity: (id, quantity) => {
        setItems((currentItems) =>
          quantity > 0
            ? currentItems.map((item) => (item.id === id ? { ...item, quantity } : item))
            : currentItems.filter((item) => item.id !== id),
        )
      },
      removeFromCart: (id) => setItems((currentItems) => currentItems.filter((item) => item.id !== id)),
      clearCart: () => setItems([]),
    }
  }, [items])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart must be used inside CartProvider')
  return context
}
