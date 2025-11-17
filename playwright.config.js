import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  timeout: 0,
  expect: { timeout: 10000 },
  fullyParallel: false,
  workers: 1,
  retries: 0,

  reporter: [
    ["list"],
    ["html", { outputFolder: "test-reports/playwright-html", open: "never" }],
    ["json", { outputFile: "test-reports/playwright-html/results.json" }],

    // ⭐ Added global report generator (DO NOT REMOVE)
    ["./utils/global-report.js"]
  ],

  // --------------------------
  // GLOBAL USE SETTINGS
  // --------------------------
  use: {
    baseURL: "https://learnqoch.com",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure",

    // Local = headed, GitHub = headless
    headless: process.env.CI ? true : false,

    userAgent:
      "Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1",

    extraHTTPHeaders: {
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.5",
      "Accept-Encoding": "gzip, deflate, br",
      DNT: "1",
      Connection: "keep-alive",
      "Upgrade-Insecure-Requests": "1",
    },
  },

  // --------------------------
  // PROJECTS SECTION
  // --------------------------
  projects: [
    {
      name: "Mobile Chrome",
      use: {
        ...devices["Pixel 5"],
        browserName: "chromium",
        viewport: { width: 390, height: 844 },

        launchOptions: {
          args: [
            "--window-size=400,700",
            "--window-position=900,50",
            "--start-maximized=false",
            "--disable-web-security",
            "--new-window",
          ],
        },
      },
    },
  ],
});
