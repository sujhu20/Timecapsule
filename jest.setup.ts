import '@testing-library/jest-dom';

// Mock environment variables for tests
Object.defineProperty(process.env, 'NODE_ENV', { value: 'test', configurable: true });
process.env.DATABASE_URL = 'file:./test.db';
process.env.NEXTAUTH_SECRET = 'test-secret-min-32-characters-long';
process.env.NEXTAUTH_URL = 'http://localhost:3000';
process.env.ENCRYPTION_KEY = 'dGVzdC1rZXktZm9yLXRlc3RpbmctcHVycG9zZXMtb25seTEyMzQ1Ng=='; // base64 encoded 32-byte key

// Mock Next.js router
jest.mock('next/navigation', () => ({
    useRouter() {
        return {
            push: jest.fn(),
            replace: jest.fn(),
            prefetch: jest.fn(),
            back: jest.fn(),
        };
    },
    usePathname() {
        return '/';
    },
    useSearchParams() {
        return new URLSearchParams();
    },
}));

// Mock NextAuth
jest.mock('next-auth/react', () => ({
    useSession: jest.fn(() => ({
        data: null,
        status: 'unauthenticated',
    })),
    signIn: jest.fn(),
    signOut: jest.fn(),
}));

// Suppress console errors in tests (unless explicitly testing error handling)
global.console = {
    ...console,
    error: jest.fn(),
    warn: jest.fn(),
};

// Polyfill Web APIs for Next.js App Router (if JSDOM is missing them or for Node env)
if (typeof global.Request === 'undefined') {
    global.Request = class Request {
        constructor(input: any, init?: any) {
            this.url = input;
            this.method = init?.method || 'GET';
            this.headers = new Headers(init?.headers);
        }
        url: string;
        method: string;
        headers: Headers;
    } as any;
}

if (typeof global.Response === 'undefined') {
    global.Response = class Response {
        constructor(body?: any, init?: any) {
            this.status = init?.status || 200;
        }
        status: number;
        json() { return Promise.resolve({}); }
    } as any;
}

if (typeof global.Headers === 'undefined') {
    global.Headers = class Headers {
        constructor(init?: any) { }
        get(key: string) { return null; }
    } as any;
}

if (typeof global.fetch === 'undefined') {
    global.fetch = jest.fn();
}
