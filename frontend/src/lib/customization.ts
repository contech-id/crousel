export type StoreCustomization = {
  secondary_color: string
  hero_image: string | null
  size_guide_image: string | null
  about_image: string | null
  story_images: Array<string | null>
}

export const defaultCustomization: StoreCustomization = {
  secondary_color: '#fbbc03',
  hero_image: null,
  size_guide_image: null,
  about_image: null,
  story_images: [null, null, null, null, null],
}
