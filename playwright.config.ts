import { defineConfig, devices } from '@playwright/test';
import { getCurrentEnvironment } from './tests/config/env.ts';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: `.env.${process.env.TEST_ENV || 'stage'}` });

const env = getCurrentEnvironment();

export default defineConfig({
  testDir: './tests',
  timeout: env.timeout,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  
  reporter: [
    ['html'],
    ['list'],
    ['junit', { outputFile: 'test-results/junit.xml' }]
  ],

  use: {
    baseURL: env.baseUrl,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    
    // Environment-specific timeout
    actionTimeout: env.timeout / 2,
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
    // {
    //   name: 'mobile-chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
  ],
});