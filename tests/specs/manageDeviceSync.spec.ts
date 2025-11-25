import { test } from '@playwright/test';
import { loginPage } from '../pages/loginPage';
import { navigationPage } from '../pages/navigationPage';
import { manageDeviceSync } from '../pages/manageDeviceSync';
//import { TEST_DATA } from '../config/testData';

test.describe('STAGE - Manage Device Sync Testing Suite', () => {
    test('Complete Manage Device Sync test flow', async ({ page }) => {
        test.setTimeout(500000);

        const login = new loginPage(page);
        const nav = new navigationPage(page);
        const manageDevice = new manageDeviceSync(page);

        try {
            await test.step('Login to application', async () => {
                await login.login('testom', 'Password01!');
            });

            await test.step('Test Manage Connect', async () => {
                await nav.goToDashboard();
                await nav.openSearchMenu();
                await nav.openMemberSearch();
                await nav.openManageDropdown();
                await manageDevice.manageDeviceSync();
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