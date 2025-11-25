import { test } from '@playwright/test';
import { loginPage } from '../pages/loginPage';
import { navigationPage } from '../pages/navigationPage';
import { viewTransmissionErrorReport } from '../pages/viewTransmissionErrorReport';
//import { TEST_DATA } from '../config/testData';

test.describe('STAGE - View Transmission Error Report Testing Suite', () => {
    test('Complete View Transmission Error Report test flow', async ({ page }) => {
        test.setTimeout(500000);

        const login = new loginPage(page);
        const nav = new navigationPage(page);
        const viewTransmissionErrorReports = new viewTransmissionErrorReport(page);

        try {
            await test.step('Login to application', async () => {
                await login.login('testom', 'Password01!');
                //await login.verifyLogin();
            });

            await test.step('Test View Transmission Error Report', async () => {
                await nav.goToDashboard();
                await nav.openSearchMenu();
                await nav.openMemberSearch();
                await nav.openManageDropdown();
                await viewTransmissionErrorReports.viewTransmissionErrorReport();
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