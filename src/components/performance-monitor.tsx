'use client'

import { useEffect } from 'react'
import {
  trackPageLoad,
  trackResourceTiming,
  trackLargestContentfulPaint,
  trackCumulativeLayoutShift,
} from '@/lib/performance'

export function PerformanceMonitor() {
  useEffect(() => {
    // Track initial page load metrics
    trackPageLoad()
    trackResourceTiming()

    // Set up continuous monitoring
    trackLargestContentfulPaint()
    trackCumulativeLayoutShift()

    // Track navigation timing
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'navigation') {
          trackPageLoad()
          trackResourceTiming()
        }
      }
    })

    observer.observe({ entryTypes: ['navigation'] })

    return () => {
      observer.disconnect()
    }
  }, [])

  return null
} 