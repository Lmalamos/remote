import { test } from '@playwright/test';
import { loginPage } from '../pages/loginPage';
import { navigationPage } from '../pages/navigationPage';
import { manageTimeslots } from '../pages/manageTimeslots';
//import { TEST_DATA } from '../config/testData';

test.describe('STAGE - Manage Timeslots Testing Suite', () => {
    test('Complete Manage Timeslots test flow', async ({ page }) => {
        test.setTimeout(500000);

        const login = new loginPage(page);
        const nav = new navigationPage(page);
        const manageTimeslot = new manageTimeslots(page);

        try {
            await test.step('Login to application', async () => {
                await login.login('testom', 'Password01!');
                //await login.verifyLogin();
            });

            await test.step('Test Manage Timeslots', async () => {
                await nav.goToDashboard();
                await nav.openSearchMenu();
                await nav.openMemberSearch();
                await nav.openManageDropdown();
                await manageTimeslot.manageTimeslots();
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