import { useRef, useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import './Hero.css'

const TOTAL_FRAMES = 192

const destinations = [
  { id: 1, name: 'Bali' },
  { id: 2, name: 'Paris' },
  { id: 3, name: 'Kyoto' },
  { id: 4, name: 'Santorini' },
  { id: 5, name: 'Machu Picchu' },
  { id: 6, name: 'Grand Canyon' },
  { id: 7, name: 'Swiss Alps' },
  { id: 8, name: 'Dubai' },
  { id: 9, name: 'Rome' },
  { id: 10, name: 'New York' },
  { id: 11, name: 'Cairo' }
]

// Duplicate 8x for looped scroll
const loopedDestinations = [
  ...destinations, ...destinations, ...destinations, ...destinations,
  ...destinations, ...destinations, ...destinations, ...destinations
]

function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val))
}

export default function Hero() {
  const canvasRef = useRef(null)
  const imagesRef = useRef([])
  const displayedFrameRef = useRef(1)
  const targetFrameRef = useRef(1)
  const animationIdRef = useRef(null)
  const resizeTimeoutRef = useRef(null)
  const contextRef = useRef(null)

  const [scrollProgress, setScrollProgress] = useState(0)

  // Derived animation values
  const p = scrollProgress

  // Center title
  const titleOpacity = clamp(1 - p * 7, 0, 1)
  const titleScale = 1 + p * 3
  const titleTranslateY = p * 120

  // Left heading
  const leftOpacity = clamp(1 - p * 4, 0, 1)
  const leftScale = 1 + p * 1.5
  const leftTranslateY = p * 200

  // Right heading
  const rightOpacity = clamp(1 - p * 3.5, 0, 1)
  const rightScale = 1 + p * 1.2
  const rightTranslateY = p * 180

  // Bottom left
  const bottomLeftOpacity = clamp(1 - p * 5, 0, 1)
  const bottomLeftTranslateY = p * 150

  // Bottom right
  const bottomRightOpacity = clamp(1 - p * 6, 0, 1)

  // CTA
  const ctaOpacity = clamp(1 - p * 8, 0, 1)
  const ctaTranslateY = p * 100

  // Destinations list
  const destContainerOpacity = p < 0.30 ? 0 : clamp((p - 0.30) * 8, 0, 1)
  const phaseProgress = clamp((p - 0.30) / 0.70, 0, 1)
  const destTranslateY = 300 - (phaseProgress * 6000)

  // Discover button
  const discoverBtnOpacity = p < 0.65 ? 0 : clamp((p - 0.65) * 6, 0, 1)

  const drawFrame = useCallback((frameIndex) => {
    const ctx = contextRef.current
    const canvas = canvasRef.current
    if (!ctx || !canvas) return
    const image = imagesRef.current[frameIndex - 1]
    if (image?.complete && image.naturalWidth !== 0) {
      const ratio = Math.max(canvas.width / image.width, canvas.height / image.height)
      const cx = (canvas.width - image.width * ratio) / 2
      const cy = (canvas.height - image.height * ratio) / 2
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(image, 0, 0, image.width, image.height,
        cx, cy, image.width * ratio, image.height * ratio)
    }
  }, [])

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    contextRef.current = canvas.getContext('2d')
    resizeCanvas()

    // Preload images
    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image()
      img.src = `/home_animation_pics/${String(i).padStart(5, '0')}.png`
      if (i === 1) {
        img.onload = () => drawFrame(1)
      }
      imagesRef.current.push(img)
    }

    // Render loop
    const tick = () => {
      const gap = targetFrameRef.current - displayedFrameRef.current
      if (gap !== 0) {
        const absGap = Math.abs(gap)
        const step = absGap > 20 ? 4 : absGap > 8 ? 3 : absGap > 3 ? 2 : 1
        const direction = gap > 0 ? 1 : -1
        displayedFrameRef.current += direction * Math.min(step, absGap)
        drawFrame(displayedFrameRef.current)
      }
      animationIdRef.current = requestAnimationFrame(tick)
    }
    animationIdRef.current = requestAnimationFrame(tick)

    // Scroll listener
    const handleScroll = () => {
      const heroContainer = document.querySelector('.hero-scroll-container')
      if (!heroContainer) return
      const scrollableDist = heroContainer.scrollHeight - window.innerHeight
      if (scrollableDist <= 0) return
      const fraction = clamp(window.scrollY / scrollableDist, 0, 1)
      setScrollProgress(fraction)
      targetFrameRef.current = clamp(Math.floor(fraction * TOTAL_FRAMES) + 1, 1, TOTAL_FRAMES)
    }

    // Resize listener
    const handleResize = () => {
      clearTimeout(resizeTimeoutRef.current)
      resizeTimeoutRef.current = setTimeout(() => {
        resizeCanvas()
        drawFrame(displayedFrameRef.current)
      }, 100)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleResize)
      if (animationIdRef.current) cancelAnimationFrame(animationIdRef.current)
      clearTimeout(resizeTimeoutRef.current)
    }
  }, [drawFrame, resizeCanvas])

  return (
    <section className="hero-scroll-container">
      <div className="sticky-canvas-container">
        <canvas ref={canvasRef}></canvas>

        {/* Black vignette overlays */}
        <div className="vignette-left" style={{ opacity: destContainerOpacity }}></div>
        <div className="vignette-right" style={{ opacity: destContainerOpacity }}></div>

        {/* Vertical Destinations list */}
        <div
          className="dest-list-container"
          style={{
            opacity: destContainerOpacity,
            visibility: destContainerOpacity === 0 ? 'hidden' : 'visible'
          }}
        >
          <div className="dest-list" style={{ transform: `translateY(${destTranslateY}px)` }}>
            {loopedDestinations.map((dest, idx) => (
              <div key={idx} className="dest-list-item">
                <span className="dest-list-label">{dest.name}</span>
                <Link to={`/destinations/${dest.id}`} className="dest-explore-btn">Explore</Link>
              </div>
            ))}
          </div>
        </div>

        {/* Discover More */}
        <div
          className="discover-more-container"
          style={{
            opacity: discoverBtnOpacity,
            visibility: discoverBtnOpacity === 0 ? 'hidden' : 'visible'
          }}
        >
          <Link to="/destinations" className="discover-more-link">Discover<br /><em>more</em></Link>
        </div>
      </div>

      {/* Text overlay */}
      <div className="scroll-content">
        <div className="hero-viewport">

          {/* CENTER: ELEVÉ title */}
          <div
            className="hero-center-title"
            style={{
              opacity: titleOpacity,
              transform: `translate(-50%, -50%) scale(${titleScale}) translateY(${titleTranslateY}px)`
            }}
          >
            <span className="center-title-text">ELEVÉ</span>
          </div>

          {/* LEFT: Main heading */}
          <div
            className="hero-text-left"
            style={{
              opacity: leftOpacity,
              transform: `scale(${leftScale}) translateY(${leftTranslateY}px)`
            }}
          >
            <h1 className="hero-large-text">We are<br /><em>exploration</em></h1>
          </div>

          {/* RIGHT: Secondary heading */}
          <div
            className="hero-text-right"
            style={{
              opacity: rightOpacity,
              transform: `scale(${rightScale}) translateY(${rightTranslateY}px)`
            }}
          >
            <h1 className="hero-large-text">We are<br /><em>distinction</em></h1>
          </div>

          {/* BOTTOM LEFT: Tagline & description */}
          <div
            className="hero-text-bottom-left"
            style={{
              opacity: bottomLeftOpacity,
              transform: `translateY(${bottomLeftTranslateY}px)`
            }}
          >
            <h3 className="hero-tagline">Your freedom to<br />explore the cosmos</h3>
            <p className="hero-desc">
              Every journey is designed around your comfort, time, and ambitions — so you can focus on what truly
              matters, while we take care of everything&nbsp;else.
            </p>
          </div>

          {/* BOTTOM RIGHT: Scroll hint */}
          <div className="hero-text-bottom-right" style={{ opacity: bottomRightOpacity }}>
            <div className="scroll-cue">
              <span className="scroll-cue-arrow">↓</span>
              <span className="scroll-cue-label">SCROLL DOWN</span>
              <span className="scroll-cue-sub">TO START THE JOURNEY</span>
            </div>
          </div>

          {/* BOTTOM CENTER: CTA Button */}
          <div
            className="hero-cta-center"
            style={{
              opacity: ctaOpacity,
              transform: `translateX(-50%) translateY(${ctaTranslateY}px)`
            }}
          >
            <Link to="/book-tour" className="cta-btn">
              <span className="cta-label">Book a Tour</span>
              <span className="cta-icon-circle">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="white" viewBox="0 0 16 16">
                  <path d="M6.428 1.151C6.708.591 7.213 0 8 0s1.292.592 1.572 1.151C9.861 1.73 10 2.431 10 3v3.691l5.17 2.585a1.5 1.5 0 0 1 .83 1.342V12a.5.5 0 0 1-.582.493l-5.507-.918-.375 2.253 1.318 1.318A.5.5 0 0 1 10.5 16h-5a.5.5 0 0 1-.354-.854l1.319-1.318-.376-2.253-5.507.918A.5.5 0 0 1 0 12v-1.382a1.5 1.5 0 0 1 .83-1.342L6 6.691V3c0-.568.14-1.271.428-1.849Z" />
                </svg>
              </span>
            </Link>
          </div>

        </div>

        {/* Subsequent viewports (scroll space) */}
        <div className="hero-viewport"></div>
        <div className="hero-viewport"></div>
      </div>
    </section>
  )
}
