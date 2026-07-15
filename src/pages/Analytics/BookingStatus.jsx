import { useState, useEffect, useMemo } from 'react'
import { useAuth } from '../../context/AuthContext.jsx'
import ProfileSidebar from '../../components/ProfileSidebar/ProfileSidebar.jsx'
import {
  getDestinationStats, getBookingStatusStats, getMonthlyTrends,
  getTypeColor, formatRevenue, buildDonutSegments
} from '../../data/analytics.js'
import './Analytics.css'

function buildLinePoints(data, chartW, chartH, padX, padY) {
  const max = Math.max(...data.map(d => d.bookings))
  const w = chartW - padX * 2
  const h = chartH - padY * 2
  return data.map((d, i) => ({
    x: padX + (i / (data.length - 1)) * w,
    y: padY + (1 - d.bookings / max) * h
  }))
}

export default function BookingStatus() {
  const { isAdmin } = useAuth()
  const [animated, setAnimated] = useState(false)

  const summary = useMemo(() => {
    const stats = getDestinationStats()
    const totalBookings = stats.reduce((s, d) => s + d.bookings, 0)
    const totalRevenue = stats.reduce((s, d) => s + d.revenue, 0)
    return {
      totalBookings,
      totalRevenue,
      avgBookingValue: Math.round(totalRevenue / totalBookings),
      conversionRate: 68.4,
      topDestination: stats[0].name,
      mostBookedThisMonth: 'Bali'
    }
  }, [])

  const statusStats = getBookingStatusStats()
  const monthlyTrends = getMonthlyTrends()
  const destStats = getDestinationStats()
  const statusDonut = useMemo(() => buildDonutSegments(statusStats), [])

  const chartW = 560, chartH = 160, padX = 32, padY = 16
  const linePoints = buildLinePoints(monthlyTrends, chartW, chartH, padX, padY)
  const polylineStr = linePoints.map(p => `${p.x},${p.y}`).join(' ')
  const first = linePoints[0], last = linePoints[linePoints.length - 1]
  const areaPath = `M${first.x},${chartH - padY} L${linePoints.map(p => `${p.x},${p.y}`).join(' L')} L${last.x},${chartH - padY} Z`

  const maxRevenue = Math.max(...destStats.map(d => d.revenue))
  const getRevBarWidth = (rev) => Math.round((rev / maxRevenue) * 100)

  const formatLargeNum = (n) => {
    if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`
    if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`
    return `${n}`
  }

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 100)
    return () => clearTimeout(t)
  }, [])

  const summaryCards = [
    { label: 'Total Bookings', value: summary.totalBookings.toLocaleString(), icon: '📊', color: '#6366f1' },
    { label: 'Total Revenue', value: formatLargeNum(summary.totalRevenue), icon: '💰', color: '#22d3ee' },
    { label: 'Avg Booking Value', value: `$${summary.avgBookingValue.toLocaleString()}`, icon: '📈', color: '#f59e0b' },
    { label: 'Conversion Rate', value: `${summary.conversionRate}%`, icon: '🎯', color: '#10b981' },
    { label: 'Top Destination', value: summary.topDestination, icon: '🏆', color: '#8b5cf6' },
    { label: 'Trending This Month', value: summary.mostBookedThisMonth, icon: '🔥', color: '#f43f5e' },
  ]

  return (
    <div className="analytics-layout">
      <ProfileSidebar />
      <main className="analytics-main">
        <section className="analytics-section">
          <div className="section-header">
            <div>
              <h1 className="section-title-h1">Booking Status Analytics</h1>
              <p className="section-subtitle">Revenue trends, booking volume, and status distribution</p>
            </div>
          </div>

          <div className="charts-container">
            {/* Summary Cards */}
            <div className="summary-grid">
              {summaryCards.map(card => (
                <div key={card.label} className="summary-card-item">
                  <div className="sc-icon" style={{ background: card.color + '22', color: card.color }}>{card.icon}</div>
                  <div className="sc-info">
                    <div className="sc-value">{card.value}</div>
                    <div className="sc-label">{card.label}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Donut + Line Chart Row */}
            <div className="charts-row-2">
              {/* Booking Status Donut */}
              <div className="chart-card chart-card--donut">
                <div className="chart-header">
                  <div>
                    <h2 className="chart-title">Booking Status Distribution</h2>
                    <p className="chart-desc">Breakdown by booking status</p>
                  </div>
                </div>
                <div className="donut-wrapper">
                  <svg viewBox="0 0 180 180" className="donut-svg" aria-hidden="true">
                    <circle cx="90" cy="90" r="70" fill="none" stroke="#1e293b" strokeWidth="30" />
                    {statusDonut.map(seg => (
                      <circle key={seg.status} cx="90" cy="90" r="70" fill="none"
                        stroke={seg.color} strokeWidth="30"
                        strokeDasharray={seg.dasharray} strokeDashoffset={seg.dashoffset}
                        strokeLinecap="butt" className="donut-seg"
                      />
                    ))}
                    <text x="90" y="85" textAnchor="middle" className="donut-center-label">2392</text>
                    <text x="90" y="102" textAnchor="middle" className="donut-center-sub">Total</text>
                  </svg>
                  <div className="donut-legend">
                    {statusDonut.map(seg => (
                      <div key={seg.status} className="legend-item">
                        <span className="legend-dot" style={{ background: seg.color }}></span>
                        <span className="legend-txt">{seg.status}</span>
                        <span className="legend-pct">{seg.percent}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Monthly Line Chart */}
              <div className="chart-card chart-card--wide">
                <div className="chart-header">
                  <div>
                    <h2 className="chart-title">Monthly Booking Trends</h2>
                    <p className="chart-desc">Booking volume over the past 12 months</p>
                  </div>
                  <div className="chart-badge chart-badge--green">📅 12 Months</div>
                </div>
                <div className="line-chart-wrapper">
                  <svg viewBox={`0 0 ${chartW} ${chartH}`} className="line-chart-svg" aria-hidden="true">
                    <defs>
                      <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#6366f1" stopOpacity="0.35" />
                        <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path d={areaPath} fill="url(#areaGrad)" />
                    <polyline points={polylineStr} fill="none" stroke="#6366f1" strokeWidth="2.5" strokeLinejoin="round" />
                    {linePoints.map((p, i) => (
                      <circle key={i} cx={p.x} cy={p.y} r="3.5" fill="#6366f1" />
                    ))}
                    {monthlyTrends.map((t, i) => (
                      <text key={i} x={padX + (i / (monthlyTrends.length - 1)) * (chartW - padX * 2)}
                        y={chartH - 2} textAnchor="middle" className="axis-label">{t.month}</text>
                    ))}
                  </svg>
                  <div className="line-chart-values">
                    {monthlyTrends.map((t, i) => (
                      <div key={i} className="lcv-item"><div className="lcv-val">{t.bookings}</div></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Revenue Bar Chart — Admin only */}
            {isAdmin && (
              <div className="chart-card chart-card--full">
                <div className="chart-header">
                  <div>
                    <h2 className="chart-title">Revenue by Destination</h2>
                    <p className="chart-desc">Total revenue generated per destination across all bookings</p>
                  </div>
                  <div className="chart-badge chart-badge--cyan">💰 Revenue Insights</div>
                </div>
                <div className="rev-bar-list">
                  {destStats.map(stat => (
                    <div key={stat.name} className="rev-bar-row">
                      <div className="rev-bar-name">{stat.name}</div>
                      <div className="rev-bar-track-wrap">
                        <div className="rev-bar-track">
                          <div className="rev-bar-fill"
                            style={{ width: animated ? getRevBarWidth(stat.revenue) + '%' : '0%', background: 'linear-gradient(90deg, #6366f1, #8b5cf6)' }}
                            role="progressbar" aria-valuenow={stat.revenue}></div>
                        </div>
                        <span className="rev-bar-label">{formatRevenue(stat.revenue)}</span>
                      </div>
                      <div className="rev-bar-meta">
                        <span className="rev-bar-bookings">{stat.bookings} bookings</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Heatmap */}
            <div className="chart-card chart-card--full">
              <div className="chart-header">
                <div>
                  <h2 className="chart-title">Peak Booking Activity</h2>
                  <p className="chart-desc">Monthly intensity heatmap — darker = more bookings</p>
                </div>
              </div>
              <div className="heatmap-grid">
                {monthlyTrends.map((t, i) => (
                  <div key={i} className="heatmap-cell"
                    style={{ opacity: animated ? (0.3 + (t.bookings / 300) * 0.7) : 0 }}>
                    <div className="hm-month">{t.month}</div>
                    <div className="hm-val">{t.bookings}</div>
                    <div className="hm-bar">
                      <div className="hm-bar-fill" style={{ height: animated ? ((t.bookings / 300) * 100) + '%' : '0%' }}></div>
                    </div>
                    <div className="hm-label">bookings</div>
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
