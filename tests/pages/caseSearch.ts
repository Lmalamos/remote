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
        await this.caseId.fill(caseId);
        await expect(this.caseId).toHaveValue(caseId);
        await this.searchButton.click();

        const rowCount = await this.page.locator('tbody tr').count();
        expect(rowCount).toBe(1);
    }

    async searchByRequestId(requestId: string) {
        await this.searchByRequestIdCheckBox.check();
        await this.requestId.fill(requestId);
        await expect(this.requestId).toHaveValue(requestId);
        await this.searchButton.click();

        const rowCount = await this.page.locator('tbody tr').count();
        expect(rowCount).toBe(1);
    }
}