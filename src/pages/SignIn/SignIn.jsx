import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import './SignIn.css'

export default function SignIn() {
  const { login, loginWithGoogle, loginWithFacebook } = useAuth()
  const navigate = useNavigate()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [touched, setTouched] = useState({})
  const [errorMessage, setErrorMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const usernameErr = username.trim().length < 3 ? 'Username must be at least 3 characters.' : ''
  const passwordErr = password.length < 6 ? 'Password must be at least 6 characters.' : ''

  const handleSubmit = (e) => {
    e.preventDefault()
    setTouched({ username: true, password: true })
    if (usernameErr || passwordErr) return

    setIsLoading(true)
    setErrorMessage('')
    setTimeout(() => {
      login(username)
      setIsLoading(false)
      navigate('/')
    }, 800)
  }

  const handleAdminLogin = () => {
    setIsLoading(true)
    setTimeout(() => {
      login('admin')
      setIsLoading(false)
      navigate('/')
    }, 800)
  }

  const handleSocialLogin = (provider) => {
    setIsLoading(true)
    setTimeout(() => {
      if (provider === 'google') loginWithGoogle()
      else if (provider === 'facebook') loginWithFacebook()
      setIsLoading(false)
      navigate('/')
    }, 800)
  }

  return (
    <div className="login-wrapper d-flex align-items-center justify-content-center">
      <div className="login-card">
        <div className="card-header text-center">
          <h2 className="title">Welcome Back</h2>
          <p className="subtitle">Please enter your details to sign in.</p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group mb-4">
            <label htmlFor="signin-username">Username or Email</label>
            <input type="text" id="signin-username" value={username}
              onChange={e => setUsername(e.target.value)} onBlur={() => setTouched(t => ({ ...t, username: true }))}
              placeholder="Enter your username" autoComplete="username" />
            {touched.username && usernameErr && <div className="text-danger small mt-1">{usernameErr}</div>}
          </div>

          <div className="form-group mb-4">
            <label htmlFor="signin-password">Password</label>
            <input type="password" id="signin-password" value={password}
              onChange={e => setPassword(e.target.value)} onBlur={() => setTouched(t => ({ ...t, password: true }))}
              placeholder="Enter your password" autoComplete="current-password" />
            {touched.password && passwordErr && <div className="text-danger small mt-1">{passwordErr}</div>}
          </div>

          <div className="d-flex justify-content-between align-items-center mb-4 footer-links">
            <div className="remember-me d-flex align-items-center gap-2">
              <input type="checkbox" id="remember" />
              <label htmlFor="remember">Remember me</label>
            </div>
            <a href="#" className="forgot-link">Forgot Password?</a>
          </div>

          {errorMessage && <div className="error-message mb-3 text-center">{errorMessage}</div>}

          <button type="submit" className="btn-login w-100" disabled={isLoading}>
            {isLoading ? <><span className="spinner"></span> Signing In...</> : 'Sign In'}
          </button>
          <button type="button" className="btn-login w-100 mt-3" style={{ background: 'var(--primary)' }}
            disabled={isLoading} onClick={handleAdminLogin}>
            {isLoading ? <><span className="spinner"></span> Logging In...</> : 'Sign In as Admin (Demo)'}
          </button>
        </form>

        <div className="divider"><span>Or continue with</span></div>

        <div className="social-login d-flex gap-3 justify-content-center">
          <button onClick={() => handleSocialLogin('google')} type="button" className="btn-social google" aria-label="Sign in with Google">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="social-icon">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
            </svg>
          </button>
          <button onClick={() => handleSocialLogin('facebook')} type="button" className="btn-social facebook" aria-label="Sign in with Facebook">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="social-icon">
              <path fill="#1877F2" d="M24 0C10.74 0 0 10.74 0 24c0 11.99 8.77 21.97 20.26 23.7V30.95h-6.1V24h6.1v-5.27c0-6.03 3.59-9.35 9.07-9.35 2.62 0 5.36.47 5.36.47v5.89h-3.02c-2.98 0-3.9 1.85-3.9 3.75V24h6.63l-1.06 6.95h-5.57V47.7C39.23 45.97 48 35.99 48 24c0-13.26-10.74-24-24-24z" />
            </svg>
          </button>
          <button type="button" className="btn-social apple" aria-label="Sign in with Apple">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" className="social-icon">
              <path fill="currentColor" d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5c0 66.2 23.9 149.4 58 202 20.5 30.8 47.7 65.4 76.4 66.4 29.2 1.1 40.5-19.8 77-19.8 35.2 0 49.3 19.8 75.6 19.8 29.5-.7 52.8-31 71.8-61.1 19.5-31.5 28.3-56.1 28.5-57.9-2.4-1.1-55.8-21.6-56.3-84.4zM245.9 96.8c18-22 30.1-52.7 27.2-83.8-25.9 1.1-57.6 17.5-75.9 39.4-15.5 18.2-28.9 47.9-25.2 81.6 29 2.1 58.7-18.1 73.9-37.2z" />
            </svg>
          </button>
        </div>

        <div className="card-footer text-center mt-4">
          <p>Don't have an account? <Link to="/sign-up" className="create-account-link">Create an account</Link></p>
        </div>
      </div>
    </div>
  )
}
