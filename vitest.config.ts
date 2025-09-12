import { resolve } from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    deps: {
      optimizer: {
        web: {
          enabled: true,
          include: ['react', 'react-dom', '@testing-library/react', 'drizzle-orm'],
        },
      },
    },
  },
  resolve: {
    alias: {
      '~': resolve(__dirname, './src'),
      '~tests': resolve(__dirname, './tests'),
    },
  },
  esbuild: {
    jsx: 'automatic',
  },
})
