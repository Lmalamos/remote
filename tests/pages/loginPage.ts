import { expect, Locator, Page } from '@playwright/test';

export class loginPage {
    readonly page: Page;

    readonly usernameInput: Locator;
    readonly passwordInput: Locator;
    readonly loginButton: Locator;

    readonly errorMessage: Locator;
    readonly unableToSignInMessage: Locator;

    constructor(page: Page) {
        this.page = page;

        this.usernameInput = page.locator('#input28');
        this.passwordInput = page.locator('#input36');
        this.loginButton = page.locator("input[type=submit]");

        this.errorMessage = page.getByText('We found some errors. Please review the form and make corrections.');
        this.unableToSignInMessage = page.getByText('Unable to sign in.');
    }

    async goto() {
        await this.page.goto('/');
    }

    async login(username: string, password: string) {
        await this.usernameInput.fill(username);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
    }

    async verifyLogin() {
        await expect(this.page).toHaveURL(/\//);
        expect(this.page).toBeTruthy();
    }

    async verifyNotLogin() {
        await expect(this.page.getByText('Unable to sign in')).toBeVisible();
        await expect(this.page.locator('#form20')).toContainText('Unable to sign in');
    }

    async verifyLoginErrorMessage() {
        await expect(this.page.getByText('We found some errors. Please review the form and make corrections.')).toBeVisible();
        await expect(this.page.locator('#form20')).toContainText('We found some errors. Please review the form and make corrections.');
    }

    async verifyEmptyUsernameErrorMessage() {
        await expect(this.page.locator('#input-container-error63')).toBeVisible();
    }

    async verifyEmptyPasswordErrorMessage() {
        await expect(this.page.getByText('We found some errors. Please')).toBeVisible();
        await expect(this.page.getByText('This field cannot be left')).toBeVisible();
        await expect(this.page.locator('#form20')).toContainText('We found some errors. Please review the form and make corrections.');
        await expect(this.page.locator('#input-container-error60')).toContainText('This field cannot be left blank');
    }

    async verifyEmptyUsernameAndPasswordErrorMessage() {
        await expect(this.page.locator('#form20')).toContainText('We found some errors. Please review the form and make corrections.');
        await expect(this.page.locator('#input-container-error61')).toContainText('This field cannot be left blank');
    }
}