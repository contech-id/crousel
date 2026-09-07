import { useCallback, useLayoutEffect, useRef, type ReactNode } from 'react'
import Lenis from 'lenis'

import './ScrollStack.css'

type ScrollStackItemProps = {
  children: ReactNode
  itemClassName?: string
}

export function ScrollStackItem({ children, itemClassName = '' }: ScrollStackItemProps) {
  return <div className={`scroll-stack-card ${itemClassName}`.trim()}>{children}</div>
}

type ScrollStackProps = {
  children: ReactNode
  className?: string
  itemDistance?: number
  itemScale?: number
  itemStackDistance?: number
  stackPosition?: string
  scaleEndPosition?: string
  baseScale?: number
  rotationAmount?: number
  blurAmount?: number
  useWindowScroll?: boolean
  onStackComplete?: () => void
}

type ScrollData = { scrollTop: number; containerHeight: number }
type CardTransform = { translateY: number; scale: number; rotation: number; blur: number }

export function ScrollStack({
  children,
  className = '',
  itemDistance = 100,
  itemScale = 0.03,
  itemStackDistance = 30,
  stackPosition = '20%',
  scaleEndPosition = '10%',
  baseScale = 0.85,
  rotationAmount = 0,
  blurAmount = 0,
  useWindowScroll = true,
  onStackComplete,
}: ScrollStackProps) {
  const scrollerRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<HTMLDivElement[]>([])
  const animationFrameRef = useRef<number | null>(null)
  const lastTransformsRef = useRef(new Map<number, CardTransform>())
  const stackCompletedRef = useRef(false)
  const isUpdatingRef = useRef(false)

  const calculateProgress = useCallback((scrollTop: number, start: number, end: number) => {
    if (scrollTop < start) return 0
    if (scrollTop > end) return 1
    return (scrollTop - start) / (end - start)
  }, [])

  const parsePercentage = useCallback((value: string, containerHeight: number) => {
    return value.includes('%') ? (parseFloat(value) / 100) * containerHeight : parseFloat(value)
  }, [])

  const getScrollData = useCallback((): ScrollData => {
    if (useWindowScroll) return { scrollTop: window.scrollY, containerHeight: window.innerHeight }
    const scroller = scrollerRef.current
    return { scrollTop: scroller?.scrollTop ?? 0, containerHeight: scroller?.clientHeight ?? window.innerHeight }
  }, [useWindowScroll])

  const getElementOffset = useCallback((element: HTMLElement) => {
    if (!useWindowScroll) return element.offsetTop

    // Use layout offsets instead of getBoundingClientRect so the transform we
    // apply to a card never feeds back into the next frame's calculations.
    let offset = 0
    let current: HTMLElement | null = element
    while (current) {
      offset += current.offsetTop
      current = current.offsetParent as HTMLElement | null
    }
    return offset
  }, [useWindowScroll])

  const updateCardTransforms = useCallback(() => {
    if (!cardsRef.current.length || isUpdatingRef.current) return
    isUpdatingRef.current = true

    const { scrollTop, containerHeight } = getScrollData()
    const stackPositionPx = parsePercentage(stackPosition, containerHeight)
    const scaleEndPositionPx = parsePercentage(scaleEndPosition, containerHeight)
    const endElement = scrollerRef.current?.querySelector<HTMLElement>('.scroll-stack-end')
    const endElementTop = endElement ? getElementOffset(endElement) : 0
    const nextTransforms = new Map<number, CardTransform>()

    cardsRef.current.forEach((card, index) => {
      const cardTop = getElementOffset(card)
      const triggerStart = cardTop - stackPositionPx - itemStackDistance * index
      const triggerEnd = cardTop - scaleEndPositionPx
      const pinEnd = endElementTop - containerHeight / 2
      const scaleProgress = calculateProgress(scrollTop, triggerStart, triggerEnd)
      const targetScale = baseScale + index * itemScale
      const scale = 1 - scaleProgress * (1 - targetScale)
      const rotation = rotationAmount ? index * rotationAmount * scaleProgress : 0
      let blur = 0

      if (blurAmount) {
        let topCardIndex = 0
        cardsRef.current.forEach((otherCard, otherIndex) => {
          const otherTop = getElementOffset(otherCard)
          const otherStart = otherTop - stackPositionPx - itemStackDistance * otherIndex
          if (scrollTop >= otherStart) topCardIndex = otherIndex
        })
        if (index < topCardIndex) blur = (topCardIndex - index) * blurAmount
      }

      let translateY = 0
      if (scrollTop >= triggerStart && scrollTop <= pinEnd) {
        translateY = scrollTop - cardTop + stackPositionPx + itemStackDistance * index
      } else if (scrollTop > pinEnd) {
        translateY = pinEnd - cardTop + stackPositionPx + itemStackDistance * index
      }

      const nextTransform: CardTransform = {
        translateY: Math.round(translateY * 100) / 100,
        scale: Math.round(scale * 1000) / 1000,
        rotation: Math.round(rotation * 100) / 100,
        blur: Math.round(blur * 100) / 100,
      }
      const previousTransform = lastTransformsRef.current.get(index)
      const hasChanged = !previousTransform
        || Math.abs(previousTransform.translateY - nextTransform.translateY) > 0.1
        || Math.abs(previousTransform.scale - nextTransform.scale) > 0.001
        || Math.abs(previousTransform.rotation - nextTransform.rotation) > 0.1
        || Math.abs(previousTransform.blur - nextTransform.blur) > 0.1

      if (hasChanged) {
        card.style.transform = `translate3d(0, ${nextTransform.translateY}px, 0) scale(${nextTransform.scale}) rotate(${nextTransform.rotation}deg)`
        card.style.filter = nextTransform.blur ? `blur(${nextTransform.blur}px)` : ''
      }
      nextTransforms.set(index, nextTransform)

      if (index === cardsRef.current.length - 1) {
        const isInView = scrollTop >= triggerStart && scrollTop <= pinEnd
        if (isInView && !stackCompletedRef.current) {
          stackCompletedRef.current = true
          onStackComplete?.()
        } else if (!isInView) {
          stackCompletedRef.current = false
        }
      }
    })

    lastTransformsRef.current = nextTransforms
    isUpdatingRef.current = false
  }, [baseScale, blurAmount, calculateProgress, getElementOffset, getScrollData, itemScale, itemStackDistance, onStackComplete, parsePercentage, rotationAmount, scaleEndPosition, stackPosition])

  useLayoutEffect(() => {
    const scroller = scrollerRef.current
    if (!scroller) return

    cardsRef.current = Array.from(scroller.querySelectorAll<HTMLDivElement>('.scroll-stack-card'))
    cardsRef.current.forEach((card, index) => {
      if (index < cardsRef.current.length - 1) card.style.marginBottom = `${itemDistance}px`
      card.style.willChange = 'transform, filter'
      card.style.transformOrigin = 'top center'
      card.style.backfaceVisibility = 'hidden'
      card.style.transformStyle = 'preserve-3d'
      card.style.transform = 'translateZ(0)'
    })

    let lenis: Lenis | null = null
    let scrollFrame: number | null = null
    const handleScroll = () => {
      if (scrollFrame !== null) return
      scrollFrame = requestAnimationFrame(() => {
        scrollFrame = null
        updateCardTransforms()
      })
    }

    if (useWindowScroll) {
      window.addEventListener('scroll', handleScroll, { passive: true })
      window.addEventListener('resize', handleScroll)
    } else {
      lenis = new Lenis({
        wrapper: scroller,
        content: scroller.querySelector('.scroll-stack-inner') ?? undefined,
        duration: 1.2,
        easing: (value: number) => Math.min(1, 1.001 - 2 ** (-10 * value)),
        smoothWheel: true,
        touchMultiplier: 2,
        infinite: false,
        lerp: 0.1,
      })
      lenis.on('scroll', handleScroll)
    }

    if (lenis) {
      const raf = (time: number) => {
        lenis?.raf(time)
        animationFrameRef.current = requestAnimationFrame(raf)
      }
      animationFrameRef.current = requestAnimationFrame(raf)
    }
    updateCardTransforms()

    return () => {
      if (animationFrameRef.current !== null) cancelAnimationFrame(animationFrameRef.current)
      if (scrollFrame !== null) cancelAnimationFrame(scrollFrame)
      if (lenis) {
        lenis.off('scroll', handleScroll)
        lenis.destroy()
      }
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
      cardsRef.current = []
      lastTransformsRef.current.clear()
      stackCompletedRef.current = false
      isUpdatingRef.current = false
    }
  }, [itemDistance, updateCardTransforms, useWindowScroll])

  return (
    <div ref={scrollerRef} className={`scroll-stack-scroller ${useWindowScroll ? 'scroll-stack-window' : ''} ${className}`.trim()}>
      <div className="scroll-stack-inner">
        {children}
        <div className="scroll-stack-end" />
      </div>
    </div>
  )
}
