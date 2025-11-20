import { test } from '@playwright/test';
import { loginPage } from '../pages/loginPage';
import { navigationPage } from '../pages/navigationPage';
import { providerSearchPage } from '../pages/providerSearch';

test.describe('Provider Search Page Tests', () => {
    test('Search for a Provider', async ({ page }) => {
        test.setTimeout(500000);

        const login = new loginPage(page);

        await login.login('autosmoke', 'Playwright!1');
        await login.verifyLogin();

        const navigation = new navigationPage(page);
        await navigation.goToDashboard();
        await navigation.openSearchMenu();
        await navigation.openProviderSearch();
        
        const providerSearch = new providerSearchPage(page);
        await providerSearch.searchProvider('Comprehensive - Test Client', '1740690205', '1740690205', 'AASEN', 'TYLER', 'West Des Moines', 'IA', '50266', 'Internal Medicine, Gastroenterology');
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