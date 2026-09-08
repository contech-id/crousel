import { useEffect } from 'react'

import AOS from 'aos'
import 'aos/dist/aos.css'

let aosInitialized = false

export function useScrollAnimation() {
  useEffect(() => {
    if (!aosInitialized) {
      AOS.init({
        duration: 700,
        easing: 'ease-out-cubic',
        offset: 80,
        once: true,
        disable: () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      })
      aosInitialized = true
    }

    const refresh = window.setTimeout(() => AOS.refreshHard(), 0)
    return () => window.clearTimeout(refresh)
  }, [])
}
