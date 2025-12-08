import { test } from '@playwright/test';
import { loginPage } from '../pages/loginPage';

test.describe('Login Page Tests', () => {
    test('Valid Username and Password Credentials', async ({ page }) => {
        const login = new loginPage(page);
        await login.login('autosmoke', 'Playwright!1');
        //await login.verifyLogin();
    });

    test('Invalid Username Credentials', async ({ page }) => {
        const login = new loginPage(page);
        await login.login('autosmokes', 'Playwright!1');
        await login.verifyNotLogin();
    });

    test('Invalid Password Credentials', async ({ page }) => {
        const login = new loginPage(page);
        await login.login('autosmoke', 'Playwright1!');
        await login.verifyNotLogin();
    });

    test('Empty Username Credentials', async ({ page }) => {
        const login = new loginPage(page);
        await login.login('', 'Playwright!1');
        await login.verifyLoginErrorMessage();
    });

    test('Empty Password Credentials', async ({ page }) => {
        const login = new loginPage(page);
        await login.login('autosmoke', '');
        await login.verifyEmptyPasswordErrorMessage();
    });

    test('Empty Username and Password Credentials', async ({ page }) => {
        const login = new loginPage(page);
        await login.login('', '');
        await login.verifyEmptyUsernameAndPasswordErrorMessage();
    });
});

test.beforeEach(async ({ page }) => {
    const login = new loginPage(page);
    await login.goto();
});