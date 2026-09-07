/**
 * Size charts are kept as data so the same source can be reused by the
 * landing-page section and the full size-guide page (and, later, linked to a
 * product or variant from the catalog).
 */
export type SizeGuideType = 'women' | 'unisex' | 'kids'

export type SizeGuideRow = {
  size: string
  sandalLength: string
  footLength: string
}

export type SizeGuide = {
  label: string
  title: string
  rows: readonly SizeGuideRow[]
}

export const sizeGuideTypes: readonly SizeGuideType[] = ['women', 'unisex', 'kids']

export const sizeGuides: Record<SizeGuideType, SizeGuide> = {
  women: {
    label: 'Women',
    title: 'Women Slide',
    rows: [
      { size: '36', sandalLength: '24 cm', footLength: '23 cm' },
      { size: '37', sandalLength: '24,5 cm', footLength: '23,5 cm' },
      { size: '38', sandalLength: '25 cm', footLength: '24 cm' },
      { size: '39', sandalLength: '25,5 cm', footLength: '24,5 cm' },
      { size: '40', sandalLength: '26 cm', footLength: '25 cm' },
      { size: '41', sandalLength: '26,5 cm', footLength: '25,5 cm' },
      { size: '42', sandalLength: '27 cm', footLength: '26 cm' },
    ],
  },
  unisex: {
    label: 'Unisex',
    title: 'Unisex Slide / Slop',
    rows: [
      { size: '36', sandalLength: '23 cm', footLength: '22 cm' },
      { size: '37', sandalLength: '24 cm', footLength: '23 cm' },
      { size: '38', sandalLength: '25 cm', footLength: '24 cm' },
      { size: '39', sandalLength: '25,5 cm', footLength: '24,5 cm' },
      { size: '40', sandalLength: '26 cm', footLength: '25 cm' },
      { size: '41', sandalLength: '27 cm', footLength: '26 cm' },
      { size: '42', sandalLength: '27,5 cm', footLength: '26,5 cm' },
      { size: '43', sandalLength: '28 cm', footLength: '27 cm' },
      { size: '44', sandalLength: '29 cm', footLength: '28 cm' },
      { size: '45', sandalLength: '29,4 cm', footLength: '28,4 cm' },
    ],
  },
  kids: {
    label: 'Kids',
    title: 'Kids',
    rows: [
      { size: '26', sandalLength: '17,5 cm', footLength: '16,5 cm' },
      { size: '27', sandalLength: '18 cm', footLength: '17 cm' },
      { size: '28', sandalLength: '18,5 cm', footLength: '17,5 cm' },
      { size: '29', sandalLength: '19 cm', footLength: '18 cm' },
      { size: '30', sandalLength: '19,5 cm', footLength: '18,5 cm' },
      { size: '31', sandalLength: '20 cm', footLength: '19 cm' },
      { size: '32', sandalLength: '20,5 cm', footLength: '19,5 cm' },
      { size: '33', sandalLength: '21 cm', footLength: '20 cm' },
      { size: '34', sandalLength: '21,5 cm', footLength: '20,5 cm' },
      { size: '35', sandalLength: '22 cm', footLength: '21 cm' },
    ],
  },
}

