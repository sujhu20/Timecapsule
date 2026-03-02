/**
 * @jest-environment node
 *
 * Logger Tests
 * Verifies development/production behavior and Sentry integration.
 */

// Mock Sentry before importing logger.
// NOTE: jest.mock factories are hoisted before `const` declarations, so we
// must use an inline jest.fn() here and retrieve it via jest.mocked() in tests.
jest.mock('@sentry/nextjs', () => ({
    captureException: jest.fn(),
}));

import { logger } from '@/lib/logger';

// Access private state by casting to any
const loggerAsAny = logger as any;

describe('Logger', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.spyOn(console, 'log').mockImplementation(() => { });
        jest.spyOn(console, 'warn').mockImplementation(() => { });
        jest.spyOn(console, 'error').mockImplementation(() => { });
        jest.spyOn(console, 'debug').mockImplementation(() => { });
    });

    afterEach(() => {
        jest.restoreAllMocks();
        // Restore defaults
        loggerAsAny.isDevelopment = true;
        loggerAsAny.isProduction = false;
    });

    describe('development mode', () => {
        beforeEach(() => {
            loggerAsAny.isDevelopment = true;
            loggerAsAny.isProduction = false;
        });

        it('info() should call console.log', () => {
            logger.info('test info');
            expect(console.log).toHaveBeenCalledWith('[INFO] test info', '');
        });

        it('warn() should call console.warn', () => {
            logger.warn('test warn');
            expect(console.warn).toHaveBeenCalledWith('[WARN] test warn', '');
        });

        it('debug() should call console.debug', () => {
            logger.debug('test debug');
            expect(console.debug).toHaveBeenCalledWith('[DEBUG] test debug', '');
        });

        it('error() should call console.error', () => {
            const err = new Error('boom');
            logger.error('error occurred', err);
            expect(console.error).toHaveBeenCalled();
        });

        it('api() should call console.log', () => {
            logger.api('GET', '/api/test');
            expect(console.log).toHaveBeenCalledWith('[API] GET /api/test', '');
        });

        it('auth() should call console.log', () => {
            logger.auth('login');
            expect(console.log).toHaveBeenCalledWith('[AUTH] login', '');
        });
    });

    describe('production mode', () => {
        const originalSentryDsn = process.env.SENTRY_DSN;

        beforeEach(() => {
            loggerAsAny.isDevelopment = false;
            loggerAsAny.isProduction = true;
        });

        afterEach(() => {
            process.env.SENTRY_DSN = originalSentryDsn;
        });

        it('info() should NOT call console.log', () => {
            logger.info('silent in prod');
            expect(console.log).not.toHaveBeenCalled();
        });

        it('warn() should NOT call console.warn', () => {
            logger.warn('silent warn');
            expect(console.warn).not.toHaveBeenCalled();
        });

        it('debug() should NOT call console.debug', () => {
            logger.debug('silent debug');
            expect(console.debug).not.toHaveBeenCalled();
        });

        it('error() should always call console.error', () => {
            logger.error('prod error');
            expect(console.error).toHaveBeenCalled();
        });

        it('error() should call Sentry.captureException when SENTRY_DSN is set', () => {
            process.env.SENTRY_DSN = 'https://fake@sentry.io/123';
            logger.error('sentry error', new Error('sentry test'));
            const { captureException } = jest.requireMock('@sentry/nextjs');
            expect(captureException).toHaveBeenCalled();
        });

        it('error() should NOT call Sentry when SENTRY_DSN is absent', () => {
            delete process.env.SENTRY_DSN;
            logger.error('no sentry', new Error('quiet'));
            const { captureException } = jest.requireMock('@sentry/nextjs');
            expect(captureException).not.toHaveBeenCalled();
        });
    });
});
