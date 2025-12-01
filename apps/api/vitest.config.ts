import dotenv from 'dotenv'
import tsconfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    clearMocks: true,
    slowTestThreshold: 3e3,
    testTimeout: 10e3,
    env: { ...dotenv.config({ path: '.env.test' }).parsed },
    setupFiles: ['./src/tests/setup.ts'],
    coverage: {
      include: ['src/**'],
      exclude: ['src/config/', 'src/entities/', 'src/tests/', 'src/@types/', 'src/logger.ts', 'src/server.ts'],
    },
  },
})
