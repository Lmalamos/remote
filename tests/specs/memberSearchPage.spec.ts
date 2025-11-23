import { test } from '@playwright/test';
import { loginPage } from '../pages/loginPage';
import { memberSearchPage } from '../pages/memberSearchPage';
import { navigationPage } from '../pages/navigationPage';

test.describe('Member Search Page Tests', () => {
    test('Search for a Member', async ({ page }) => {
        test.setTimeout(500000);

        const login = new loginPage(page);
        await login.login('autosmoke', 'Playwright!1');
        await login.verifyLogin();

        const navigation = new navigationPage(page);
        await navigation.goToDashboard();
        await navigation.openSearchMenu();
        await navigation.openMemberSearch();

        const memberSearch = new memberSearchPage(page);
        await memberSearch.searchMember('Comprehensive - Test Client', '1234567890', 'Jabroni', 'Junior', '', '03312022', '1111111111', 'kgillman@telligen.com', 'Self', 'Male', '', '', '1111');
        await memberSearch.verifySearchResults();
        await memberSearch.openMemberHub('COMP1234567890');
        await memberSearch.verifyMemberHubLoads();
    });

    test('Search for a Member using Invalid Search Criteria', async ({ page }) => {
        const login = new loginPage(page);
        await login.login('autosmoke', 'Playwright!1');
        await login.verifyLogin();

        const navigation = new navigationPage(page);
        await navigation.goToDashboard();
        await navigation.openSearchMenu();
        await navigation.openMemberSearch();

        const memberSearch = new memberSearchPage(page);
        await memberSearch.searchMember('Comprehensive - Test Client', '', '', '', '', '', '', '', '', '', '', '', '');
        await memberSearch.verifySearchCriteriaErrorMessage();
    });

    test('Search for a Member using Invalid Member ID Length', async ({ page }) => {
        const login = new loginPage(page);
        await login.login('autosmoke', 'Playwright!1');
        await login.verifyLogin();

        const navigation = new navigationPage(page);
        await navigation.goToDashboard();
        await navigation.openSearchMenu();
        await navigation.openMemberSearch();

        const memberSearch = new memberSearchPage(page);
        await memberSearch.searchMember('Comprehensive - Test Client', '5', '', '', '', '', '', '', '', '', '', '', '');
        await memberSearch.verifyMemberIdLengthErrorMessage();
    });

    test('Search for a Member using Invalid Name', async ({ page }) => {
        const login = new loginPage(page);
        await login.login('autosmoke', 'Playwright!1');
        await login.verifyLogin();

        const navigation = new navigationPage(page);
        await navigation.goToDashboard();
        await navigation.openSearchMenu();
        await navigation.openMemberSearch();

        const memberSearch = new memberSearchPage(page);
        await memberSearch.searchMember('Comprehensive - Test Client', '', '', '', 'a', '', '', '', 'Spouse', 'Male', 'Married', 'Asian', '');
        await memberSearch.verifyErrorNameErrorMessage();
    });

    test.only('Add Member', async ({ page }) => {
        const login = new loginPage(page);
        await login.login('autosmoke', 'Playwright!1');
        await login.verifyLogin();

        const navigation = new navigationPage(page);
        await navigation.goToDashboard();
        await navigation.openSearchMenu();
        await navigation.openMemberSearch();

        const memberSearch = new memberSearchPage(page);
        await memberSearch.searchMember('Comprehensive - Test Client', '111111110', 'Jabroni', 'Junior', '', '03312022', '1111111111', 'kgillman@telligen.com', 'Self', 'Male', '', '', '1111');
        await memberSearch.verifyNoSearchResults();
        await memberSearch.addMember('Test', 'Tester', '01/01/2000', 'Male', '111-11-1111', '111111111', '100 Test Drive', 'Ames', 'IA', '50010', 'Comprehensive - Test Client');
        
        //can't do this until add member actually adds a member successfully:
        //await memberSearch.verifyMemberHubLoads();
    });

    test('Menu Options', async ({ page }) => {
        const login = new loginPage(page);
        await login.login('autosmoke', 'Playwright!1');
        await login.verifyLogin();

        //can be another spec file or can be here:
        const navigation = new navigationPage(page);
        await navigation.scheduledReports();
        await navigation.coachingHub();
        await navigation.messages();
        await navigation.reports();
        await navigation.knowledgeCenter();
        await navigation.reportIssueToQualitracSupportTeam();
    });

});

test.beforeEach(async ({ page }) => {
    const login = new loginPage(page);
    await login.goto();
});