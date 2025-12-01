import { defineConfig } from '@playwright/test'

export default defineConfig({
  webServer: {
    command: 'npm run dev -- --host --port 4173',
    url: 'http://localhost:4173',
    reuseExistingServer: true,
    stdout: 'ignore',
    stderr: 'pipe',
    timeout: 60_000,
  },
  use: {
    baseURL: 'http://localhost:4173',
    headless: true,
  },
  testDir: 'tests/e2e',
})
