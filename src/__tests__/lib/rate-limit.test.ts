/**
 * @jest-environment node
 *
 * Rate Limit Tests
 * Tests getClientIp, checkRateLimit (graceful degradation, allow, block),
 * and withRateLimit middleware behavior.
 */

// Mock logger to avoid noise
jest.mock('@/lib/logger', () => ({
    logger: {
        warn: jest.fn(),
        error: jest.fn(),
        info: jest.fn(),
    },
}));

// Mock @upstash/redis and @upstash/ratelimit before loading module
jest.mock('@upstash/redis', () => ({
    Redis: jest.fn().mockImplementation(() => ({
        ping: jest.fn().mockResolvedValue('PONG'),
        incr: jest.fn().mockResolvedValue(1),
        expire: jest.fn().mockResolvedValue(1),
    })),
}));

jest.mock('@upstash/ratelimit', () => ({
    Ratelimit: jest.fn().mockImplementation(() => ({
        limit: jest.fn(),
    })),
}));

import { getClientIp, checkRateLimit, withRateLimit } from '@/lib/rate-limit';
import { NextRequest } from 'next/server';

function makeRequest(url = 'http://localhost/api/test', headers: Record<string, string> = {}): NextRequest {
    return new NextRequest(url, { headers });
}

describe('getClientIp', () => {
    it('extracts from x-forwarded-for (first IP in list)', () => {
        const req = makeRequest('http://localhost/', {
            'x-forwarded-for': '1.2.3.4, 5.6.7.8',
        });
        expect(getClientIp(req)).toBe('1.2.3.4');
    });

    it('extracts from x-real-ip when x-forwarded-for is absent', () => {
        const req = makeRequest('http://localhost/', {
            'x-real-ip': '9.10.11.12',
        });
        expect(getClientIp(req)).toBe('9.10.11.12');
    });

    it('extracts from cf-connecting-ip (Cloudflare)', () => {
        const req = makeRequest('http://localhost/', {
            'cf-connecting-ip': '13.14.15.16',
        });
        expect(getClientIp(req)).toBe('13.14.15.16');
    });

    it('falls back to "unknown" when no IP headers present', () => {
        const req = makeRequest('http://localhost/');
        expect(getClientIp(req)).toBe('unknown');
    });

    it('prefers x-forwarded-for over x-real-ip', () => {
        const req = makeRequest('http://localhost/', {
            'x-forwarded-for': '1.1.1.1',
            'x-real-ip': '2.2.2.2',
        });
        expect(getClientIp(req)).toBe('1.1.1.1');
    });
});

describe('checkRateLimit', () => {
    it('returns { success: true } when limiter is null (graceful degradation)', async () => {
        const result = await checkRateLimit('test-id', null);
        expect(result.success).toBe(true);
        expect(result.response).toBeUndefined();
    });

    it('returns { success: true } when rate limit allows the request', async () => {
        const mockLimiter = {
            limit: jest.fn().mockResolvedValue({
                success: true,
                limit: 100,
                remaining: 99,
                reset: Date.now() + 60_000,
            }),
        } as any;

        const result = await checkRateLimit('allowed-id', mockLimiter);
        expect(result.success).toBe(true);
    });

    it('returns 429 NextResponse when rate limit is exceeded', async () => {
        const reset = Date.now() + 30_000;
        const mockLimiter = {
            limit: jest.fn().mockResolvedValue({
                success: false,
                limit: 100,
                remaining: 0,
                reset,
            }),
        } as any;

        const result = await checkRateLimit('blocked-id', mockLimiter, 'POST /api/create');
        expect(result.success).toBe(false);
        expect(result.response).toBeDefined();
        expect(result.response?.status).toBe(429);
    });

    it('returns { success: true } when rate limiter itself throws (graceful degradation)', async () => {
        const mockLimiter = {
            limit: jest.fn().mockRejectedValue(new Error('Redis connection refused')),
        } as any;

        const result = await checkRateLimit('error-id', mockLimiter);
        expect(result.success).toBe(true);
    });
});

describe('withRateLimit', () => {
    it('uses client IP as identifier when no explicit identifier is given', async () => {
        const req = makeRequest('http://localhost/api/test', {
            'x-forwarded-for': '10.0.0.1',
        });

        const mockLimiter = {
            limit: jest.fn().mockResolvedValue({
                success: true,
                limit: 100,
                remaining: 99,
                reset: Date.now() + 60_000,
            }),
        } as any;

        await withRateLimit(req, mockLimiter);
        expect(mockLimiter.limit).toHaveBeenCalledWith('10.0.0.1');
    });

    it('uses provided identifier over client IP', async () => {
        const req = makeRequest('http://localhost/api/test', {
            'x-forwarded-for': '10.0.0.1',
        });

        const mockLimiter = {
            limit: jest.fn().mockResolvedValue({
                success: true,
                limit: 20,
                remaining: 19,
                reset: Date.now() + 60_000,
            }),
        } as any;

        await withRateLimit(req, mockLimiter, 'user-abc');
        expect(mockLimiter.limit).toHaveBeenCalledWith('user-abc');
    });
});
