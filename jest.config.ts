import type { Config } from 'jest';
import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
    // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
    dir: './',
});

// Add any custom config to be passed to Jest
const config: Config = {
    coverageProvider: 'v8',
    testEnvironment: 'jsdom',

    // Setup files
    setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],

    // Module paths
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
    },

    // Coverage configuration
    collectCoverageFrom: [
        'src/**/*.{js,jsx,ts,tsx}',
        '!src/**/*.d.ts',
        '!src/**/*.stories.{js,jsx,ts,tsx}',
        '!src/**/__tests__/**',
        '!src/**/__mocks__/**',
        '!src/app/layout.tsx',
        '!src/app/**/page.tsx', // Exclude page components (tested via E2E)
    ],

    // Coverage thresholds - ENFORCED
    coverageThreshold: {
        global: {
            branches: 80,
            functions: 80,
            lines: 80,
            statements: 80,
        },
        // Critical modules require 100% coverage
        './src/lib/unlock-service.ts': {
            branches: 100,
            functions: 100,
            lines: 100,
            statements: 100,
        },
    },

    // Test match patterns
    testMatch: [
        '**/__tests__/**/*.[jt]s?(x)',
        '**/?(*.)+(spec|test).[jt]s?(x)',
    ],

    // Transform configuration
    transform: {
        '^.+\\.(ts|tsx)$': ['ts-jest', {
            tsconfig: {
                jsx: 'react',
            },
        }],
    },

    // Ignore patterns
    testPathIgnorePatterns: [
        '/node_modules/',
        '/.next/',
        'src/app/actions/', // Ignore Vitest tests
        'src/__tests__/utils/',
    ],

    // Module file extensions
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],

    // Verbose output
    verbose: true,
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(config);
