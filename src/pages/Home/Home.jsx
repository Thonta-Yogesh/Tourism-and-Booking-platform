import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import Hero from '../../components/Hero/Hero.jsx'
import { getTopDestinations } from '../../data/destinations.js'
import './Home.css'

export default function Home() {
  const topDestinations = getTopDestinations(6)
  const [activeIndex, setActiveIndex] = useState(0)
  const autoScrollRef = useRef(null)

  const nextSlide = () => {
    setActiveIndex(i => (i + 1) % topDestinations.length)
  }

  const prevSlide = () => {
    setActiveIndex(i => (i === 0 ? topDestinations.length - 1 : i - 1))
    resetAutoScroll()
  }

  const handleSetActive = (i) => {
    setActiveIndex(i)
    resetAutoScroll()
  }

  const startAutoScroll = () => {
    autoScrollRef.current = setInterval(() => {
      setActiveIndex(i => (i + 1) % topDestinations.length)
    }, 3000)
  }

  const stopAutoScroll = () => {
    if (autoScrollRef.current) {
      clearInterval(autoScrollRef.current)
      autoScrollRef.current = null
    }
  }

  const resetAutoScroll = () => {
    stopAutoScroll()
    startAutoScroll()
  }

  useEffect(() => {
    startAutoScroll()
    return () => stopAutoScroll()
  }, [])

  const getCardClass = (i) => {
    const len = topDestinations.length
    if (i === activeIndex) return 'carousel-card active'
    if (i === (activeIndex === 0 ? len - 1 : activeIndex - 1)) return 'carousel-card prev'
    if (i === (activeIndex === len - 1 ? 0 : activeIndex + 1)) return 'carousel-card next'
    return 'carousel-card'
  }

  return (
    <>
      <Hero />

      {/* Curated Experiences */}
      <section className="py-5 container">
        <div className="text-center mb-5">
          <h2 className="section-title">Curated Experiences</h2>
          <div className="accent-line"></div>
        </div>

        <div className="row g-4">
          {[
            { title: 'Natural Wonders', desc: "Immerse yourself in the untamed beauty of the world's most stunning landscapes." },
            { title: 'Cultural Heritage', desc: 'Journey through history and witness the rich traditions of diverse civilizations.' },
            { title: 'Urban Escapes', desc: 'Experience the vibrant energy and sophisticated allure of global metropolises.' }
          ].map((exp) => (
            <div key={exp.title} className="col-lg-4 col-md-6">
              <div className="exp-card h-100">
                <div className="exp-info">
                  <h3>{exp.title}</h3>
                  <p>{exp.desc}</p>
                  <Link to="/activities" className="btn-text text-uppercase">Explore →</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Top Destinations */}
      <section className="top-destinations-section py-5 position-relative overflow-hidden">
        <div className="animated-bg"></div>
        <div className="container position-relative z-1">
          <div className="text-center mb-5">
            <h2 className="section-title">Top Destinations</h2>
            <div className="accent-line"></div>
          </div>

          <div className="carousel-container d-flex align-items-center justify-content-center perspective-1000">
            {topDestinations.map((dest, i) => (
              <div
                key={dest.id}
                className={getCardClass(i)}
                onClick={() => handleSetActive(i)}
              >
                <div className="card-content" onClick={() => window.location.href = `/destinations/${dest.id}`} style={{ cursor: 'pointer' }}>
                  <img src={dest.imageUrl} alt={dest.name} className="card-img" />
                  <div className="card-overlay">
                    <h3>{dest.name}</h3>
                    <p className="mb-0"><i className="bi bi-geo-alt-fill me-1"></i>{dest.location}</p>
                    {i === activeIndex && (
                      <div className="rating mt-2">
                        <i className="bi bi-star-fill"></i> {dest.rating}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Controls */}
          <div className="d-flex justify-content-center gap-3 mt-4">
            <button className="carousel-control-btn" onClick={prevSlide} aria-label="Previous destination">
              <i className="bi bi-chevron-left"></i>
            </button>
            <button className="carousel-control-btn" onClick={nextSlide} aria-label="Next destination">
              <i className="bi bi-chevron-right"></i>
            </button>
          </div>
        </div>
      </section>

      {/* Banner */}
      <section className="banner-section py-5">
        <div className="container text-center">
          <h2 className="banner-title mb-4">Ready for your next journey?</h2>
          <Link to="/book-tour" className="banner-cta-btn">
            Get in Touch
          </Link>
        </div>
      </section>
    </>
  )
}
