// Centralized logging utility for production
// Use this instead of console.log throughout the application
import * as Sentry from '@sentry/nextjs';

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogContext {
    [key: string]: any;
}

class Logger {
    private isDevelopment = process.env.NODE_ENV === 'development';
    private isProduction = process.env.NODE_ENV === 'production';

    /**
     * Log informational messages (development only)
     */
    info(message: string, context?: LogContext) {
        if (this.isDevelopment) {
            console.log(`[INFO] ${message}`, context || '');
        }
    }

    /**
     * Log warning messages (development only)
     */
    warn(message: string, context?: LogContext) {
        if (this.isDevelopment) {
            console.warn(`[WARN] ${message}`, context || '');
        }
    }

    /**
     * Log error messages (always logged, sent to error tracking in production)
     */
    error(message: string, error?: Error | unknown, context?: LogContext) {
        if (this.isDevelopment) {
            console.error(`[ERROR] ${message}`, error, context || '');
        }

        if (this.isProduction) {
            // Forward errors to Sentry when DSN is configured
            if (process.env.SENTRY_DSN) {
                Sentry.captureException(error instanceof Error ? error : new Error(message), {
                    extra: { message, ...context },
                });
            }
            console.error(`[ERROR] ${message}`, error instanceof Error ? error.message : error);
        }
    }

    /**
     * Log debug messages (development only)
     */
    debug(message: string, context?: LogContext) {
        if (this.isDevelopment) {
            console.debug(`[DEBUG] ${message}`, context || '');
        }
    }

    /**
     * Log API requests (development only)
     */
    api(method: string, endpoint: string, context?: LogContext) {
        if (this.isDevelopment) {
            console.log(`[API] ${method} ${endpoint}`, context || '');
        }
    }

    /**
     * Log authentication events (development only)
     */
    auth(event: string, context?: LogContext) {
        if (this.isDevelopment) {
            console.log(`[AUTH] ${event}`, context || '');
        }
    }
}

// Export singleton instance
export const logger = new Logger();

// Convenience exports
export const logInfo = logger.info.bind(logger);
export const logWarn = logger.warn.bind(logger);
export const logError = logger.error.bind(logger);
export const logDebug = logger.debug.bind(logger);
export const logApi = logger.api.bind(logger);
export const logAuth = logger.auth.bind(logger);
