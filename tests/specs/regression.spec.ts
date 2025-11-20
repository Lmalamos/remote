import { test } from '@playwright/test';
import { loginPage } from '../pages/loginPage';
import { navigationPage } from '../pages/navigationPage';
import { memberSearchPage } from '../pages/memberSearchPage';
import { memberDetailsPage } from '../pages/memberDetailsPage';
import { assessmentsPanel } from '../pages/memberHub/assessments';
import { activitiesPanel } from '../pages/memberHub/activities';
import { eligibleMemberTasks } from '../pages/memberHub/eligibleMemberTasks';
import { careManagementPanel } from '../pages/memberHub/careManagement';
import { TEST_DATA } from '../config/testData';

test.describe('STAGE - Regression Testing Suite', () => {
    test('Complete regression test flow', async ({ page }) => {
        test.setTimeout(500000);

        // Initialize page objects:
        const login = new loginPage(page);
        const nav = new navigationPage(page);
        const eligibleTasks = new eligibleMemberTasks(page);
        const memberSearch = new memberSearchPage(page);
        const memberDetails = new memberDetailsPage(page);
        const careManagement = new careManagementPanel(page);
        const assessments = new assessmentsPanel(page);
        const activities = new activitiesPanel(page);

        try {
            await test.step('Login to application', async () => {
                await login.login(TEST_DATA.credentials.username, TEST_DATA.credentials.password);
            });

            await test.step('Test eligible member task queue', async () => {
                await nav.goToDashboard();
                await nav.openSearchMenu();
                await nav.openMemberSearch();
                await eligibleTasks.navigateToTaskQueue();
                await eligibleTasks.selectAllColumns();
                await eligibleTasks.applyFilters();
            });

            await test.step('Search for member and verify details', async () => {
                await nav.goToDashboard();
                await nav.openSearchMenu();
                await nav.openMemberSearch();
                await memberSearch.searchMember(TEST_DATA.testMember.client, TEST_DATA.testMember.id);
                await memberSearch.openMemberHub(TEST_DATA.testMember.id);
                await memberSearch.clickViewMemberDetails();
                await memberDetails.verifyMemberInfo(TEST_DATA.testMember.id);
                const popup = await memberDetails.openExtendedDetails();
                await memberDetails.verifyExtendedDetails(popup);
                await popup.close();
            });

            //duplicate test step:
            await test.step('Navigate to member profile', async () => {
                // await nav.goToDashboard();
                // await nav.openSearchMenu();
                // await nav.openMemberSearch();
                // await memberSearch.searchMember(TEST_DATA.testMember.client, TEST_DATA.testMember.id);
                // await memberSearch.openMemberHub(TEST_DATA.testMember.id);
                // await memberSearch.clickViewMemberDetails();
                // await memberSearch.openEvenMoreMemberDetails();
            });

            await test.step('Test care management panel', async () => {
                await memberDetails.scrollToSection(100);
                await careManagement.expandPanel();
                await careManagement.verifyCaseManagement();
                await careManagement.verifyCareTransitions();
                await careManagement.expandPanel();
            });

            await test.step('Test assessments panel', async () => {
                await memberDetails.scrollToSection(100);
                await assessments.expandPanel();
                const assessmentPopup = await assessments.verifyMemberScreening();
                await assessments.verifyAssessmentDetails(assessmentPopup);
                await assessmentPopup.close();
                await memberDetails.scrollToSection(100);
                await assessments.verifyMemberScreening();
                await assessments.verifyStressScaleAssessment();
                await assessments.expandPanel();
            });

            await test.step('Test activities panel', async () => {
                await activities.expandPanel();
                await activities.verifyActivitiesList();
                await activities.testCompleteTaskFlow();
                await activities.expandPanel();
            });

            await test.step('Navigate back to dashboard', async () => {
                await nav.goToDashboard();
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