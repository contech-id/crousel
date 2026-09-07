import { useEffect } from 'react'

import AOS from 'aos'
import 'aos/dist/aos.css'

const ignoredTags = new Set(['SCRIPT', 'STYLE', 'LINK', 'META', 'NOSCRIPT', 'TITLE', 'OPTION'])
let aosInitialized = false

/**
 * Applies AOS to every rendered HTML element. A MutationObserver keeps newly
 * rendered route content covered as well.
 */
export function useScrollAnimation() {
  useEffect(() => {
    const root = document.getElementById('root')

    if (!root) return

    if (!aosInitialized) {
      AOS.init({
        duration: 650,
        easing: 'ease-out-cubic',
        offset: 80,
        once: false,
        mirror: true,
        disableMutationObserver: true,
        disable: () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      })
      aosInitialized = true
    }

    const animatedElements = new Set<HTMLElement>()
    const sectionOrder = new WeakMap<Element, number>()

    const observeElements = () => {
      root.querySelectorAll<HTMLElement>('*').forEach((element) => {
        if (ignoredTags.has(element.tagName) || element.closest('header') || element.closest('[data-scroll-stack]') || element.closest('[data-scroll-static]') || element.dataset.aos) return

        const siblingIndex = element.parentElement
          ? Array.from(element.parentElement.children).indexOf(element)
          : 0
        const isCard = element.tagName === 'ARTICLE' || (element.parentElement?.classList.contains('grid') && element.tagName === 'A')
        const section = element.closest('section, footer, header, main') ?? root
        const sectionIndex = sectionOrder.get(section) ?? 0

        element.dataset.aos = 'fade-up'
        element.dataset.aosDelay = String(((isCard ? siblingIndex : sectionIndex) % 7) * 100)
        animatedElements.add(element)
        sectionOrder.set(section, sectionIndex + 1)
      })
      AOS.refreshHard()
    }

    observeElements()
    const mutationObserver = new MutationObserver(observeElements)
    mutationObserver.observe(root, { childList: true, subtree: true })

    return () => {
      mutationObserver.disconnect()
      animatedElements.forEach((element) => {
        delete element.dataset.aos
        element.classList.remove('aos-init', 'aos-animate')
      })
    }
  }, [])
}
