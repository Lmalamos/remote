import { test } from '@playwright/test';
import { loginPage } from '../pages/loginPage';
import { navigationPage } from '../pages/navigationPage';
import { caseSearchPage } from '../pages/caseSearch';

test.describe('Case Search Page Tests', () => {
    test('Search for a Case', async ({ page }) => {
        test.setTimeout(500000);

        const login = new loginPage(page);

        await login.login('autosmoke', 'Playwright!1');
        //await login.verifyLogin();

        const navigation = new navigationPage(page);
        await navigation.goToDashboard();
        await navigation.openSearchMenu();
        await navigation.openCaseSearch();

        const caseSearch = new caseSearchPage(page);
        await caseSearch.searchByCaseId('29756');
        await caseSearch.searchByRequestId('29768');
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