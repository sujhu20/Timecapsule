
import { checkRateLimit } from './rate-limit';
import { Ratelimit } from '@upstash/ratelimit';

// Mock Next.js server objects
jest.mock('next/server', () => ({
    NextRequest: jest.fn(),
    NextResponse: {
        json: jest.fn((body, init) => ({ body, status: init?.status, headers: init?.headers })),
        next: jest.fn(),
    },
}));

// Mock Redis and Ratelimit
jest.mock('@upstash/ratelimit');
jest.mock('@upstash/redis', () => ({
    Redis: jest.fn().mockImplementation(() => ({})),
}));

describe('Rate Limit Library', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should allow request if limiter is null (Redis disabled)', async () => {
        const result = await checkRateLimit('test-id', null);
        expect(result.success).toBe(true);
    });

    it('should allow request if limit is not exceeded', async () => {
        const mockLimit = jest.fn().mockResolvedValue({
            success: true,
            limit: 10,
            reset: Date.now() + 60000,
            remaining: 9,
        });

        const mockLimiter = { limit: mockLimit } as unknown as Ratelimit;

        const result = await checkRateLimit('test-id', mockLimiter);

        expect(result.success).toBe(true);
        expect(mockLimit).toHaveBeenCalledWith('test-id');
    });

    it('should block request if limit is exceeded', async () => {
        const mockLimit = jest.fn().mockResolvedValue({
            success: false,
            limit: 10,
            reset: Date.now() + 60000,
            remaining: 0,
        });

        const mockLimiter = { limit: mockLimit } as unknown as Ratelimit;

        const result = await checkRateLimit('test-id', mockLimiter);

        expect(result.success).toBe(false);
        expect(result.response).toBeDefined();
        expect(result.response?.status).toBe(429);
    });

    it('should handle errors gracefully (fail open)', async () => {
        const mockLimit = jest.fn().mockRejectedValue(new Error('Redis error'));
        const mockLimiter = { limit: mockLimit } as unknown as Ratelimit;

        // Should return success: true even on error (Graceful degradation)
        const result = await checkRateLimit('test-id', mockLimiter);

        expect(result.success).toBe(true);
    });
});
