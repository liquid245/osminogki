const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests/e2e',
  timeout: 30_000,
  fullyParallel: true,
  reporter: 'list',
  use: {
    baseURL: 'http://127.0.0.1:8080',
    trace: 'on-first-retry'
  },
  webServer: {
    command: 'npm run serve -- --port 8080',
    url: 'http://127.0.0.1:8080',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000
  },
  projects: [
    {
      name: 'chromium',
      use: {
        browserName: 'chromium',
        viewport: { width: 1280, height: 720 }
      }
    }
  ]
});
