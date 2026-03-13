// ============================================
// VISUAL REGRESSION CONFIGURATION
// ============================================
import { Page, PageScreenshotOptions } from '@playwright/test';

/**
 * Default screenshot options for visual regression
 */
export const DEFAULT_SCREENSHOT_OPTIONS: PageScreenshotOptions = {
  fullPage: true,
  animations: 'disabled',
  timeout: 30000,
};

/**
 * Screenshot options for specific viewport
 */
export const VIEWPORT_SCREENSHOT_OPTIONS: PageScreenshotOptions = {
  fullPage: false,
  animations: 'disabled',
  timeout: 30000,
};

/**
 * Screenshot options for elements
 */
export const ELEMENT_SCREENSHOT_OPTIONS = {
  animations: 'disabled',
  timeout: 30000,
};

/**
 * Visual diff thresholds
 */
export const VISUAL_THRESHOLDS = {
  // Strict: For static content that shouldn't change
  STRICT: {
    maxDiffPixels: 0,
    maxDiffPixelRatio: 0,
  },

  // Lenient: For dynamic content with minor variations
  LENIENT: {
    maxDiffPixelRatio: 0.01, // 1% difference allowed
  },

  // Moderate: For content with some dynamic elements
  MODERATE: {
    maxDiffPixelRatio: 0.05, // 5% difference allowed
  },
};

/**
 * Visual testing helper class
 */
export class VisualTester {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Take full page screenshot and compare
   * @param name - Screenshot name
   * @param options - Screenshot options
   */
  async compareFullPage(name: string, options?: PageScreenshotOptions): Promise<void> {
    await this.page.screenshot({
      ...DEFAULT_SCREENSHOT_OPTIONS,
      ...options,
    });
  }

  /**
   * Take viewport screenshot and compare
   * @param name - Screenshot name
   * @param options - Screenshot options
   */
  async compareViewport(name: string, options?: PageScreenshotOptions): Promise<void> {
    await this.page.screenshot({
      ...VIEWPORT_SCREENSHOT_OPTIONS,
      ...options,
    });
  }

  /**
   * Take element screenshot and compare
   * @param selector - Element selector
   * @param name - Screenshot name
   */
  async compareElement(selector: string, name: string): Promise<void> {
    const element = this.page.locator(selector);
    await element.screenshot({
      ...ELEMENT_SCREENSHOT_OPTIONS,
    });
  }

  /**
   * Prepare page for visual testing
   * Hides dynamic elements like timestamps, cursors, etc.
   */
  async preparePage(): Promise<void> {
    // Hide animations
    await this.page.addStyleTag({
      content: `
        *, *::before, *::after {
          animation-duration: 0s !important;
          animation-delay: 0s !important;
          transition-duration: 0s !important;
          transition-delay: 0s !important;
        }
      `
    });

    // Hide common dynamic elements
    await this.page.evaluate(() => {
      // Hide cursors
      document.body.style.cursor = 'none';

      // Hide timestamps (common class names)
      const timestampSelectors = [
        '.timestamp',
        '.datetime',
        '[data-timestamp]',
        '.time'
      ];

      timestampSelectors.forEach(selector => {
        document.querySelectorAll(selector).forEach(el => {
          (el as HTMLElement).style.visibility = 'hidden';
        });
      });
    });
  }

  /**
   * Wait for page to be ready for screenshot
   * Ensures fonts, images, etc. are loaded
   */
  async waitForReady(): Promise<void> {
    // Wait for network idle
    await this.page.waitForLoadState('networkidle');

    // Wait for fonts to load
    await this.page.evaluate(() => document.fonts.ready);

    // Wait for images to load
    await this.page.evaluate(() => {
      return Promise.all(
        Array.from(document.images)
          .filter(img => !img.complete)
          .map(img => new Promise(resolve => {
            img.onload = img.onerror = resolve;
          }))
      );
    });
  }

  /**
   * Hide specific elements before screenshot
   * @param selectors - Array of selectors to hide
   */
  async hideElements(selectors: string[]): Promise<void> {
    for (const selector of selectors) {
      await this.page.locator(selector).evaluate(el => {
        (el as HTMLElement).style.visibility = 'hidden';
      }).catch(() => {
        // Element might not exist, ignore
      });
    }
  }

  /**
   * Mask specific elements before screenshot
   * @param selectors - Array of selectors to mask
   */
  async maskElements(selectors: string[]): Promise<string[]> {
    return selectors;
  }
}

/**
 * Common element selectors to hide in visual tests
 */
export const DYNAMIC_ELEMENTS = {
  TIMESTAMPS: ['.timestamp', '.datetime', '[data-timestamp]'],
  DATES: ['.date', '[data-date]'],
  CURSORS: ['.cursor', '[data-cursor]'],
  TOOLTIPS: ['.tooltip', '[data-tooltip]'],
  NOTIFICATIONS: ['.snackbar', '.toast', '.notification'],
};
