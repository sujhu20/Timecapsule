
export interface Logger {
    info(message: string, context?: Record<string, any>): void;
    error(message: string, error?: any, context?: Record<string, any>): void;
    warn(message: string, context?: Record<string, any>): void;
}

export const logger: Logger = {
    info(message, context) {
        console.log(JSON.stringify({ level: 'info', message, context, timestamp: new Date().toISOString() }));
    },
    error(message, error, context) {
        console.error(JSON.stringify({ level: 'error', message, error, context, timestamp: new Date().toISOString() }));
    },
    warn(message, context) {
        console.warn(JSON.stringify({ level: 'warn', message, context, timestamp: new Date().toISOString() }));
    }
};
