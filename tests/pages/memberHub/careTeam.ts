import { test, expect, Locator, Page } from '@playwright/test';

export class careTeamPanel {
    readonly page: Page;

    readonly careTeamHeader: Locator;

    constructor(page: Page) {
        this.page = page;

        this.careTeamHeader = page.locator('h3:has-text("Care Team")');
    }

    async addCareTeam(searchTerm: string) {
        await this.careTeamHeader.click();
    }

    async verifyCareTeamData() {
        await this.page.getByRole('button', { name: 'Care Team' }).click();
        await this.page.mouse.move(0, 500);

        //PRIMARY CARE PHYSICIAN:
        await this.page.getByText('Primary Care Physician', { exact: true }).click();
        await expect(this.page.locator('#primaryCarePhysicianTable_info')).toContainText('Showing 1 to 1 of 1 entries');
        const page1Promise = this.page.waitForEvent('popup');
        await this.page.getByRole('link', { name: 'ACOSTA, JUAN - open in a new' }).click();

        //VERIFY PROVIDER:
        expect(this.page.locator('strong:has-text("JUAN ACOSTA")'));

        const page1 = await page1Promise;
        await page1.close();

        //ADD PRIMARY CARE PHYSICIAN:
        await this.page.getByTitle('Add Primary Care Physician').click();
        await this.page.getByRole('button', { name: 'Yes' }).click();
        await this.page.getByRole('textbox', { name: 'City' }).click();
        await this.page.getByRole('textbox', { name: 'City' }).fill('Ames');
        await this.page.getByLabel('State').selectOption('IA');
        await this.page.getByRole('textbox', { name: 'Zip Code' }).click();
        await this.page.getByRole('textbox', { name: 'Zip Code' }).fill('50010');
        await this.page.getByRole('button', { name: 'Search', exact: true }).click();
        await this.page.getByRole('button', { name: 'Cancel' }).click();
        await this.page.getByRole('button', { name: '' }).click();
        await this.page.getByRole('button', { name: 'No', exact: true }).click();
        await this.page.getByText('Primary Care Physician', { exact: true }).click();

        //PRIMARY CARE FACILITY:
        await this.page.getByText('Primary Care Facility', { exact: true }).click();
        await expect(this.page.locator('#primaryCareFacilityTable_info')).toContainText('Showing 1 to 1 of 1 entries');
        const page2Promise = this.page.waitForEvent('popup');
        await this.page.getByRole('link', { name: 'ADVANCED CHIROPRACTIC, INC' }).click();

        //VERIFY PROVIDER:
        expect(this.page.locator('strong:has-text("ADVANCED CHIROPRACTIC, INC.")'));

        const page2 = await page2Promise;
        await page2.close();

        //ADD PRIMARY CARE FACILITY:
        await this.page.getByText('Primary Care Facility', { exact: true }).click();
        await this.page.getByTitle('Add Primary Care Facility').click();
        await this.page.getByRole('button', { name: 'Yes' }).click();
        await this.page.getByRole('textbox', { name: 'City' }).click();
        await this.page.getByRole('textbox', { name: 'City' }).fill('Ames');
        await this.page.getByLabel('State').selectOption('IA');
        await this.page.getByRole('textbox', { name: 'Zip Code' }).click();
        await this.page.getByRole('textbox', { name: 'Zip Code' }).fill('50010');
        await this.page.getByRole('button', { name: 'Search', exact: true }).click();
        await this.page.getByRole('button', { name: 'Cancel' }).click();
        await this.page.getByText('Primary Care Facility', { exact: true }).click();

        //OTHER PROVIDERS:
        await this.page.getByText('Other Providers', { exact: true }).click();
        //await expect(this.page.locator('#otherProvidersTable_info')).toContainText('Showing 1 to 10 of 207 entries');
        const page3Promise = this.page.waitForEvent('popup');
        await this.page.getByRole('link', { name: 'ANDERSON, KENNETH - open in a' }).first().click();
        expect(this.page.locator('strong:has-text("KENNETH ANDERSON")'));

        const page3 = await page3Promise;
        await page3.close();

        //ADD OTHER PROVIDERS:
        await this.page.getByText('Other Providers', { exact: true }).click();
        await this.page.getByRole('button', { name: '' }).nth(2).click();
        await this.page.getByRole('button', { name: 'No', exact: true }).click();
        await this.page.getByTitle('Add Other Provider').click();
        await this.page.getByRole('textbox', { name: 'City' }).click();
        await this.page.getByRole('textbox', { name: 'City' }).fill('Ames');
        await this.page.getByLabel('State').selectOption('IA');
        await this.page.getByRole('textbox', { name: 'Zip Code' }).click();
        await this.page.getByRole('textbox', { name: 'Zip Code' }).fill('50010');
        await this.page.getByRole('button', { name: 'Search', exact: true }).click();
        await this.page.getByRole('button', { name: 'Cancel' }).click();
        await this.page.getByText('Other Providers', { exact: true }).click();

        //MEMBER DESIGNATES/CONTACTS:
        await this.page.getByText('Member Designates/Contacts', { exact: true }).click();
        //await expect(this.page.locator('#memberDesignatesTable_info')).toContainText('Showing 1 to 10 of 79 entries');

        //ADD MEMBER DESIGNATES/CONTACTS:
        await this.page.getByText('Member Designates/Contacts', { exact: true }).click();
        await this.page.getByTitle('Add Member Designate/Contact').click();
        await this.page.getByRole('textbox', { name: 'First Name *' }).click();
        await this.page.getByRole('textbox', { name: 'First Name *' }).fill('Test');
        await this.page.getByRole('textbox', { name: 'Last Name / Organization Name' }).click();
        await this.page.getByRole('textbox', { name: 'Last Name / Organization Name' }).fill('Inc');
        await this.page.getByLabel('Relationship to Member').selectOption('27');
        await this.page.getByRole('radio', { name: 'Verbal' }).check();
        await this.page.locator('.input-group-addon > .fa').click();
        await this.page.getByRole('textbox', { name: 'Phone Number *' }).click({ clickCount: 3});
        
        await this.page.keyboard.press('1');
        await this.page.keyboard.press('1');
        await this.page.keyboard.press('1');
        //-
        await this.page.keyboard.press('1');
        await this.page.keyboard.press('1');
        await this.page.keyboard.press('1');
        //-
        await this.page.keyboard.press('1');
        await this.page.keyboard.press('1');
        await this.page.keyboard.press('1');
        await this.page.keyboard.press('1');

        await this.page.getByLabel('Phone Type').selectOption('21');
        await this.page.getByRole('button', { name: 'Close', exact: true }).click();
        await this.page.getByText('Member Designates/Contacts', { exact: true }).click();
    }
}