export type ProductTarget = 'Women' | 'Men' | 'Unisex' | 'Kids'

export type Product = {
  id: number
  slug: string
  name: string
  category: string
  target: string
  color: string
  availableColors: string[]
  images: string[]
  description: string
  price: string
  features: string[]
  availableSizes: string[]
  availability: string
}

export const products: readonly Product[] = [
  {
    id: 1,
    slug: 'luna-sandal',
    name: 'Luna Sandal',
    category: 'Sandal Slide Women',
    target: 'Women',
    color: 'Sand Beige',
    availableColors: ['Sand Beige', 'Jet Black', 'Cloud White'],
    images: [
      'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1562273138-f46be4ebdf33?auto=format&fit=crop&w=900&q=85',
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=900&q=85',
    ],
    description:
      'Luna menghadirkan langkah santai yang tetap terlihat rapi. Bantalan empuk dan desain clean membuatnya mudah dipadukan dari rumah hingga hangout.',
    price: 'Rp249.000',
    features: [
      'Hand Made Crafting',
      'Crousel Embossed Logo',
      'Premium Synthetic Leather',
      'True Fit to Feet',
      'Solid Color',
      'Crousel Sole',
      'Bantalan empuk pada insole',
    ],
    availableSizes: ['36', '37', '38', '39', '40'],
    availability: 'Tersedia',
  },
  {
    id: 2,
    slug: 'milo-sandal',
    name: 'Milo Sandal',
    category: 'Sandal Slop Unisex',
    target: 'Unisex',
    color: 'Slate Blue',
    availableColors: ['Slate Blue', 'Jet Black', 'Stone Grey'],
    images: [
      'https://images.unsplash.com/photo-1603487742131-4160ec999306?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&w=900&q=85',
      'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=900&q=85',
    ],
    description:
      'Milo dirancang sebagai teman harian yang praktis. Bentuknya kokoh, nyaman, dan punya karakter unisex yang mudah masuk ke berbagai gaya.',
    price: 'Rp279.000',
    features: [
      'Hand Made Crafting',
      'Crousel Embossed Logo',
      'Premium Synthetic Leather',
      'True Fit to Feet',
      'Solid Color',
      'Crousel Sole',
    ],
    availableSizes: ['39', '40', '41', '42', '43', '44'],
    availability: 'Tersedia',
  },
  {
    id: 3,
    slug: 'ayla-sandal',
    name: 'Ayla Sandal',
    category: 'Sandal Slide Unisex',
    target: 'Unisex',
    color: 'Mauve Lilac',
    availableColors: ['Mauve Lilac', 'Cloud White', 'Jet Black'],
    images: [
      'https://images.unsplash.com/photo-1575537302964-96cd47c06b1b?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=900&q=85',
      'https://images.unsplash.com/photo-1534653299134-96a171b61581?auto=format&fit=crop&w=900&q=85',
    ],
    description:
      'Ayla menyatukan nuansa playful dengan kenyamanan yang bisa diandalkan. Profilnya ringan untuk dipakai sepanjang hari, kapan pun dibutuhkan.',
    price: 'Rp259.000',
    features: [
      'Hand Made Crafting',
      'Crousel Embossed Logo',
      'Premium Synthetic Leather',
      'True Fit to Feet',
      'Solid Color',
      'Crousel Sole',
    ],
    availableSizes: ['36', '37', '38', '39', '40', '41', '42'],
    availability: 'Tersedia',
  },
  {
    id: 4,
    slug: 'kiko-kids',
    name: 'Kiko Kids',
    category: 'Sandal Kids',
    target: 'Kids',
    color: 'Honey Tan',
    availableColors: ['Honey Tan', 'Sky Blue', 'Rose Pink'],
    images: [
      'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1514989940723-e8e51635b782?auto=format&fit=crop&w=900&q=85',
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=85',
    ],
    description:
      'Kiko dibuat untuk hari-hari penuh gerak. Strap yang mudah diatur dan sol fleksibel membantu si kecil tetap nyaman saat bermain.',
    price: 'Rp189.000',
    features: [
      'Hand Made Crafting',
      'Crousel Embossed Logo',
      'Premium Synthetic Leather',
      'True Fit to Feet',
      'Solid Color',
      'Crousel Sole',
      'Bantalan empuk pada insole',
    ],
    availableSizes: ['28', '29', '30', '31', '32', '33'],
    availability: 'Tersedia',
  },
  {
    id: 5,
    slug: 'sora-wedges',
    name: 'Sora Wedges',
    category: 'Sandal Wedges Women',
    target: 'Women',
    color: 'Dusty Rose',
    availableColors: ['Dusty Rose', 'Sand Beige', 'Jet Black'],
    images: [
      'https://images.unsplash.com/photo-1515347619252-60a4bf4fff4f?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=900&q=85',
      'https://images.unsplash.com/photo-1534653299134-96a171b61581?auto=format&fit=crop&w=900&q=85',
    ],
    description:
      'Sora memberi sedikit elevasi tanpa mengorbankan kenyamanan. Bentuk strap yang clean membuatnya cocok untuk tampilan kasual hingga semi-formal.',
    price: 'Rp329.000',
    features: [
      'Hand Made Crafting',
      'Crousel Embossed Logo',
      'Premium Synthetic Leather',
      'True Fit to Feet',
      'Solid Color',
      'Crousel Sole',
      'Tinggi wedges 5 cm',
    ],
    availableSizes: ['36', '37', '38', '39', '40'],
    availability: 'Tersedia',
  },
]

export function getProductBySlug(slug: string) {
  return products.find((product) => product.slug === slug)
}
