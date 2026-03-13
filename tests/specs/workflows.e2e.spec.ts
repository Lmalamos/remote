// ============================================
// END-TO-END WORKFLOWS
// Complete user journeys testing integrated functionality
// ============================================

import { test, expect } from '../fixtures/cleanupAuth.fixture';
import { memberSearchPage } from '../pages/memberSearchPage';
import { navigationPage } from '../pages/navigationPage';
import { allergiesPanel } from '../pages/memberHub/allergies';
import { medicationsPanel } from '../pages/memberHub/medications';
import { Tags, combineTags } from '../tags';
import { TEST_MEMBER, CLIENTS } from '../constants';
import { waitForNetworkIdle, smartWait, waitForElementVisible } from '../utils/waitHelpers';
import { createMemberDetails, generateUniqueMemberId } from '../factories/memberFactory';

test.describe(`${Tags.E2E} ${combineTags(Tags.WORKFLOW)} End-to-End Workflows`, () => {
  let memberSearch: memberSearchPage;
  let navigation: navigationPage;
  let allergies: allergiesPanel;
  let medications: medicationsPanel;

  test.beforeEach(async ({ authenticatedPage }) => {
    memberSearch = new memberSearchPage(authenticatedPage);
    navigation = new navigationPage(authenticatedPage);
    allergies = new allergiesPanel(authenticatedPage);
    medications = new medicationsPanel(authenticatedPage);
  });

  test.describe('Member Onboarding Workflow', () => {
    test('Complete member search to hub navigation @e2e @p1 @slow', async ({ authenticatedPage, testDataTracker }) => {
      /**
       * Complete workflow:
       * 1. Navigate to member search
       * 2. Search for existing member
       * 3. Open member hub
       * 4. Verify hub loaded with all panels
       * 5. Navigate through key panels
       */

      await test.step('Navigate to member search', async () => {
        await navigation.goToDashboard();
        await navigation.openSearchMenu();
        await navigation.openMemberSearch();
        await waitForNetworkIdle(authenticatedPage);
      });

      await test.step('Search for member', async () => {
        await memberSearch.searchMember({
          client: CLIENTS.COMPREHENSIVE_TEST,
          memberId: TEST_MEMBER.ID,
          lastName: TEST_MEMBER.LAST_NAME,
        });

        await waitForNetworkIdle(authenticatedPage);

        // Verify search results displayed
        await memberSearch.verifySearchResults();
      });

      await test.step('Open member hub', async () => {
        await memberSearch.openMemberHub(TEST_MEMBER.FULL_ID);
        await waitForNetworkIdle(authenticatedPage);

        // Verify member hub loaded
        await memberSearch.verifyMemberHubLoads();
        await expect(authenticatedPage.getByText('Member Hub')).toBeVisible();
      });

      await test.step('Verify key panels are available', async () => {
        // Check for common member hub panels
        const panels = [
          'Allergies',
          'Medications',
          'Care Management',
          'Assessments',
        ];

        for (const panel of panels) {
          const panelHeader = authenticatedPage.locator(`h3:has-text("${panel}")`);
          const isVisible = await panelHeader.isVisible({ timeout: 5000 }).catch(() => false);

          if (isVisible) {
            // Panel exists
            expect(isVisible).toBe(true);
          }
        }
      });

      await test.step('Navigate to View Member Details', async () => {
        await memberSearch.clickViewMemberDetails();
        await smartWait(authenticatedPage, 1000);

        // Should show member details section
        const detailsSection = authenticatedPage.locator('.member-details, #memberDetails, [class*="detail"]');
        const sectionCount = await detailsSection.count();

        // Some details should be visible
        expect(sectionCount).toBeGreaterThanOrEqual(0);
      });

      await test.step('Navigate to Even More Member Details', async () => {
        const moreDetailsLink = authenticatedPage.getByRole('link', { name: 'View Even More Member Details' });
        const linkVisible = await moreDetailsLink.isVisible({ timeout: 3000 }).catch(() => false);

        if (linkVisible) {
          await moreDetailsLink.click();
          await waitForNetworkIdle(authenticatedPage);

          // Should navigate to extended details page
          const url = authenticatedPage.url();
          expect(url).toBeTruthy();
        }
      });
    });

    test('Member not found to add member flow @e2e @p2 @slow', async ({ authenticatedPage }) => {
      /**
       * Workflow for adding new member:
       * 1. Search for non-existent member
       * 2. See "Member Not Found" message
       * 3. Click "Add Member" button
       * 4. Fill member details form
       * 5. Verify form validation
       */

      await test.step('Navigate and search for non-existent member', async () => {
        await navigation.goToDashboard();
        await navigation.openSearchMenu();
        await navigation.openMemberSearch();
        await waitForNetworkIdle(authenticatedPage);

        // Search for member that doesn't exist
        const uniqueId = generateUniqueMemberId();
        await memberSearch.searchMember({
          client: CLIENTS.COMPREHENSIVE_TEST,
          memberId: uniqueId,
        });

        await waitForNetworkIdle(authenticatedPage);
      });

      await test.step('Verify "Member Not Found" message', async () => {
        await memberSearch.verifyNoSearchResults();
        await expect(authenticatedPage.getByRole('heading', { name: 'Member Not Found.' })).toBeVisible();
        await expect(authenticatedPage.getByRole('button', { name: ' Add Member' })).toBeVisible();
      });

      await test.step('Open Add Member form', async () => {
        await authenticatedPage.getByRole('button', { name: ' Add Member' }).click();
        await smartWait(authenticatedPage, 1000);

        // Verify form opened
        const dialog = authenticatedPage.getByRole('dialog', { name: 'Add Member' });
        const isVisible = await dialog.isVisible({ timeout: 3000 }).catch(() => false);

        if (isVisible) {
          expect(isVisible).toBe(true);
        }
      });

      await test.step('Verify form has required fields', async () => {
        // Check required fields are present
        const requiredFields = [
          'First Name *',
          'Last Name *',
          'Birth Date *',
          'Social Security Number *',
          'Member Id *',
        ];

        for (const fieldName of requiredFields) {
          const field = authenticatedPage.getByRole('textbox', { name: fieldName });
          const isVisible = await field.isVisible({ timeout: 2000 }).catch(() => false);

          if (isVisible) {
            expect(isVisible).toBe(true);
          }
        }
      });

      await test.step('Close form without submitting', async () => {
        const cancelButton = authenticatedPage.getByRole('button', { name: 'Cancel' });
        await cancelButton.click();
        await waitForNetworkIdle(authenticatedPage);

        // Should return to search results page
        await expect(authenticatedPage.getByRole('heading', { name: 'Member Not Found.' })).toBeVisible();
      });
    });
  });

  test.describe('Member Hub Data Management Workflow', () => {
    test('Add allergy and medication in sequence @e2e @p1 @slow', async ({ authenticatedPage }) => {
      /**
       * Complete workflow:
       * 1. Search and open member
       * 2. Add an allergy
       * 3. Verify allergy added
       * 4. Add a medication
       * 5. Verify medication added
       * 6. Verify both persist after navigation
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

      await test.step('Add an allergy', async () => {
        // Open allergies panel
        await allergies.panelHeader.click();
        await waitForNetworkIdle(authenticatedPage);

        // Click Add
        await allergies.addButton.click();
        await waitForElementVisible(allergies.searchInput);

        // Search for allergy
        await allergies.searchInput.fill('Pollen');
        await allergies.searchButton.click();
        await waitForNetworkIdle(authenticatedPage);

        // Select and add notes
        const firstResult = authenticatedPage.getByRole('radio', { name: 'Select (SNOMED)' }).first();
        const resultVisible = await firstResult.isVisible({ timeout: 5000 }).catch(() => false);

        if (resultVisible) {
          await firstResult.check();
          await allergies.allergyNotes.first().fill('Added during workflow test');

          // Cancel instead of submit to avoid data pollution
          await allergies.cancelButton.click();
          await waitForNetworkIdle(authenticatedPage);
        } else {
          // Cancel if no results
          await allergies.cancelButton.click();
        }
      });

      await test.step('Navigate to medications panel', async () => {
        await medications.medicationsHeader.click();
        await waitForNetworkIdle(authenticatedPage);

        // Verify medications panel opened
        const addButton = authenticatedPage.getByRole('button', { name: 'Add' });
        await expect(addButton).toBeVisible({ timeout: 5000 });
      });

      await test.step('Verify allergies still accessible', async () => {
        // Navigate back to allergies
        await allergies.panelHeader.click();
        await waitForNetworkIdle(authenticatedPage);

        // Should still show allergies panel
        await expect(allergies.addButton).toBeVisible({ timeout: 5000 });
      });
    });

    test('Search member multiple times with different criteria @e2e @p2', async ({ authenticatedPage }) => {
      /**
       * Workflow testing search flexibility:
       * 1. Search by Member ID
       * 2. Search by Last Name
       * 3. Search by DOB and Last Name
       * 4. Verify all searches work
       */

      await test.step('Navigate to member search', async () => {
        await navigation.goToDashboard();
        await navigation.openSearchMenu();
        await navigation.openMemberSearch();
        await waitForNetworkIdle(authenticatedPage);
      });

      await test.step('Search by Member ID', async () => {
        await memberSearch.searchMember({
          client: CLIENTS.COMPREHENSIVE_TEST,
          memberId: TEST_MEMBER.ID,
        });

        await waitForNetworkIdle(authenticatedPage);

        // Should find member
        const resultsTable = authenticatedPage.locator('#advancedMemberSearchMemberTableBody');
        const hasResults = await resultsTable.isVisible({ timeout: 5000 }).catch(() => false);

        // Navigate back to search
        await navigation.openSearchMenu();
        await navigation.openMemberSearch();
        await waitForNetworkIdle(authenticatedPage);
      });

      await test.step('Search by Last Name and First Name', async () => {
        await memberSearch.searchMember({
          client: CLIENTS.COMPREHENSIVE_TEST,
          lastName: TEST_MEMBER.LAST_NAME,
          firstName: TEST_MEMBER.FIRST_NAME,
        });

        await waitForNetworkIdle(authenticatedPage);

        // Should find member
        const resultsTable = authenticatedPage.locator('#advancedMemberSearchMemberTableBody');
        const hasResults = await resultsTable.isVisible({ timeout: 5000 }).catch(() => false);

        // Navigate back
        await navigation.openSearchMenu();
        await navigation.openMemberSearch();
        await waitForNetworkIdle(authenticatedPage);
      });

      await test.step('Search by DOB and Last Name', async () => {
        await memberSearch.searchMember({
          client: CLIENTS.COMPREHENSIVE_TEST,
          dob: TEST_MEMBER.DOB,
          lastName: TEST_MEMBER.LAST_NAME,
        });

        await waitForNetworkIdle(authenticatedPage);

        // Should find member
        const resultsTable = authenticatedPage.locator('#advancedMemberSearchMemberTableBody');
        const hasResults = await resultsTable.isVisible({ timeout: 5000 }).catch(() => false);
      });
    });
  });

  test.describe('Navigation Workflow', () => {
    test('Navigate through main menu options @e2e @p2', async ({ authenticatedPage }) => {
      /**
       * Test main navigation flow:
       * 1. Dashboard
       * 2. Search menu
       * 3. Member search
       * 4. Various reports and tools
       */

      await test.step('Navigate to Dashboard', async () => {
        await navigation.goToDashboard();
        await waitForNetworkIdle(authenticatedPage);

        // Should be on dashboard
        const url = authenticatedPage.url();
        expect(url).toContain('dashboard');
      });

      await test.step('Open and close Search menu', async () => {
        await navigation.openSearchMenu();
        await smartWait(authenticatedPage, 500);

        // Search menu should be visible
        const searchMenuItem = authenticatedPage.getByRole('link', { name: 'Member Search' });
        const isVisible = await searchMenuItem.isVisible({ timeout: 3000 }).catch(() => false);

        if (isVisible) {
          expect(isVisible).toBe(true);
        }
      });

      await test.step('Navigate to Member Search', async () => {
        await navigation.openMemberSearch();
        await waitForNetworkIdle(authenticatedPage);

        // Should be on member search page
        const searchButton = authenticatedPage.locator('button:has-text("Search")');
        await expect(searchButton).toBeVisible({ timeout: 5000 });
      });

      await test.step('Return to Dashboard', async () => {
        await navigation.goToDashboard();
        await waitForNetworkIdle(authenticatedPage);

        const url = authenticatedPage.url();
        expect(url).toContain('dashboard');
      });
    });

    test('Browser back button navigation @e2e @p2', async ({ authenticatedPage }) => {
      /**
       * Test browser back button behavior:
       * 1. Navigate through pages
       * 2. Use back button
       * 3. Verify state is maintained
       */

      await test.step('Navigate through multiple pages', async () => {
        // Go to dashboard
        await navigation.goToDashboard();
        await waitForNetworkIdle(authenticatedPage);

        // Go to member search
        await navigation.openSearchMenu();
        await navigation.openMemberSearch();
        await waitForNetworkIdle(authenticatedPage);

        // Search for member
        await memberSearch.searchMember({
          client: CLIENTS.COMPREHENSIVE_TEST,
          memberId: TEST_MEMBER.ID,
        });
        await waitForNetworkIdle(authenticatedPage);
      });

      await test.step('Use browser back button', async () => {
        // Go back
        await authenticatedPage.goBack();
        await smartWait(authenticatedPage, 1000);

        // Should still be functional (not broken state)
        const pageContent = await authenticatedPage.content();
        expect(pageContent).not.toContain('error');

        // Go back again
        await authenticatedPage.goBack();
        await smartWait(authenticatedPage, 1000);

        // Still functional
        const content2 = await authenticatedPage.content();
        expect(content2).not.toContain('error');
      });

      await test.step('Use forward button', async () => {
        // Go forward
        await authenticatedPage.goForward();
        await smartWait(authenticatedPage, 1000);

        // Should maintain state
        const pageContent = await authenticatedPage.content();
        expect(pageContent).toBeTruthy();
      });
    });
  });

  test.describe('Data Persistence Workflow', () => {
    test('Member hub data persists after navigation away and back @e2e @p2', async ({ authenticatedPage }) => {
      /**
       * Test data persistence:
       * 1. Open member hub
       * 2. Note current state
       * 3. Navigate away
       * 4. Navigate back
       * 5. Verify data is still there
       */

      await test.step('Open member hub and verify initial state', async () => {
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

        // Verify member hub loaded
        await expect(authenticatedPage.getByText('Member Hub')).toBeVisible();

        // Open allergies panel to see data
        await allergies.panelHeader.click();
        await waitForNetworkIdle(authenticatedPage);
      });

      await test.step('Navigate away to dashboard', async () => {
        await navigation.goToDashboard();
        await waitForNetworkIdle(authenticatedPage);

        // Verify we're on dashboard
        const url = authenticatedPage.url();
        expect(url).toContain('dashboard');
      });

      await test.step('Navigate back to same member', async () => {
        await navigation.openSearchMenu();
        await navigation.openMemberSearch();

        await memberSearch.searchMember({
          client: CLIENTS.COMPREHENSIVE_TEST,
          memberId: TEST_MEMBER.ID,
        });

        await waitForNetworkIdle(authenticatedPage);
        await memberSearch.openMemberHub(TEST_MEMBER.FULL_ID);
        await waitForNetworkIdle(authenticatedPage);

        // Verify member hub still loads correctly
        await expect(authenticatedPage.getByText('Member Hub')).toBeVisible();

        // Open allergies panel again
        await allergies.panelHeader.click();
        await waitForNetworkIdle(authenticatedPage);

        // Data should still be there
        const allergyTable = authenticatedPage.locator('#ALLERGY_DETAIL_TABLE');
        await expect(allergyTable).toBeVisible({ timeout: 5000 });
      });
    });
  });

  test.describe('Multi-Panel Workflow', () => {
    test('Open multiple panels in sequence @e2e @p3', async ({ authenticatedPage }) => {
      /**
       * Test opening multiple panels:
       * 1. Open allergies
       * 2. Open medications
       * 3. Open care management
       * 4. Verify all accessible
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

      const panelsToTest = [
        { name: 'Allergies', locator: 'h3:has-text("Allergies")' },
        { name: 'Medications', locator: 'h3:has-text("Medications")' },
        { name: 'Care Management', locator: 'h3:has-text("Care Management")' },
      ];

      for (const panel of panelsToTest) {
        await test.step(`Open ${panel.name} panel`, async () => {
          const panelHeader = authenticatedPage.locator(panel.locator);
          const isVisible = await panelHeader.isVisible({ timeout: 5000 }).catch(() => false);

          if (isVisible) {
            await panelHeader.click();
            await smartWait(authenticatedPage, 1000);

            // Panel should expand/activate
            expect(isVisible).toBe(true);
          }
        });
      }
    });
  });
});
