import { useState } from 'react'
import './Contact.css'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      setSubmitted(true)
    }, 1000)
  }

  return (
    <div className="contact-page">
      <div className="container">
        {/* Hero */}
        <div className="contact-hero text-center">
          <h1>Contact Us</h1>
          <p className="lead">We'd love to hear from you. Let us know how we can help.</p>
        </div>

        <div className="row g-5">
          {/* Info Column */}
          <div className="col-lg-4">
            <div className="contact-info-card">
              <h2 className="section-title">Get In Touch</h2>
              <p className="text-muted mb-4">Whether you have a question about our tours, pricing, or anything else, our team is ready to answer all your questions.</p>

              {[
                { icon: 'bi-geo-alt-fill', title: 'Visit Us', desc: '123 Luxury Lane, Travel City, TC 12345' },
                { icon: 'bi-telephone-fill', title: 'Call Us', desc: '+1 (555) 123-4567' },
                { icon: 'bi-envelope-fill', title: 'Email Us', desc: 'hello@eleve.travel' },
                { icon: 'bi-clock-fill', title: 'Working Hours', desc: 'Mon-Fri: 9AM – 6PM' }
              ].map(item => (
                <div key={item.title} className="info-item d-flex gap-3 mb-4">
                  <div className="icon-box">
                    <i className={`bi ${item.icon}`}></i>
                  </div>
                  <div>
                    <h5>{item.title}</h5>
                    <p className="text-muted mb-0">{item.desc}</p>
                  </div>
                </div>
              ))}

              <h5 className="mt-4 mb-3">Follow Us</h5>
              <div className="social-links">
                {[
                  { icon: 'bi-instagram', href: 'https://instagram.com', label: 'Instagram' },
                  { icon: 'bi-twitter-x', href: 'https://twitter.com', label: 'Twitter' },
                  { icon: 'bi-facebook', href: 'https://facebook.com', label: 'Facebook' }
                ].map(s => (
                  <a key={s.icon} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}>
                    <i className={`bi ${s.icon}`}></i>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Form Column */}
          <div className="col-lg-8">
            <div className="contact-form-card">
              {submitted ? (
                <div className="alert-success text-center p-5 rounded-4">
                  <i className="bi bi-check-circle-fill text-success display-4 mb-3 d-block"></i>
                  <h3 className="fw-bold">Message Sent!</h3>
                  <p className="text-muted">Thank you for reaching out. We'll get back to you within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate>
                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Full Name</label>
                        <input type="text" name="name" value={form.name} onChange={handleChange}
                          placeholder="John Doe" required />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Email Address</label>
                        <input type="email" name="email" value={form.email} onChange={handleChange}
                          placeholder="john@example.com" required />
                      </div>
                    </div>
                  </div>

                  <div className="form-group mb-3">
                    <label>Subject</label>
                    <input type="text" name="subject" value={form.subject} onChange={handleChange}
                      placeholder="How can we help?" required />
                  </div>

                  <div className="form-group mb-4">
                    <label>Message</label>
                    <textarea name="message" rows="6" value={form.message} onChange={handleChange}
                      placeholder="Tell us more about your inquiry..."></textarea>
                  </div>

                  <button type="submit" className="btn-submit" disabled={isLoading}>
                    {isLoading ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
