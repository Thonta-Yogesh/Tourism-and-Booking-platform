import { useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getDestinations } from '../../data/destinations.js'
import './Destinations.css'

const allDestinations = getDestinations()

export default function Destinations() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFilter, setSelectedFilter] = useState(null)
  const [sortOption, setSortOption] = useState('recommended')
  const [minRating, setMinRating] = useState(0)
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false)
  const [isPriceDropdownOpen, setIsPriceDropdownOpen] = useState(false)
  const [isRatingDropdownOpen, setIsRatingDropdownOpen] = useState(false)
  const [minPrice, setMinPrice] = useState(null)
  const [maxPrice, setMaxPrice] = useState(null)
  const [inputMinPrice, setInputMinPrice] = useState(null)
  const [inputMaxPrice, setInputMaxPrice] = useState(null)
  const navigate = useNavigate()

  const filteredDestinations = useMemo(() => {
    const query = searchQuery.toLowerCase()
    let result = allDestinations.filter(dest => {
      const matchesSearch = dest.name.toLowerCase().includes(query) ||
        dest.location.toLowerCase().includes(query) ||
        dest.description.toLowerCase().includes(query)
      const matchesFilter = selectedFilter ? dest.type === selectedFilter : true
      const matchesRating = dest.rating >= minRating
      const matchesMinPrice = minPrice === null || dest.price >= minPrice
      const matchesMaxPrice = maxPrice === null || dest.price <= maxPrice
      return matchesSearch && matchesFilter && matchesRating && matchesMinPrice && matchesMaxPrice
    })

    return result.sort((a, b) => {
      switch (sortOption) {
        case 'price-asc': return a.price - b.price
        case 'price-desc': return b.price - a.price
        case 'rating': return b.rating - a.rating
        case 'popularity': {
          const w = { High: 3, Medium: 2, Low: 1 }
          return w[b.popularity] - w[a.popularity]
        }
        default: {
          const s = { High: 10, Medium: 5, Low: 1 }
          return (s[b.popularity] + b.rating * 2) - (s[a.popularity] + a.rating * 2)
        }
      }
    })
  }, [searchQuery, selectedFilter, sortOption, minRating, minPrice, maxPrice])

  const sortLabel = {
    recommended: 'Recommended',
    popularity: 'Popularity',
    'price-asc': 'Price: Low to High',
    'price-desc': 'Price: High to Low',
    rating: 'Top Rated'
  }[sortOption]

  const ratingLabel = {
    0: 'All Ratings',
    4: '4.0+ ★',
    4.5: '4.5+ ★',
    4.8: '4.8+ ★'
  }[minRating]

  const handleSort = (sort) => {
    setSortOption(sort)
    setIsSortDropdownOpen(false)
  }

  const handleApplyPrice = () => {
    setMinPrice(inputMinPrice)
    setMaxPrice(inputMaxPrice)
    setIsPriceDropdownOpen(false)
  }

  const clearAllFilters = () => {
    setSearchQuery('')
    setSelectedFilter(null)
    setMinRating(0)
    setMinPrice(null)
    setMaxPrice(null)
    setIsRatingDropdownOpen(false)
    setIsPriceDropdownOpen(false)
    setIsSortDropdownOpen(false)
  }

  return (
    <div className="container py-5 mt-5">
      <div className="text-center mb-5 pt-4">
        <h1>Explore Destinations</h1>
        <p className="text-muted">Discover the world's most breathtaking places.</p>
      </div>

      {/* Centered Search Bar Container */}
      <div className="search-bar-container mb-4">
        <div className="search-wrapper">
          <i className="bi bi-search search-icon"></i>
          <input
            type="text"
            className="search-input"
            placeholder="Search destinations by name, location or details..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className="clear-search-btn" onClick={() => setSearchQuery('')} aria-label="Clear search">
              <i className="bi bi-x-lg"></i>
            </button>
          )}
        </div>
      </div>

      {/* Category Tabs (Minimal Text Links with Gold underline) */}
      <div className="category-tabs-container mb-4">
        {['All', 'Beach', 'City', 'Cultural', 'Nature', 'Mountain'].map(f => (
          <button
            key={f}
            className={`category-tab ${(f === 'All' && !selectedFilter) || selectedFilter === f ? 'active' : ''}`}
            onClick={() => setSelectedFilter(f === 'All' ? null : f)}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Refine Controls Bar (Rating, Price, Sort dropdowns) */}
      <div className="refine-bar mb-5">
        <span className="refine-label">Refine by:</span>
        <div className="refine-controls">
          {/* Rating Dropdown */}
          <div className="dropdown position-relative">
            <button
              className={`filter-pill dropdown-trigger ${minRating > 0 ? 'active' : ''}`}
              onClick={() => {
                setIsRatingDropdownOpen(v => !v)
                setIsPriceDropdownOpen(false)
                setIsSortDropdownOpen(false)
              }}
            >
              <i className="bi bi-star me-1"></i>
              {ratingLabel}
              <i className="bi bi-chevron-down ms-1 small"></i>
            </button>
            {isRatingDropdownOpen && (
              <ul className="dropdown-menu show shadow border-0 mt-2 rounded-4 overflow-hidden p-0" style={{ minWidth: '150px', right: 0, left: 'auto', zIndex: 100 }}>
                {[0, 4, 4.5, 4.8].map(r => (
                  <li key={r}>
                    <button
                      className={`dropdown-item py-2 px-3 small fw-medium ${minRating === r ? 'active-item' : ''}`}
                      onClick={() => {
                        setMinRating(r)
                        setIsRatingDropdownOpen(false)
                      }}
                    >
                      {r === 0 ? 'All Ratings' : `${r}+ ★`}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Price Dropdown */}
          <div className="dropdown position-relative">
            <button
              className={`filter-pill dropdown-trigger ${minPrice !== null || maxPrice !== null ? 'active' : ''}`}
              onClick={() => {
                if (!isPriceDropdownOpen) {
                  setInputMinPrice(minPrice)
                  setInputMaxPrice(maxPrice)
                }
                setIsPriceDropdownOpen(v => !v)
                setIsSortDropdownOpen(false)
                setIsRatingDropdownOpen(false)
              }}
            >
              <i className="bi bi-sliders me-1"></i>
              Price {minPrice !== null || maxPrice !== null ? `($${minPrice ?? 0}-${maxPrice ?? 'Any'})` : ''}
              <i className="bi bi-chevron-down ms-1 small"></i>
            </button>
            {isPriceDropdownOpen && (
              <div className="dropdown-menu show shadow border-0 mt-2 rounded-4 p-3" style={{ minWidth: '240px', right: 0, left: 'auto', zIndex: 100 }}>
                <div className="mb-2">
                  <label className="form-label small fw-bold">Min Price ($)</label>
                  <input type="number" className="form-control form-control-sm" placeholder="0"
                    value={inputMinPrice ?? ''} onChange={e => setInputMinPrice(e.target.value ? Number(e.target.value) : null)} />
                </div>
                <div className="mb-3">
                  <label className="form-label small fw-bold">Max Price ($)</label>
                  <input type="number" className="form-control form-control-sm" placeholder="Any"
                    value={inputMaxPrice ?? ''} onChange={e => setInputMaxPrice(e.target.value ? Number(e.target.value) : null)} />
                </div>
                <div className="d-flex gap-2">
                  <button className="btn btn-primary btn-sm rounded-pill flex-fill" onClick={handleApplyPrice}>Apply</button>
                  <button className="btn btn-outline-secondary btn-sm rounded-pill" onClick={() => { setMinPrice(null); setMaxPrice(null); setIsPriceDropdownOpen(false) }}>Clear</button>
                </div>
              </div>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="dropdown position-relative">
            <button
              className="filter-pill dropdown-trigger"
              onClick={() => {
                setIsSortDropdownOpen(v => !v)
                setIsPriceDropdownOpen(false)
                setIsRatingDropdownOpen(false)
              }}
            >
              <i className="bi bi-sort-down me-1"></i>
              {sortLabel}
              <i className="bi bi-chevron-down ms-1 small"></i>
            </button>
            {isSortDropdownOpen && (
              <ul className="dropdown-menu show shadow border-0 mt-2 rounded-4 overflow-hidden p-0" style={{ minWidth: '180px', right: 0, left: 'auto', zIndex: 100 }}>
                {[['recommended', 'Recommended'], ['popularity', 'Popularity'], ['rating', 'Top Rated First'], ['price-asc', 'Price: Low to High'], ['price-desc', 'Price: High to Low']].map(([val, label]) => (
                  <li key={val}>
                    <button className="dropdown-item py-2 px-3 small fw-medium" onClick={() => handleSort(val)}>{label}</button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* Destinations Grid */}
      <div className="row g-4">
        {filteredDestinations.length > 0 ? filteredDestinations.map(dest => (
          <div key={dest.id} className="col-lg-4 col-md-6">
            <div className="card h-100 destination-card">
              <div className="position-relative overflow-hidden">
                <img src={dest.imageUrl} alt={dest.name} className="card-img-top w-100" />
                <div className="position-absolute top-0 end-0 m-3">
                  <span className="badge bg-white text-dark shadow-sm">${dest.price.toLocaleString()}</span>
                </div>
              </div>
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <h5 className="card-title fw-bold mb-0">{dest.name}</h5>
                  <div className="d-flex align-items-center">
                    <i className="bi bi-star-fill text-warning small me-1"></i>
                    <span className="small fw-bold">{dest.rating}</span>
                  </div>
                </div>
                <p className="card-text text-muted small mb-2"><i className="bi bi-geo-alt me-1"></i>{dest.location}</p>
                <p className="card-text small text-secondary line-clamp-3">{dest.description}</p>
              </div>
              <div className="card-footer bg-white border-0 pt-0 pb-4">
                <div className="d-flex flex-wrap gap-2 mb-3">
                  <span className="badge bg-light text-secondary fw-normal">{dest.type}</span>
                  {dest.popularity === 'High' && <span className="badge bg-danger-subtle text-danger fw-normal">Popular</span>}
                </div>
                <button onClick={() => navigate(`/destinations/${dest.id}`)} className="btn btn-primary w-100 rounded-pill">
                  View Details
                </button>
              </div>
            </div>
          </div>
        )) : (
          <div className="col-12 text-center py-5">
            <div className="text-muted">
              <i className="bi bi-geo-alt display-1 mb-3 d-block opacity-25"></i>
              <h3>No destinations found</h3>
              <p>Try adjusting your search or filters to find what you're looking for.</p>
              <button className="btn btn-outline-primary rounded-pill mt-3" onClick={clearAllFilters}>
                Clear all filters
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
