import { test, expect } from '@playwright/test';
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
        navigation.goToDashboard();
        navigation.openSearchMenu();
        navigation.openMemberSearch();

        const memberSearch = new memberSearchPage(page);
        await memberSearch.searchMember('Comprehensive - Test Client', 'COMPTEMP000000100423');

        //new option here to either select an existing member or create a new member:
        if (await page.locator('#btnAddMemberModal').isVisible()) {
            await memberSearch.addMember('Test', 'Tester', '01/01/2000', 'Male', '111-11-1111', '111111111', '100 Test Drive', 'Ames', 'IA', '50010', 'Comprehensive - Test Client');
        } else {
            await memberSearch.openMemberHub('COMPTEMP000000100423');
            await memberSearch.verifyMemberHubLoads();
        }
    });

    test('Add Member', async ({ page }) => {
        const login = new loginPage(page);
        await login.login('autosmoke', 'Playwright!1');
        await login.verifyLogin();

        const navigation = new navigationPage(page);
        navigation.goToDashboard();
        navigation.openSearchMenu();
        navigation.openMemberSearch();

        const memberSearch = new memberSearchPage(page);
        await memberSearch.searchMember('Comprehensive - Test Client', '111111111');
        await memberSearch.addMember('Test', 'Tester', '01/01/2000', 'Male', '111-11-1111', '111111111', '100 Test Drive', 'Ames', 'IA', '50010', 'Comprehensive - Test Client');
        
        //can't do this until add member actually adds a member successfully:
        //await memberSearch.verifyMemberHubLoads();
    });

});

test.beforeEach(async ({ page }) => {
    const login = new loginPage(page);
    await login.goto();
});

test.afterEach(async ({ page }) => {
//     await page.getByRole('button', { name: 'User menu, autosmoke is' }).click(); 
//     page.once('dialog', dialog => {
//     console.log(`Dialog message: ${dialog.message()}`);
//     dialog.dismiss().catch(() => {});
//   });
//   await page.getByRole('link', { name: 'Log Out' }).click();

    await page.close();
});

// test.afterAll(async ({ page }) => {
//     await page.close();
// });