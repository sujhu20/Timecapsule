import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { trace, SpanStatusCode } from '@opentelemetry/api'

// Cache duration in seconds
const CACHE_DURATION = 60 * 60 * 24 * 7 // 7 days

export function middleware(request: NextRequest) {
  const tracer = trace.getTracer('time-capsule-middleware')

  return tracer.startActiveSpan('middleware', async (span) => {
    try {
      // Add request attributes to the span
      span.setAttributes({
        'http.method': request.method,
        'http.url': request.url,
        'http.host': request.headers.get('host') ?? undefined,
        'http.useragent': request.headers.get('user-agent') ?? undefined,
      })

      // Continue with the request
      const response = await NextResponse.next()

      // Add response attributes to the span
      span.setAttributes({
        'http.status_code': response.status,
      })

      span.setStatus({ code: SpanStatusCode.OK })
      return response
    } catch (error) {
      span.setStatus({
        code: SpanStatusCode.ERROR,
        message: error instanceof Error ? error.message : 'Unknown error',
      })
      throw error
    } finally {
      span.end()
    }
  })
}

export const config = {
  matcher: '/api/:path*',
} 