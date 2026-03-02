import * as Sentry from '@sentry/nextjs'

export const measurePerformance = (name: string, fn: () => void) => {
  const start = performance.now()
  try {
    fn()
  } finally {
    const duration = performance.now() - start
    Sentry.addBreadcrumb({
      category: 'performance',
      message: `${name} took ${duration.toFixed(2)}ms`,
      level: 'info',
    })
  }
}

export const trackPageLoad = () => {
  if (typeof window !== 'undefined') {
    const timing = window.performance.timing
    const pageLoadTime = timing.loadEventEnd - timing.navigationStart
    const domContentLoaded = timing.domContentLoadedEventEnd - timing.navigationStart
    const firstPaint = performance.getEntriesByName('first-paint')[0]?.startTime
    const firstContentfulPaint = performance.getEntriesByName('first-contentful-paint')[0]?.startTime

    Sentry.addBreadcrumb({
      category: 'performance',
      message: 'Page load metrics',
      data: {
        pageLoadTime,
        domContentLoaded,
        firstPaint,
        firstContentfulPaint,
      },
      level: 'info',
    })
  }
}

export const trackResourceTiming = () => {
  if (typeof window !== 'undefined') {
    const resources = performance.getEntriesByType('resource')
    const slowResources = resources.filter(
      (resource) => resource.duration > 1000
    )

    if (slowResources.length > 0) {
      Sentry.addBreadcrumb({
        category: 'performance',
        message: 'Slow resources detected',
        data: {
          slowResources: slowResources.map((resource) => ({
            name: resource.name,
            duration: resource.duration,
          })),
        },
        level: 'warning',
      })
    }
  }
}

export const trackLargestContentfulPaint = () => {
  if (typeof window !== 'undefined') {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      const lastEntry = entries[entries.length - 1]

      Sentry.addBreadcrumb({
        category: 'performance',
        message: 'Largest Contentful Paint',
        data: {
          lcp: lastEntry.startTime,
          size: (lastEntry as any).size,
          element: (lastEntry as any).element,
        },
        level: 'info',
      })

      observer.disconnect()
    })

    observer.observe({ entryTypes: ['largest-contentful-paint'] })
  }
}

export const trackCumulativeLayoutShift = () => {
  if (typeof window !== 'undefined') {
    let cls = 0
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!(entry as any).hadRecentInput) {
          cls += (entry as any).value
        }
      }

      if (cls > 0.1) {
        Sentry.addBreadcrumb({
          category: 'performance',
          message: 'High Cumulative Layout Shift detected',
          data: { cls },
          level: 'warning',
        })
      }
    })

    observer.observe({ entryTypes: ['layout-shift'] })
  }
} 