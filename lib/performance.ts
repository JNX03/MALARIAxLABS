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