import { useState, useEffect, useMemo } from 'react'
import ProfileSidebar from '../../components/ProfileSidebar/ProfileSidebar.jsx'
import {
  getDestinationStats, getMostBooked, getLeastBooked, getTypeBreakdown,
  getTypeColor, formatRevenue, getBarWidth, getTrendIcon, getTrendClass, buildDonutSegments
} from '../../data/analytics.js'
import './Analytics.css'

export default function DestinationPopularity() {
  const [animated, setAnimated] = useState(false)

  const allStats = getDestinationStats()
  const mostBooked = getMostBooked(5)
  const leastBooked = getLeastBooked(5)
  const typeBreakdown = getTypeBreakdown()

  const maxBookings = Math.max(...allStats.map(s => s.bookings))
  const maxLeastBookings = Math.max(...leastBooked.map(s => s.bookings))
  const donutSegments = useMemo(() => buildDonutSegments(typeBreakdown), [])

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 100)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="page-shell">
      <ProfileSidebar />
      <main className="page-main">
        <section className="analytics-section">
          <div className="section-header">
            <div>
              <h1 className="section-title-h1">Destination Popularity</h1>
              <p className="section-subtitle">Insights into booking trends across all destinations</p>
            </div>
          </div>

          <div className="charts-container">
            {/* ROW 1: Most Booked */}
            <div className="charts-row-2">
              <div className="chart-card chart-card--wide">
                <div className="chart-header">
                  <div>
                    <h2 className="chart-title">Most Booked Destinations</h2>
                    <p className="chart-desc">Top performing destinations by booking volume</p>
                  </div>
                  <div className="chart-badge chart-badge--green">🔥 Trending</div>
                </div>
                <div className="bar-list">
                  {mostBooked.map(stat => (
                    <div key={stat.name} className="bar-item">
                      <div className="bar-meta">
                        <span className="bar-name">{stat.name}</span>
                        <span className="bar-value">{stat.bookings}</span>
                      </div>
                      <div className="bar-track">
                        <div
                          className="bar-fill"
                          style={{ width: animated ? getBarWidth(stat.bookings, maxBookings) + '%' : '0%' }}
                          role="progressbar" aria-valuenow={stat.bookings}
                        ></div>
                      </div>
                      <div className="bar-extra">
                        <span className="pct-badge">{stat.popularityPercent}%</span>
                        <span className="rev-label">{formatRevenue(stat.revenue)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Donut: By Type */}
              <div className="chart-card chart-card--donut">
                <div className="chart-header">
                  <div>
                    <h2 className="chart-title">By Destination Type</h2>
                    <p className="chart-desc">Booking distribution by category</p>
                  </div>
                </div>
                <div className="donut-wrapper">
                  <svg viewBox="0 0 180 180" className="donut-svg" aria-hidden="true">
                    <circle cx="90" cy="90" r="70" fill="none" stroke="#1e293b" strokeWidth="30" />
                    {donutSegments.map(seg => (
                      <circle key={seg.type} cx="90" cy="90" r="70" fill="none"
                        stroke={seg.color} strokeWidth="30"
                        strokeDasharray={seg.dasharray} strokeDashoffset={seg.dashoffset}
                        strokeLinecap="butt" className="donut-seg"
                      />
                    ))}
                    <text x="90" y="85" textAnchor="middle" className="donut-center-label">11</text>
                    <text x="90" y="102" textAnchor="middle" className="donut-center-sub">Destinations</text>
                  </svg>
                  <div className="donut-legend">
                    {donutSegments.map(seg => (
                      <div key={seg.type} className="legend-item">
                        <span className="legend-dot" style={{ background: seg.color }}></span>
                        <span className="legend-txt">{seg.type}</span>
                        <span className="legend-pct">{seg.percent}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* ROW 2: Least Booked + Ratings */}
            <div className="charts-row-2">
              <div className="chart-card chart-card--wide">
                <div className="chart-header">
                  <div>
                    <h2 className="chart-title">Least Booked Destinations</h2>
                    <p className="chart-desc">Explore hidden gems with fewer crowds</p>
                  </div>
                  <div className="chart-badge chart-badge--orange">💎 Hidden Gems</div>
                </div>
                <div className="bar-list">
                  {leastBooked.map(stat => (
                    <div key={stat.name} className="bar-item">
                      <div className="bar-meta">
                        <span className="bar-name">{stat.name}</span>
                        <span className="bar-value">{stat.bookings}</span>
                      </div>
                      <div className="bar-track">
                        <div className="bar-fill bar-fill--teal"
                          style={{ width: animated ? getBarWidth(stat.bookings, maxLeastBookings) + '%' : '0%' }}
                          role="progressbar" aria-valuenow={stat.bookings}></div>
                      </div>
                      <div className="bar-extra">
                        <span className="pct-badge pct-badge--teal">{stat.popularityPercent}%</span>
                        <span className="rev-label">{formatRevenue(stat.revenue)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Rating Overview */}
              <div className="chart-card chart-card--donut">
                <div className="chart-header">
                  <div>
                    <h2 className="chart-title">Rating Overview</h2>
                    <p className="chart-desc">Average ratings across all destinations</p>
                  </div>
                </div>
                <div className="rating-list">
                  {allStats.map(stat => (
                    <div key={stat.name} className="rating-row">
                      <span className="rating-name">{stat.name}</span>
                      <div className="rating-stars-track">
                        <div className="rating-stars-fill"
                          style={{ width: animated ? ((stat.rating / 5) * 100) + '%' : '0%', background: getTypeColor(stat.type) }}></div>
                      </div>
                      <span className="rating-val">{stat.rating}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Full Popularity Breakdown */}
            <div className="chart-card chart-card--full">
              <div className="chart-header">
                <div>
                  <h2 className="chart-title">Full Popularity Breakdown</h2>
                  <p className="chart-desc">All destinations ranked by booking share</p>
                </div>
              </div>
              <div className="popularity-grid">
                {allStats.map((stat, i) => (
                  <div key={stat.name} className="pop-card">
                    <div className="pop-rank">#{i + 1}</div>
                    <div className="pop-header">
                      <div className="pop-name">{stat.name}</div>
                      <div className="pop-location">📍 {stat.location}</div>
                      <div className="pop-type-badge"
                        style={{ background: getTypeColor(stat.type) + '22', color: getTypeColor(stat.type) }}>
                        {stat.type}
                      </div>
                    </div>
                    <div className="pop-pct-label">
                      <span className="pop-pct-value">{stat.popularityPercent}%</span>
                      <span className={`pop-trend ${getTrendClass(stat.trend)}`}>{getTrendIcon(stat.trend)}</span>
                    </div>
                    <div className="pop-progress-track">
                      <div className="pop-progress-fill"
                        style={{ width: animated ? stat.popularityPercent + '%' : '0%', background: getTypeColor(stat.type) }}></div>
                    </div>
                    <div className="pop-footer">
                      <span>{stat.bookings} bookings</span>
                      <span>{formatRevenue(stat.revenue)} revenue</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
