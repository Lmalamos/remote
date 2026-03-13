// ============================================
// COMMON ASSERTION HELPERS
// ============================================
import { expect, Page, Locator } from '@playwright/test';

/**
 * Verify that a table has exactly the expected number of rows
 * @param page - Playwright page object
 * @param rowCount - Expected number of rows
 * @param tableSelector - Optional selector for specific table (default: 'tbody tr')
 */
export async function verifyTableRowCount(page: Page, rowCount: number, tableSelector: string = 'tbody tr') {
    const actualCount = await page.locator(tableSelector).count();
    expect(actualCount).toBe(rowCount);
}

/**
 * Verify that text is visible on the page with a custom error message
 * @param page - Playwright page object
 * @param text - Text to search for
 * @param message - Custom assertion message
 */
export async function verifyTextVisible(page: Page, text: string, message?: string) {
    await expect(page.getByText(text), message).toBeVisible();
}

/**
 * Verify table shows expected entry count message
 * @param page - Playwright page object
 * @param totalEntries - Total number of entries
 * @param start - Starting entry number (default: 1)
 * @param end - Ending entry number (default: equals totalEntries)
 */
export async function verifyTableEntries(page: Page, totalEntries: number, start: number = 1, end?: number) {
    const endEntry = end || totalEntries;
    const expectedText = `Showing ${start} to ${endEntry} of ${totalEntries} entries`;
    await expect(page.getByText(expectedText)).toBeVisible();
}

/**
 * Verify that a locator has the expected value
 * @param locator - Playwright locator
 * @param expectedValue - Expected value
 */
export async function verifyInputValue(locator: Locator, expectedValue: string) {
    await expect(locator).toHaveValue(expectedValue);
}

/**
 * Verify that error message contains expected text
 * @param page - Playwright page object
 * @param errorText - Expected error text
 * @param selector - Error container selector (default: '.snackbar.error.show')
 */
export async function verifyErrorMessage(page: Page, errorText: string, selector: string = '.snackbar.error.show') {
    await expect(page.locator(selector)).toContainText(errorText);
}

/**
 * Verify that "No matching records found" is displayed in a table
 * @param page - Playwright page object
 */
export async function verifyNoMatchingRecords(page: Page) {
    await expect(page.getByRole('alert')).toContainText('No matching records found');
}

/**
 * Verify that "No data available in table" is displayed
 * @param page - Playwright page object
 */
export async function verifyNoDataInTable(page: Page) {
    await expect(page.getByText('No data available in table')).toBeVisible();
}
