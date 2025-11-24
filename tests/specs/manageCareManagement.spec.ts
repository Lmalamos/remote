import { test } from '@playwright/test';
import { loginPage } from '../pages/loginPage';
import { navigationPage } from '../pages/navigationPage';
import { manageCareManagement } from '../pages/manageCareManagement';
//import { TEST_DATA } from '../config/testData';

test.describe('STAGE - Manage Care Management Testing Suite', () => {
    test('Complete Care Management test flow', async ({ page }) => {
        test.setTimeout(500000);

        const login = new loginPage(page);
        const nav = new navigationPage(page);
        const manageCM = new manageCareManagement(page);

        try {
            await test.step('Login to application', async () => {
                await login.login('testom', 'Password01!');
            });

            await test.step('Test Manage Business Rules', async () => {
                await nav.goToDashboard();
                await nav.openSearchMenu();
                await nav.openMemberSearch();
                await nav.openManageDropdown();
                await manageCM.manageCareManagement();
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