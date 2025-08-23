// Simple performance utilities for monitoring navigation speed

export const trackNavigationStart = (route: string) => {
  if (typeof window !== 'undefined' && window.performance) {
    performance.mark(`nav-start-${route}`)
  }
}

export const trackNavigationEnd = (route: string) => {
  if (typeof window !== 'undefined' && window.performance) {
    performance.mark(`nav-end-${route}`)
    
    try {
      performance.measure(
        `navigation-${route}`, 
        `nav-start-${route}`, 
        `nav-end-${route}`
      )
      
      const measure = performance.getEntriesByName(`navigation-${route}`)[0]
      if (measure && process.env.NODE_ENV === 'development') {
        console.log(`🚀 Navigation to ${route}: ${Math.round(measure.duration)}ms`)
      }
    } catch (error) {
      // Ignore errors
    }
  }
}

export const prefetchRoute = (route: string) => {
  if (typeof window !== 'undefined' && document) {
    const link = document.createElement('link')
    link.rel = 'prefetch'
    link.href = route
    document.head.appendChild(link)
  }
}

// Web Vitals measurement
export interface WebVitals {
  lcp?: number
  fid?: number
  cls?: number
  ttfb?: number
  fcp?: number
}

let webVitalsData: WebVitals = {}

export function measureWebVitals() {
  if (typeof window === 'undefined') return

  // Measure LCP (Largest Contentful Paint)
  if ('PerformanceObserver' in window) {
    try {
      const observer = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries()
        const lastEntry = entries[entries.length - 1] as any
        webVitalsData.lcp = lastEntry.startTime
        if (process.env.NODE_ENV === 'development') {
          console.log('📊 LCP:', Math.round(lastEntry.startTime), 'ms')
        }
      })
      observer.observe({ entryTypes: ['largest-contentful-paint'] })
    } catch (e) {
      // PerformanceObserver not supported
    }

    // Measure FCP (First Contentful Paint)
    try {
      const fcpObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries()
        const fcpEntry = entries.find(entry => entry.name === 'first-contentful-paint') as any
        if (fcpEntry) {
          webVitalsData.fcp = fcpEntry.startTime
          if (process.env.NODE_ENV === 'development') {
            console.log('📊 FCP:', Math.round(fcpEntry.startTime), 'ms')
          }
        }
      })
      fcpObserver.observe({ entryTypes: ['paint'] })
    } catch (e) {
      // PerformanceObserver not supported
    }
  }
}

export function getWebVitals(): WebVitals {
  return webVitalsData
}