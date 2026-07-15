// Analytics data — plain JS replacing Angular AnalyticsService
const rawStats = [
  { id: 1, name: 'Bali', location: 'Indonesia', type: 'Beach', bookings: 342, revenue: 410400, rating: 4.8, trend: 'up' },
  { id: 2, name: 'Paris', location: 'France', type: 'City', bookings: 298, revenue: 447000, rating: 4.7, trend: 'up' },
  { id: 3, name: 'Kyoto', location: 'Japan', type: 'Cultural', bookings: 187, revenue: 336600, rating: 4.9, trend: 'stable' },
  { id: 4, name: 'Santorini', location: 'Greece', type: 'Beach', bookings: 263, revenue: 526000, rating: 4.9, trend: 'up' },
  { id: 5, name: 'Machu Picchu', location: 'Peru', type: 'Cultural', bookings: 154, revenue: 338800, rating: 5.0, trend: 'stable' },
  { id: 6, name: 'Grand Canyon', location: 'USA', type: 'Nature', bookings: 218, revenue: 218000, rating: 4.8, trend: 'down' },
  { id: 7, name: 'Swiss Alps', location: 'Switzerland', type: 'Mountain', bookings: 131, revenue: 327500, rating: 4.9, trend: 'up' },
  { id: 8, name: 'Dubai', location: 'UAE', type: 'City', bookings: 276, revenue: 441600, rating: 4.6, trend: 'up' },
  { id: 9, name: 'Rome', location: 'Italy', type: 'City', bookings: 224, revenue: 313600, rating: 4.8, trend: 'stable' },
  { id: 10, name: 'New York', location: 'USA', type: 'City', bookings: 201, revenue: 381900, rating: 4.7, trend: 'down' },
  { id: 11, name: 'Cairo', location: 'Egypt', type: 'Cultural', bookings: 98, revenue: 107800, rating: 4.6, trend: 'down' },
]

const bookingStatusRaw = [
  { status: 'Completed', count: 1124, color: '#6366f1' },
  { status: 'Confirmed', count: 726, color: '#22d3ee' },
  { status: 'Pending', count: 318, color: '#f59e0b' },
  { status: 'Cancelled', count: 224, color: '#f43f5e' },
]

const monthlyTrendRaw = [
  { month: 'Apr', bookings: 98, revenue: 142000 },
  { month: 'May', bookings: 134, revenue: 195000 },
  { month: 'Jun', bookings: 178, revenue: 258000 },
  { month: 'Jul', bookings: 221, revenue: 318000 },
  { month: 'Aug', bookings: 265, revenue: 384000 },
  { month: 'Sep', bookings: 248, revenue: 360000 },
  { month: 'Oct', bookings: 192, revenue: 279000 },
  { month: 'Nov', bookings: 156, revenue: 226000 },
  { month: 'Dec', bookings: 203, revenue: 294000 },
  { month: 'Jan', bookings: 168, revenue: 243000 },
  { month: 'Feb', bookings: 181, revenue: 263000 },
  { month: 'Mar', bookings: 212, revenue: 308000 },
]

const TYPE_COLORS = {
  Beach: '#06b6d4', City: '#8b5cf6', Cultural: '#f59e0b',
  Mountain: '#10b981', Nature: '#f43f5e'
}

function getDestinationStats() {
  const total = rawStats.reduce((s, d) => s + d.bookings, 0)
  return rawStats
    .map(s => ({ ...s, popularityPercent: Math.round((s.bookings / total) * 1000) / 10 }))
    .sort((a, b) => b.bookings - a.bookings)
}

function getMostBooked(limit = 5) { return getDestinationStats().slice(0, limit) }
function getLeastBooked(limit = 5) { return [...getDestinationStats()].reverse().slice(0, limit) }

function getBookingStatusStats() {
  const total = bookingStatusRaw.reduce((s, d) => s + d.count, 0)
  return bookingStatusRaw.map(s => ({ ...s, percent: Math.round((s.count / total) * 1000) / 10 }))
}

function getMonthlyTrends() { return monthlyTrendRaw }

function getTypeBreakdown() {
  const typeMap = {}
  rawStats.forEach(s => { typeMap[s.type] = (typeMap[s.type] || 0) + s.bookings })
  const total = Object.values(typeMap).reduce((a, b) => a + b, 0)
  return Object.entries(typeMap).map(([type, count]) => ({
    type, count,
    percent: Math.round((count / total) * 1000) / 10,
    color: TYPE_COLORS[type] ?? '#94a3b8'
  })).sort((a, b) => b.count - a.count)
}

function getSummary() {
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
}

function getTypeColor(type) { return TYPE_COLORS[type] ?? '#94a3b8' }

function formatRevenue(rev) {
  if (rev >= 1_000_000) return `$${(rev / 1_000_000).toFixed(1)}M`
  if (rev >= 1_000) return `$${(rev / 1_000).toFixed(0)}K`
  return `$${rev}`
}

function getBarWidth(bookings, max) { return max > 0 ? Math.round((bookings / max) * 100) : 0 }
function getTrendIcon(trend) { return trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→' }
function getTrendClass(trend) { return trend === 'up' ? 'trend-up' : trend === 'down' ? 'trend-down' : 'trend-stable' }

function buildDonutSegments(data) {
  const total = data.reduce((s, d) => s + d.count, 0)
  const r = 70
  const circumference = 2 * Math.PI * r
  let offset = 0
  return data.map(d => {
    const pct = d.count / total
    const len = pct * circumference
    const seg = { ...d, dasharray: `${len} ${circumference - len}`, dashoffset: -offset }
    offset += len
    return seg
  })
}

export {
  getDestinationStats, getMostBooked, getLeastBooked,
  getBookingStatusStats, getMonthlyTrends, getTypeBreakdown,
  getSummary, getTypeColor, formatRevenue, getBarWidth,
  getTrendIcon, getTrendClass, buildDonutSegments
}
