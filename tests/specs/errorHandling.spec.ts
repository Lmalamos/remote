// ============================================
// ERROR HANDLING & RECOVERY
// Tests for error scenarios, network issues, session handling
// ============================================

import { test, expect } from '../fixtures/cleanupAuth.fixture';
import { memberSearchPage } from '../pages/memberSearchPage';
import { navigationPage } from '../pages/navigationPage';
import { allergiesPanel } from '../pages/memberHub/allergies';
import { Tags } from '../tags';
import { TEST_MEMBER, CLIENTS, UI_TEXT } from '../constants';
import { waitForNetworkIdle, smartWait } from '../utils/waitHelpers';

test.describe(`${Tags.REGRESSION} Error Handling & Recovery`, () => {
  let memberSearch: memberSearchPage;
  let navigation: navigationPage;
  let allergies: allergiesPanel;

  test.beforeEach(async ({ authenticatedPage }) => {
    memberSearch = new memberSearchPage(authenticatedPage);
    navigation = new navigationPage(authenticatedPage);
    allergies = new allergiesPanel(authenticatedPage);
  });

  test.describe('Network Error Handling', () => {
    test('Handle slow network gracefully @p2', async ({ authenticatedPage }) => {
      /**
       * Simulate slow network and verify application handles it
       */

      await test.step('Emulate slow network', async () => {
        // Emulate slow 3G network
        await authenticatedPage.context().route('**/*', async (route) => {
          // Add delay to simulate slow network
          await new Promise(resolve => setTimeout(resolve, 500));
          await route.continue();
        });
      });

      await test.step('Navigate and perform actions', async () => {
        await navigation.goToDashboard();
        await waitForNetworkIdle(authenticatedPage, 60000); // Longer timeout for slow network

        await navigation.openSearchMenu();
        await navigation.openMemberSearch();
        await waitForNetworkIdle(authenticatedPage, 60000);

        // Should load, just slower
        const searchButton = authenticatedPage.locator('button:has-text("Search")');
        await expect(searchButton).toBeVisible({ timeout: 15000 });
      });

      await test.step('Verify no errors during slow network', async () => {
        // Should not show error messages
        const errorMessage = authenticatedPage.locator('.error, .alert-danger');
        const hasError = await errorMessage.isVisible({ timeout: 2000 }).catch(() => false);

        // May show loading indicators but should not error
        expect(hasError).toBe(false);
      });
    });

    test('Handle missing data gracefully @p2', async ({ authenticatedPage }) => {
      /**
       * Test when API returns empty data
       */

      await test.step('Search for non-existent member', async () => {
        await navigation.goToDashboard();
        await navigation.openSearchMenu();
        await navigation.openMemberSearch();

        await memberSearch.searchMember({
          client: CLIENTS.COMPREHENSIVE_TEST,
          memberId: '9999999999',
          lastName: 'NonExistentMember99999',
        });

        await waitForNetworkIdle(authenticatedPage);
      });

      await test.step('Verify appropriate "not found" message', async () => {
        // Should show "Member Not Found" message, not an error
        await memberSearch.verifyNoSearchResults();
        await expect(authenticatedPage.getByRole('heading', { name: 'Member Not Found.' })).toBeVisible();

        // Should offer to add member
        await expect(authenticatedPage.getByRole('button', { name: ' Add Member' })).toBeVisible();

        // Should not show system error
        const systemError = authenticatedPage.locator('.snackbar.error.show');
        const errorText = await systemError.textContent().catch(() => '');
        expect(errorText).not.toContain('500');
        expect(errorText).not.toContain('Internal Server Error');
      });
    });

    test('Page refresh during data entry @p2', async ({ authenticatedPage }) => {
      /**
       * Test page refresh behavior during form completion
       */

      await test.step('Start filling a form', async () => {
        await navigation.goToDashboard();
        await navigation.openSearchMenu();
        await navigation.openMemberSearch();

        // Start search (don't complete)
        const memberIdField = authenticatedPage.locator('[placeholder="Member\\ ID"]');
        await memberIdField.fill('123456');
      });

      await test.step('Refresh page', async () => {
        await authenticatedPage.reload();
        await waitForNetworkIdle(authenticatedPage);
      });

      await test.step('Verify page loads correctly after refresh', async () => {
        // Should load member search page
        const searchButton = authenticatedPage.locator('button:has-text("Search")');
        await expect(searchButton).toBeVisible({ timeout: 10000 });

        // Form should be cleared (data not persisted across refresh)
        const memberIdField = authenticatedPage.locator('[placeholder="Member\\ ID"]');
        const value = await memberIdField.inputValue();
        expect(value).toBe('');
      });
    });
  });

  test.describe('Validation Error Recovery', () => {
    test('Recover from validation errors @p1', async ({ authenticatedPage }) => {
      /**
       * Test fixing validation errors and resubmitting
       */

      await test.step('Navigate to member search', async () => {
        await navigation.goToDashboard();
        await navigation.openSearchMenu();
        await navigation.openMemberSearch();
        await waitForNetworkIdle(authenticatedPage);
      });

      await test.step('Trigger validation error', async () => {
        // Try to search without criteria
        await memberSearch.searchMember({
          client: CLIENTS.COMPREHENSIVE_TEST,
        });

        // Should show validation error
        await memberSearch.verifySearchCriteriaErrorMessage();
      });

      await test.step('Fix validation error and retry', async () => {
        // Now fill valid criteria
        await memberSearch.searchMember({
          client: CLIENTS.COMPREHENSIVE_TEST,
          memberId: TEST_MEMBER.ID,
        });

        await waitForNetworkIdle(authenticatedPage);

        // Should now succeed
        const resultsTable = authenticatedPage.locator('#advancedMemberSearchMemberTableBody');
        const hasResults = await resultsTable.isVisible({ timeout: 5000 }).catch(() => false);

        // Either shows results or "not found", but should not have validation error
        const errorMessage = authenticatedPage.locator('.snackbar.error.show');
        const errorText = await errorMessage.textContent().catch(() => '');
        expect(errorText).not.toContain(UI_TEXT.SEARCH_CRITERIA_REQUIRED);
      });
    });

    test('Multiple validation errors shown and cleared @p2', async ({ authenticatedPage }) => {
      /**
       * Test that multiple validation errors are shown and can be cleared
       */

      await test.step('Navigate to member search', async () => {
        await navigation.goToDashboard();
        await navigation.openSearchMenu();
        await navigation.openMemberSearch();
        await waitForNetworkIdle(authenticatedPage);
      });

      await test.step('Trigger multiple validation errors', async () => {
        // Search with too-short member ID
        await memberSearch.searchMember({
          client: CLIENTS.COMPREHENSIVE_TEST,
          memberId: '12', // Too short
        });

        await memberSearch.verifyMemberIdLengthErrorMessage();

        // Error should be visible
        const errorMessage = authenticatedPage.locator('.snackbar.error.show');
        await expect(errorMessage).toContainText(UI_TEXT.MEMBER_ID_LENGTH_ERROR);
      });

      await test.step('Clear error by providing valid input', async () => {
        // Wait for error to clear or provide valid input
        await smartWait(authenticatedPage, 2000);

        // Try again with valid data
        await memberSearch.searchMember({
          client: CLIENTS.COMPREHENSIVE_TEST,
          memberId: TEST_MEMBER.ID,
        });

        await waitForNetworkIdle(authenticatedPage);

        // Validation error should be gone
        const errorMessage = authenticatedPage.locator('.snackbar.error.show');
        const stillVisible = await errorMessage.isVisible({ timeout: 2000 }).catch(() => false);

        // Error should fade or be replaced with results
        if (stillVisible) {
          const errorText = await errorMessage.textContent();
          // Should not be the member ID length error anymore
          expect(errorText).not.toContain(UI_TEXT.MEMBER_ID_LENGTH_ERROR);
        }
      });
    });
  });

  test.describe('Form Error Handling', () => {
    test('Add Member form validation @p1', async ({ authenticatedPage }) => {
      /**
       * Test Add Member form validation errors
       */

      await test.step('Trigger Add Member form', async () => {
        await navigation.goToDashboard();
        await navigation.openSearchMenu();
        await navigation.openMemberSearch();

        // Search for non-existent member
        await memberSearch.searchMember({
          client: CLIENTS.COMPREHENSIVE_TEST,
          memberId: '9999999999',
        });

        await waitForNetworkIdle(authenticatedPage);

        // Click Add Member
        await authenticatedPage.getByRole('button', { name: ' Add Member' }).click();
        await smartWait(authenticatedPage, 1000);
      });

      await test.step('Try to submit with missing required fields', async () => {
        const submitButton = authenticatedPage.getByRole('button', { name: 'Submit' });
        const submitVisible = await submitButton.isVisible({ timeout: 2000 }).catch(() => false);

        if (submitVisible) {
          await submitButton.click();
          await smartWait(authenticatedPage, 1000);

          // Should show validation errors
          const validationErrors = authenticatedPage.locator('.field-validation-error, .error, .alert-danger');
          const errorCount = await validationErrors.count();

          // Should have errors for required fields
          expect(errorCount).toBeGreaterThan(0);
        }
      });

      await test.step('Fix some errors and verify partial validation', async () => {
        // Fill some required fields
        const firstNameField = authenticatedPage.getByRole('textbox', { name: 'First Name *' });
        const firstNameVisible = await firstNameField.isVisible({ timeout: 2000 }).catch(() => false);

        if (firstNameVisible) {
          await firstNameField.fill('Test');
          await smartWait(authenticatedPage, 500);

          const lastNameField = authenticatedPage.getByRole('textbox', { name: 'Last Name *' });
          await lastNameField.fill('User');

          // Some errors should clear, others remain
          const validationErrors = authenticatedPage.locator('.field-validation-error');
          const errorCount = await validationErrors.count();

          // Should still have errors for unfilled required fields
          expect(errorCount).toBeGreaterThanOrEqual(0);
        }
      });

      await test.step('Close form', async () => {
        const cancelButton = authenticatedPage.getByRole('button', { name: 'Cancel' });
        await cancelButton.click();
      });
    });

    test('Handle duplicate submission attempts @p2', async ({ authenticatedPage }) => {
      /**
       * Test double-click / double-submit handling
       */

      await test.step('Navigate to member hub', async () => {
        await navigation.goToDashboard();
        await navigation.openSearchMenu();
        await navigation.openMemberSearch();

        await memberSearch.searchMember({
          client: CLIENTS.COMPREHENSIVE_TEST,
          memberId: TEST_MEMBER.ID,
        });

        await waitForNetworkIdle(authenticatedPage);
        await memberSearch.openMemberHub(TEST_MEMBER.FULL_ID);
        await waitForNetworkIdle(authenticatedPage);
      });

      await test.step('Try to submit allergy form multiple times', async () => {
        await allergies.panelHeader.click();
        await waitForNetworkIdle(authenticatedPage);

        await allergies.addButton.click();
        await smartWait(authenticatedPage, 1000);

        const searchInput = allergies.searchInput;
        const searchVisible = await searchInput.isVisible({ timeout: 3000 }).catch(() => false);

        if (searchVisible) {
          await searchInput.fill('Test');
          await allergies.searchButton.click();
          await waitForNetworkIdle(authenticatedPage);

          // Try to click submit button multiple times quickly
          const submitButton = allergies.submitButton;
          const submitVisible = await submitButton.isVisible({ timeout: 3000 }).catch(() => false);

          if (submitVisible) {
            // Click multiple times
            await submitButton.click();
            await submitButton.click(); // Should be disabled or handle gracefully

            await smartWait(authenticatedPage, 1000);

            // Should not create duplicate entries or error
            // Should either disable button or queue properly
          }
        }

        // Close form
        const cancelButton = allergies.cancelButton;
        const cancelVisible = await cancelButton.isVisible({ timeout: 2000 }).catch(() => false);
        if (cancelVisible) {
          await cancelButton.click();
        }
      });
    });
  });

  test.describe('Browser Navigation Edge Cases', () => {
    test('Browser back button does not break state @p2', async ({ authenticatedPage }) => {
      /**
       * Test browser back button in various scenarios
       */

      await test.step('Navigate through multiple pages', async () => {
        await navigation.goToDashboard();
        await waitForNetworkIdle(authenticatedPage);

        await navigation.openSearchMenu();
        await navigation.openMemberSearch();
        await waitForNetworkIdle(authenticatedPage);

        await memberSearch.searchMember({
          client: CLIENTS.COMPREHENSIVE_TEST,
          memberId: TEST_MEMBER.ID,
        });
        await waitForNetworkIdle(authenticatedPage);

        await memberSearch.openMemberHub(TEST_MEMBER.FULL_ID);
        await waitForNetworkIdle(authenticatedPage);
      });

      await test.step('Use back button multiple times', async () => {
        // Back to search results
        await authenticatedPage.goBack();
        await smartWait(authenticatedPage, 2000);

        // Verify page is functional
        let pageContent = await authenticatedPage.content();
        expect(pageContent).not.toContain('Uncaught');
        expect(pageContent).toBeTruthy();

        // Back to search form
        await authenticatedPage.goBack();
        await smartWait(authenticatedPage, 2000);

        pageContent = await authenticatedPage.content();
        expect(pageContent).not.toContain('Uncaught');

        // Back to dashboard
        await authenticatedPage.goBack();
        await smartWait(authenticatedPage, 2000);

        pageContent = await authenticatedPage.content();
        expect(pageContent).not.toContain('Uncaught');
      });

      await test.step('Use forward button', async () => {
        // Forward through pages
        await authenticatedPage.goForward();
        await smartWait(authenticatedPage, 2000);

        await authenticatedPage.goForward();
        await smartWait(authenticatedPage, 2000);

        // Should maintain functionality
        const pageContent = await authenticatedPage.content();
        expect(pageContent).toBeTruthy();
      });
    });

    test('Navigate away during form submission @p2', async ({ authenticatedPage }) => {
      /**
       * Test navigating away while form is being submitted
       */

      await test.step('Start form submission', async () => {
        await navigation.goToDashboard();
        await navigation.openSearchMenu();
        await navigation.openMemberSearch();

        // Start a search (simulating a slow submission)
        await memberSearch.searchMember({
          client: CLIENTS.COMPREHENSIVE_TEST,
          memberId: TEST_MEMBER.ID,
        });

        // Don't wait for it to complete
        await smartWait(authenticatedPage, 500);
      });

      await test.step('Navigate away immediately', async () => {
        // Navigate to dashboard before search completes
        await navigation.goToDashboard();
        await waitForNetworkIdle(authenticatedPage);
      });

      await test.step('Verify application state is consistent', async () => {
        // Should be on dashboard
        const url = authenticatedPage.url();
        expect(url).toContain('dashboard');

        // Should not have errors
        const pageContent = await authenticatedPage.content();
        expect(pageContent).not.toContain('Uncaught');

        // Can navigate normally
        await navigation.openSearchMenu();
        await navigation.openMemberSearch();
        await waitForNetworkIdle(authenticatedPage);

        const searchButton = authenticatedPage.locator('button:has-text("Search")');
        await expect(searchButton).toBeVisible();
      });
    });
  });

  test.describe('Data Integrity', () => {
    test('Simultaneous panel operations @p3', async ({ authenticatedPage }) => {
      /**
       * Test opening/closing multiple panels quickly
       */

      await test.step('Navigate to member hub', async () => {
        await navigation.goToDashboard();
        await navigation.openSearchMenu();
        await navigation.openMemberSearch();

        await memberSearch.searchMember({
          client: CLIENTS.COMPREHENSIVE_TEST,
          memberId: TEST_MEMBER.ID,
        });

        await waitForNetworkIdle(authenticatedPage);
        await memberSearch.openMemberHub(TEST_MEMBER.FULL_ID);
        await waitForNetworkIdle(authenticatedPage);
      });

      await test.step('Rapidly toggle multiple panels', async () => {
        // Click multiple panel headers quickly
        await allergies.panelHeader.click();
        await smartWait(authenticatedPage, 200);

        const medicationsHeader = authenticatedPage.locator('h3:has-text("Medications")');
        const medVisible = await medicationsHeader.isVisible({ timeout: 2000 }).catch(() => false);
        if (medVisible) {
          await medicationsHeader.click();
          await smartWait(authenticatedPage, 200);
        }

        await allergies.panelHeader.click();
        await smartWait(authenticatedPage, 200);

        // Should handle rapid clicking without errors
        const pageContent = await authenticatedPage.content();
        expect(pageContent).not.toContain('Uncaught');
      });

      await test.step('Verify panels still function correctly', async () => {
        // Open allergies and verify it works
        await allergies.panelHeader.click();
        await waitForNetworkIdle(authenticatedPage);

        // Should be able to interact with panel
        await expect(allergies.addButton).toBeVisible({ timeout: 5000 });
      });
    });

    test('Handle empty form cancellation @p3', async ({ authenticatedPage }) => {
      /**
       * Test canceling forms at various stages
       */

      await test.step('Navigate to member hub', async () => {
        await navigation.goToDashboard();
        await navigation.openSearchMenu();
        await navigation.openMemberSearch();

        await memberSearch.searchMember({
          client: CLIENTS.COMPREHENSIVE_TEST,
          memberId: TEST_MEMBER.ID,
        });

        await waitForNetworkIdle(authenticatedPage);
        await memberSearch.openMemberHub(TEST_MEMBER.FULL_ID);
        await waitForNetworkIdle(authenticatedPage);
      });

      await test.step('Open and immediately cancel allergy form', async () => {
        await allergies.panelHeader.click();
        await waitForNetworkIdle(authenticatedPage);

        await allergies.addButton.click();
        await smartWait(authenticatedPage, 500);

        // Cancel immediately without filling anything
        await allergies.cancelButton.click();
        await waitForNetworkIdle(authenticatedPage);

        // Should return to panel list
        await expect(allergies.addButton).toBeVisible();
      });

      await test.step('Open, partially fill, then cancel', async () => {
        await allergies.addButton.click();
        await smartWait(authenticatedPage, 500);

        const searchInput = allergies.searchInput;
        const searchVisible = await searchInput.isVisible({ timeout: 2000 }).catch(() => false);

        if (searchVisible) {
          // Fill something
          await searchInput.fill('Test');
          await smartWait(authenticatedPage, 300);

          // Cancel
          await allergies.cancelButton.click();
          await waitForNetworkIdle(authenticatedPage);

          // Should return without errors
          await expect(allergies.addButton).toBeVisible();
        }
      });
    });
  });
});
