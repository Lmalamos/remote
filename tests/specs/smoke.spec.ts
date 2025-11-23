import { test } from '@playwright/test';
import { loginPage } from '../pages/loginPage';
import { navigationPage } from '../pages/navigationPage';
import { memberSearchPage } from '../pages/memberSearchPage';
import { profilePage } from '../pages/profilePage';
import { immunizationPanel } from '../pages/memberHub/immunizations';
import { TEST_DATA } from '../config/testData';

test.describe('STAGE - Smoke Testing Suite', () => {
    test('Complete smoke test flow', async ({ page }) => {
        test.setTimeout(500000);

        // Initialize page objects:
        const login = new loginPage(page);
        const nav = new navigationPage(page);
        const memberSearch = new memberSearchPage(page);
        const profile = new profilePage(page);
        const immunization = new immunizationPanel(page);

        try {
            await test.step('Login to application', async () => {
                await login.login(TEST_DATA.credentials.username, TEST_DATA.credentials.password);
            });

            await test.step('Navigate to and edit profile', async () => {
                await profile.editProfile('Walter', 'Leland', 'Kronkite', 'bkeyes1@telligen.com', '1111111111');
                await profile.editProfile('Bob', 'Thomas', 'Keyes', 'bkeyes@telligen.com', '4058103238');
            });

            await test.step('Search for member and test Immunizations', async () => {
                await nav.goToDashboard();
                await nav.openSearchMenu();
                await nav.openMemberSearch();

                await memberSearch.searchMember('Comprehensive - Test Client', '1234567890', 'Jabroni', 'Junior', '', '03312022', '1111111111', 'kgillman@telligen.com', 'Self', 'Male', '', '', '1111');;
                await memberSearch.verifySearchResults();
                await memberSearch.openMemberHub('COMP1234567890');

                await immunization.addImmunization('tetanus');
                await immunization.verifyImmunization();
            });

            await test.step('Search for member and test Care Team', async () => {
                await nav.goToDashboard();
                await nav.openSearchMenu();
                await nav.openMemberSearch();

                await memberSearch.searchMember('Comprehensive - Test Client', '1234567890', 'Jabroni', 'Junior', '', '03312022', '1111111111', 'kgillman@telligen.com', 'Self', 'Male', '', '', '1111');;
                await memberSearch.verifySearchResults();
                await memberSearch.openMemberHub('COMP1234567890');

                //await careTeam.addCareTeam('test');
                //await careTeam.verifyCareTeam();
            })

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