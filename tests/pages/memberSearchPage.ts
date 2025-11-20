import { expect, Locator, Page } from '@playwright/test';

export class memberSearchPage {
    readonly page: Page;

    readonly clientDropdown: Locator;
    readonly searchInput: Locator;
    readonly searchButton: Locator;

    constructor(page: Page) {
        this.page = page;

        this.clientDropdown = page.locator('select').first();
        this.searchInput = page.locator('[placeholder="Member\\ ID"]');
        this.searchButton = page.locator('button:has-text("Search")');
    }

    async searchMember(client: string, memberId: string) {
        await this.page.selectOption('select', { label: client });
        await this.page.fill('[placeholder="Member\\ ID"]', memberId);
        await this.page.click('button:has-text("Search")');
        //await this.page.waitForLoadState('networkidle');
    }

    async addMember(firstName: string, lastName: string, birthDate: string, gender: string, ssn: string, memberId: string, address: string, city: string, state: string, zip: string, client: string) {
        await this.page.getByRole('button', { name: ' Add Member' }).click();
        await this.page.getByRole('textbox', { name: 'First Name *' }).click();
        await this.page.getByRole('textbox', { name: 'First Name *' }).fill('Test');
        await this.page.getByRole('textbox', { name: 'Last Name *' }).click();
        await this.page.getByRole('textbox', { name: 'Last Name *' }).fill('Tester');
        await this.page.getByRole('textbox', { name: 'Birth Date *' }).click({ clickCount: 3 });

        await this.page.keyboard.press('0');
        await this.page.keyboard.press('1');
        await this.page.keyboard.press('0');
        await this.page.keyboard.press('1');
        await this.page.keyboard.press('2');
        await this.page.keyboard.press('0');
        await this.page.keyboard.press('0');
        await this.page.keyboard.press('0');

        await this.page.getByRole('dialog', { name: 'Add Member' }).getByLabel('Gender', { exact: true }).selectOption('11');
        await this.page.getByRole('textbox', { name: 'Social Security Number *' }).click({ clickCount: 3});
        
        await this.page.keyboard.press('1');
        await this.page.keyboard.press('1');
        await this.page.keyboard.press('1');
        //-
        await this.page.keyboard.press('1');
        await this.page.keyboard.press('1');
        //-
        await this.page.keyboard.press('1');
        await this.page.keyboard.press('1');
        await this.page.keyboard.press('1');
        await this.page.keyboard.press('1');

        await this.page.getByRole('textbox', { name: 'Member Id *' }).click();
        await this.page.getByRole('textbox', { name: 'Member Id *' }).fill('111111111');
        await this.page.locator('#divMailingAddressLineOne').click();
        await this.page.getByRole('textbox', { name: 'Address Line 1 *' }).fill('100 Test Drive');
        await this.page.getByRole('textbox', { name: 'City *' }).click();
        await this.page.getByRole('textbox', { name: 'City *' }).fill('Ames');
        await this.page.getByLabel('State').selectOption('IA');
        await this.page.getByRole('textbox', { name: 'Zip *' }).click({ clickCount: 3 });

        await this.page.keyboard.press('5');
        await this.page.keyboard.press('0');
        await this.page.keyboard.press('0');
        await this.page.keyboard.press('1');
        await this.page.keyboard.press('0');

        //uncomment this once we get randomized values:
        //await this.page.getByRole('button', { name: 'Submit' }).click();
    }

    async openMemberHub(memberId: string) {
        await this.page.getByRole('link', { name: memberId, exact: true }).click();
    }

    async verifyMemberHubLoads() {
        await expect(this.page.getByText('Member Hub')).toBeVisible();
    }

    async clickViewMemberDetails() {
        await this.page.getByRole('button', { name: 'View Member Details' }).click();
    }

    async openEvenMoreMemberDetails() {
        await this.page.getByRole('link', { name: 'View Even More Member Details' }).click();
    }
}