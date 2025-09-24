// src/utils/performance.js
// Production Performance Optimizations

// Lazy load components
export const lazyComponents = {
  Dashboard: React.lazy(() => import('../pages/Dashboard')),
  MoodHistory: React.lazy(() => import('../components/mood/MoodHistory')),
  Analytics: React.lazy(() => import('../components/analytics/AnalyticsDashboard')),
  Premium: React.lazy(() => import('../pages/Premium'))
}

// Image optimization
export const optimizeImage = (src, width = 800) => {
  if (src.includes('unsplash.com')) {
    return \\?w=\&q=75&auto=format\
  }
  return src
}

// Service Worker registration
export const registerSW = () => {
  if ('serviceWorker' in navigator && import.meta.env.PROD) {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => console.log('SW registered'))
      .catch(error => console.log('SW registration failed'))
  }
}

// Analytics helper
export const trackEvent = (eventName, properties = {}) => {
  if (import.meta.env.PROD && window.gtag) {
    window.gtag('event', eventName, properties)
  }
}
