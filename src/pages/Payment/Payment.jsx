import { useState } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import './Payment.css'

function formatCardNumber(value) {
  return value.replace(/\D/g, '').replace(/(\d{4})/g, '$1 ').trim().slice(0, 19)
}

function formatExpiry(value) {
  const digits = value.replace(/\D/g, '')
  if (digits.length >= 3) return digits.slice(0, 2) + '/' + digits.slice(2, 4)
  return digits
}

export default function Payment() {
  const location = useLocation()
  const navigate = useNavigate()
  const bookingData = location.state?.bookingData || location.state?.bookingDetails

  const [form, setForm] = useState({
    cardholderName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  })
  const [touched, setTouched] = useState({})
  const [paymentError, setPaymentError] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentSuccess, setPaymentSuccess] = useState(false)

  const validate = () => {
    const errs = {}
    if (!form.cardholderName.trim()) errs.cardholderName = 'Cardholder name is required.'
    if (!/^\d{4} \d{4} \d{4} \d{4}$/.test(form.cardNumber)) errs.cardNumber = 'Please enter a valid 16-digit card number.'
    if (!/^\d{2}\/\d{2}$/.test(form.expiryDate)) errs.expiryDate = 'Enter a valid expiry (MM/YY).'
    if (!/^\d{3,4}$/.test(form.cvv)) errs.cvv = 'Enter a valid 3 or 4 digit CVV.'
    return errs
  }

  const errors = validate()
  const isValid = Object.keys(errors).length === 0

  const handleChange = (e) => {
    let { name, value } = e.target
    if (name === 'cardNumber') value = formatCardNumber(value)
    if (name === 'expiryDate') value = formatExpiry(value)
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleBlur = (field) => setTouched(prev => ({ ...prev, [field]: true }))

  const handleSubmit = (e) => {
    e.preventDefault()
    setTouched({ cardholderName: true, cardNumber: true, expiryDate: true, cvv: true })
    if (!isValid) return

    setIsProcessing(true)
    setPaymentError('')
    setTimeout(() => {
      setIsProcessing(false)
      navigate('/book-tour', { state: { paymentSuccess: true } })
    }, 2000)
  }

  if (!bookingData) {
    return (
      <div className="container py-5 mt-5 text-center">
        <h2 className="fw-bold mb-3">No Booking Found</h2>
        <p className="text-muted">Please start a new booking first.</p>
        <Link to="/book-tour" className="btn btn-primary rounded-pill px-5 mt-3">Book a Tour</Link>
      </div>
    )
  }

  if (paymentSuccess) {
    return (
      <div className="container py-5 mt-5 text-center">
        <div className="success-card mx-auto p-5 rounded-4 shadow">
          <div className="success-icon mb-4">✓</div>
          <h2 className="fw-bold mb-2">Booking Confirmed!</h2>
          <p className="text-muted mb-4">Your trip to <strong>{bookingData.destinationName}</strong> is confirmed.</p>
          <p className="small text-muted">A confirmation has been sent to {bookingData.email}</p>
          <Link to="/" className="btn btn-primary rounded-pill px-5 mt-4">Back to Home</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-5 mt-5">
      <div className="text-center mb-5 pt-4">
        <h1 className="display-4 fw-bold">Payment</h1>
        <p className="lead text-muted mt-2">Complete your payment to confirm the booking.</p>
      </div>

      <div className="row g-5">
        {/* Card Details */}
        <div className="col-lg-7">
          <div className="card border-0 shadow-lg rounded-5 overflow-hidden pop-card">
            <div className="card-body p-4 p-md-5">
              <h4 className="fw-bold mb-4 text-theme">
                <i className="bi bi-credit-card me-2"></i>Card Details
              </h4>

              {paymentError && (
                <div className="alert alert-danger rounded-4 mb-4 d-flex align-items-center">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>{paymentError}
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate>
                {/* Cardholder Name */}
                <div className="mb-4">
                  <label className="form-label fw-bold small text-uppercase text-muted">Cardholder Name</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-0 rounded-start-pill ps-3">
                      <i className="bi bi-person text-theme"></i>
                    </span>
                    <input type="text" name="cardholderName" className="form-control form-control-lg border-0 bg-light rounded-end-pill"
                      value={form.cardholderName} onChange={handleChange} onBlur={() => handleBlur('cardholderName')}
                      placeholder="Name on card" />
                  </div>
                  {touched.cardholderName && errors.cardholderName &&
                    <div className="text-danger small mt-1 ps-3">{errors.cardholderName}</div>}
                </div>

                {/* Card Number */}
                <div className="mb-4">
                  <label className="form-label fw-bold small text-uppercase text-muted">Card Number</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-0 rounded-start-pill ps-3">
                      <i className="bi bi-credit-card-2-front text-theme"></i>
                    </span>
                    <input type="text" name="cardNumber" className="form-control form-control-lg border-0 bg-light rounded-end-pill"
                      value={form.cardNumber} onChange={handleChange} onBlur={() => handleBlur('cardNumber')}
                      placeholder="0000 0000 0000 0000" maxLength="19" />
                  </div>
                  {touched.cardNumber && errors.cardNumber &&
                    <div className="text-danger small mt-1 ps-3">{errors.cardNumber}</div>}
                </div>

                <div className="row g-4 mb-4">
                  {/* Expiry */}
                  <div className="col-md-6">
                    <label className="form-label fw-bold small text-uppercase text-muted">Expiry Date</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-0 rounded-start-pill ps-3">
                        <i className="bi bi-calendar3 text-theme"></i>
                      </span>
                      <input type="text" name="expiryDate" className="form-control form-control-lg border-0 bg-light rounded-end-pill"
                        value={form.expiryDate} onChange={handleChange} onBlur={() => handleBlur('expiryDate')}
                        placeholder="MM/YY" maxLength="5" />
                    </div>
                    {touched.expiryDate && errors.expiryDate &&
                      <div className="text-danger small mt-1 ps-3">{errors.expiryDate}</div>}
                  </div>

                  {/* CVV */}
                  <div className="col-md-6">
                    <label className="form-label fw-bold small text-uppercase text-muted">CVV</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-0 rounded-start-pill ps-3">
                        <i className="bi bi-lock text-theme"></i>
                      </span>
                      <input type="password" name="cvv" className="form-control form-control-lg border-0 bg-light rounded-end-pill"
                        value={form.cvv} onChange={handleChange} onBlur={() => handleBlur('cvv')}
                        placeholder="•••" maxLength="4" />
                    </div>
                    {touched.cvv && errors.cvv &&
                      <div className="text-danger small mt-1 ps-3">{errors.cvv}</div>}
                  </div>
                </div>

                <div className="d-flex align-items-center text-muted small mb-4">
                  <i className="bi bi-shield-lock-fill me-2 text-success"></i>
                  Your payment information is secure and encrypted.
                </div>

                <button type="submit" className="btn btn-primary btn-lg w-100 rounded-pill py-3 fw-bold" disabled={isProcessing}>
                  {isProcessing ? (
                    <><span className="spinner-border spinner-border-sm me-2"></span>Processing Payment...</>
                  ) : (
                    <><i className="bi bi-lock-fill me-2"></i>Pay Now — ${bookingData.totalPrice?.toFixed(0)}</>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Booking Summary */}
        <div className="col-lg-5">
          <div className="card border-0 shadow-sm rounded-5 overflow-hidden">
            <div className="card-body p-4">
              <h4 className="fw-bold mb-4 text-theme">
                <i className="bi bi-receipt me-2"></i>Booking Summary
              </h4>
              <div className="summary-row d-flex justify-content-between py-2 border-bottom">
                <span className="text-muted">Destination</span>
                <span className="fw-bold">{bookingData.destinationName}</span>
              </div>
              <div className="summary-row d-flex justify-content-between py-2 border-bottom">
                <span className="text-muted">Traveler</span>
                <span>{bookingData.name}</span>
              </div>
              <div className="summary-row d-flex justify-content-between py-2 border-bottom">
                <span className="text-muted">Travel Date</span>
                <span>{bookingData.travelDate}</span>
              </div>
              <div className="summary-row d-flex justify-content-between py-2 border-bottom">
                <span className="text-muted">Travelers</span>
                <span>{bookingData.travelers}</span>
              </div>
              <div className="summary-row d-flex justify-content-between py-2 border-bottom">
                <span className="text-muted">Base Price</span>
                <span>${bookingData.basePrice?.toLocaleString()}</span>
              </div>
              {bookingData.discountAmount > 0 && (
                <div className="summary-row d-flex justify-content-between py-2 border-bottom text-success">
                  <span>Discount</span>
                  <span>-${bookingData.discountAmount?.toFixed(0)}</span>
                </div>
              )}
              <div className="summary-row d-flex justify-content-between py-2 border-bottom">
                <span className="text-muted">Taxes (12%)</span>
                <span>${bookingData.taxes?.toFixed(0)}</span>
              </div>
              <div className="d-flex justify-content-between py-3 fw-bold fs-5">
                <span>Total</span>
                <span>${bookingData.totalPrice?.toFixed(0)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
