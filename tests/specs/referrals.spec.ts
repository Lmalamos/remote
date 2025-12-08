import { test } from '@playwright/test';
import { loginPage } from '../pages/loginPage';
import { navigationPage } from '../pages/navigationPage';
import { memberSearchPage } from '../pages/memberSearchPage';
import { memberDetailsPage } from '../pages/memberDetailsPage';
import { profilePage } from '../pages/profilePage';
import { activitiesPanel } from '../pages/memberHub/activities';
import { TEST_DATA } from '../config/testData';
import { referralsPanel } from '../pages/memberHub/referrals';

test.describe('STAGE - Referrals Testing Suite', () => {
    test('Complete Referral test flow', async ({ page }) => {
        test.setTimeout(500000);

        // Initialize page objects:
        const login = new loginPage(page);
        const nav = new navigationPage(page);
        const memberSearch = new memberSearchPage(page);
        const referrals = new referralsPanel(page);

        try {
            await test.step('Login to application', async () => {
                await login.login(TEST_DATA.credentials.username, TEST_DATA.credentials.password);
            });

            await test.step('Search for member and test Referrals', async () => {
                await nav.goToDashboard();
                await nav.openSearchMenu();
                await nav.openMemberSearch();
                await memberSearch.searchMember('Comprehensive - Test Client', '1234567890', 'Jabroni', 'Junior', '', '03312022', '1111111111', 'kgillman@telligen.com', 'Self', 'Male', '', '', '1111');;
                await memberSearch.verifySearchResults();
                await memberSearch.openMemberHub('COMP1234567890');
                //await referrals.verifyReferralsData();
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