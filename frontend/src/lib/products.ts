export type ProductTarget = 'Women' | 'Men' | 'Unisex' | 'Kids'

export type Product = {
  slug: string
  name: string
  category: string
  target: ProductTarget
  model: string
  color: string
  availableColors: readonly string[]
  images: readonly string[]
  shortDescription: string
  description: string
  price: string
  material: string
  features: readonly string[]
  availableSizes: readonly string[]
  sandalLength: string
  footLengthRecommendation: string
  width?: string
  wedgeHeight?: string
  packagingWeight?: string
  purchaseUrl: string
  availability: 'Tersedia' | 'Pre-order' | 'Habis'
}

export const products: readonly Product[] = [
  {
    slug: 'luna-sandal',
    name: 'Luna Sandal',
    category: 'Sandal Slide Women',
    target: 'Women',
    model: 'Luna Classic Slide',
    color: 'Sand Beige',
    availableColors: ['Sand Beige', 'Jet Black', 'Cloud White'],
    images: [
      'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1562273138-f46be4ebdf33?auto=format&fit=crop&w=900&q=85',
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=900&q=85',
    ],
    shortDescription: 'Slide ringan dengan siluet minimal untuk hari yang aktif.',
    description:
      'Luna menghadirkan langkah santai yang tetap terlihat rapi. Bantalan empuk dan desain clean membuatnya mudah dipadukan dari rumah hingga hangout.',
    price: 'Rp249.000',
    material: 'Upper kulit sintetis premium, footbed EVA, outsole karet anti-slip.',
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
    sandalLength: '24,5–26 cm',
    footLengthRecommendation: '23–25,5 cm',
    width: '9,5 cm',
    packagingWeight: '±650 g',
    purchaseUrl: 'https://shopee.co.id/crousel.official',
    availability: 'Tersedia',
  },
  {
    slug: 'milo-sandal',
    name: 'Milo Sandal',
    category: 'Sandal Slop Unisex',
    target: 'Unisex',
    model: 'Milo Everyday Slop',
    color: 'Slate Blue',
    availableColors: ['Slate Blue', 'Jet Black', 'Stone Grey'],
    images: [
      'https://images.unsplash.com/photo-1603487742131-4160ec999306?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&w=900&q=85',
      'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=900&q=85',
    ],
    shortDescription: 'Sandal slop serbaguna untuk rutinitas pria dan wanita.',
    description:
      'Milo dirancang sebagai teman harian yang praktis. Bentuknya kokoh, nyaman, dan punya karakter unisex yang mudah masuk ke berbagai gaya.',
    price: 'Rp279.000',
    material: 'Synthetic leather upper, memory foam footbed, rubber outsole.',
    features: [
      'Hand Made Crafting',
      'Crousel Embossed Logo',
      'Premium Synthetic Leather',
      'True Fit to Feet',
      'Solid Color',
      'Crousel Sole',
    ],
    availableSizes: ['39', '40', '41', '42', '43', '44'],
    sandalLength: '26–29 cm',
    footLengthRecommendation: '25–28 cm',
    width: '10,5 cm',
    packagingWeight: '±780 g',
    purchaseUrl: 'https://shopee.co.id/crousel.official',
    availability: 'Tersedia',
  },
  {
    slug: 'ayla-sandal',
    name: 'Ayla Sandal',
    category: 'Sandal Slide Unisex',
    target: 'Unisex',
    model: 'Ayla Daily Slide',
    color: 'Mauve Lilac',
    availableColors: ['Mauve Lilac', 'Cloud White', 'Jet Black'],
    images: [
      'https://images.unsplash.com/photo-1575537302964-96cd47c06b1b?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=900&q=85',
      'https://images.unsplash.com/photo-1534653299134-96a171b61581?auto=format&fit=crop&w=900&q=85',
    ],
    shortDescription: 'Slide modern dengan warna lembut dan pijakan nyaman.',
    description:
      'Ayla menyatukan nuansa playful dengan kenyamanan yang bisa diandalkan. Profilnya ringan untuk dipakai sepanjang hari, kapan pun dibutuhkan.',
    price: 'Rp259.000',
    material: 'EVA foam moulded upper dan outsole karet bertekstur.',
    features: [
      'Hand Made Crafting',
      'Crousel Embossed Logo',
      'Premium Synthetic Leather',
      'True Fit to Feet',
      'Solid Color',
      'Crousel Sole',
    ],
    availableSizes: ['36', '37', '38', '39', '40', '41', '42'],
    sandalLength: '24,5–28 cm',
    footLengthRecommendation: '23–27 cm',
    width: '10 cm',
    packagingWeight: '±620 g',
    purchaseUrl: 'https://shopee.co.id/crousel.official',
    availability: 'Tersedia',
  },
  {
    slug: 'kiko-kids',
    name: 'Kiko Kids',
    category: 'Sandal Kids',
    target: 'Kids',
    model: 'Kiko Playtime Sandal',
    color: 'Honey Tan',
    availableColors: ['Honey Tan', 'Sky Blue', 'Rose Pink'],
    images: [
      'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1514989940723-e8e51635b782?auto=format&fit=crop&w=900&q=85',
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=85',
    ],
    shortDescription: 'Sandal ceria dan aman untuk menemani petualangan si kecil.',
    description:
      'Kiko dibuat untuk hari-hari penuh gerak. Strap yang mudah diatur dan sol fleksibel membantu si kecil tetap nyaman saat bermain.',
    price: 'Rp189.000',
    material: 'Synthetic leather upper, soft EVA footbed, flexible rubber outsole.',
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
    sandalLength: '18,5–21,5 cm',
    footLengthRecommendation: '17,5–20,5 cm',
    width: '8 cm',
    packagingWeight: '±480 g',
    purchaseUrl: 'https://shopee.co.id/crousel.official',
    availability: 'Tersedia',
  },
  {
    slug: 'sora-wedges',
    name: 'Sora Wedges',
    category: 'Sandal Wedges Women',
    target: 'Women',
    model: 'Sora Everyday Wedges',
    color: 'Dusty Rose',
    availableColors: ['Dusty Rose', 'Sand Beige', 'Jet Black'],
    images: [
      'https://images.unsplash.com/photo-1515347619252-60a4bf4fff4f?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=900&q=85',
      'https://images.unsplash.com/photo-1534653299134-96a171b61581?auto=format&fit=crop&w=900&q=85',
    ],
    shortDescription: 'Wedges feminin dengan tinggi pas untuk gaya sehari-hari.',
    description:
      'Sora memberi sedikit elevasi tanpa mengorbankan kenyamanan. Bentuk strap yang clean membuatnya cocok untuk tampilan kasual hingga semi-formal.',
    price: 'Rp329.000',
    material: 'Upper kulit sintetis, insole foam, wedge dan outsole karet.',
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
    sandalLength: '24,5–26 cm',
    footLengthRecommendation: '23–25,5 cm',
    width: '9,5 cm',
    wedgeHeight: '5 cm',
    packagingWeight: '±850 g',
    purchaseUrl: 'https://shopee.co.id/crousel.official',
    availability: 'Tersedia',
  },
]

export function getProductBySlug(slug: string) {
  return products.find((product) => product.slug === slug)
}
