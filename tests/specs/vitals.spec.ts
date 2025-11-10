import { test, expect } from '@playwright/test';
import { loginPage } from '../pages/loginPage';
import { navigationPage } from '../pages/navigationPage';
import { memberSearchPage } from '../pages/memberSearchPage';
import { memberDetailsPage } from '../pages/memberDetailsPage';

import { profilePage } from '../pages/profilePage';

import { activitiesPanel } from '../pages/memberHub/activities';

import { TEST_DATA } from '../config/testData';
import { vitalsPanel } from '../pages/memberHub/vitals';

test.describe('STAGE - Vitals Testing Suite', () => {
    test('Complete Vitals test flow', async ({ page }) => {
        test.setTimeout(500000);

        // Initialize page objects:
        const login = new loginPage(page);
        const nav = new navigationPage(page);
        //const eligibleTasks = new eligibleMemberTasks(page);
        const memberSearch = new memberSearchPage(page);
        const memberDetails = new memberDetailsPage(page);
        const activities = new activitiesPanel(page);
        const profile = new profilePage(page);
        const vitals = new vitalsPanel(page);

        try {
            await test.step('Login to application', async () => {
                await login.login(TEST_DATA.credentials.username, TEST_DATA.credentials.password);
            });

            await test.step('Search for member and test Vitals', async () => {
                await nav.goToDashboard();
                await nav.openSearchMenu();
                await nav.openMemberSearch();

                await memberSearch.searchMember(TEST_DATA.testMember.client, TEST_DATA.testMember.id);
                await memberSearch.openMemberHub(TEST_DATA.testMember.id);

                //verify data in Vitals panel:
                //await vitals.verifyVitalsData();
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