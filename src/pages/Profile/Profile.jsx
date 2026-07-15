import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import ProfileSidebar from '../../components/ProfileSidebar/ProfileSidebar.jsx'
import './Profile.css'

export default function Profile() {
  const { currentUser, updateProfile } = useAuth()
  const navigate = useNavigate()
  const [isEditing, setIsEditing] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [form, setForm] = useState({ name: '', email: '', phone: '', bio: '' })

  useEffect(() => {
    if (!currentUser) {
      navigate('/login')
      return
    }
    populateForm()
  }, [currentUser])

  const populateForm = () => {
    if (currentUser) {
      setForm({
        name: currentUser.name || '',
        email: currentUser.email || '',
        phone: currentUser.phone || '',
        bio: currentUser.bio || ''
      })
    }
  }

  const toggleEdit = () => {
    if (!isEditing) {
      populateForm()
      setSuccessMessage('')
    }
    setIsEditing(v => !v)
  }

  const saveProfile = (e) => {
    e.preventDefault()
    if (!form.name.trim() || !form.email.trim()) return
    updateProfile(form)
    setIsEditing(false)
    setSuccessMessage('Profile updated successfully!')
    setTimeout(() => setSuccessMessage(''), 3000)
  }

  if (!currentUser) return null

  return (
    <div className="page-shell">
      <ProfileSidebar />
      <main className="page-main">
        <div className="profile-header d-flex justify-content-between align-items-center mb-4">
          <div>
            <h1 className="h3 fw-bold mb-0">My Profile</h1>
            <p className="text-muted small">Manage your personal information</p>
          </div>
          <button className="btn btn-outline-primary rounded-pill px-4" onClick={toggleEdit}>
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        {successMessage && (
          <div className="alert alert-success rounded-4 mb-4">{successMessage}</div>
        )}

        {!isEditing ? (
          /* VIEW MODE */
          <div className="detail-section">
            <h2 className="section-heading">Personal Information</h2>
            <div className="detail-grid">
              <div className="detail-item">
                <div className="detail-label">Full Name</div>
                <div className="detail-value">{currentUser?.name || '—'}</div>
              </div>
              <div className="detail-item">
                <div className="detail-label">Email Address</div>
                <div className="detail-value">{currentUser?.email || '—'}</div>
              </div>
              <div className="detail-item">
                <div className="detail-label">Phone Number</div>
                <div className="detail-value">{currentUser?.phone || 'Not provided'}</div>
              </div>
              <div className="detail-item detail-item--full">
                <div className="detail-label">Bio</div>
                <div className="detail-value">{currentUser?.bio || 'No bio yet. Click Edit Profile to add one.'}</div>
              </div>
            </div>

            {/* Analytics Quick Links */}
            <div className="detail-section mt-5">
              <h2 className="section-heading">Quick Access to Analytics</h2>
              <div className="quick-links">
                <Link to="/analytics/destination-popularity" className="quick-link-card">
                  <div className="ql-icon ql-purple">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                    </svg>
                  </div>
                  <div className="ql-info">
                    <div className="ql-title">Destination Popularity Insights</div>
                    <div className="ql-desc">Most &amp; least booked destinations, type breakdowns, ratings</div>
                  </div>
                  <svg className="ql-arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </Link>
                <Link to="/analytics/booking-status" className="quick-link-card">
                  <div className="ql-icon ql-cyan">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                    </svg>
                  </div>
                  <div className="ql-info">
                    <div className="ql-title">Booking Status Analytics</div>
                    <div className="ql-desc">Revenue trends, booking volume, status distribution</div>
                  </div>
                  <svg className="ql-arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        ) : (
          /* EDIT MODE */
          <form onSubmit={saveProfile} className="edit-form">
            <h2 className="section-heading">Edit Profile</h2>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="pf-name" className="form-lbl">Full Name</label>
                <input id="pf-name" type="text" className="form-inp" value={form.name}
                  onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Your full name" required />
              </div>
              <div className="form-group">
                <label htmlFor="pf-email" className="form-lbl">Email Address</label>
                <input id="pf-email" type="email" className="form-inp" value={form.email}
                  onChange={e => setForm(p => ({ ...p, email: e.target.value }))} placeholder="your@email.com" required />
              </div>
              <div className="form-group">
                <label htmlFor="pf-phone" className="form-lbl">Phone Number</label>
                <input id="pf-phone" type="text" className="form-inp" value={form.phone}
                  onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} placeholder="+1 234 567 8900" />
              </div>
              <div className="form-group form-group--full">
                <label htmlFor="pf-bio" className="form-lbl">Bio</label>
                <textarea id="pf-bio" className="form-inp form-textarea" rows="3" value={form.bio}
                  onChange={e => setForm(p => ({ ...p, bio: e.target.value }))} placeholder="Tell us about yourself"></textarea>
              </div>
            </div>
            <button type="submit" className="save-btn">Save Changes</button>
          </form>
        )}
      </main>
    </div>
  )
}
