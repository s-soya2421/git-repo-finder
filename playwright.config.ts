import { defineConfig, devices } from "@playwright/test";

const MOCK_PORT = 3099;
const APP_PORT = 3100;

export default defineConfig({
  testDir: "./e2e",
  testMatch: "**/*.spec.ts",
  timeout: 60_000,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  globalSetup: "./e2e/global-setup.ts",
  use: {
    baseURL: `http://localhost:${APP_PORT}`,
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: `GITHUB_API_BASE_URL=http://localhost:${MOCK_PORT} npx next dev --port ${APP_PORT}`,
    url: `http://localhost:${APP_PORT}`,
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});
