// ============================================
// ENHANCED PLAYWRIGHT CONFIGURATION
// Phase 4: Cross-browser, better reporting, optimizations
// ============================================
import { defineConfig, devices } from '@playwright/test';
import { getCurrentEnvironment } from './tests/config/env.ts';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: `.env.${process.env.TEST_ENV || 'stage'}` });

const env = getCurrentEnvironment();

export default defineConfig({
  testDir: './tests',
  timeout: env.timeout,

  // Sharding for parallel execution
  // Run with: npx playwright test --shard=1/4
  // fullyParallel: true,

  // Global setup/teardown
  // globalSetup: require.resolve('./tests/setup/global-setup.ts'),
  // globalTeardown: require.resolve('./tests/setup/global-teardown.ts'),

  // Fail fast options
  forbidOnly: !!process.env.CI,
  maxFailures: process.env.CI ? 10 : undefined, // Stop after 10 failures in CI

  // Retry configuration
  retries: process.env.CI ? 2 : 0,

  // Worker configuration
  workers: process.env.CI ? 4 : undefined, // 4 workers in CI

  // Grep configuration for tags
  // Run with: npx playwright test --grep @smoke
  grep: process.env.TEST_TAGS ? new RegExp(process.env.TEST_TAGS) : undefined,

  // Enhanced reporting
  reporter: [
    // HTML Report
    ['html', {
      outputFolder: 'playwright-report',
      open: process.env.CI ? 'never' : 'on-failure',
    }],

    // List reporter for console output
    ['list', {
      printSteps: true,
    }],

    // JUnit for CI integration
    ['junit', {
      outputFile: 'test-results/junit.xml',
      embedAnnotationsAsProperties: true,
    }],

    // JSON reporter for custom processing
    ['json', {
      outputFile: 'test-results/results.json',
    }],

    // Allure reporter (requires @playwright/test with allure)
    // ['allure-playwright', {
    //   outputFolder: 'allure-results',
    //   detail: true,
    //   suiteTitle: true,
    // }],

    // Custom reporter
    // ['./tests/reporters/customReporter.ts'],
  ],

  use: {
    // Base URL from environment
    baseURL: env.baseUrl,

    // Tracing
    trace: process.env.CI ? 'on-first-retry' : 'retain-on-failure',

    // Screenshots
    screenshot: 'only-on-failure',

    // Video
    video: process.env.CI ? 'retain-on-failure' : 'off',

    // Timeouts
    actionTimeout: env.timeout / 2,
    navigationTimeout: env.timeout,

    // Context options
    viewport: { width: 1920, height: 1080 },
    ignoreHTTPSErrors: true,

    // Geolocation (if needed)
    // geolocation: { longitude: -93.6250, latitude: 42.0308 }, // Ames, IA
    // permissions: ['geolocation'],

    // Locale
    locale: 'en-US',
    timezoneId: 'America/Chicago',

    // Color scheme
    colorScheme: 'light',

    // Device scale factor
    deviceScaleFactor: 1,

    // Accept downloads
    acceptDownloads: true,
  },

  // Test match patterns
  testMatch: [
    '**/*.spec.ts',
    '**/*.test.ts',
  ],

  // Ignore patterns
  testIgnore: [
    '**/*.refactored.spec.ts', // Ignore example files
    '**/*.phase3.spec.ts',     // Ignore example files
  ],

  projects: [
    // Desktop Browsers
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        channel: 'chrome', // Use Chrome instead of Chromium
      },
      // Run only smoke tests in chromium
      // testMatch: /.*smoke.*.spec.ts/,
    },

    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
      },
      // Run only tagged tests
      // grep: /@firefox-only|@smoke/,
    },

    {
      name: 'webkit',
      use: {
        ...devices['Desktop Safari'],
      },
      // Run only specific tests
      // testMatch: /.*smoke.*.spec.ts/,
    },

    // Mobile viewports
    {
      name: 'mobile-chrome',
      use: {
        ...devices['Pixel 5'],
      },
      // Mobile-specific tests
      // testMatch: /.*mobile.*.spec.ts/,
    },

    {
      name: 'mobile-safari',
      use: {
        ...devices['iPhone 13'],
      },
      // testMatch: /.*mobile.*.spec.ts/,
    },

    // Tablet viewports
    {
      name: 'tablet',
      use: {
        ...devices['iPad Pro'],
      },
      // testMatch: /.*tablet.*.spec.ts/,
    },

    // API Testing (no browser)
    {
      name: 'api',
      use: {
        baseURL: env.apiUrl,
      },
      testMatch: /.*api.*.spec.ts/,
    },

    // Visual Regression (specific browser for consistency)
    {
      name: 'visual-chrome',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 },
      },
      testMatch: /.*visual.*.spec.ts/,
    },

    // Performance testing
    {
      name: 'performance',
      use: {
        ...devices['Desktop Chrome'],
        trace: 'on', // Always trace for performance analysis
      },
      testMatch: /.*performance.*.spec.ts/,
    },
  ],

  // Webserver (if running local dev server)
  // webServer: {
  //   command: 'npm run dev',
  //   port: 3000,
  //   timeout: 120000,
  //   reuseExistingServer: !process.env.CI,
  // },

  // Expect configuration
  expect: {
    timeout: 10000,
    toHaveScreenshot: {
      maxDiffPixels: 100,
      threshold: 0.2,
      animations: 'disabled',
    },
    toMatchSnapshot: {
      maxDiffPixels: 100,
    },
  },

  // Metadata
  metadata: {
    environment: process.env.TEST_ENV || 'stage',
    buildNumber: process.env.BUILD_NUMBER,
    branch: process.env.GIT_BRANCH,
  },
});
