import { test, expect } from '@playwright/test';
import { loginPage } from '../pages/loginPage';
import { navigationPage } from '../pages/navigationPage';
import { memberSearchPage } from '../pages/memberSearchPage';
import { memberDetailsPage } from '../pages/memberDetailsPage';

import { profilePage } from '../pages/profilePage';
import { immunizationPanel } from '../pages/memberHub/immunizations';
import { careTeamPanel } from '../pages/memberHub/careTeam';

//import { assessmentsPanel } from '../pages/memberHub/assessments';
//import { activitiesPanel } from '../pages/memberHub/activities';
//import { eligibleMemberTasks } from '../pages/memberHub/eligibleMemberTasks';
//import { careManagementPanel } from '../pages/memberHub/careManagement';

import { TEST_DATA } from '../config/testData';

test.describe('STAGE - Smoke Testing Suite', () => {
    test('Complete smoke test flow', async ({ page }) => {
        //test.slow();
        test.setTimeout(500000);
        
        // const context = await browser.newContext({ 
        //     viewport: { width: 1280, height: 800 } 
        // });
        // const page = await context.newPage();

        // Initialize page objects:
        const login = new loginPage(page);
        const nav = new navigationPage(page);
        //const eligibleTasks = new eligibleMemberTasks(page);
        const memberSearch = new memberSearchPage(page);
        const memberDetails = new memberDetailsPage(page);
        //const careManagement = new careManagementPanel(page);
        //const assessments = new assessmentsPanel(page);
        //const activities = new activitiesPanel(page);

        const profile = new profilePage(page);
        const immunization = new immunizationPanel(page);
        const careTeam = new careTeamPanel(page);

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

                await memberSearch.searchMember(TEST_DATA.testMember.client, TEST_DATA.testMember.id);
                await memberSearch.openMemberHub(TEST_DATA.testMember.id);

                await immunization.addImmunization('tetanus');
                await immunization.verifyImmunization();
            });

            await test.step('Search for member and test Care Team', async () => {
                await nav.goToDashboard();
                await nav.openSearchMenu();
                await nav.openMemberSearch();

                await memberSearch.searchMember(TEST_DATA.testMember.client, TEST_DATA.testMember.id);
                await memberSearch.openMemberHub(TEST_DATA.testMember.id);

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