// ============================================
// TABLE INTERACTION HELPERS
// ============================================
import { Page, Locator } from '@playwright/test';

/**
 * Search in a DataTable search box
 * @param page - Playwright page object
 * @param searchTerm - Term to search for
 * @param tableId - Optional table ID for specific table search
 */
export async function searchInTable(page: Page, searchTerm: string, tableId?: string) {
    const searchSelector = tableId
        ? `#${tableId}_filter input[type="search"]`
        : 'input[type="search"]';

    await page.locator(searchSelector).fill(searchTerm);
}

/**
 * Change the number of entries shown in a DataTable
 * @param page - Playwright page object
 * @param entriesCount - Number of entries to show ('10', '25', '50', '100')
 * @param tableId - Optional table ID for specific table
 */
export async function changeTableEntriesCount(page: Page, entriesCount: string, tableId?: string) {
    const selector = tableId
        ? `select[name="${tableId}_length"]`
        : 'select[name*="_length"]';

    await page.locator(selector).selectOption(entriesCount);
}

/**
 * Get the count of visible rows in a table
 * @param page - Playwright page object
 * @param tableSelector - Table selector (default: 'tbody tr')
 * @returns Number of rows
 */
export async function getTableRowCount(page: Page, tableSelector: string = 'tbody tr'): Promise<number> {
    return await page.locator(tableSelector).count();
}

/**
 * Clear table search
 * @param page - Playwright page object
 * @param tableId - Optional table ID for specific table
 */
export async function clearTableSearch(page: Page, tableId?: string) {
    const searchSelector = tableId
        ? `#${tableId}_filter input[type="search"]`
        : 'input[type="search"]';

    await page.locator(searchSelector).clear();
}

/**
 * Click a specific row in a table by index
 * @param page - Playwright page object
 * @param rowIndex - Zero-based row index
 * @param tableSelector - Table body selector (default: 'tbody')
 */
export async function clickTableRow(page: Page, rowIndex: number, tableSelector: string = 'tbody') {
    await page.locator(`${tableSelector} tr`).nth(rowIndex).click();
}

/**
 * Get text from a specific cell
 * @param page - Playwright page object
 * @param rowIndex - Zero-based row index
 * @param columnIndex - Zero-based column index
 * @returns Cell text content
 */
export async function getCellText(page: Page, rowIndex: number, columnIndex: number): Promise<string> {
    const cell = page.locator('tbody tr').nth(rowIndex).locator('td').nth(columnIndex);
    return await cell.textContent() || '';
}
