import { test, expect } from '@playwright/test';
import { loginPage } from '../pages/loginPage';
import { navigationPage } from '../pages/navigationPage';
import { memberSearchPage } from '../pages/memberSearchPage';
import { memberDetailsPage } from '../pages/memberDetailsPage';

import { profilePage } from '../pages/profilePage';

import { activitiesPanel } from '../pages/memberHub/activities';
//import { careManagementPanel } from '../pages/memberHub/careManagement';
import { allergiesPanel } from '../pages/memberHub/allergies';

import { TEST_DATA } from '../config/testData';
import { callProcessingPanel } from '../pages/memberHub/callProcessing';
import { diagnosisPanel } from '../pages/memberHub/diagnosis';

test.describe('STAGE - Diagnosis Testing Suite', () => {
    test('Complete Diagnosis test flow', async ({ page }) => {
        test.setTimeout(500000);

        // Initialize page objects:
        const login = new loginPage(page);
        const nav = new navigationPage(page);
        //const eligibleTasks = new eligibleMemberTasks(page);
        const memberSearch = new memberSearchPage(page);
        const memberDetails = new memberDetailsPage(page);
        //const careManagement = new careManagementPanel(page);
        const activities = new activitiesPanel(page);
        const allergies = new allergiesPanel(page);
        const callProcessing = new callProcessingPanel(page);

        const profile = new profilePage(page);
        //const immunization = new immunizationPage(page);
        //const careTeam = new careTeamPage(page);
        const diagnosis = new diagnosisPanel(page);

        try {
            await test.step('Login to application', async () => {
                await login.login(TEST_DATA.credentials.username, TEST_DATA.credentials.password);
            });

            await test.step('Search for member and test Diagnosis', async () => {
                await nav.goToDashboard();
                await nav.openSearchMenu();
                await nav.openMemberSearch();
                await memberSearch.searchMember(TEST_DATA.testMember.client, TEST_DATA.testMember.id);
                await memberSearch.openMemberHub(TEST_DATA.testMember.id);
                await diagnosis.verifyDiagnosisData();
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