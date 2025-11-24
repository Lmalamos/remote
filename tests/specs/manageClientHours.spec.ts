import { test } from '@playwright/test';
import { loginPage } from '../pages/loginPage';
import { navigationPage } from '../pages/navigationPage';
import { manageClientHours } from '../pages/manageClientHours';
//import { TEST_DATA } from '../config/testData';

test.describe('STAGE - Manage Client Hours Testing Suite', () => {
    test('Complete Manage Client Hours test flow', async ({ page }) => {
        test.setTimeout(500000);

        const login = new loginPage(page);
        const nav = new navigationPage(page);
        const manageClientHour = new manageClientHours(page);

        try {
            await test.step('Login to application', async () => {
                await login.login('testom', 'Password01!');
            });

            await test.step('Test Manage Business Rules', async () => {
                await nav.goToDashboard();
                await nav.openSearchMenu();
                await nav.openMemberSearch();
                await nav.openManageDropdown();
                await manageClientHour.manageClientHours();
            });
        } catch (err) {
            console.error('Test failed with error:', err);
            throw err;
        } finally {
            await page.close();
        }
    });
});

test.beforeEach(async ({ page }) => {
    const login = new loginPage(page);
    await login.goto();
});