// ============================================
// WAIT HELPERS
// ============================================
import { Page, Locator, expect } from '@playwright/test';

/**
 * Wait for element to be visible and stable
 * Better than waitForTimeout as it waits for actual state
 * @param locator - Element locator
 * @param timeout - Max wait time in ms (default: 30000)
 */
export async function waitForElementVisible(locator: Locator, timeout: number = 30000): Promise<void> {
    await locator.waitFor({ state: 'visible', timeout });
}

/**
 * Wait for element to be attached to DOM
 * @param locator - Element locator
 * @param timeout - Max wait time in ms (default: 30000)
 */
export async function waitForElementAttached(locator: Locator, timeout: number = 30000): Promise<void> {
    await locator.waitFor({ state: 'attached', timeout });
}

/**
 * Wait for element to be hidden/removed
 * @param locator - Element locator
 * @param timeout - Max wait time in ms (default: 30000)
 */
export async function waitForElementHidden(locator: Locator, timeout: number = 30000): Promise<void> {
    await locator.waitFor({ state: 'hidden', timeout });
}

/**
 * Wait for page to be fully loaded
 * @param page - Playwright page object
 * @param timeout - Max wait time in ms (default: 30000)
 */
export async function waitForPageLoad(page: Page, timeout: number = 30000): Promise<void> {
    await page.waitForLoadState('load', { timeout });
    await page.waitForLoadState('domcontentloaded', { timeout });
}

/**
 * Wait for network to be idle
 * Useful after form submissions or AJAX calls
 * @param page - Playwright page object
 * @param timeout - Max wait time in ms (default: 30000)
 */
export async function waitForNetworkIdle(page: Page, timeout: number = 30000): Promise<void> {
    await page.waitForLoadState('networkidle', { timeout });
}

/**
 * Wait for a specific URL pattern
 * @param page - Playwright page object
 * @param urlPattern - URL pattern (string or regex)
 * @param timeout - Max wait time in ms (default: 30000)
 */
export async function waitForURL(page: Page, urlPattern: string | RegExp, timeout: number = 30000): Promise<void> {
    await page.waitForURL(urlPattern, { timeout });
}

/**
 * Wait for table to load data
 * Waits for tbody to have at least one row
 * @param page - Playwright page object
 * @param tableSelector - Table selector (default: 'tbody tr')
 * @param timeout - Max wait time in ms (default: 30000)
 */
export async function waitForTableData(page: Page, tableSelector: string = 'tbody tr', timeout: number = 30000): Promise<void> {
    await page.waitForSelector(tableSelector, { state: 'attached', timeout });
    // Wait for at least one row
    await page.waitForFunction(
        (selector) => {
            const rows = document.querySelectorAll(selector);
            return rows.length > 0;
        },
        tableSelector,
        { timeout }
    );
}

/**
 * Wait for DataTable to finish loading
 * Waits for the processing indicator to disappear
 * @param page - Playwright page object
 * @param tableId - DataTable ID (optional)
 * @param timeout - Max wait time in ms (default: 30000)
 */
export async function waitForDataTableReady(page: Page, tableId?: string, timeout: number = 30000): Promise<void> {
    const processingSelector = tableId
        ? `#${tableId}_processing`
        : '.dataTables_processing';

    try {
        // Wait for processing indicator to appear (if it does)
        await page.waitForSelector(processingSelector, { state: 'visible', timeout: 1000 });
        // Then wait for it to disappear
        await page.waitForSelector(processingSelector, { state: 'hidden', timeout });
    } catch {
        // Processing indicator may not appear for fast operations
        // This is OK, just continue
    }
}

/**
 * Wait for modal/dialog to be visible
 * @param page - Playwright page object
 * @param modalSelector - Modal selector (default: '.modal.show')
 * @param timeout - Max wait time in ms (default: 30000)
 */
export async function waitForModal(page: Page, modalSelector: string = '.modal.show', timeout: number = 30000): Promise<void> {
    await page.waitForSelector(modalSelector, { state: 'visible', timeout });
}

/**
 * Wait for modal/dialog to close
 * @param page - Playwright page object
 * @param modalSelector - Modal selector (default: '.modal.show')
 * @param timeout - Max wait time in ms (default: 30000)
 */
export async function waitForModalClosed(page: Page, modalSelector: string = '.modal.show', timeout: number = 30000): Promise<void> {
    await page.waitForSelector(modalSelector, { state: 'hidden', timeout });
}

/**
 * Wait for snackbar/notification to appear
 * @param page - Playwright page object
 * @param snackbarSelector - Snackbar selector (default: '.snackbar.show')
 * @param timeout - Max wait time in ms (default: 10000)
 */
export async function waitForNotification(page: Page, snackbarSelector: string = '.snackbar.show', timeout: number = 10000): Promise<void> {
    await page.waitForSelector(snackbarSelector, { state: 'visible', timeout });
}

/**
 * Wait for element to be enabled (not disabled)
 * @param locator - Element locator
 * @param timeout - Max wait time in ms (default: 30000)
 */
export async function waitForEnabled(locator: Locator, timeout: number = 30000): Promise<void> {
    await expect(locator).toBeEnabled({ timeout });
}

/**
 * Wait for element text to contain specific text
 * @param locator - Element locator
 * @param text - Expected text
 * @param timeout - Max wait time in ms (default: 30000)
 */
export async function waitForText(locator: Locator, text: string | RegExp, timeout: number = 30000): Promise<void> {
    await expect(locator).toContainText(text, { timeout });
}

/**
 * Wait for element count to be specific number
 * Useful for waiting for search results
 * @param locator - Element locator
 * @param count - Expected count
 * @param timeout - Max wait time in ms (default: 30000)
 */
export async function waitForCount(locator: Locator, count: number, timeout: number = 30000): Promise<void> {
    await expect(locator).toHaveCount(count, { timeout });
}

/**
 * Smart wait - combines multiple wait strategies
 * Waits for element to be visible, attached, and stable
 * Can also handle Page objects for backward compatibility
 * @param locatorOrPage - Element locator or Page object
 * @param timeout - Max wait time in ms (default: 30000)
 */
export async function smartWait(locatorOrPage: Locator | Page, timeout: number = 30000): Promise<void> {
    // Type guard to check if it's a Page object
    if ('waitForLoadState' in locatorOrPage) {
        // It's a Page object - wait for page load
        const page = locatorOrPage as Page;
        await page.waitForLoadState('load', { timeout });
        await page.waitForLoadState('domcontentloaded', { timeout });
    } else {
        // It's a Locator - wait for element
        const locator = locatorOrPage as Locator;
        await locator.waitFor({ state: 'visible', timeout });
        await expect(locator).toBeVisible({ timeout });
    }
}

/**
 * Wait with retry logic
 * Retries a function until it succeeds or timeout
 * @param fn - Async function to retry
 * @param maxRetries - Maximum number of retries (default: 3)
 * @param delayMs - Delay between retries in ms (default: 1000)
 */
export async function waitWithRetry<T>(
    fn: () => Promise<T>,
    maxRetries: number = 3,
    delayMs: number = 1000
): Promise<T> {
    let lastError: Error | undefined;

    for (let i = 0; i < maxRetries; i++) {
        try {
            return await fn();
        } catch (error) {
            lastError = error as Error;
            if (i < maxRetries - 1) {
                await new Promise(resolve => setTimeout(resolve, delayMs));
            }
        }
    }

    throw lastError || new Error('waitWithRetry failed');
}
