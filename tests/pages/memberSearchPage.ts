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

    async searchMember(client: string, memberId: string, lastName: string, firstName: string, middleName: string, dob: string, phoneNumber: string, email: string, relationshipStatus: string, gender: string, maritalStatus: string, race: string, ssn: string) {
        await this.page.selectOption('select', { label: client });
        await this.page.fill('[placeholder="Member\\ ID"]', memberId);
        await expect(this.page.locator('[placeholder="Member\\ ID"]')).toHaveValue(memberId);
        await this.page.getByRole('textbox', { name: 'Last Name' }).fill(lastName);
        await expect(this.page.getByRole('textbox', { name: 'Last Name' })).toHaveValue(lastName);
        await this.page.getByRole('textbox', { name: 'First Name' }).fill(firstName);
        await expect(this.page.getByRole('textbox', { name: 'First Name' })).toHaveValue(firstName);
        await this.page.getByRole('textbox', { name: 'Middle Name' }).fill(middleName);
        await expect(this.page.getByRole('textbox', { name: 'Middle Name' })).toHaveValue(middleName);
        await this.page.getByRole('textbox', { name: 'Date Of Birth' }).fill(dob);
        //await expect(this.page.getByRole('textbox', { name: 'Date Of Birth' })).toHaveValue(dob);
        await this.page.getByRole('textbox', { name: 'Phone Number' }).fill(phoneNumber);
        //await expect(this.page.getByRole('textbox', { name: 'Phone Number' })).toHaveValue(phoneNumber);
        await this.page.getByRole('textbox', { name: 'Email' }).fill(email);
        await expect(this.page.getByRole('textbox', { name: 'Email' })).toHaveValue(email);
        await this.page.getByLabel('Relationship Status').selectOption(relationshipStatus);
        //await expect(this.page.getByLabel('Relationship Status')).toHaveValue(relationshipStatus);
        await this.page.getByRole('cell', { name: 'Gender' }).getByLabel('Gender').selectOption(gender);
        //await expect(this.page.getByRole('cell', { name: 'Gender' })).toHaveValue(gender);
        await this.page.getByRole('cell', { name: 'Marital Status' }).getByLabel('Marital Status').selectOption(maritalStatus);
        //await expect(this.page.getByRole('cell', { name: 'Marital Status' })).toHaveValue(maritalStatus);
        await this.page.getByRole('cell', { name: 'Race' }).getByLabel('Race').selectOption(race);
        //await expect(this.page.getByRole('textbox', { name: 'Race' })).toHaveValue(race);
        await this.page.getByRole('textbox', { name: 'SSN' }).fill(ssn);
        //await expect(this.page.getByRole('textbox', { name: 'SSN' })).toHaveValue(ssn);
        await this.page.click('button:has-text("Search")');
    }

    async verifySearchResults() {
        const rows = this.page.locator('#advancedMemberSearchMemberTableBody');
        await expect(rows).toHaveCount(1);
    }

    async verifyNoSearchResults() {
        await expect(this.page.getByRole('heading', { name: 'Member Not Found.' })).toBeVisible();
        await expect(this.page.locator('h3')).toContainText('Member Not Found.');
        await expect(this.page.getByRole('button', { name: ' Add Member' })).toBeVisible();
        await expect(this.page.locator('#btnAddMemberModal')).toContainText('Add Member');
    }

    async verifySearchCriteriaErrorMessage() {
        await expect(this.page.locator('.snackbar.error.show')).toContainText('You must provide search criteria in order to continue');
    }

    async verifyMemberIdLengthErrorMessage() {
        await expect(this.page.locator('.snackbar.error.show')).toContainText('Member Id must carry at least 3 characters');
    }

    async verifyErrorNameErrorMessage() {
        await expect(this.page.locator('.snackbar.error.show')).toContainText('You must provide one of: Member Id, First Name, Last Name, Date of Birth, Phone Number, Email, SSN');
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