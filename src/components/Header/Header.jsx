import { useState, useEffect, useCallback } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import './Header.css'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { currentUser, logout } = useAuth()

  const isHome = location.pathname === '/' || location.pathname === '/home' || location.pathname === ''

  const checkScroll = useCallback(() => {
    if (!isHome) {
      setIsScrolled(true)
      return
    }
    const heroContainer = document.querySelector('.hero-scroll-container')
    if (heroContainer) {
      const scrollableDist = heroContainer.scrollHeight - window.innerHeight
      setIsScrolled(window.scrollY >= scrollableDist)
    } else {
      setIsScrolled(window.scrollY > 50)
    }
  }, [isHome])

  useEffect(() => {
    checkScroll()
    window.addEventListener('scroll', checkScroll, { passive: true })
    return () => window.removeEventListener('scroll', checkScroll)
  }, [checkScroll])

  // Close menu on route change
  useEffect(() => {
    setIsMenuOpen(false)
  }, [location.pathname])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const headerClass = [
    'd-flex align-items-center w-100',
    isScrolled ? 'scrolled' : '',
    isHome ? 'is-home' : ''
  ].filter(Boolean).join(' ')

  return (
    <header className={headerClass} id="main-header">
      <div className="container-fluid px-4 px-md-5 d-flex align-items-center justify-content-between position-relative">

        {/* Left: Navigation Links */}
        <nav className={`desktop-nav${isMenuOpen ? ' mobile-open' : ''}`}>
          <ul className="nav-menu list-unstyled mb-0 d-flex align-items-center gap-4">
            <li><Link to="/" onClick={() => setIsMenuOpen(false)}>Home</Link></li>
            <li><Link to="/destinations" onClick={() => setIsMenuOpen(false)}>Destinations</Link></li>
            <li><Link to="/activities" onClick={() => setIsMenuOpen(false)}>Activities</Link></li>
            <li><Link to="/contact" onClick={() => setIsMenuOpen(false)}>Contact Us</Link></li>

            {/* Mobile Only Actions */}
            {!currentUser ? (
              <li className="d-lg-none mt-4">
                <Link to="/login" onClick={() => setIsMenuOpen(false)} className="pointer">Sign In</Link>
              </li>
            ) : (
              <>
                <li className="d-lg-none mt-4">
                  <Link to="/profile" onClick={() => setIsMenuOpen(false)}>My Profile</Link>
                </li>
                <li className="d-lg-none">
                  <span onClick={() => { handleLogout(); setIsMenuOpen(false) }} className="pointer" style={{ cursor: 'pointer' }}>Logout</span>
                </li>
              </>
            )}
            <li className="d-lg-none">
              <Link to="/book-tour" onClick={() => setIsMenuOpen(false)} className="btn-book">Book a Tour</Link>
            </li>
          </ul>
        </nav>

        {/* Center: Logo */}
        <div className="logo-wrapper">
          <Link to="/" className="logo">ELEVÉ</Link>
        </div>

        {/* Right: Auth & CTA */}
        <div className="header-actions d-flex align-items-center gap-3">
          {!currentUser ? (
            <div className="auth-buttons d-none d-lg-flex align-items-center gap-3">
              <Link to="/login" className="nav-link pointer">Sign In</Link>
            </div>
          ) : (
            <div className="user-profile d-none d-lg-flex align-items-center gap-2">
              <Link to="/profile" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', color: 'inherit' }}>
                <img src={currentUser.avatar} alt="User" className="avatar" />
                <span className="username">{currentUser.name}</span>
              </Link>
              <button onClick={handleLogout} className="btn-logout" aria-label="Logout">
                <i className="bi bi-box-arrow-right"></i>
              </button>
            </div>
          )}

          <Link to="/book-tour" className="btn-book text-decoration-none d-none d-lg-inline-block">Book a Tour</Link>

          {/* Mobile Burger */}
          <button
            className={`burger d-lg-none${isMenuOpen ? ' open' : ''}`}
            onClick={() => setIsMenuOpen(v => !v)}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>

      </div>
    </header>
  )
}
