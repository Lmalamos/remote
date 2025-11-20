import { expect, Locator, Page } from '@playwright/test';

export class caseSearchPage {
    readonly page: Page;

    readonly caseId: Locator;
    readonly requestId: Locator;
    readonly searchByRequestIdCheckBox: Locator;
    readonly searchButton: Locator;

    constructor(page: Page) {
        this.page = page;

        this.caseId = page.locator('#caseClaimSearchCaseId');
        this.requestId = page.locator('#caseClaimSearchRequestId');
        this.searchByRequestIdCheckBox = page.locator('#caseClaimSearchByRequestId');
        this.searchButton = page.getByRole('button', { name: 'Search', exact: true });
    }

    async searchByCaseId(caseId: string) {
        //await this.page.pause();

        await this.caseId.fill(caseId);
        await expect(this.caseId).toHaveValue(caseId);
        await this.searchButton.click();

        //await expect(this.page.getByText('Showing 1 to 1 of 1 entries')).toBeVisible();
        //await expect(this.page.locator('#providerTable_info')).toContainText('Showing 1 to 1 of 1 entries');

        //const rows = this.page.locator('tbody tr');
        //await expect(rows).toHaveCount(1);

        
        // Wait for search results (optional if already awaited)
        //await this.page.waitForSelector('tbody tr');

        // Get the number of rows
        const rowCount = await this.page.locator('tbody tr').count();

        // Assert that there is exactly 1 record
        expect(rowCount).toBe(1);
    }

    async searchByRequestId(requestId: string) {
        //await this.page.pause();
        
        await this.searchByRequestIdCheckBox.check();
        await this.requestId.fill(requestId);
        await expect(this.requestId).toHaveValue(requestId);
        await this.searchButton.click();

        //await expect(this.page.getByText('Showing 1 to 1 of 1 entries')).toBeVisible();
        //await expect(this.page.locator('#providerTable_info')).toContainText('Showing 1 to 1 of 1 entries');

        //const rows = this.page.locator('tbody tr');
        //await expect(rows).toHaveCount(1);

        
        // Wait for search results (optional if already awaited)
        //await this.page.waitForSelector('tbody tr');

        // Get the number of rows
        const rowCount = await this.page.locator('tbody tr').count();

        // Assert that there is exactly 1 record
        expect(rowCount).toBe(1);
    }
}