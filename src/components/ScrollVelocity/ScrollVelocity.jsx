import { useEffect, useRef, useState } from 'react'
import './ScrollVelocity.css'

export default function ScrollVelocity({ text, baseVelocity = 2, scrollVelocityFactor = 3 }) {
  const scrollerRef = useRef(null)
  const [currentX, setCurrentX] = useState(0)
  const velocityRef = useRef(0)
  const lastScrollYRef = useRef(0)
  const directionFactorRef = useRef(1)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      const delta = currentScrollY - lastScrollYRef.current

      if (delta !== 0) {
        velocityRef.current += delta * (scrollVelocityFactor / 100)
        directionFactorRef.current = delta > 0 ? 1 : -1
      }
      lastScrollYRef.current = currentScrollY
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [scrollVelocityFactor])

  useEffect(() => {
    let animationFrameId
    const loop = () => {
      const el = scrollerRef.current
      if (!el) return

      velocityRef.current *= 0.9 // Dampen impulse velocity
      const deltaMove = baseVelocity + velocityRef.current

      setCurrentX(prevX => {
        let nextX = prevX - deltaMove
        const containerWidth = el.scrollWidth
        const itemWidth = containerWidth / 4

        if (itemWidth > 0) {
          if (nextX <= -itemWidth) {
            nextX += itemWidth
          } else if (nextX > 0) {
            nextX -= itemWidth
          }
        }
        return nextX
      })

      animationFrameId = requestAnimationFrame(loop)
    }

    animationFrameId = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(animationFrameId)
  }, [baseVelocity])

  return (
    <section className="parallax">
      <div
        className="scroller"
        ref={scrollerRef}
        style={{ transform: `translateX(${currentX}px)` }}
      >
        <span className="scroller-text">{text}&nbsp;</span>
        <span className="scroller-text">{text}&nbsp;</span>
        <span className="scroller-text">{text}&nbsp;</span>
        <span className="scroller-text">{text}&nbsp;</span>
      </div>
    </section>
  )
}
