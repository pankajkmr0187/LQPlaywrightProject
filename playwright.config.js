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
  ],

  use: {
    baseURL: "https://learnqoch.com",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    headless: false,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1',
    extraHTTPHeaders: {
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.5',
      'Accept-Encoding': 'gzip, deflate, br',
      'DNT': '1',
      'Connection': 'keep-alive',
      'Upgrade-Insecure-Requests': '1',
    },
  },

  /*
  Available Playwright Mobile Devices:
  
  Android Devices:
  - "Blackberry PlayBook"
  - "Blackberry PlayBook landscape"
  - "Galaxy Note 3"
  - "Galaxy Note 3 landscape"
  - "Galaxy Note II"
  - "Galaxy Note II landscape"
  - "Galaxy S III"
  - "Galaxy S III landscape"
  - "Galaxy S5"
  - "Galaxy S5 landscape"
  - "Galaxy S8"
  - "Galaxy S8 landscape"
  - "Galaxy S9+"
  - "Galaxy S9+ landscape"
  - "Galaxy Tab S4"
  - "Galaxy Tab S4 landscape"
  - "Kindle Fire HDX"
  - "Kindle Fire HDX landscape"
  - "LG Optimus L70"
  - "LG Optimus L70 landscape"
  - "Microsoft Lumia 550"
  - "Microsoft Lumia 550 landscape"
  - "Microsoft Lumia 950"
  - "Microsoft Lumia 950 landscape"
  - "Nexus 10"
  - "Nexus 10 landscape"
  - "Nexus 4"
  - "Nexus 4 landscape"
  - "Nexus 5"
  - "Nexus 5 landscape"
  - "Nexus 5X"
  - "Nexus 5X landscape"
  - "Nexus 6"
  - "Nexus 6 landscape"
  - "Nexus 6P"
  - "Nexus 6P landscape"
  - "Nexus 7"
  - "Nexus 7 landscape"
  - "Nokia Lumia 520"
  - "Nokia Lumia 520 landscape"
  - "Nokia N9"
  - "Nokia N9 landscape"
  - "Pixel 2"
  - "Pixel 2 landscape"
  - "Pixel 2 XL"
  - "Pixel 2 XL landscape"
  - "Pixel 3"
  - "Pixel 3 landscape"
  - "Pixel 4"
  - "Pixel 4 landscape"
  - "Pixel 5"
  - "Pixel 5 landscape"
  
  iPhone/iPad Devices:
  - "iPad"
  - "iPad landscape"
  - "iPad Mini"
  - "iPad Mini landscape"
  - "iPad Pro"
  - "iPad Pro landscape"
  - "iPhone 6"
  - "iPhone 6 landscape"
  - "iPhone 6 Plus"
  - "iPhone 6 Plus landscape"
  - "iPhone 7"
  - "iPhone 7 landscape"
  - "iPhone 7 Plus"
  - "iPhone 7 Plus landscape"
  - "iPhone 8"
  - "iPhone 8 landscape"
  - "iPhone 8 Plus"
  - "iPhone 8 Plus landscape"
  - "iPhone SE"
  - "iPhone SE landscape"
  - "iPhone X"
  - "iPhone X landscape"
  - "iPhone XR"
  - "iPhone XR landscape"
  - "iPhone 11"
  - "iPhone 11 landscape"
  - "iPhone 11 Pro"
  - "iPhone 11 Pro landscape"
  - "iPhone 11 Pro Max"
  - "iPhone 11 Pro Max landscape"
  - "iPhone 12"
  - "iPhone 12 landscape"
  - "iPhone 12 Pro"
  - "iPhone 12 Pro landscape"
  - "iPhone 12 Pro Max"
  - "iPhone 12 Pro Max landscape"
  - "iPhone 12 Mini"
  - "iPhone 12 Mini landscape"
  - "iPhone 13"
  - "iPhone 13 landscape"
  - "iPhone 13 Pro"
  - "iPhone 13 Pro landscape"
  - "iPhone 13 Pro Max"
  - "iPhone 13 Pro Max landscape"
  - "iPhone 13 Mini"
  - "iPhone 13 Mini landscape"
  - "iPhone 14"
  - "iPhone 14 landscape"
  - "iPhone 14 Plus"
  - "iPhone 14 Plus landscape"
  - "iPhone 14 Pro"
  - "iPhone 14 Pro landscape"
  - "iPhone 14 Pro Max"
  - "iPhone 14 Pro Max landscape"
  
  Desktop Browsers:
  - "Desktop Chrome"
  - "Desktop Firefox"
  - "Desktop Safari"
  - "Desktop Edge"
  
  Usage: Replace device name in ...devices["DEVICE_NAME"]
  Example: ...devices["iPhone 13 Pro Max"]
  */
  
  projects: [
    // Android Devices
    /*{
      name: "Galaxy S8",
      use: {
        ...devices["Galaxy S8"],
        viewport: { width: 360, height: 1500 },
        deviceScaleFactor: 1,
        isMobile: true,
        hasTouch: true,
        locale: "en-US",
        ignoreHTTPSErrors: true,
      },
    },
    {
      name: "Pixel 5",
      use: {
        ...devices["Pixel 5"],
        viewport: { width: 393, height: 1500 },
        deviceScaleFactor: 1,
        isMobile: true,
        hasTouch: true,
        locale: "en-US",
        ignoreHTTPSErrors: true,
      },
    },
    {
      name: "Galaxy Note II",
      use: {
        ...devices["Galaxy Note II"],
        viewport: { width: 360, height: 1500 },
        deviceScaleFactor: 1,
        isMobile: true,
        hasTouch: true,
        locale: "en-US",
        ignoreHTTPSErrors: true,
      },
    },
    
    // More Android Devices
    {
      name: "Galaxy S9+",
      use: {
        ...devices["Galaxy S9+"],
        viewport: { width: 320, height: 1500 },
        deviceScaleFactor: 1,
        isMobile: true,
        hasTouch: true,
        locale: "en-US",
        ignoreHTTPSErrors: true,
      },
    },
    {
      name: "Pixel 2",
      use: {
        ...devices["Pixel 2"],
        viewport: { width: 411, height: 1500 },
        deviceScaleFactor: 1,
        isMobile: true,
        hasTouch: true,
        locale: "en-US",
        ignoreHTTPSErrors: true,
      },
    },
    {
      name: "Pixel 3",
      use: {
        ...devices["Pixel 3"],
        viewport: { width: 393, height: 1500 },
        deviceScaleFactor: 1,
        isMobile: true,
        hasTouch: true,
        locale: "en-US",
        ignoreHTTPSErrors: true,
      },
    },
    {
      name: "Pixel 4",
      use: {
        ...devices["Pixel 4"],
        viewport: { width: 353, height: 1500 },
        deviceScaleFactor: 1,
        isMobile: true,
        hasTouch: true,
        locale: "en-US",
        ignoreHTTPSErrors: true,
      },
    },
    
    // iPhone Devices
    {
      name: "iPhone 6",
      use: {
        ...devices["iPhone 6"],
        viewport: { width: 375, height: 1500 },
        deviceScaleFactor: 1,
        isMobile: true,
        hasTouch: true,
        locale: "en-US",
        ignoreHTTPSErrors: true,
      },
    },
    {
      name: "iPhone 7",
      use: {
        ...devices["iPhone 7"],
        viewport: { width: 375, height: 1500 },
        deviceScaleFactor: 1,
        isMobile: true,
        hasTouch: true,
        locale: "en-US",
        ignoreHTTPSErrors: true,
      },
    },
    {
      name: "iPhone 8",
      use: {
        ...devices["iPhone 8"],
        viewport: { width: 375, height: 1500 },
        deviceScaleFactor: 1,
        isMobile: true,
        hasTouch: true,
        locale: "en-US",
        ignoreHTTPSErrors: true,
      },
    },
    {
      name: "iPhone X",
      use: {
        ...devices["iPhone X"],
        viewport: { width: 375, height: 1500 },
        deviceScaleFactor: 1,
        isMobile: true,
        hasTouch: true,
        locale: "en-US",
        ignoreHTTPSErrors: true,
      },
    },
    {
      name: "iPhone 11",
      use: {
        ...devices["iPhone 11"],
        viewport: { width: 414, height: 1500 },
        deviceScaleFactor: 1,
        isMobile: true,
        hasTouch: true,
        locale: "en-US",
        ignoreHTTPSErrors: true,
      },
    },
    {
      name: "iPhone 11 Pro",
      use: {
        ...devices["iPhone 11 Pro"],
        viewport: { width: 375, height: 1500 },
        deviceScaleFactor: 1,
        isMobile: true,
        hasTouch: true,
        locale: "en-US",
        ignoreHTTPSErrors: true,
      },
    },
    {
      name: "iPhone 11 Pro Max",
      use: {
        ...devices["iPhone 11 Pro Max"],
        viewport: { width: 414, height: 1500 },
        deviceScaleFactor: 1,
        isMobile: true,
        hasTouch: true,
        locale: "en-US",
        ignoreHTTPSErrors: true,
      },
    },
    {
      name: "iPhone 12",
      use: {
        ...devices["iPhone 12"],
        viewport: { width: 390, height: 1500 },
        deviceScaleFactor: 1,
        isMobile: true,
        hasTouch: true,
        locale: "en-US",
        ignoreHTTPSErrors: true,
      },
    },
    {
      name: "iPhone 12 Pro",
      use: {
        ...devices["iPhone 12 Pro"],
        viewport: { width: 390, height: 1500 },
        deviceScaleFactor: 1,
        isMobile: true,
        hasTouch: true,
        locale: "en-US",
        ignoreHTTPSErrors: true,
      },
    },
    {
      name: "iPhone 12 Pro Max",
      use: {
        ...devices["iPhone 12 Pro Max"],
        viewport: { width: 428, height: 1500 },
        deviceScaleFactor: 1,
        isMobile: true,
        hasTouch: true,
        locale: "en-US",
        ignoreHTTPSErrors: true,
      },
    },
    {
      name: "iPhone 13",
      use: {
        ...devices["iPhone 13"],
        viewport: { width: 390, height: 1500 },
        deviceScaleFactor: 1,
        isMobile: true,
        hasTouch: true,
        locale: "en-US",
        ignoreHTTPSErrors: true,
      },
    },
    {
      name: "iPhone 13 Pro",
      use: {
        ...devices["iPhone 13 Pro"],
        viewport: { width: 390, height: 1500 },
        deviceScaleFactor: 1,
        isMobile: true,
        hasTouch: true,
        locale: "en-US",
        ignoreHTTPSErrors: true,
      },
    },
    {
      name: "iPhone 13 Pro Max",
      use: {
        ...devices["iPhone 13 Pro Max"],
        viewport: { width: 428, height: 1500 },
        deviceScaleFactor: 1,
        isMobile: true,
        hasTouch: true,
        locale: "en-US",
        ignoreHTTPSErrors: true,
      },
    },
    {
      name: "iPhone 14",
      use: {
        ...devices["iPhone 14"],
        viewport: { width: 390, height: 1500 },
        deviceScaleFactor: 1,
        isMobile: true,
        hasTouch: true,
        locale: "en-US",
        ignoreHTTPSErrors: true,
      },
      launchOptions: {
        args: [
          "--window-size=300,600",
          "--window-position=1050,50",
          "--start-maximized=false",
          "--disable-web-security"
        ],
      },
    },
    {
      name: "iPhone 14 Pro",
      use: {
        ...devices["iPhone 14 Pro"],
        viewport: { width: 393, height: 1500 },
        deviceScaleFactor: 1,
        isMobile: true,
        hasTouch: true,
        locale: "en-US",
        ignoreHTTPSErrors: true,
      },
    },
    {
      name: "iPhone 14 Pro Max",
      use: {
        ...devices["iPhone 14 Pro Max"],
        viewport: { width: 430, height: 1500 },
        deviceScaleFactor: 1,
        isMobile: true,
        hasTouch: true,
        locale: "en-US",
        ignoreHTTPSErrors: true,
      },
    },
    {
      name: "iPhone SE",
      use: {
        ...devices["iPhone SE"],
        viewport: { width: 375, height: 1500 },
        deviceScaleFactor: 1,
        isMobile: true,
        hasTouch: true,
        locale: "en-US",
        ignoreHTTPSErrors: true,
      },
    },
    
    // iPad Devices
    {
      name: "iPad",
      use: {
        ...devices["iPad"],
        viewport: { width: 768, height: 1500 },
        deviceScaleFactor: 1,
        isMobile: true,
        hasTouch: true,
        locale: "en-US",
        ignoreHTTPSErrors: true,
      },
    },
    {
      name: "iPad Pro",
      use: {
        ...devices["iPad Pro"],
        viewport: { width: 1024, height: 1500 },
        deviceScaleFactor: 1,
        isMobile: true,
        hasTouch: true,
        locale: "en-US",
        ignoreHTTPSErrors: true,
      },
    },
    
    // Desktop Browsers
    {
      name: "Desktop Chrome",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1280, height: 1500 },
      },
    },
    {
      name: "Desktop Firefox",
      use: {
        ...devices["Desktop Firefox"],
        viewport: { width: 1280, height: 1500 },
      },
    },
    {
      name: "Desktop Safari",
      use: {
        ...devices["Desktop Safari"],
        viewport: { width: 1280, height: 1500 },
      },
    },*/


{
   name: "Mobile Chrome",
  use: {
    ...devices["Pixel 5"],
    browserName: "chromium",
    viewport: { width: 390, height: 844 },
    launchOptions: {
      headless: false,
      args: [
        "--window-size=400,700",
        "--window-position=900,50",   // 👈 moved 50 px left (was 950)
        "--start-maximized=false",
        "--disable-web-security",
        "--new-window"
      ],
    },
  },
},


  ],
});