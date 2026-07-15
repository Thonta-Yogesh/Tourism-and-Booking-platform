import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import './ProfileSidebar.css'

export default function ProfileSidebar() {
  const { currentUser, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const isActive = (path) => location.pathname === path ? ' ps-active' : ''

  return (
    <aside className="ps-sidebar" role="navigation" aria-label="Profile navigation">

      {/* User Info */}
      <div className="ps-user">
        <div className="ps-avatar">
          <img src={currentUser?.avatar || '/assets/images/avatars/avatar-1.jpg'} alt="User avatar" />
        </div>
        <div className="ps-user-info">
          <div className="ps-name">{currentUser?.name || 'My Account'}</div>
          <div className="ps-email">{currentUser?.email || ''}</div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="ps-nav">
        <Link to="/profile" className={`ps-link${isActive('/profile')}`}>
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
          My Profile
        </Link>

        <Link to="/analytics/destination-popularity" className={`ps-link${isActive('/analytics/destination-popularity')}`}>
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
          </svg>
          Destination Popularity
          <span className="ps-badge">Insights</span>
        </Link>

        <Link to="/analytics/booking-status" className={`ps-link${isActive('/analytics/booking-status')}`}>
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
          </svg>
          Booking Analytics
          <span className="ps-badge ps-badge--blue">Analytics</span>
        </Link>
      </nav>

      {/* Sign Out */}
      <button className="ps-logout" onClick={handleLogout}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
          <polyline points="16 17 21 12 16 7" />
          <line x1="21" y1="12" x2="9" y2="12" />
        </svg>
        Sign Out
      </button>
    </aside>
  )
}
