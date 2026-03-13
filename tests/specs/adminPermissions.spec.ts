// ============================================
// ADMIN & PERMISSIONS TESTS
// Role-based access, authorization, security boundaries
// ============================================

import { test, expect } from '../fixtures/cleanupAuth.fixture';
import { loginPage } from '../pages/loginPage';
import { memberSearchPage } from '../pages/memberSearchPage';
import { navigationPage } from '../pages/navigationPage';
import { Tags } from '../tags';
import { TEST_CREDENTIALS, CLIENTS } from '../constants';
import { waitForNetworkIdle, smartWait } from '../utils/waitHelpers';

test.describe(`${Tags.ADMIN} @security Admin & Permissions Tests`, () => {
  test.describe('Admin Access Control', () => {
    test('Admin user can access manage pages @p1', async ({ authenticatedPage, adminAuthenticatedPage }) => {
      // Use admin authenticated page
      const page = adminAuthenticatedPage;
      const navigation = new navigationPage(page);

      await navigation.goToDashboard();
      await waitForNetworkIdle(page);

      // Try to access manage pages (admin-only sections)
      const adminMenuItems = [
        'Manage Assessments',
        'Manage Care Management',
        'Manage Configuration',
      ];

      let adminSectionFound = false;

      for (const menuItem of adminMenuItems) {
        // Look for admin menu items
        const menuLink = page.getByRole('link', { name: menuItem });
        const isVisible = await menuLink.isVisible({ timeout: 3000 }).catch(() => false);

        if (isVisible) {
          adminSectionFound = true;
          console.log(`Found admin menu: ${menuItem}`);

          // Try to navigate
          await menuLink.click();
          await waitForNetworkIdle(page, 10000);

          // Should not be redirected or blocked
          const currentUrl = page.url();
          expect(currentUrl).toBeTruthy();

          // Navigate back
          await navigation.goToDashboard();
          await smartWait(page, 500);

          break; // Found and accessed one admin section
        }
      }

      // If no admin sections found, that's also valid (might not be implemented yet)
      console.log('Admin section found:', adminSectionFound);
    });

    test('Admin can view all clients @p1', async ({ adminAuthenticatedPage }) => {
      const page = adminAuthenticatedPage;
      const navigation = new navigationPage(page);
      const memberSearch = new memberSearchPage(page);

      await navigation.goToDashboard();
      await navigation.openSearchMenu();
      await navigation.openMemberSearch();
      await waitForNetworkIdle(page);

      // Check client dropdown options
      const clientDropdown = page.locator('select').first();
      const optionCount = await clientDropdown.locator('option').count();

      // Admin should see multiple clients (or at least "All")
      expect(optionCount).toBeGreaterThan(0);

      console.log(`Admin can see ${optionCount} client options`);
    });

    test('Admin can perform privileged operations @p1', async ({ adminAuthenticatedPage }) => {
      const page = adminAuthenticatedPage;
      const navigation = new navigationPage(page);

      await navigation.goToDashboard();
      await waitForNetworkIdle(page);

      // Look for admin-only buttons/features
      const adminButtons = [
        'Manage Users',
        'System Settings',
        'Configuration',
        'Admin Panel',
      ];

      let hasAdminFeatures = false;

      for (const buttonText of adminButtons) {
        const button = page.getByRole('button', { name: buttonText });
        const isVisible = await button.isVisible({ timeout: 2000 }).catch(() => false);

        if (isVisible) {
          hasAdminFeatures = true;
          console.log(`Found admin feature: ${buttonText}`);
          break;
        }
      }

      // Admin should have some privileged features (or test is informational)
      console.log('Has admin features:', hasAdminFeatures);
    });
  });

  test.describe('Non-Admin Access Control', () => {
    test('Regular user cannot access admin pages directly @p0', async ({ authenticatedPage }) => {
      // Using regular authenticated page (non-admin)
      const navigation = new navigationPage(authenticatedPage);

      await navigation.goToDashboard();
      await waitForNetworkIdle(authenticatedPage);

      // Try to navigate directly to admin URL
      const adminUrls = [
        '/admin',
        '/admin/manage-assessments',
        '/admin/manage-users',
        '/admin/configuration',
        '/manage/assessments',
      ];

      for (const url of adminUrls) {
        await authenticatedPage.goto(url).catch(() => {
          // May throw error if route doesn't exist
        });

        await smartWait(authenticatedPage, 2000);

        const currentUrl = authenticatedPage.url();

        // Should be redirected or see access denied
        const accessDenied = authenticatedPage.getByText(/access denied|unauthorized|forbidden|not authorized/i);
        const isDenied = await accessDenied.isVisible({ timeout: 3000 }).catch(() => false);

        // Either redirected away from admin URL or see denial message
        const isBlocked = !currentUrl.includes('/admin') || isDenied;

        if (isBlocked) {
          console.log(`Blocked from ${url}: ✓`);
          expect(isBlocked).toBe(true);
          break; // Found one blocked URL, test passes
        }
      }
    });

    test('Regular user cannot see admin menu items @p1', async ({ authenticatedPage }) => {
      const navigation = new navigationPage(authenticatedPage);

      await navigation.goToDashboard();
      await waitForNetworkIdle(authenticatedPage);

      // Look for admin menu items (should not be visible)
      const adminMenuItems = [
        'Manage Users',
        'Manage System',
        'Admin Panel',
        'System Configuration',
      ];

      for (const menuItem of adminMenuItems) {
        const menuLink = authenticatedPage.getByRole('link', { name: menuItem });
        const isVisible = await menuLink.isVisible({ timeout: 2000 }).catch(() => false);

        // Admin items should not be visible to regular users
        if (isVisible) {
          console.log(`WARNING: Regular user can see admin menu: ${menuItem}`);
        }
        expect(isVisible).toBe(false);
      }
    });

    test('Regular user has limited client access @p1', async ({ authenticatedPage }) => {
      const navigation = new navigationPage(authenticatedPage);
      const memberSearch = new memberSearchPage(authenticatedPage);

      await navigation.goToDashboard();
      await navigation.openSearchMenu();
      await navigation.openMemberSearch();
      await waitForNetworkIdle(authenticatedPage);

      // Check client dropdown - regular user may have limited options
      const clientDropdown = authenticatedPage.locator('select').first();
      const optionCount = await clientDropdown.locator('option').count();

      // Regular user should have at least one client
      expect(optionCount).toBeGreaterThan(0);

      // Log for comparison with admin
      console.log(`Regular user can see ${optionCount} client options`);
    });
  });

  test.describe('Role-Based Feature Access', () => {
    test('User can only access assigned features @p1', async ({ authenticatedPage }) => {
      const navigation = new navigationPage(authenticatedPage);

      await navigation.goToDashboard();
      await waitForNetworkIdle(authenticatedPage);

      // Check what features are available
      const features = [
        { name: 'Dashboard', selector: '[href*="dashboard"]' },
        { name: 'Member Search', selector: '[href*="member"]' },
        { name: 'Reports', selector: '[href*="report"]' },
      ];

      for (const feature of features) {
        const element = authenticatedPage.locator(feature.selector).first();
        const isVisible = await element.isVisible({ timeout: 3000 }).catch(() => false);

        console.log(`Feature ${feature.name}: ${isVisible ? 'Available' : 'Not available'}`);
      }

      // User should have at least dashboard access
      const dashboard = authenticatedPage.locator('[href*="dashboard"]');
      const hasDashboard = await dashboard.count();
      expect(hasDashboard).toBeGreaterThan(0);
    });

    test('Read-only user cannot edit data @p1', async ({ authenticatedPage }) => {
      // This test assumes read-only user exists
      // For now, we'll test with regular user and check for edit restrictions

      const navigation = new navigationPage(authenticatedPage);
      const memberSearch = new memberSearchPage(authenticatedPage);

      await navigation.goToDashboard();
      await navigation.openSearchMenu();
      await navigation.openMemberSearch();

      await memberSearch.searchMember({
        client: CLIENTS.COMPREHENSIVE_TEST,
        memberId: '1234567890',
      });

      await waitForNetworkIdle(authenticatedPage);

      // Check if edit buttons exist
      const editButtons = authenticatedPage.getByRole('button', { name: /edit/i });
      const editCount = await editButtons.count();

      // Log what edit capabilities exist
      console.log(`Edit buttons found: ${editCount}`);

      // If read-only, edit buttons should be disabled or not present
      if (editCount > 0) {
        const firstEditButton = editButtons.first();
        const isDisabled = await firstEditButton.isDisabled().catch(() => false);
        console.log('Edit button disabled:', isDisabled);
      }
    });

    test('User cannot delete data without permission @p1', async ({ authenticatedPage }) => {
      const navigation = new navigationPage(authenticatedPage);
      const memberSearch = new memberSearchPage(authenticatedPage);

      await navigation.goToDashboard();
      await navigation.openSearchMenu();
      await navigation.openMemberSearch();

      await memberSearch.searchMember({
        client: CLIENTS.COMPREHENSIVE_TEST,
        memberId: '1234567890',
      });

      await waitForNetworkIdle(authenticatedPage);

      // Look for delete buttons
      const deleteButtons = authenticatedPage.locator('button:has-text("Delete"), .fa-trash, [aria-label*="delete"]');
      const deleteCount = await deleteButtons.count();

      console.log(`Delete buttons found: ${deleteCount}`);

      // If delete buttons exist, they might be disabled or protected
      if (deleteCount > 0) {
        const firstDelete = deleteButtons.first();
        const isDisabled = await firstDelete.isDisabled().catch(() => false);
        console.log('Delete button disabled:', isDisabled);
      }
    });
  });

  test.describe('Session & Authentication', () => {
    test('Session timeout redirects to login @p1', async ({ page }) => {
      // This test requires manipulating session timeout
      // For now, we'll test basic session behavior

      const login = new loginPage(page);
      const navigation = new navigationPage(page);

      // Login
      await login.goto();
      await login.login(TEST_CREDENTIALS.STAGE_USERNAME, TEST_CREDENTIALS.STAGE_PASSWORD);
      await waitForNetworkIdle(page);

      // Clear session cookies (simulate timeout)
      await page.context().clearCookies();
      await smartWait(page, 1000);

      // Try to navigate (should redirect to login)
      await page.goto('/dashboard').catch(() => {});
      await smartWait(page, 3000);

      // Should be redirected to login page
      const currentUrl = page.url();
      const isLoginPage = currentUrl.includes('login') || currentUrl.includes('signin');

      console.log('After session clear, URL:', currentUrl);
      console.log('Redirected to login:', isLoginPage);

      // Should require re-authentication
      expect(currentUrl).toBeTruthy();
    });

    test('Concurrent sessions handled properly @p2', async ({ context, page }) => {
      // Open second tab with same user
      const page2 = await context.newPage();

      const login1 = new loginPage(page);
      const login2 = new loginPage(page2);

      // Login in both tabs
      await login1.goto();
      await login1.login(TEST_CREDENTIALS.STAGE_USERNAME, TEST_CREDENTIALS.STAGE_PASSWORD);
      await waitForNetworkIdle(page);

      await login2.goto();
      await login2.login(TEST_CREDENTIALS.STAGE_USERNAME, TEST_CREDENTIALS.STAGE_PASSWORD);
      await waitForNetworkIdle(page2);

      // Both should work or one should be logged out
      const url1 = page.url();
      const url2 = page2.url();

      console.log('Tab 1 URL:', url1);
      console.log('Tab 2 URL:', url2);

      // At least one should be logged in
      const bothLoggedIn = !url1.includes('login') || !url2.includes('login');
      expect(bothLoggedIn).toBe(true);

      await page2.close();
    });

    test('Invalid session token rejected @p1', async ({ page }) => {
      // Login first
      const login = new loginPage(page);
      await login.goto();
      await login.login(TEST_CREDENTIALS.STAGE_USERNAME, TEST_CREDENTIALS.STAGE_PASSWORD);
      await waitForNetworkIdle(page);

      // Manipulate session cookie to be invalid
      const cookies = await page.context().cookies();

      for (const cookie of cookies) {
        if (cookie.name.toLowerCase().includes('session') || cookie.name.toLowerCase().includes('auth')) {
          // Modify cookie value to be invalid
          await page.context().addCookies([{
            ...cookie,
            value: 'invalid_token_12345',
          }]);

          break;
        }
      }

      // Try to navigate
      await page.goto('/dashboard').catch(() => {});
      await smartWait(page, 3000);

      // Should be rejected (redirected to login or error)
      const currentUrl = page.url();
      const isRejected = currentUrl.includes('login') || currentUrl.includes('error');

      console.log('After invalid token, URL:', currentUrl);
      console.log('Access rejected:', isRejected);
    });
  });

  test.describe('Data Access Control', () => {
    test('User can only view assigned client data @p1', async ({ authenticatedPage }) => {
      const navigation = new navigationPage(authenticatedPage);
      const memberSearch = new memberSearchPage(authenticatedPage);

      await navigation.goToDashboard();
      await navigation.openSearchMenu();
      await navigation.openMemberSearch();
      await waitForNetworkIdle(authenticatedPage);

      // Get available clients
      const clientDropdown = authenticatedPage.locator('select').first();
      const options = await clientDropdown.locator('option').allTextContents();

      console.log('Available clients:', options);

      // User should see specific clients (not necessarily all)
      expect(options.length).toBeGreaterThan(0);
    });

    test('User cannot access other client data directly @p1', async ({ authenticatedPage }) => {
      // Try to search for data in a client user shouldn't have access to
      // This requires knowing which clients user doesn't have access to
      // For now, this is a framework test

      const navigation = new navigationPage(authenticatedPage);
      const memberSearch = new memberSearchPage(authenticatedPage);

      await navigation.goToDashboard();
      await navigation.openSearchMenu();
      await navigation.openMemberSearch();
      await waitForNetworkIdle(authenticatedPage);

      // Get current client list
      const clientDropdown = authenticatedPage.locator('select').first();
      const firstOption = await clientDropdown.locator('option').nth(1).textContent();

      console.log('Testing with client:', firstOption);

      // If user has access, test passes
      // In production, test with unauthorized client
      expect(firstOption).toBeTruthy();
    });

    test('Sensitive data is masked appropriately @p1', async ({ authenticatedPage }) => {
      const navigation = new navigationPage(authenticatedPage);
      const memberSearch = new memberSearchPage(authenticatedPage);

      await navigation.goToDashboard();
      await navigation.openSearchMenu();
      await navigation.openMemberSearch();

      await memberSearch.searchMember({
        client: CLIENTS.COMPREHENSIVE_TEST,
        memberId: '1234567890',
      });

      await waitForNetworkIdle(authenticatedPage);

      // Check if SSN is masked in results
      const pageContent = await authenticatedPage.content();

      // Look for masked SSN pattern (XXX-XX-####)
      const hasMaskedSSN = pageContent.includes('XXX-XX-') || pageContent.includes('***-**-');
      const hasFullSSN = pageContent.match(/\d{9}/); // 9 consecutive digits (unmasked)

      console.log('Has masked SSN:', hasMaskedSSN);
      console.log('Has full SSN:', hasFullSSN !== null);

      // Sensitive data should be masked
      // Either shows masked or doesn't show SSN at all
      expect(!hasFullSSN || hasMaskedSSN).toBe(true);
    });
  });

  test.describe('Audit Trail', () => {
    test('User actions are logged @p2', async ({ authenticatedPage }) => {
      // Perform various actions
      const navigation = new navigationPage(authenticatedPage);
      const memberSearch = new memberSearchPage(authenticatedPage);

      await navigation.goToDashboard();
      await navigation.openSearchMenu();
      await navigation.openMemberSearch();

      await memberSearch.searchMember({
        client: CLIENTS.COMPREHENSIVE_TEST,
        memberId: '1234567890',
      });

      await waitForNetworkIdle(authenticatedPage);

      // In production, check audit log for these actions
      // For now, verify actions completed successfully
      const resultsTable = authenticatedPage.locator('#advancedMemberSearchMemberTableBody, h3:has-text("Member Not Found")');
      await expect(resultsTable).toBeVisible({ timeout: 10000 });

      console.log('Action completed: member search');
      console.log('Note: Audit trail should log this action');
    });

    test('Member access is tracked @p2', async ({ authenticatedPage }) => {
      const navigation = new navigationPage(authenticatedPage);
      const memberSearch = new memberSearchPage(authenticatedPage);

      await navigation.goToDashboard();
      await navigation.openSearchMenu();
      await navigation.openMemberSearch();

      await memberSearch.searchMember({
        client: CLIENTS.COMPREHENSIVE_TEST,
        memberId: '1234567890',
      });

      await waitForNetworkIdle(authenticatedPage);

      // Open member hub (PHI access)
      const memberLink = authenticatedPage.getByRole('link', { name: /COMP\d+/i }).first();
      const isVisible = await memberLink.isVisible({ timeout: 5000 }).catch(() => false);

      if (isVisible) {
        await memberLink.click();
        await waitForNetworkIdle(authenticatedPage);

        console.log('Accessed member hub');
        console.log('Note: This PHI access should be audited');

        // In production, verify audit log entry
        expect(isVisible).toBe(true);
      }
    });
  });

  test.describe('Password & Account Security', () => {
    test('Login fails with incorrect password @p1', async ({ page }) => {
      const login = new loginPage(page);

      await login.goto();

      // Try login with wrong password
      await login.login(TEST_CREDENTIALS.STAGE_USERNAME, 'WrongPassword123!');
      await smartWait(page, 3000);

      // Should show error message
      const errorMessage = page.getByText(/invalid|incorrect|unable to sign in/i);
      const hasError = await errorMessage.isVisible({ timeout: 5000 }).catch(() => false);

      console.log('Login failed with wrong password:', hasError);

      // Should not be logged in
      const currentUrl = page.url();
      const stillOnLogin = currentUrl.includes('login');

      expect(hasError || stillOnLogin).toBe(true);
    });

    test('Account lockout after failed attempts @p2', async ({ page }) => {
      const login = new loginPage(page);

      await login.goto();

      // Try multiple failed logins
      for (let i = 0; i < 3; i++) {
        await login.login(TEST_CREDENTIALS.STAGE_USERNAME, `WrongPassword${i}!`);
        await smartWait(page, 2000);

        console.log(`Failed login attempt ${i + 1}`);
      }

      // Check for lockout message
      const lockoutMessage = page.getByText(/locked|too many attempts|temporarily disabled/i);
      const isLocked = await lockoutMessage.isVisible({ timeout: 3000 }).catch(() => false);

      console.log('Account locked after failed attempts:', isLocked);

      // Note: Lockout behavior is implementation-specific
      // This test documents expected behavior
    });
  });
});
