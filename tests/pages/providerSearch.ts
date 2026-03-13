import { expect, Locator, Page } from '@playwright/test';
import { ProviderSearchCriteria } from '../types';

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

    /**
     * Search for a provider using provided criteria
     * @param criteria - Provider search criteria object
     */
    async searchProvider(criteria: ProviderSearchCriteria) {
        if (criteria.npi) {
            await this.npi.fill(criteria.npi);
            await this.searchButton.click();
            await expect(this.page.getByText('Showing 1 to 1 of 1 entries')).toBeVisible();
        }

        if (criteria.lastOrganizationName) {
            await this.lastOrganizationName.fill(criteria.lastOrganizationName);
        }
        if (criteria.firstName) {
            await this.firstName.fill(criteria.firstName);
        }
        if (criteria.city) {
            await this.city.fill(criteria.city);
        }
        if (criteria.state) {
            await this.state.selectOption(criteria.state);
        }
        if (criteria.zipCode) {
            await this.zipCode.fill(criteria.zipCode);
        }
        if (criteria.taxonomy) {
            await this.taxonomy.selectOption(criteria.taxonomy);
        }

        await this.searchButton.click();
        await expect(this.page.getByText('Showing 1 to 1 of 1 entries')).toBeVisible();

        const rowCount = await this.page.locator('tbody tr').count();
        expect(rowCount).toBe(1);
    }
}