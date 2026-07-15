import { useState, useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getDestinationById } from '../../data/destinations.js'
import './DestinationDetails.css'

export default function DestinationDetails() {
  const { id } = useParams()
  const dest = getDestinationById(id)
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const isPausedRef = useRef(false)
  const intervalRef = useRef(null)

  const transitionToImage = (index) => {
    setIsTransitioning(true)
    setTimeout(() => {
      setActiveImageIndex(index)
      requestAnimationFrame(() => setIsTransitioning(false))
    }, 500)
  }

  const nextImage = () => {
    if (!dest?.images) return
    transitionToImage((activeImageIndex + 1) % dest.images.length)
  }

  const setActiveImage = (i) => {
    if (i === activeImageIndex) return
    isPausedRef.current = true
    transitionToImage(i)
    setTimeout(() => { isPausedRef.current = false }, 5000)
  }

  useEffect(() => {
    if (!dest?.images || dest.images.length <= 1) return
    intervalRef.current = setInterval(() => {
      if (!isPausedRef.current) {
        setActiveImageIndex(prev => (prev + 1) % dest.images.length)
      }
    }, 4000)
    return () => clearInterval(intervalRef.current)
  }, [dest])

  if (!dest) {
    return (
      <div className="container py-5 mt-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }

  const activeImage = dest.images?.[activeImageIndex] || dest.imageUrl

  return (
    <div className="container py-5 mt-5">
      <div className="row g-5">
        {/* LEFT: Gallery */}
        <div className="col-lg-8">
          {/* Main Image */}
          <div
            className="gallery-container overflow-hidden mb-4"
            style={{ cursor: 'pointer', position: 'relative' }}
          >
            <img
              src={activeImage}
              alt={dest.name}
              className={`main-image w-100 h-100 object-fit-cover${isTransitioning ? ' fade-out' : ''}`}
            />
          </div>

          {/* Thumbnails */}
          <div className="thumbnail-scroll d-flex gap-3 overflow-auto pb-3">
            {dest.images?.map((img, i) => (
              <button
                key={i}
                className={`thumbnail-btn rounded-3${i === activeImageIndex ? ' active' : ''}`}
                onClick={() => setActiveImage(i)}
                aria-label={`View image ${i + 1}`}
              >
                <img src={img} alt={`Thumbnail ${i + 1}`} className="w-100 h-100 object-fit-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT: Details */}
        <div className="col-lg-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h1 className="h2 fw-bold mb-0">{dest.name}</h1>
            <span className="rating-badge">
              <i className="bi bi-star-fill me-1"></i>{dest.rating}
            </span>
          </div>
          <p className="text-muted mb-4"><i className="bi bi-geo-alt-fill me-1"></i>{dest.location}</p>
          <p className="mb-4 text-secondary">{dest.description}</p>

          {/* Highlights */}
          <h5 className="fw-bold mb-3">Highlights</h5>
          <ul className="list-unstyled d-flex flex-wrap gap-2 mb-4">
            {dest.highlights?.map(h => (
              <li key={h}><span className="highlight-tag">{h}</span></li>
            ))}
          </ul>

          {/* Tourism Info */}
          <div className="info-card p-4 mb-4">
            <div className="row g-3">
              {[
                ['DURATION', dest.duration],
                ['BEST TIME', dest.tourismInfo?.bestTimeToVisit],
                ['LANGUAGE', dest.tourismInfo?.language],
                ['CURRENCY', dest.tourismInfo?.currency]
              ].map(([label, value]) => (
                <div key={label} className="col-6">
                  <small className="text-muted d-block text-uppercase fw-bold mb-1" style={{ fontSize: '0.75rem', letterSpacing: '1px' }}>{label}</small>
                  <span className="fw-medium text-dark">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Book CTA */}
          <div className="book-cta-card d-flex align-items-center justify-content-between p-4">
            <div>
              <span className="d-block small mb-1">Starting from</span>
              <span className="h2 price-amount fw-bold mb-0">${dest.price?.toLocaleString()}</span>
              <span className="small"> / person</span>
            </div>
            <Link
              to={`/book-tour?destinationId=${dest.id}`}
              className="book-cta-btn"
            >
              Book Now
            </Link>
          </div>
        </div>
      </div>

      {/* Customer Reviews */}
      <div className="row mt-5 pt-5">
        <div className="col-12">
          <h3 className="fw-bold mb-4">Customer Reviews</h3>
          <div className="reviews-container position-relative overflow-hidden w-100">
            <div className="fade-overlay-left"></div>
            <div className="fade-overlay-right"></div>
            <div className="reviews-track d-flex gap-4">
              {/* Original + duplicate for infinite loop */}
              {[...dest.reviews, ...dest.reviews].map((review, idx) => (
                <div key={idx} className="review-card p-4 rounded-4 bg-white shadow-sm border col-md-4 flex-shrink-0">
                  <div className="d-flex align-items-center mb-3">
                    <div className="avatar-circle rounded-circle bg-light d-flex align-items-center justify-content-center me-3 fw-bold text-primary fs-5"
                      style={{ width: '50px', height: '50px' }}>
                      {review.author.charAt(0)}
                    </div>
                    <div>
                      <h6 className="fw-bold mb-0">{review.author}</h6>
                      <small className="text-muted">{review.date}</small>
                    </div>
                  </div>
                  <div className="mb-2 text-warning">
                    {[1, 2, 3, 4, 5].map(star => (
                      <i key={star} className={`bi ${star <= review.rating ? 'bi-star-fill' : 'bi-star'}`}></i>
                    ))}
                  </div>
                  <p className="text-secondary small mb-0">"{review.text}"</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
