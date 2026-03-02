
import { defineConfig } from 'vitest/config'
// @ts-ignore — @vitejs/plugin-react needs 'bundler'/'node16' moduleResolution; works at runtime
import react from '@vitejs/plugin-react'
import path from 'path'
import dotenv from 'dotenv'

// Load .env.test into process.env so tests see DATABASE_URL, NEXTAUTH_SECRET, etc.
dotenv.config({ path: path.resolve(__dirname, '.env.test') })

export default defineConfig({
    plugins: [react()],
    test: {
        environment: 'jsdom',
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
        // Only run files that use Vitest (stress.test.ts in app/actions, etc.)
        include: ['src/app/actions/**/*.test.ts', 'src/app/actions/**/*.spec.ts'],
        // Exclude Jest-based tests and node_modules from Vitest
        exclude: ['src/lib/**', 'node_modules/**', '.next/**'],
    },
})
