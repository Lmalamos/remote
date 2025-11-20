import { expect, Locator, Page } from '@playwright/test';

export class providerSearchPage {
    readonly page: Page;

    readonly clientDropdown: Locator;
    readonly npi: Locator;
    readonly otherIdNumber: Locator;
    readonly lastOrganizationName: Locator;
    readonly firstName: Locator;
    readonly city: Locator;
    readonly state: Locator;
    readonly zipCode: Locator;
    readonly taxonomy: Locator;
    readonly searchButton: Locator;

    constructor(page: Page) {
        this.page = page;

        this.clientDropdown = page.locator('select').first();
        this.npi = page.locator('#txtAPSearchNPI');
        this.otherIdNumber = page.locator('#txtAPSearchOtherId');
        this.lastOrganizationName = page.locator('#txtAPSearchLastNameAndOrganization');
        this.firstName = page.locator('#txtAPSearchFirstName');
        this.city = page.locator('#txtAPSearchCity');
        this.state = page.locator('#sltAPSearchAddressState');
        this.zipCode = page.locator('#txtAPSearchZipCode');
        this.taxonomy = page.locator('#sltAPSearchTaxonomy');
        this.searchButton = page.locator('#searchAddProviderButton');
    }

    async searchProvider(client: string, npi: string, otherIdNumber: string, lastOrganizationName: string, firstName: string, city: string, state: string, zipCode: string, taxonomy: string) {
        //await this.page.pause();

        await this.npi.fill(npi);
        await this.searchButton.click();

        await expect(this.page.getByText('Showing 1 to 1 of 1 entries')).toBeVisible();
        await expect(this.page.locator('#providerTable_info')).toContainText('Showing 1 to 1 of 1 entries');
        
        await this.lastOrganizationName.fill(lastOrganizationName);
        await expect(this.lastOrganizationName).toHaveValue(lastOrganizationName);
        await this.firstName.fill(firstName);
        await expect(this.firstName).toHaveValue(firstName);
        await this.city.fill(city);
        await expect(this.city).toHaveValue(city);
        await this.state.selectOption(state);
        await expect(this.state).toHaveValue(state);
        await this.zipCode.fill(zipCode);
        await expect(this.zipCode).toHaveValue(zipCode);
        await this.taxonomy.selectOption(taxonomy);
        await this.searchButton.click();
        await expect(this.page.getByText('Showing 1 to 1 of 1 entries')).toBeVisible();
        await expect(this.page.locator('#providerTable_info')).toContainText('Showing 1 to 1 of 1 entries');

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