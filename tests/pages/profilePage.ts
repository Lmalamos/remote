import { test, expect, Locator, Page } from '@playwright/test';
import { UserProfile } from '../types';

export class profilePage {
    readonly page: Page;

    readonly userProfileHeader: Locator;
    readonly myProfileLink: Locator;
    readonly firstNameInput: Locator;
    readonly middleNameInput: Locator;
    readonly lastNameInput: Locator;
    readonly emailInput: Locator;
    readonly phoneNumberInput: Locator;
    readonly saveButton: Locator;

    constructor(page: Page) {
        this.page = page;

        this.userProfileHeader = page.locator('#userProfileHeader > small > i');
        this.myProfileLink = page.locator('text=My Profile');
        this.firstNameInput = page.locator('input[name="firstName"]');
        this.middleNameInput = page.locator('input[name="middleName"]');
        this.lastNameInput = page.locator('input[name="lastName"]');
        this.emailInput = page.locator('[placeholder="username\\@example\\.com"]');
        this.phoneNumberInput = page.locator('input[name="phoneNumber"]');
        this.saveButton = page.locator('button:has-text("Save")');
    }

    /**
     * Edit user profile information
     * @param profile - User profile data object
     */
    async editProfile(profile: UserProfile) {
        await this.userProfileHeader.click();
        await this.myProfileLink.click();

        await this.firstNameInput.clear();
        await this.firstNameInput.fill(profile.firstName);
        await this.middleNameInput.fill(profile.middleName);
        await this.lastNameInput.fill(profile.lastName);
        await this.emailInput.fill(profile.email);
        await this.phoneNumberInput.clear();
        await this.phoneNumberInput.fill(profile.phoneNumber);

        await this.saveButton.click();
    }

    /**
     * Verify user profile information
     * @param profile - Expected user profile data
     */
    async verifyProfile(profile: UserProfile) {
        await this.userProfileHeader.click();
        await this.myProfileLink.click();

        await expect(this.firstNameInput).toHaveValue(profile.firstName);
        await expect(this.middleNameInput).toHaveValue(profile.middleName);
        await expect(this.lastNameInput).toHaveValue(profile.lastName);
        await expect(this.emailInput).toHaveValue(profile.email);

        // Phone number is formatted by the application
        const formattedPhone = `(${profile.phoneNumber.slice(0, 3)}) ${profile.phoneNumber.slice(3, 6)}-${profile.phoneNumber.slice(6)}`;
        await expect(this.phoneNumberInput).toHaveValue(formattedPhone);

        await this.saveButton.click();
    }
}