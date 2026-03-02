
import { defineConfig } from 'vitest/config'
// @ts-ignore — @vitejs/plugin-react needs 'bundler'/'node16' moduleResolution; works at runtime
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
    plugins: [react()],
    test: {
        environment: 'jsdom',
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
})
