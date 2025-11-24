import { test } from '@playwright/test';
import { loginPage } from '../pages/loginPage';
import { navigationPage } from '../pages/navigationPage';
import { manageAssessments } from '../pages/manageAssessments';
//import { TEST_DATA } from '../config/testData';

test.describe('STAGE - Manage Assessments Testing Suite', () => {
    test('Complete Manage Assessments test flow', async ({ page }) => {
        test.setTimeout(500000);

        const login = new loginPage(page);
        const nav = new navigationPage(page);
        const manageAssessment = new manageAssessments(page);

        try {
            await test.step('Login to application', async () => {
                await login.login('testom', 'Password01!');
            });

            await test.step('Test Manage Assessments', async () => {
                await nav.goToDashboard();
                await nav.openSearchMenu();
                await nav.openMemberSearch();
                await nav.openManageDropdown();
                await manageAssessment.manageAssessments();
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