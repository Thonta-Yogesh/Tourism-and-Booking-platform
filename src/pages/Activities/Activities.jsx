import { getDestinations } from '../../data/destinations.js'
import { Link } from 'react-router-dom'
import './Activities.css'

const activities = [
  {
    icon: '⛰️',
    title: 'Mountain Trekking',
    desc: 'Challenge yourself with guided treks through some of the world\'s most breathtaking mountain landscapes. From beginner trails to expert-level ascents.',
    featured: ['Alps', 'Andes', 'Himalayas'],
    category: 'Adventure'
  },
  {
    icon: '🍽️',
    title: 'Local Cuisine Tours',
    desc: 'Discover the authentic tastes and culinary traditions of each region. From street food to fine dining experiences led by local chefs.',
    featured: ['Cooking Class', 'Market Tours', 'Wine Tasting'],
    category: 'Food & Culture'
  },
  {
    icon: '🏛️',
    title: 'Historic City Walks',
    desc: 'Explore ancient streets and uncover the secrets of civilizations past. Expert guides bring history to life through fascinating stories.',
    featured: ['Old Town Walks', 'Museum Access', 'Expert Guides'],
    category: 'Cultural'
  },
  {
    icon: '🤿',
    title: 'Water Sports',
    desc: 'Dive into thrilling aquatic adventures from crystal-clear snorkeling to epic surfing sessions on the world\'s most beautiful coastlines.',
    featured: ['Snorkeling', 'Surfing', 'Kayaking'],
    category: 'Water'
  },
  {
    icon: '🦁',
    title: 'Wildlife Safaris',
    desc: 'Encounter majestic wildlife in their natural habitats. Our expert naturalists provide extraordinary close-up experiences with nature.',
    featured: ['Game Drives', 'Bird Watching', 'Photography Tours'],
    category: 'Nature'
  },
  {
    icon: '🧘',
    title: 'Wellness & Retreat',
    desc: 'Rejuvenate body and mind with curated wellness experiences. From luxury spa treatments to yoga retreats in serene natural settings.',
    featured: ['Yoga', 'Meditation', 'Spa Treatments'],
    category: 'Wellness'
  }
]

export default function Activities() {
  const allDests = getDestinations()

  return (
    <div className="container py-5 mt-5">
      <div className="text-center mb-5 pt-4">
        <h1 className="display-5 fw-bold">Exciting Activities</h1>
        <p className="text-muted fs-5">Find the best things to do on your trip.</p>
      </div>

      <div className="row g-4">
        {activities.map((act) => (
          <div key={act.title} className="col-lg-4 col-md-6">
            <div className="activity-card h-100 p-4">
              <div className="activity-icon mb-3" style={{ fontSize: '3rem' }}>{act.icon}</div>
              <span className="badge bg-light text-secondary mb-2">{act.category}</span>
              <h3 className="h5 fw-bold mb-2">{act.title}</h3>
              <p className="text-muted small">{act.desc}</p>
              <div className="d-flex flex-wrap gap-2 mt-3">
                {act.featured.map(f => (
                  <span key={f} className="badge border text-dark fw-normal">{f}</span>
                ))}
              </div>
              <Link to="/book-tour" className="btn btn-outline-primary btn-sm rounded-pill mt-3 w-100">
                Book This Experience
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Destination CTA */}
      <div className="text-center mt-5 pt-3">
        <p className="text-muted mb-3">Ready to explore? Check out our curated destinations.</p>
        <Link to="/destinations" className="btn btn-primary rounded-pill px-5">Explore All Destinations</Link>
      </div>
    </div>
  )
}
