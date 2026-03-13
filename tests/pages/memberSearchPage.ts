import { expect, Locator, Page } from '@playwright/test';
import { MemberSearchCriteria, MemberDetails } from '../types';

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

    /**
     * Search for a member using provided criteria
     * @param criteria - Member search criteria object
     */
    async searchMember(criteria: MemberSearchCriteria) {
        await this.page.selectOption('select', { label: criteria.client });

        if (criteria.memberId) {
            await this.page.fill('[placeholder="Member\\ ID"]', criteria.memberId);
        }
        if (criteria.lastName) {
            await this.page.getByRole('textbox', { name: 'Last Name' }).fill(criteria.lastName);
        }
        if (criteria.firstName) {
            await this.page.getByRole('textbox', { name: 'First Name' }).fill(criteria.firstName);
        }
        if (criteria.middleName) {
            await this.page.getByRole('textbox', { name: 'Middle Name' }).fill(criteria.middleName);
        }
        if (criteria.dob) {
            await this.page.getByRole('textbox', { name: 'Date Of Birth' }).fill(criteria.dob);
        }
        if (criteria.phoneNumber) {
            await this.page.getByRole('textbox', { name: 'Phone Number' }).fill(criteria.phoneNumber);
        }
        if (criteria.email) {
            await this.page.getByRole('textbox', { name: 'Email' }).fill(criteria.email);
        }
        if (criteria.relationshipStatus) {
            await this.page.getByLabel('Relationship Status').selectOption(criteria.relationshipStatus);
        }
        if (criteria.gender) {
            await this.page.getByRole('cell', { name: 'Gender' }).getByLabel('Gender').selectOption(criteria.gender);
        }
        if (criteria.maritalStatus) {
            await this.page.getByRole('cell', { name: 'Marital Status' }).getByLabel('Marital Status').selectOption(criteria.maritalStatus);
        }
        if (criteria.race) {
            await this.page.getByRole('cell', { name: 'Race' }).getByLabel('Race').selectOption(criteria.race);
        }
        if (criteria.ssn) {
            await this.page.getByRole('textbox', { name: 'SSN' }).fill(criteria.ssn);
        }

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

    /**
     * Add a new member to the system
     * @param details - Member details object
     */
    async addMember(details: MemberDetails) {
        await this.page.getByRole('button', { name: ' Add Member' }).click();
        await this.page.getByRole('textbox', { name: 'First Name *' }).fill(details.firstName);
        await this.page.getByRole('textbox', { name: 'Last Name *' }).fill(details.lastName);
        await this.page.getByRole('textbox', { name: 'Birth Date *' }).fill(details.birthDate);

        await this.page.getByRole('dialog', { name: 'Add Member' }).getByLabel('Gender', { exact: true }).selectOption(details.gender);
        await this.page.getByRole('textbox', { name: 'Social Security Number *' }).fill(details.ssn);

        await this.page.getByRole('textbox', { name: 'Member Id *' }).fill(details.memberId);
        await this.page.getByRole('textbox', { name: 'Address Line 1 *' }).fill(details.address);
        await this.page.getByRole('textbox', { name: 'City *' }).fill(details.city);
        await this.page.getByLabel('State').selectOption(details.state);
        await this.page.getByRole('textbox', { name: 'Zip *' }).fill(details.zip);

        // Note: Uncomment to actually submit once randomized values are implemented
        // await this.page.getByRole('button', { name: 'Submit' }).click();
    }

    async openMemberHub(memberId: string) {
        // Strip the "COMP" prefix if present (TEST_MEMBER.FULL_ID includes it, but the UI link doesn't)
        const cleanId = memberId.replace(/^COMP/, '');
        // Use partial match for the accessible name which includes "View member details for Member ID {id}"
        await this.page.getByRole('link', { name: new RegExp(cleanId) }).first().click();
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