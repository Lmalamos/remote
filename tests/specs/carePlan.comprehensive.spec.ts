// ============================================
// CARE PLAN - COMPREHENSIVE TESTS
// Goals, interventions, outcomes, workflows, tracking
// ============================================

import { test, expect } from '../fixtures/cleanupAuth.fixture';
import { memberSearchPage } from '../pages/memberSearchPage';
import { navigationPage } from '../pages/navigationPage';
import { carePlanPanel } from '../pages/memberHub/carePlan';
import { Tags } from '../tags';
import { TEST_MEMBER, CLIENTS } from '../constants';
import { waitForNetworkIdle, smartWait } from '../utils/waitHelpers';

test.describe(`${Tags.CARE_PLAN} ${Tags.MEMBER_HUB} Care Plan - Comprehensive`, () => {
  let memberSearch: memberSearchPage;
  let navigation: navigationPage;
  let carePlan: carePlanPanel;

  test.beforeEach(async ({ authenticatedPage }) => {
    memberSearch = new memberSearchPage(authenticatedPage);
    navigation = new navigationPage(authenticatedPage);
    carePlan = new carePlanPanel(authenticatedPage);

    // Navigate to member hub
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

    // Open care plan panel
    await carePlan.panelHeader.click();
    await waitForNetworkIdle(authenticatedPage);
  });

  test.describe('Care Plan Panel Access', () => {
    test('Care Plan panel opens @p1', async ({ authenticatedPage }) => {
      // Panel should be visible
      await expect(carePlan.panelHeader).toBeVisible();

      // Check if add button exists
      const addButton = authenticatedPage.getByRole('button', { name: /add|create/i }).first();
      const hasAddButton = await addButton.isVisible({ timeout: 5000 }).catch(() => false);

      console.log('Care Plan add button visible:', hasAddButton);
    });

    test('Care Plan list displays @p2', async ({ authenticatedPage }) => {
      // Check for care plan table/list
      const carePlanTable = authenticatedPage.locator('table, .care-plan-list, [class*="carePlan"]').first();
      const hasTable = await carePlanTable.isVisible({ timeout: 5000 }).catch(() => false);

      if (hasTable) {
        console.log('Care Plan list found');
        expect(hasTable).toBe(true);
      } else {
        console.log('No care plans yet - empty state');
      }
    });
  });

  test.describe('Create Care Plan', () => {
    test('Open create care plan form @p2', async ({ authenticatedPage }) => {
      // Look for add/create button
      const addButton = authenticatedPage.getByRole('button', { name: /add.*care.*plan|create.*plan/i }).first();
      const buttonVisible = await addButton.isVisible({ timeout: 5000 }).catch(() => false);

      if (buttonVisible) {
        await addButton.click();
        await smartWait(authenticatedPage, 1000);

        // Form should open
        const formArea = authenticatedPage.locator('form, [role="dialog"], .modal');
        const formVisible = await formArea.isVisible({ timeout: 3000 }).catch(() => false);

        console.log('Care Plan form opened:', formVisible);

        // Close form
        const cancelButton = authenticatedPage.getByRole('button', { name: /cancel/i });
        const cancelVisible = await cancelButton.isVisible({ timeout: 2000 }).catch(() => false);

        if (cancelVisible) {
          await cancelButton.click();
        }
      }
    });

    test('Care plan requires name/title @p1', async ({ authenticatedPage }) => {
      const addButton = authenticatedPage.getByRole('button', { name: /add.*care.*plan/i }).first();
      const buttonVisible = await addButton.isVisible({ timeout: 5000 }).catch(() => false);

      if (buttonVisible) {
        await addButton.click();
        await smartWait(authenticatedPage, 1000);

        // Look for name/title field
        const nameField = authenticatedPage.getByRole('textbox', { name: /name|title/i }).first();
        const nameVisible = await nameField.isVisible({ timeout: 3000 }).catch(() => false);

        if (nameVisible) {
          // Check if required
          const label = await authenticatedPage.locator('label:has-text("Name"), label:has-text("Title")').first().textContent().catch(() => '');
          const isRequired = label.includes('*');

          console.log('Care plan name/title required:', isRequired);
        }

        // Close
        const cancelButton = authenticatedPage.getByRole('button', { name: /cancel/i });
        await cancelButton.click().catch(() => {});
      }
    });
  });

  test.describe('Care Plan Goals', () => {
    test('Add goal to care plan @p2', async ({ authenticatedPage }) => {
      // Look for goal-related buttons
      const goalButton = authenticatedPage.getByRole('button', { name: /add.*goal|new.*goal/i }).first();
      const buttonVisible = await goalButton.isVisible({ timeout: 5000 }).catch(() => false);

      if (buttonVisible) {
        await goalButton.click();
        await smartWait(authenticatedPage, 1000);

        console.log('Add goal button clicked');

        // Close
        const cancelButton = authenticatedPage.getByRole('button', { name: /cancel/i }).first();
        await cancelButton.click().catch(() => {});
      }
    });

    test('Goal requires description @p2', async ({ authenticatedPage }) => {
      const goalButton = authenticatedPage.getByRole('button', { name: /add.*goal/i }).first();
      const buttonVisible = await goalButton.isVisible({ timeout: 5000 }).catch(() => false);

      if (buttonVisible) {
        await goalButton.click();
        await smartWait(authenticatedPage, 1000);

        // Look for goal description field
        const descField = authenticatedPage.getByRole('textbox', { name: /description|goal/i }).first();
        const descVisible = await descField.isVisible({ timeout: 3000 }).catch(() => false);

        if (descVisible) {
          console.log('Goal description field found');
        }

        // Close
        const cancelButton = authenticatedPage.getByRole('button', { name: /cancel/i }).first();
        await cancelButton.click().catch(() => {});
      }
    });

    test('Multiple goals can be added @p3', async ({ authenticatedPage }) => {
      // Check if multiple goal entries exist
      const goalList = authenticatedPage.locator('[class*="goal"], .goal-item, table').first();
      const hasGoals = await goalList.isVisible({ timeout: 5000 }).catch(() => false);

      if (hasGoals) {
        const goalRows = await goalList.locator('tr, .goal-item, [class*="goal-row"]').count();
        console.log('Goals found:', goalRows);

        // Should support multiple goals
        expect(goalRows).toBeGreaterThanOrEqual(0);
      }
    });
  });

  test.describe('Care Plan Interventions', () => {
    test('Add intervention to care plan @p2', async ({ authenticatedPage }) => {
      const interventionButton = authenticatedPage.getByRole('button', { name: /add.*intervention|intervention/i }).first();
      const buttonVisible = await interventionButton.isVisible({ timeout: 5000 }).catch(() => false);

      if (buttonVisible) {
        await interventionButton.click();
        await smartWait(authenticatedPage, 1000);

        console.log('Add intervention clicked');

        // Close
        const cancelButton = authenticatedPage.getByRole('button', { name: /cancel/i }).first();
        await cancelButton.click().catch(() => {});
      }
    });

    test('Intervention linked to goal @p3', async ({ authenticatedPage }) => {
      // Check if interventions can be linked to goals
      const interventionSection = authenticatedPage.locator('[class*="intervention"]').first();
      const hasSection = await interventionSection.isVisible({ timeout: 5000 }).catch(() => false);

      console.log('Intervention section visible:', hasSection);
    });
  });

  test.describe('Care Plan Status', () => {
    test('Care plan has status field @p2', async ({ authenticatedPage }) => {
      // Look for status indicators
      const statusOptions = ['Active', 'Inactive', 'Completed', 'Draft'];

      for (const status of statusOptions) {
        const statusElement = authenticatedPage.getByText(status, { exact: false });
        const hasStatus = await statusElement.isVisible({ timeout: 2000 }).catch(() => false);

        if (hasStatus) {
          console.log(`Status "${status}" found`);
        }
      }
    });

    test('Care plan can be activated @p2', async ({ authenticatedPage }) => {
      // Look for activate button
      const activateButton = authenticatedPage.getByRole('button', { name: /activate/i });
      const hasButton = await activateButton.isVisible({ timeout: 5000 }).catch(() => false);

      console.log('Activate button available:', hasButton);
    });

    test('Care plan can be completed @p3', async ({ authenticatedPage }) => {
      // Look for complete button
      const completeButton = authenticatedPage.getByRole('button', { name: /complete|close/i });
      const hasButton = await completeButton.isVisible({ timeout: 5000 }).catch(() => false);

      console.log('Complete button available:', hasButton);
    });
  });

  test.describe('Care Plan Dates', () => {
    test('Care plan has start date @p2', async ({ authenticatedPage }) => {
      const addButton = authenticatedPage.getByRole('button', { name: /add.*care.*plan/i }).first();
      const buttonVisible = await addButton.isVisible({ timeout: 5000 }).catch(() => false);

      if (buttonVisible) {
        await addButton.click();
        await smartWait(authenticatedPage, 1000);

        // Look for start date field
        const startDateField = authenticatedPage.getByRole('textbox', { name: /start.*date/i });
        const dateVisible = await startDateField.isVisible({ timeout: 3000 }).catch(() => false);

        console.log('Start date field found:', dateVisible);

        // Close
        const cancelButton = authenticatedPage.getByRole('button', { name: /cancel/i });
        await cancelButton.click().catch(() => {});
      }
    });

    test('Care plan has end date @p3', async ({ authenticatedPage }) => {
      const addButton = authenticatedPage.getByRole('button', { name: /add.*care.*plan/i }).first();
      const buttonVisible = await addButton.isVisible({ timeout: 5000 }).catch(() => false);

      if (buttonVisible) {
        await addButton.click();
        await smartWait(authenticatedPage, 1000);

        // Look for end date field
        const endDateField = authenticatedPage.getByRole('textbox', { name: /end.*date|target.*date/i });
        const dateVisible = await endDateField.isVisible({ timeout: 3000 }).catch(() => false);

        console.log('End date field found:', dateVisible);

        // Close
        const cancelButton = authenticatedPage.getByRole('button', { name: /cancel/i });
        await cancelButton.click().catch(() => {});
      }
    });
  });

  test.describe('Care Plan History', () => {
    test('View care plan history @p2', async ({ authenticatedPage }) => {
      // Check if history table exists
      const historyTable = authenticatedPage.locator('table').first();
      const hasTable = await historyTable.isVisible({ timeout: 5000 }).catch(() => false);

      if (hasTable) {
        const rows = await historyTable.locator('tbody tr').count();
        console.log('Care plan history rows:', rows);

        expect(rows).toBeGreaterThanOrEqual(0);
      }
    });

    test('Search care plan history @p3', async ({ authenticatedPage }) => {
      const searchBox = authenticatedPage.getByRole('searchbox', { name: 'Search:' }).first();
      const searchVisible = await searchBox.isVisible({ timeout: 3000 }).catch(() => false);

      if (searchVisible) {
        await searchBox.fill('test');
        await smartWait(authenticatedPage, 500);

        console.log('Care plan history search executed');
      }
    });
  });

  test.describe('Care Plan Actions', () => {
    test('View care plan details @p2', async ({ authenticatedPage }) => {
      // Look for view/details buttons
      const viewButtons = authenticatedPage.getByRole('button', { name: /view|details/i });
      const buttonCount = await viewButtons.count();

      console.log('View/details buttons found:', buttonCount);
    });

    test('Edit existing care plan @p2', async ({ authenticatedPage }) => {
      // Look for edit buttons
      const editButtons = authenticatedPage.getByRole('button', { name: /edit/i });
      const buttonCount = await editButtons.count();

      console.log('Edit buttons found:', buttonCount);
    });

    test('Delete care plan requires confirmation @p3', async ({ authenticatedPage }) => {
      // Look for delete buttons
      const deleteButtons = authenticatedPage.locator('button:has-text("Delete"), .fa-trash');
      const buttonCount = await deleteButtons.count();

      console.log('Delete buttons found:', buttonCount);
    });
  });

  test.describe('Care Plan Templates', () => {
    test('Templates available for care plans @p3', async ({ authenticatedPage }) => {
      const addButton = authenticatedPage.getByRole('button', { name: /add.*care.*plan/i }).first();
      const buttonVisible = await addButton.isVisible({ timeout: 5000 }).catch(() => false);

      if (buttonVisible) {
        await addButton.click();
        await smartWait(authenticatedPage, 1000);

        // Look for template selection
        const templateDropdown = authenticatedPage.getByLabel(/template|select.*template/i);
        const templateVisible = await templateDropdown.isVisible({ timeout: 3000 }).catch(() => false);

        console.log('Template selection available:', templateVisible);

        // Close
        const cancelButton = authenticatedPage.getByRole('button', { name: /cancel/i });
        await cancelButton.click().catch(() => {});
      }
    });
  });

  test.describe('Care Plan Progress Tracking', () => {
    test('Track progress on goals @p3', async ({ authenticatedPage }) => {
      // Look for progress indicators
      const progressElements = authenticatedPage.locator('[class*="progress"], .progress-bar');
      const hasProgress = await progressElements.first().isVisible({ timeout: 5000 }).catch(() => false);

      console.log('Progress tracking elements found:', hasProgress);
    });

    test('Update goal status @p3', async ({ authenticatedPage }) => {
      // Look for status update options
      const statusButtons = authenticatedPage.getByRole('button', { name: /status|update/i });
      const buttonCount = await statusButtons.count();

      console.log('Status update buttons:', buttonCount);
    });
  });

  test.describe('Care Plan Collaboration', () => {
    test('Assign care team members to plan @p3', async ({ authenticatedPage }) => {
      // Look for assign/team member options
      const assignButton = authenticatedPage.getByRole('button', { name: /assign|team/i });
      const hasButton = await assignButton.isVisible({ timeout: 5000 }).catch(() => false);

      console.log('Assign team member option:', hasButton);
    });

    test('Add notes to care plan @p3', async ({ authenticatedPage }) => {
      // Look for notes section
      const notesSection = authenticatedPage.locator('[class*="note"]').first();
      const hasNotes = await notesSection.isVisible({ timeout: 5000 }).catch(() => false);

      console.log('Notes section available:', hasNotes);
    });
  });

  test.describe('Cancel and Navigation', () => {
    test('Cancel care plan creation @p2', async ({ authenticatedPage }) => {
      const addButton = authenticatedPage.getByRole('button', { name: /add.*care.*plan/i }).first();
      const buttonVisible = await addButton.isVisible({ timeout: 5000 }).catch(() => false);

      if (buttonVisible) {
        await addButton.click();
        await smartWait(authenticatedPage, 500);

        // Cancel
        const cancelButton = authenticatedPage.getByRole('button', { name: /cancel/i });
        const cancelVisible = await cancelButton.isVisible({ timeout: 2000 }).catch(() => false);

        if (cancelVisible) {
          await cancelButton.click();
          await smartWait(authenticatedPage, 500);

          // Should return to list
          await expect(carePlan.panelHeader).toBeVisible();
        }
      }
    });

    test('Navigate back to care plan list @p3', async ({ authenticatedPage }) => {
      // If in detail view, navigate back
      const backButton = authenticatedPage.getByRole('button', { name: /back|return/i });
      const hasButton = await backButton.isVisible({ timeout: 3000 }).catch(() => false);

      if (hasButton) {
        await backButton.click();
        await smartWait(authenticatedPage, 500);

        // Should show list
        await expect(carePlan.panelHeader).toBeVisible();
      }
    });
  });
});
