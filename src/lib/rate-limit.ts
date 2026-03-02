/**
 * Distributed Rate Limiting with Redis
 * 
 * Features:
 * - Per-IP rate limiting
 * - Per-user rate limiting
 * - Login throttling
 * - Graceful degradation (works without Redis)
 * - Abuse detection logging
 */

import { Redis } from '@upstash/redis';
import { Ratelimit } from '@upstash/ratelimit';
import { NextRequest, NextResponse } from 'next/server';
import { logger } from './logger';

// ============================================
// REDIS CLIENT
// ============================================

// Initialize Redis client (Upstash)
const redis = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
    : null;

// ============================================
// RATE LIMITERS
// ============================================

/**
 * Per-IP rate limiter for public endpoints
 * 100 requests per minute per IP
 */
export const ipRateLimiter = redis
    ? new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(100, '1 m'),
        analytics: true,
        prefix: 'ratelimit:ip',
    })
    : null;

/**
 * Per-user rate limiter for authenticated endpoints
 * 20 requests per minute per user
 */
export const userRateLimiter = redis
    ? new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(20, '1 m'),
        analytics: true,
        prefix: 'ratelimit:user',
    })
    : null;

/**
 * Login attempt throttling
 * 5 attempts per 15 minutes per IP
 */
export const loginRateLimiter = redis
    ? new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(5, '15 m'),
        analytics: true,
        prefix: 'ratelimit:login',
    })
    : null;

/**
 * Capsule creation rate limiter
 * 10 capsules per hour per user
 */
export const capsuleCreationLimiter = redis
    ? new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(10, '1 h'),
        analytics: true,
        prefix: 'ratelimit:capsule',
    })
    : null;

/**
 * Strict rate limiter for sensitive operations
 * 3 requests per 5 minutes
 */
export const strictRateLimiter = redis
    ? new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(3, '5 m'),
        analytics: true,
        prefix: 'ratelimit:strict',
    })
    : null;

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get client IP address from request
 */
export function getClientIp(request: NextRequest): string {
    // Check various headers for IP
    const forwarded = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    const cfConnectingIp = request.headers.get('cf-connecting-ip');

    if (forwarded) {
        return forwarded.split(',')[0].trim();
    }

    if (realIp) {
        return realIp;
    }

    if (cfConnectingIp) {
        return cfConnectingIp;
    }

    // Fallback
    return 'unknown';
}

/**
 * Check rate limit and return appropriate response
 */
export async function checkRateLimit(
    identifier: string,
    limiter: Ratelimit | null,
    context?: string
): Promise<{ success: boolean; response?: NextResponse }> {
    // If Redis is not configured, allow request (graceful degradation)
    if (!limiter) {
        logger.warn('Rate limiting disabled: Redis not configured');
        return { success: true };
    }

    try {
        const { success, limit, reset, remaining } = await limiter.limit(identifier);

        // Add rate limit headers
        const headers = {
            'X-RateLimit-Limit': limit.toString(),
            'X-RateLimit-Remaining': remaining.toString(),
            'X-RateLimit-Reset': new Date(reset).toISOString(),
        };

        if (!success) {
            // Log rate limit violation
            logger.warn('Rate limit exceeded', {
                identifier,
                context,
                limit,
                reset: new Date(reset).toISOString(),
            });

            // Track abuse
            await trackAbuse(identifier, context);

            return {
                success: false,
                response: NextResponse.json(
                    {
                        success: false,
                        error: {
                            type: 'RATE_LIMIT_EXCEEDED',
                            message: 'Too many requests. Please try again later.',
                            retryAfter: Math.ceil((reset - Date.now()) / 1000),
                        },
                    },
                    {
                        status: 429,
                        headers,
                    }
                ),
            };
        }

        return { success: true };
    } catch (error) {
        // If rate limiting fails, allow request (graceful degradation)
        logger.error('Rate limiting error', error as Error, { identifier, context });
        return { success: true };
    }
}

/**
 * Track abuse patterns
 */
async function trackAbuse(identifier: string, context?: string): Promise<void> {
    if (!redis) return;

    try {
        const key = `abuse:${identifier}`;
        const count = await redis.incr(key);

        // Set expiry on first violation
        if (count === 1) {
            await redis.expire(key, 3600); // 1 hour
        }

        // Log severe abuse (> 10 violations in 1 hour)
        if (count > 10) {
            logger.error('SEVERE ABUSE DETECTED', undefined, {
                identifier,
                context,
                violations: count,
                timestamp: new Date().toISOString(),
            });
        }
    } catch (error) {
        logger.error('Error tracking abuse', error as Error, { identifier });
    }
}

/**
 * Rate limit middleware for API routes
 */
export async function withRateLimit(
    request: NextRequest,
    limiter: Ratelimit | null,
    identifier?: string
): Promise<{ success: boolean; response?: NextResponse }> {
    const id = identifier || getClientIp(request);
    const context = `${request.method} ${request.nextUrl.pathname}`;

    return checkRateLimit(id, limiter, context);
}

/**
 * Combined IP + User rate limiting
 */
export async function withCombinedRateLimit(
    request: NextRequest,
    userId?: string
): Promise<{ success: boolean; response?: NextResponse }> {
    // Check IP rate limit first
    const ip = getClientIp(request);
    const ipCheck = await checkRateLimit(ip, ipRateLimiter, 'ip');

    if (!ipCheck.success) {
        return ipCheck;
    }

    // If user is authenticated, check user rate limit
    if (userId) {
        const userCheck = await checkRateLimit(userId, userRateLimiter, 'user');
        if (!userCheck.success) {
            return userCheck;
        }
    }

    return { success: true };
}

// ============================================
// REDIS HEALTH CHECK
// ============================================

/**
 * Check Redis connection health
 */
export async function checkRedisHealth(): Promise<boolean> {
    if (!redis) {
        return false;
    }

    try {
        await redis.ping();
        return true;
    } catch (error) {
        logger.error('Redis health check failed', error as Error);
        return false;
    }
}

/**
 * Get rate limit statistics
 */
export async function getRateLimitStats(): Promise<{
    enabled: boolean;
    healthy: boolean;
    analytics?: any;
}> {
    const enabled = redis !== null;
    const healthy = enabled ? await checkRedisHealth() : false;

    return {
        enabled,
        healthy,
    };
}
