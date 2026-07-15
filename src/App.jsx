import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Header from './components/Header/Header.jsx'
import Footer from './components/Footer/Footer.jsx'
import AmbientBackground from './components/AmbientBackground/AmbientBackground.jsx'

// Eagerly loaded (critical path)
import Home from './pages/Home/Home.jsx'

// Lazy loaded pages
const Destinations = lazy(() => import('./pages/Destinations/Destinations.jsx'))
const DestinationDetails = lazy(() => import('./pages/Destinations/DestinationDetails.jsx'))
const Activities = lazy(() => import('./pages/Activities/Activities.jsx'))
const Booking = lazy(() => import('./pages/Booking/Booking.jsx'))
const Payment = lazy(() => import('./pages/Payment/Payment.jsx'))
const SignIn = lazy(() => import('./pages/SignIn/SignIn.jsx'))
const SignUp = lazy(() => import('./pages/SignUp/SignUp.jsx'))
const Contact = lazy(() => import('./pages/Contact/Contact.jsx'))
const Profile = lazy(() => import('./pages/Profile/Profile.jsx'))
const DestinationPopularity = lazy(() => import('./pages/Analytics/DestinationPopularity.jsx'))
const BookingStatus = lazy(() => import('./pages/Analytics/BookingStatus.jsx'))

const PageLoader = () => (
  <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
    <div className="spinner-border" role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
  </div>
)

function App() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AmbientBackground />
      <Header />
      <main style={{ flex: '1 0 auto' }}>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/destinations" element={<Destinations />} />
            <Route path="/destinations/:id" element={<DestinationDetails />} />
            <Route path="/activities" element={<Activities />} />
            <Route path="/book-tour" element={<Booking />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/login" element={<SignIn />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/analytics/destination-popularity" element={<DestinationPopularity />} />
            <Route path="/analytics/booking-status" element={<BookingStatus />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}

export default App
