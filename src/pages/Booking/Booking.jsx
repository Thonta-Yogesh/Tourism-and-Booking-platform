import { useState, useEffect, useMemo } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { getDestinations, getDestinationById } from '../../data/destinations.js'
import ScrollVelocity from '../../components/ScrollVelocity/ScrollVelocity.jsx'
import './Booking.css'

const availableOffers = [
  { code: 'FAMILY5', description: '15% off for groups of 5+', type: 'percent', value: 15, minGuests: 5 },
  { code: 'HONEYMOON', description: '$200 off for couples', type: 'flat', value: 200, exactGuests: 2 },
  { code: 'EARLYBIRD', description: '10% off early bookings', type: 'percent', value: 10, minDays: 30 }
]

export default function Booking() {
  const navigate = useNavigate()
  const location = useLocation()
  const destinationsList = getDestinations()

  // Pre-selected destination from query params
  const searchParams = new URLSearchParams(location.search)
  const preSelectedId = searchParams.get('destinationId')

  const [form, setForm] = useState({
    destinationId: preSelectedId ? Number(preSelectedId) : '',
    date: '',
    guests: 1,
    name: '',
    email: '',
    phone: '',
    specialRequests: ''
  })

  const [touched, setTouched] = useState({})
  const [couponCode, setCouponCode] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState(null)
  const [couponError, setCouponError] = useState(null)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    // Check if redirect contains success state
    if (location.state?.paymentSuccess) {
      setSubmitSuccess(true)
    }
  }, [location.state])

  const selectedDestination = useMemo(() => {
    return form.destinationId ? getDestinationById(form.destinationId) : null
  }, [form.destinationId])

  const destinationsText = useMemo(() => {
    return destinationsList.map(d => d.name).join(' • ')
  }, [destinationsList])

  const totalPrice = useMemo(() => {
    if (!selectedDestination) return 0
    let total = selectedDestination.price * form.guests
    if (appliedCoupon) {
      if (appliedCoupon.type === 'percent') {
        total = total * (1 - appliedCoupon.discount / 100)
      } else {
        total = Math.max(0, total - appliedCoupon.discount)
      }
    }
    return total
  }, [selectedDestination, form.guests, appliedCoupon])

  const discountAmount = useMemo(() => {
    if (!selectedDestination) return 0
    return (selectedDestination.price * form.guests) - totalPrice
  }, [selectedDestination, form.guests, totalPrice])

  const validate = () => {
    const errs = {}
    if (!form.destinationId) errs.destinationId = 'Please select a destination.'
    if (!form.date) errs.date = 'Please select a date.'
    if (!form.guests || form.guests < 1) errs.guests = 'At least 1 guest is required.'
    if (!form.name.trim()) errs.name = 'Name is required.'
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Valid email is required.'
    if (!form.phone.trim()) errs.phone = 'Phone is required.'
    return errs
  }

  const errors = validate()
  const isValid = Object.keys(errors).length === 0

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({
      ...prev,
      [name]: name === 'destinationId' || name === 'guests' ? (value ? Number(value) : '') : value
    }))
  }

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }))
  }

  const applyCoupon = (code) => {
    setCouponError(null)
    const normalizedCode = code.toUpperCase().trim()
    if (!normalizedCode) return

    const offer = availableOffers.find(o => o.code === normalizedCode)
    if (!offer) {
      setCouponError('Invalid coupon code')
      setAppliedCoupon(null)
      return
    }

    if (offer.minGuests && form.guests < offer.minGuests) {
      setCouponError(`Minimum ${offer.minGuests} guests required for this offer.`)
      setAppliedCoupon(null)
      return
    }

    if (offer.exactGuests && form.guests !== offer.exactGuests) {
      setCouponError(`This offer is valid only for exactly ${offer.exactGuests} guests.`)
      setAppliedCoupon(null)
      return
    }

    setAppliedCoupon({
      code: offer.code,
      discount: offer.value,
      type: offer.type
    })
    setCouponCode(normalizedCode)
  }

  const removeCoupon = () => {
    setAppliedCoupon(null)
    setCouponCode('')
    setCouponError(null)
  }

  const handleSpotlightMove = (e) => {
    const el = e.currentTarget
    const rect = el.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    el.style.setProperty('--mouse-x', `${x}px`)
    el.style.setProperty('--mouse-y', `${y}px`)
    el.style.setProperty('--spotlight-color', 'rgba(255, 255, 255, 0.2)')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setTouched({
      destinationId: true,
      date: true,
      guests: true,
      name: true,
      email: true,
      phone: true
    })
    if (isValid) {
      setShowConfirmDialog(true)
    }
  }

  const handleConfirm = () => {
    setShowConfirmDialog(false)
    const bookingData = {
      destinationId: Number(form.destinationId),
      destinationName: selectedDestination?.name ?? '',
      date: String(form.date),
      guests: Number(form.guests),
      name: String(form.name),
      email: String(form.email),
      phone: String(form.phone),
      specialRequests: String(form.specialRequests || ''),
      totalPrice: totalPrice,
      couponCode: appliedCoupon?.code,
      discountAmount: discountAmount
    }

    navigate('/payment', { state: { bookingData } })
  }

  return (
    <div className="container py-5 mt-5">
      <div className="text-center mb-5 pt-4">
        <h1 className="display-4 fw-bold">Book Your Dream Tour</h1>
        <ScrollVelocity text={destinationsText} />
        <p className="lead text-muted mt-4">Complete your reservation details below.</p>
      </div>

      {submitSuccess ? (
        <div className="alert alert-success text-center p-5 rounded-5 shadow-lg mb-5 animate-fade-in">
          <div className="mb-4">
            <i className="bi bi-check-circle-fill display-1 text-success drop-shadow"></i>
          </div>
          <h2 className="alert-heading fw-bold mb-3">Booking Confirmed!</h2>
          <p className="lead mb-4 text-muted">Your adventure awaits. We've sent the details to your inbox.</p>
          <div className="d-flex justify-content-center gap-3">
            <button className="btn btn-outline-success rounded-pill px-4 py-2 fw-bold" onClick={() => setSubmitSuccess(false)}>
              Book Another
            </button>
            <Link to="/" className="btn btn-theme rounded-pill px-4 py-2 fw-bold shadow-sm btn-hover-effect">
              Back to Home
            </Link>
          </div>
        </div>
      ) : (
        <div className="row g-5">
          {/* Left Column: Form */}
          <div className="col-lg-7">
            <div className="card border-0 shadow-lg rounded-5 overflow-hidden h-100 pop-card">
              <div className="card-body p-4 p-md-5">
                <h4 className="fw-bold mb-4 text-theme">Trip Details</h4>
                <form onSubmit={handleSubmit} noValidate>
                  {/* Destination */}
                  <div className="mb-4">
                    <label htmlFor="destination" className="form-label fw-bold small text-uppercase text-muted">Destination</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-0 rounded-start-pill ps-3">
                        <i className="bi bi-geo-alt text-theme"></i>
                      </span>
                      <select
                        id="destination"
                        name="destinationId"
                        className="form-select form-select-lg border-0 bg-light rounded-end-pill shadow-sm-hover"
                        value={form.destinationId}
                        onChange={handleChange}
                        onBlur={() => handleBlur('destinationId')}
                      >
                        <option value="" disabled>Choose a destination...</option>
                        {destinationsList.map(d => (
                          <option key={d.id} value={d.id}>{d.name} - ${d.price.toLocaleString()}</option>
                        ))}
                      </select>
                    </div>
                    {touched.destinationId && errors.destinationId && (
                      <div className="text-danger small mt-1 ps-3">{errors.destinationId}</div>
                    )}
                  </div>

                  <div className="row g-4 mb-4">
                    {/* Date */}
                    <div className="col-md-6">
                      <label htmlFor="date" className="form-label fw-bold small text-uppercase text-muted">Travel Date</label>
                      <div className="input-group">
                        <span className="input-group-text bg-light border-0 rounded-start-pill ps-3">
                          <i className="bi bi-calendar-event text-theme"></i>
                        </span>
                        <input
                          type="date"
                          id="date"
                          name="date"
                          className="form-control form-control-lg border-0 bg-light rounded-end-pill shadow-sm-hover"
                          value={form.date}
                          onChange={handleChange}
                          onBlur={() => handleBlur('date')}
                          min={new Date().toISOString().split('T')[0]}
                        />
                      </div>
                      {touched.date && errors.date && (
                        <div className="text-danger small mt-1 ps-3">{errors.date}</div>
                      )}
                    </div>

                    {/* Guests */}
                    <div className="col-md-6">
                      <label htmlFor="guests" className="form-label fw-bold small text-uppercase text-muted">Guests</label>
                      <div className="input-group">
                        <span className="input-group-text bg-light border-0 rounded-start-pill ps-3">
                          <i className="bi bi-people text-theme"></i>
                        </span>
                        <input
                          type="number"
                          id="guests"
                          name="guests"
                          className="form-control form-control-lg border-0 bg-light rounded-end-pill shadow-sm-hover"
                          value={form.guests}
                          min="1"
                          onChange={handleChange}
                          onBlur={() => handleBlur('guests')}
                        />
                      </div>
                      {touched.guests && errors.guests && (
                        <div className="text-danger small mt-1 ps-3">{errors.guests}</div>
                      )}
                    </div>
                  </div>

                  <h4 className="fw-bold mb-4 mt-5 text-theme">Your Info</h4>

                  {/* Personal Details */}
                  <div className="mb-4">
                    <label htmlFor="name" className="form-label fw-bold small text-uppercase text-muted">Full Name</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-0 rounded-start-pill ps-3">
                        <i className="bi bi-person text-theme"></i>
                      </span>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        className="form-control form-control-lg border-0 bg-light rounded-end-pill shadow-sm-hover"
                        value={form.name}
                        placeholder="John Doe"
                        onChange={handleChange}
                        onBlur={() => handleBlur('name')}
                      />
                    </div>
                    {touched.name && errors.name && (
                      <div className="text-danger small mt-1 ps-3">{errors.name}</div>
                    )}
                  </div>

                  <div className="row g-4 mb-4">
                    {/* Email */}
                    <div className="col-md-6">
                      <label htmlFor="email" className="form-label fw-bold small text-uppercase text-muted">Email Address</label>
                      <div className="input-group">
                        <span className="input-group-text bg-light border-0 rounded-start-pill ps-3">
                          <i className="bi bi-envelope text-theme"></i>
                        </span>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          className="form-control form-control-lg border-0 bg-light rounded-end-pill shadow-sm-hover"
                          value={form.email}
                          placeholder="john@example.com"
                          onChange={handleChange}
                          onBlur={() => handleBlur('email')}
                        />
                      </div>
                      {touched.email && errors.email && (
                        <div className="text-danger small mt-1 ps-3">{errors.email}</div>
                      )}
                    </div>

                    {/* Phone */}
                    <div className="col-md-6">
                      <label htmlFor="phone" className="form-label fw-bold small text-uppercase text-muted">Phone Number</label>
                      <div className="input-group">
                        <span className="input-group-text bg-light border-0 rounded-start-pill ps-3">
                          <i className="bi bi-telephone text-theme"></i>
                        </span>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          className="form-control form-control-lg border-0 bg-light rounded-end-pill shadow-sm-hover"
                          value={form.phone}
                          placeholder="+1 234 567 8900"
                          onChange={handleChange}
                          onBlur={() => handleBlur('phone')}
                        />
                      </div>
                      {touched.phone && errors.phone && (
                        <div className="text-danger small mt-1 ps-3">{errors.phone}</div>
                      )}
                    </div>
                  </div>

                  {/* Special Requests */}
                  <div className="mb-5">
                    <label htmlFor="requests" class="form-label fw-bold small text-uppercase text-muted">Special Requests</label>
                    <textarea
                      id="requests"
                      name="specialRequests"
                      className="form-control border-0 bg-light rounded-4 shadow-sm-hover p-3"
                      rows="3"
                      value={form.specialRequests}
                      placeholder="Any dietary restrictions or accessibility needs?"
                      onChange={handleChange}
                    ></textarea>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* Right Column: Summary & Pricing */}
          <div className="col-lg-5">
            <div
              className="card border-0 shadow-lg rounded-5 overflow-hidden card-spotlight text-white mb-4 pop-card"
              onMouseMove={handleSpotlightMove}
            >
              <div className="card-body p-4 p-md-5 position-relative">
                <div className="position-absolute top-0 end-0 p-3 opacity-25">
                  <i className="bi bi-ticket-perforated display-1"></i>
                </div>
                <h3 className="fw-bold mb-4">Booking Summary</h3>

                {selectedDestination ? (
                  <>
                    <div className="d-flex justify-content-between mb-2">
                      <span>{selectedDestination.name} x {form.guests}</span>
                      <span>${(selectedDestination.price * form.guests).toLocaleString()}</span>
                    </div>

                    {appliedCoupon && (
                      <div className="d-flex justify-content-between mb-2 text-warning animate-slide-in">
                        <span>Discount ({appliedCoupon.code})</span>
                        <span>-${discountAmount.toLocaleString()}</span>
                      </div>
                    )}

                    <hr className="border-white opacity-50 my-3" />
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <span className="h5 mb-0 opacity-75">Total</span>
                      <span className="h2 fw-bold mb-0">${totalPrice.toLocaleString()}</span>
                    </div>
                  </>
                ) : (
                  <p className="opacity-75">Select a destination to see the price breakdown.</p>
                )}

                {/* Coupon */}
                <div className="mt-4">
                  <label className="form-label small fw-bold text-white-50 uppercase">Have a coupon?</label>
                  <div className="input-group mb-2">
                    <input
                      type="text"
                      className="form-control border-0 rounded-start-pill"
                      placeholder="Enter code"
                      value={couponCode}
                      onChange={e => setCouponCode(e.target.value)}
                      disabled={!!appliedCoupon}
                    />
                    {!appliedCoupon ? (
                      <button className="btn btn-dark rounded-end-pill px-3" type="button" onClick={() => applyCoupon(couponCode)}>
                        Apply
                      </button>
                    ) : (
                      <button className="btn btn-secondary rounded-end-pill px-3" type="button" onClick={removeCoupon}>
                        <i className="bi bi-x-lg"></i>
                      </button>
                    )}
                  </div>
                  {couponError && (
                    <div className="text-warning small animate-shake">
                      <i className="bi bi-exclamation-circle me-1"></i>{couponError}
                    </div>
                  )}
                  {appliedCoupon && (
                    <div className="text-white small">
                      <i className="bi bi-check-circle me-1"></i>Coupon applied successfully!
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Available Offers */}
            <h5 className="fw-bold mb-3 ps-2">Available Offers</h5>
            <div className="d-flex flex-column gap-3">
              {availableOffers.map(offer => (
                <div
                  key={offer.code}
                  className="card border-0 shadow-sm rounded-4 cursor-pointer offer-card transition-transform"
                  onClick={() => applyCoupon(offer.code)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="card-body d-flex align-items-center p-3">
                    <div className="rounded-circle offer-icon-theme p-3 me-3">
                      <i className="bi bi-tag-fill fs-4"></i>
                    </div>
                    <div>
                      <h6 className="fw-bold mb-1">{offer.code}</h6>
                      <small className="text-muted d-block">{offer.description}</small>
                    </div>
                    <i className="bi bi-chevron-right ms-auto text-muted small"></i>
                  </div>
                </div>
              ))}
            </div>

            {/* Submit Button */}
            <button
              className="btn btn-theme w-100 rounded-pill py-3 fw-bold shadow-lg mt-4 d-flex justify-content-between align-items-center px-4"
              onClick={handleSubmit}
              disabled={!isValid || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span>Processing...</span>
                  <div className="spinner-border spinner-border-sm text-white" role="status"></div>
                </>
              ) : (
                <>
                  <span>Confirm Booking</span>
                  <span className="bg-white text-theme px-2 py-1 rounded-pill small fw-bold">${totalPrice.toLocaleString()}</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="confirm-overlay" onClick={() => setShowConfirmDialog(false)} role="dialog" aria-modal="true">
          <div className="confirm-dialog animate-fade-in" onClick={e => e.stopPropagation()}>
            <div className="confirm-icon">
              <i className="bi bi-rocket-takeoff-fill"></i>
            </div>
            <h3 className="confirm-title">Ready for Liftoff?</h3>
            <p className="confirm-subtitle">Please review your booking details before confirming.</p>

            {selectedDestination && (
              <div className="confirm-details">
                <div className="confirm-detail-row">
                  <span className="confirm-label"><i className="bi bi-geo-alt me-2"></i>Destination</span>
                  <span className="confirm-value">{selectedDestination.name}</span>
                </div>
                <div className="confirm-detail-row">
                  <span class="confirm-label"><i class="bi bi-calendar-event me-2"></i>Date</span>
                  <span className="confirm-value">{form.date}</span>
                </div>
                <div className="confirm-detail-row">
                  <span className="confirm-label"><i className="bi bi-people me-2"></i>Guests</span>
                  <span className="confirm-value">{form.guests}</span>
                </div>
                {appliedCoupon && (
                  <div className="confirm-detail-row text-success">
                    <span className="confirm-label"><i className="bi bi-tag me-2"></i>Coupon</span>
                    <span className="confirm-value">{appliedCoupon.code} (-${discountAmount.toLocaleString()})</span>
                  </div>
                )}
                <hr className="confirm-divider" />
                <div className="confirm-detail-row confirm-total">
                  <span className="confirm-label">Total</span>
                  <span className="confirm-value">${totalPrice.toLocaleString()}</span>
                </div>
              </div>
            )}

            <div className="confirm-actions">
              <button className="btn btn-outline-secondary rounded-pill px-4 py-2 fw-bold" onClick={() => setShowConfirmDialog(false)}>
                Cancel
              </button>
              <button className="btn btn-theme rounded-pill px-4 py-2 fw-bold shadow-sm" onClick={handleConfirm}>
                <i className="bi bi-check-lg me-1"></i>Confirm & Pay
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
