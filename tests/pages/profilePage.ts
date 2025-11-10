import { test, expect, Locator, Page } from '@playwright/test';

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

    async editProfile(firstName: string, middleName: string, lastName: string, email: string, phoneNumber: string) {
        await this.userProfileHeader.click();
        await this.myProfileLink.click();

        await this.firstNameInput.click({ clickCount: 4 });
        await this.firstNameInput.fill(firstName);
        await expect(this.page.locator('input[name="firstName"]')).toHaveValue(firstName);

        await this.middleNameInput.fill(middleName);
        await expect(this.page.locator('input[name="middleName"]')).toHaveValue(middleName);

        await this.lastNameInput.fill(lastName);
        await expect(this.page.locator('input[name="lastName"]')).toHaveValue(lastName);

        await this.emailInput.fill(email);
        await expect(this.page.locator('[placeholder="username\\@example\\.com"]')).toHaveValue(email);

        await this.phoneNumberInput.click({ clickCount: 4 });
        await this.phoneNumberInput.fill(phoneNumber);

        //await expect(this.page.locator('input[name="phoneNumber"]')).toHaveValue(phoneNumber );
        await expect(this.page.locator('input[name="phoneNumber"]')).toHaveValue('(' + phoneNumber[0] + phoneNumber[1] + phoneNumber[2] + ') ' + phoneNumber[3] + phoneNumber[4] + phoneNumber[5] + '-' + phoneNumber[6] + phoneNumber[7] + phoneNumber[8] + phoneNumber[9]);

        await this.saveButton.click();
    }

    //maybe have assertions in the editProfile() function?:
    async verifyProfile(firstName: string, middleName: string, lastName: string, email: string, phoneNumber: string) {
        await this.userProfileHeader.click();
        await this.myProfileLink.click();

        await expect(this.page.locator('input[name="firstName"]')).toHaveValue(firstName);
        await expect(this.page.locator('input[name="middleName"]')).toHaveValue(middleName);
        await expect(this.page.locator('input[name="lastName"]')).toHaveValue(lastName);
        await expect(this.page.locator('[placeholder="username\\@example\\.com"]')).toHaveValue(email);

        //await expect(this.page.locator('input[name="phoneNumber"]')).toHaveValue(phoneNumber);
        await expect(this.page.locator('input[name="phoneNumber"]')).toHaveValue('(' + phoneNumber[0] + phoneNumber[1] + phoneNumber[2] + ')' + ' ' + phoneNumber[3] + phoneNumber[4] + phoneNumber[5] + '-' + phoneNumber[6] + phoneNumber[7] + phoneNumber[8] + phoneNumber[9]);

        await this.saveButton.click();
    }
}