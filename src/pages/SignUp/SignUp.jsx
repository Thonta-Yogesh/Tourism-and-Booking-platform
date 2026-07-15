import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import './SignUp.css'

export default function SignUp() {
  const { signup } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({ fullName: '', email: '', password: '', confirmPassword: '' })
  const [touched, setTouched] = useState({})
  const [errorMessage, setErrorMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const errors = {}
  if (form.fullName.trim().length < 3) errors.fullName = 'Name must be at least 3 characters.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = 'Valid email is required.'
  if (form.password.length < 6) errors.password = 'Password must be at least 6 characters.'
  if (!form.confirmPassword) errors.confirmPassword = 'Please confirm your password.'

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  const handleBlur = (field) => setTouched(prev => ({ ...prev, [field]: true }))

  const handleSubmit = (e) => {
    e.preventDefault()
    setTouched({ fullName: true, email: true, password: true, confirmPassword: true })
    if (Object.keys(errors).length > 0) return

    if (form.password !== form.confirmPassword) {
      setErrorMessage('Passwords do not match.')
      return
    }

    setIsLoading(true)
    setErrorMessage('')
    setTimeout(() => {
      signup(form.fullName, form.email)
      setIsLoading(false)
      navigate('/')
    }, 1000)
  }

  return (
    <div className="signup-wrapper d-flex align-items-center justify-content-center">
      <div className="signup-card">
        <h2 className="title">Create Account</h2>
        <p className="subtitle">Start your journey with ELEVÉ today.</p>

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group mb-4">
            <label htmlFor="signup-name">Full Name</label>
            <input type="text" id="signup-name" name="fullName" value={form.fullName}
              onChange={handleChange} onBlur={() => handleBlur('fullName')} placeholder="Your full name" />
            {touched.fullName && errors.fullName && <div className="text-danger small mt-1">{errors.fullName}</div>}
          </div>

          <div className="form-group mb-4">
            <label htmlFor="signup-email">Email Address</label>
            <input type="email" id="signup-email" name="email" value={form.email}
              onChange={handleChange} onBlur={() => handleBlur('email')} placeholder="your@email.com" />
            {touched.email && errors.email && <div className="text-danger small mt-1">{errors.email}</div>}
          </div>

          <div className="form-group mb-4">
            <label htmlFor="signup-password">Password</label>
            <input type="password" id="signup-password" name="password" value={form.password}
              onChange={handleChange} onBlur={() => handleBlur('password')} placeholder="Min. 6 characters" />
            {touched.password && errors.password && <div className="text-danger small mt-1">{errors.password}</div>}
          </div>

          <div className="form-group mb-4">
            <label htmlFor="signup-confirm">Confirm Password</label>
            <input type="password" id="signup-confirm" name="confirmPassword" value={form.confirmPassword}
              onChange={handleChange} onBlur={() => handleBlur('confirmPassword')} placeholder="Repeat password" />
            {touched.confirmPassword && errors.confirmPassword && <div className="text-danger small mt-1">{errors.confirmPassword}</div>}
          </div>

          {errorMessage && <div className="error-message mb-3 text-center">{errorMessage}</div>}

          <button type="submit" className="btn-signup w-100" disabled={isLoading}>
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="text-center mt-4">
          <p>Already have an account? <Link to="/login" className="login-link">Sign In</Link></p>
        </div>
      </div>
    </div>
  )
}
