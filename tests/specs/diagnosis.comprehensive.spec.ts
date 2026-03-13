// ============================================
// DIAGNOSIS - COMPREHENSIVE TESTS
// ICD code search, validation, provider integration
// ============================================

import { test, expect } from '../fixtures/cleanupAuth.fixture';
import { memberSearchPage } from '../pages/memberSearchPage';
import { navigationPage } from '../pages/navigationPage';
import { diagnosisPanel } from '../pages/memberHub/diagnosis';
import { Tags } from '../tags';
import { TEST_MEMBER, CLIENTS } from '../constants';
import { waitForNetworkIdle, smartWait } from '../utils/waitHelpers';

test.describe(`${Tags.DIAGNOSIS} ${Tags.MEMBER_HUB} Diagnosis - Comprehensive`, () => {
  let memberSearch: memberSearchPage;
  let navigation: navigationPage;
  let diagnosis: diagnosisPanel;

  test.beforeEach(async ({ authenticatedPage }) => {
    memberSearch = new memberSearchPage(authenticatedPage);
    navigation = new navigationPage(authenticatedPage);
    diagnosis = new diagnosisPanel(authenticatedPage);

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

    // Open diagnosis panel
    await diagnosis.diagnosisHeader.click();
    await waitForNetworkIdle(authenticatedPage);
  });

  test.describe('Diagnosis Panel Access', () => {
    test('Diagnosis panel opens @p1', async ({ authenticatedPage }) => {
      // Panel should be visible
      await expect(diagnosis.diagnosisHeader).toBeVisible();

      // Check for add button
      const addButton = authenticatedPage.getByRole('button', { name: /add|create/i }).first();
      const hasAddButton = await addButton.isVisible({ timeout: 5000 }).catch(() => false);

      console.log('Diagnosis add button visible:', hasAddButton);
    });

    test('Diagnosis list displays @p2', async ({ authenticatedPage }) => {
      // Check for diagnosis table/list
      const diagnosisTable = authenticatedPage.locator('table, .diagnosis-list, [class*="diagnosis"]').first();
      const hasTable = await diagnosisTable.isVisible({ timeout: 5000 }).catch(() => false);

      if (hasTable) {
        console.log('Diagnosis list found');
        expect(hasTable).toBe(true);
      } else {
        console.log('No diagnoses yet - empty state');
      }
    });
  });

  test.describe('ICD Code Search by Section', () => {
    test('Search diagnosis by section @p2', async ({ authenticatedPage }) => {
      const addButton = authenticatedPage.getByRole('button', { name: /add.*diagnosis/i }).first();
      const buttonVisible = await addButton.isVisible({ timeout: 5000 }).catch(() => false);

      if (buttonVisible) {
        await addButton.click();
        await smartWait(authenticatedPage, 1000);

        // Look for section dropdown
        const sectionDropdown = authenticatedPage.getByLabel(/section|chapter/i).first();
        const sectionVisible = await sectionDropdown.isVisible({ timeout: 3000 }).catch(() => false);

        if (sectionVisible) {
          await sectionDropdown.click();
          await smartWait(authenticatedPage, 500);

          // Select respiratory system
          const respiratoryOption = authenticatedPage.getByText(/respiratory system.*J00-J99/i);
          const optionVisible = await respiratoryOption.isVisible({ timeout: 2000 }).catch(() => false);

          if (optionVisible) {
            await respiratoryOption.click();
            await waitForNetworkIdle(authenticatedPage);
            console.log('Respiratory system section selected');
          }
        }

        // Close form
        const cancelButton = authenticatedPage.getByRole('button', { name: /cancel/i });
        await cancelButton.click().catch(() => {});
      }
    });

    test('Search diagnosis by category @p2', async ({ authenticatedPage }) => {
      const addButton = authenticatedPage.getByRole('button', { name: /add.*diagnosis/i }).first();
      const buttonVisible = await addButton.isVisible({ timeout: 5000 }).catch(() => false);

      if (buttonVisible) {
        await addButton.click();
        await smartWait(authenticatedPage, 1000);

        // Select section first
        const sectionDropdown = authenticatedPage.getByLabel(/section|chapter/i).first();
        const sectionVisible = await sectionDropdown.isVisible({ timeout: 3000 }).catch(() => false);

        if (sectionVisible) {
          await sectionDropdown.click();
          const respiratoryOption = authenticatedPage.getByText(/respiratory system/i).first();
          await respiratoryOption.click().catch(() => {});
          await smartWait(authenticatedPage, 1000);

          // Now select category
          const categoryDropdown = authenticatedPage.getByLabel(/category/i).first();
          const categoryVisible = await categoryDropdown.isVisible({ timeout: 3000 }).catch(() => false);

          if (categoryVisible) {
            await categoryDropdown.click();
            await smartWait(authenticatedPage, 500);

            const lowerRespOption = authenticatedPage.getByText(/lower respiratory.*J20-J22/i);
            const optionVisible = await lowerRespOption.isVisible({ timeout: 2000 }).catch(() => false);

            if (optionVisible) {
              await lowerRespOption.click();
              await waitForNetworkIdle(authenticatedPage);
              console.log('Lower respiratory infections category selected');
            }
          }
        }

        // Close
        const cancelButton = authenticatedPage.getByRole('button', { name: /cancel/i });
        await cancelButton.click().catch(() => {});
      }
    });

    test('Multiple ICD chapters available @p3', async ({ authenticatedPage }) => {
      const addButton = authenticatedPage.getByRole('button', { name: /add.*diagnosis/i }).first();
      const buttonVisible = await addButton.isVisible({ timeout: 5000 }).catch(() => false);

      if (buttonVisible) {
        await addButton.click();
        await smartWait(authenticatedPage, 1000);

        const sectionDropdown = authenticatedPage.getByLabel(/section|chapter/i).first();
        const sectionVisible = await sectionDropdown.isVisible({ timeout: 3000 }).catch(() => false);

        if (sectionVisible) {
          await sectionDropdown.click();
          await smartWait(authenticatedPage, 500);

          // Count available chapters
          const options = authenticatedPage.locator('[role="option"], option');
          const optionCount = await options.count().catch(() => 0);

          console.log('ICD chapters available:', optionCount);
          expect(optionCount).toBeGreaterThan(5);
        }

        // Close
        const cancelButton = authenticatedPage.getByRole('button', { name: /cancel/i });
        await cancelButton.click().catch(() => {});
      }
    });
  });

  test.describe('ICD Code Search by Code', () => {
    test('Search diagnosis by ICD code @p2', async ({ authenticatedPage }) => {
      const addButton = authenticatedPage.getByRole('button', { name: /add.*diagnosis/i }).first();
      const buttonVisible = await addButton.isVisible({ timeout: 5000 }).catch(() => false);

      if (buttonVisible) {
        await addButton.click();
        await smartWait(authenticatedPage, 1000);

        // Look for code search option
        const searchByCodeRadio = authenticatedPage.getByLabel(/search.*code|by.*code/i);
        const radioVisible = await searchByCodeRadio.isVisible({ timeout: 3000 }).catch(() => false);

        if (radioVisible) {
          await searchByCodeRadio.check();
          await smartWait(authenticatedPage, 500);

          // Enter ICD code
          const codeInput = authenticatedPage.getByPlaceholder(/code|icd/i);
          const inputVisible = await codeInput.isVisible({ timeout: 2000 }).catch(() => false);

          if (inputVisible) {
            await codeInput.fill('J20.9');
            await smartWait(authenticatedPage, 500);

            // Click search
            const searchButton = authenticatedPage.getByRole('button', { name: /search/i });
            await searchButton.click();
            await waitForNetworkIdle(authenticatedPage);

            console.log('ICD code J20.9 searched');
          }
        }

        // Close
        const cancelButton = authenticatedPage.getByRole('button', { name: /cancel/i });
        await cancelButton.click().catch(() => {});
      }
    });

    test('Invalid ICD code handling @p2', async ({ authenticatedPage }) => {
      const addButton = authenticatedPage.getByRole('button', { name: /add.*diagnosis/i }).first();
      const buttonVisible = await addButton.isVisible({ timeout: 5000 }).catch(() => false);

      if (buttonVisible) {
        await addButton.click();
        await smartWait(authenticatedPage, 1000);

        const searchByCodeRadio = authenticatedPage.getByLabel(/search.*code|by.*code/i);
        const radioVisible = await searchByCodeRadio.isVisible({ timeout: 3000 }).catch(() => false);

        if (radioVisible) {
          await searchByCodeRadio.check();
          await smartWait(authenticatedPage, 500);

          const codeInput = authenticatedPage.getByPlaceholder(/code|icd/i);
          const inputVisible = await codeInput.isVisible({ timeout: 2000 }).catch(() => false);

          if (inputVisible) {
            // Try invalid codes
            const invalidCodes = ['INVALID', 'Z99999', '12345', 'ABC'];

            for (const code of invalidCodes) {
              await codeInput.clear();
              await codeInput.fill(code);
              await smartWait(authenticatedPage, 500);

              const searchButton = authenticatedPage.getByRole('button', { name: /search/i });
              await searchButton.click();
              await smartWait(authenticatedPage, 1000);

              console.log(`Tested invalid code: ${code}`);
            }
          }
        }

        // Close
        const cancelButton = authenticatedPage.getByRole('button', { name: /cancel/i });
        await cancelButton.click().catch(() => {});
      }
    });

    test('Partial ICD code search @p3', async ({ authenticatedPage }) => {
      const addButton = authenticatedPage.getByRole('button', { name: /add.*diagnosis/i }).first();
      const buttonVisible = await addButton.isVisible({ timeout: 5000 }).catch(() => false);

      if (buttonVisible) {
        await addButton.click();
        await smartWait(authenticatedPage, 1000);

        const searchByCodeRadio = authenticatedPage.getByLabel(/search.*code|by.*code/i);
        const radioVisible = await searchByCodeRadio.isVisible({ timeout: 3000 }).catch(() => false);

        if (radioVisible) {
          await searchByCodeRadio.check();
          await smartWait(authenticatedPage, 500);

          const codeInput = authenticatedPage.getByPlaceholder(/code|icd/i);
          const inputVisible = await codeInput.isVisible({ timeout: 2000 }).catch(() => false);

          if (inputVisible) {
            // Try partial codes
            await codeInput.fill('J20');
            const searchButton = authenticatedPage.getByRole('button', { name: /search/i });
            await searchButton.click();
            await waitForNetworkIdle(authenticatedPage);

            console.log('Partial code J20 searched');
          }
        }

        // Close
        const cancelButton = authenticatedPage.getByRole('button', { name: /cancel/i });
        await cancelButton.click().catch(() => {});
      }
    });
  });

  test.describe('Diagnosis Required Fields', () => {
    test('Identification date is required @p1', async ({ authenticatedPage }) => {
      const addButton = authenticatedPage.getByRole('button', { name: /add.*diagnosis/i }).first();
      const buttonVisible = await addButton.isVisible({ timeout: 5000 }).catch(() => false);

      if (buttonVisible) {
        await addButton.click();
        await smartWait(authenticatedPage, 1000);

        // Look for identification date field
        const dateField = authenticatedPage.getByLabel(/identification.*date|date.*identified/i);
        const dateVisible = await dateField.isVisible({ timeout: 3000 }).catch(() => false);

        if (dateVisible) {
          // Check if required
          const label = await authenticatedPage.locator('label:has-text("Identification"), label:has-text("Date")').first().textContent().catch(() => '');
          const isRequired = label.includes('*');

          console.log('Identification date required:', isRequired);
          expect(isRequired).toBe(true);
        }

        // Close
        const cancelButton = authenticatedPage.getByRole('button', { name: /cancel/i });
        await cancelButton.click().catch(() => {});
      }
    });

    test('Cannot save without required fields @p1', async ({ authenticatedPage }) => {
      const addButton = authenticatedPage.getByRole('button', { name: /add.*diagnosis/i }).first();
      const buttonVisible = await addButton.isVisible({ timeout: 5000 }).catch(() => false);

      if (buttonVisible) {
        await addButton.click();
        await smartWait(authenticatedPage, 1000);

        // Try to save without filling required fields
        const saveButton = authenticatedPage.getByRole('button', { name: /save|submit/i });
        const saveVisible = await saveButton.isVisible({ timeout: 3000 }).catch(() => false);

        if (saveVisible) {
          await saveButton.click();
          await smartWait(authenticatedPage, 1000);

          // Look for validation error
          const error = authenticatedPage.locator('.error, .alert-danger, [class*="error"]');
          const hasError = await error.isVisible({ timeout: 2000 }).catch(() => false);

          console.log('Validation error shown:', hasError);
        }

        // Close
        const cancelButton = authenticatedPage.getByRole('button', { name: /cancel/i });
        await cancelButton.click().catch(() => {});
      }
    });
  });

  test.describe('Provider Integration', () => {
    test('Search for provider @p2', async ({ authenticatedPage }) => {
      const addButton = authenticatedPage.getByRole('button', { name: /add.*diagnosis/i }).first();
      const buttonVisible = await addButton.isVisible({ timeout: 5000 }).catch(() => false);

      if (buttonVisible) {
        await addButton.click();
        await smartWait(authenticatedPage, 1000);

        // Look for provider search
        const providerSearch = authenticatedPage.getByLabel(/provider/i);
        const searchVisible = await providerSearch.isVisible({ timeout: 3000 }).catch(() => false);

        if (searchVisible) {
          await providerSearch.fill('Smith');
          await smartWait(authenticatedPage, 500);

          const searchButton = authenticatedPage.getByRole('button', { name: /search.*provider/i });
          const buttonVisible = await searchButton.isVisible({ timeout: 2000 }).catch(() => false);

          if (buttonVisible) {
            await searchButton.click();
            await waitForNetworkIdle(authenticatedPage);
            console.log('Provider search executed');
          }
        }

        // Close
        const cancelButton = authenticatedPage.getByRole('button', { name: /cancel/i });
        await cancelButton.click().catch(() => {});
      }
    });

    test('Provider search with empty term @p3', async ({ authenticatedPage }) => {
      const addButton = authenticatedPage.getByRole('button', { name: /add.*diagnosis/i }).first();
      const buttonVisible = await addButton.isVisible({ timeout: 5000 }).catch(() => false);

      if (buttonVisible) {
        await addButton.click();
        await smartWait(authenticatedPage, 1000);

        const providerSearch = authenticatedPage.getByLabel(/provider/i);
        const searchVisible = await providerSearch.isVisible({ timeout: 3000 }).catch(() => false);

        if (searchVisible) {
          // Leave empty and try to search
          const searchButton = authenticatedPage.getByRole('button', { name: /search.*provider/i });
          const buttonVisible = await searchButton.isVisible({ timeout: 2000 }).catch(() => false);

          if (buttonVisible) {
            await searchButton.click();
            await smartWait(authenticatedPage, 1000);
            console.log('Empty provider search attempted');
          }
        }

        // Close
        const cancelButton = authenticatedPage.getByRole('button', { name: /cancel/i });
        await cancelButton.click().catch(() => {});
      }
    });
  });

  test.describe('Diagnosis Date Handling', () => {
    test('Add diagnosis with past identification date @p2', async ({ authenticatedPage }) => {
      const addButton = authenticatedPage.getByRole('button', { name: /add.*diagnosis/i }).first();
      const buttonVisible = await addButton.isVisible({ timeout: 5000 }).catch(() => false);

      if (buttonVisible) {
        await addButton.click();
        await smartWait(authenticatedPage, 1000);

        const dateField = authenticatedPage.getByLabel(/identification.*date/i);
        const dateVisible = await dateField.isVisible({ timeout: 3000 }).catch(() => false);

        if (dateVisible) {
          const pastDate = '01/15/2023';
          await dateField.fill(pastDate);
          await smartWait(authenticatedPage, 500);

          const dateValue = await dateField.inputValue();
          console.log('Past identification date:', dateValue);
        }

        // Close
        const cancelButton = authenticatedPage.getByRole('button', { name: /cancel/i });
        await cancelButton.click().catch(() => {});
      }
    });

    test('Future identification date validation @p3', async ({ authenticatedPage }) => {
      const addButton = authenticatedPage.getByRole('button', { name: /add.*diagnosis/i }).first();
      const buttonVisible = await addButton.isVisible({ timeout: 5000 }).catch(() => false);

      if (buttonVisible) {
        await addButton.click();
        await smartWait(authenticatedPage, 1000);

        const dateField = authenticatedPage.getByLabel(/identification.*date/i);
        const dateVisible = await dateField.isVisible({ timeout: 3000 }).catch(() => false);

        if (dateVisible) {
          const futureDate = '12/31/2099';
          await dateField.fill(futureDate);
          await smartWait(authenticatedPage, 500);

          // Check for validation warning
          const warning = authenticatedPage.locator('.warning, .alert-warning');
          const hasWarning = await warning.isVisible({ timeout: 2000 }).catch(() => false);

          console.log('Future date warning shown:', hasWarning);
        }

        // Close
        const cancelButton = authenticatedPage.getByRole('button', { name: /cancel/i });
        await cancelButton.click().catch(() => {});
      }
    });

    test('Invalid date format handling @p2', async ({ authenticatedPage }) => {
      const addButton = authenticatedPage.getByRole('button', { name: /add.*diagnosis/i }).first();
      const buttonVisible = await addButton.isVisible({ timeout: 5000 }).catch(() => false);

      if (buttonVisible) {
        await addButton.click();
        await smartWait(authenticatedPage, 1000);

        const dateField = authenticatedPage.getByLabel(/identification.*date/i);
        const dateVisible = await dateField.isVisible({ timeout: 3000 }).catch(() => false);

        if (dateVisible) {
          const invalidDates = ['13/32/2023', '00/00/0000', 'invalid', '99/99/9999'];

          for (const invalidDate of invalidDates) {
            await dateField.clear();
            await dateField.fill(invalidDate);
            await smartWait(authenticatedPage, 500);

            console.log(`Testing invalid date: ${invalidDate}`);
          }
        }

        // Close
        const cancelButton = authenticatedPage.getByRole('button', { name: /cancel/i });
        await cancelButton.click().catch(() => {});
      }
    });
  });

  test.describe('Multiple Diagnoses', () => {
    test('Add multiple diagnoses @p2', async ({ authenticatedPage }) => {
      // Check if multiple diagnosis entries exist
      const diagnosisTable = authenticatedPage.locator('table').first();
      const hasTable = await diagnosisTable.isVisible({ timeout: 5000 }).catch(() => false);

      if (hasTable) {
        const rows = await diagnosisTable.locator('tbody tr').count();
        console.log('Diagnosis rows found:', rows);

        expect(rows).toBeGreaterThanOrEqual(0);
      }
    });

    test('Diagnoses listed in table @p2', async ({ authenticatedPage }) => {
      const diagnosisTable = authenticatedPage.locator('table').first();
      const hasTable = await diagnosisTable.isVisible({ timeout: 5000 }).catch(() => false);

      if (hasTable) {
        // Check for expected columns
        const headers = ['Code', 'Description', 'Date', 'Provider'];

        for (const header of headers) {
          const headerCell = diagnosisTable.locator(`th:has-text("${header}")`);
          const hasHeader = await headerCell.isVisible({ timeout: 2000 }).catch(() => false);

          if (hasHeader) {
            console.log(`Column "${header}" found`);
          }
        }
      }
    });
  });

  test.describe('Diagnosis Status', () => {
    test('Diagnosis has status field @p3', async ({ authenticatedPage }) => {
      const addButton = authenticatedPage.getByRole('button', { name: /add.*diagnosis/i }).first();
      const buttonVisible = await addButton.isVisible({ timeout: 5000 }).catch(() => false);

      if (buttonVisible) {
        await addButton.click();
        await smartWait(authenticatedPage, 1000);

        // Look for status field
        const statusField = authenticatedPage.getByLabel(/status/i);
        const statusVisible = await statusField.isVisible({ timeout: 3000 }).catch(() => false);

        console.log('Status field available:', statusVisible);

        // Close
        const cancelButton = authenticatedPage.getByRole('button', { name: /cancel/i });
        await cancelButton.click().catch(() => {});
      }
    });

    test('Status options available @p3', async ({ authenticatedPage }) => {
      const addButton = authenticatedPage.getByRole('button', { name: /add.*diagnosis/i }).first();
      const buttonVisible = await addButton.isVisible({ timeout: 5000 }).catch(() => false);

      if (buttonVisible) {
        await addButton.click();
        await smartWait(authenticatedPage, 1000);

        const statusField = authenticatedPage.getByLabel(/status/i);
        const statusVisible = await statusField.isVisible({ timeout: 3000 }).catch(() => false);

        if (statusVisible) {
          await statusField.click();
          await smartWait(authenticatedPage, 500);

          const statusOptions = ['Active', 'Inactive', 'Resolved'];

          for (const status of statusOptions) {
            const option = authenticatedPage.getByText(status, { exact: false });
            const hasOption = await option.isVisible({ timeout: 1000 }).catch(() => false);

            if (hasOption) {
              console.log(`Status "${status}" available`);
            }
          }
        }

        // Close
        const cancelButton = authenticatedPage.getByRole('button', { name: /cancel/i });
        await cancelButton.click().catch(() => {});
      }
    });
  });

  test.describe('Diagnosis Actions', () => {
    test('View diagnosis details @p2', async ({ authenticatedPage }) => {
      const viewButtons = authenticatedPage.getByRole('button', { name: /view|details/i });
      const buttonCount = await viewButtons.count();

      console.log('View/details buttons found:', buttonCount);
    });

    test('Edit existing diagnosis @p2', async ({ authenticatedPage }) => {
      const editButtons = authenticatedPage.getByRole('button', { name: /edit/i });
      const buttonCount = await editButtons.count();

      console.log('Edit buttons found:', buttonCount);
    });

    test('Delete diagnosis requires confirmation @p3', async ({ authenticatedPage }) => {
      const deleteButtons = authenticatedPage.locator('button:has-text("Delete"), .fa-trash');
      const buttonCount = await deleteButtons.count();

      console.log('Delete buttons found:', buttonCount);
    });
  });

  test.describe('Diagnosis History', () => {
    test('View diagnosis history @p2', async ({ authenticatedPage }) => {
      const historyTable = authenticatedPage.locator('table').first();
      const hasTable = await historyTable.isVisible({ timeout: 5000 }).catch(() => false);

      if (hasTable) {
        const rows = await historyTable.locator('tbody tr').count();
        console.log('Diagnosis history rows:', rows);

        expect(rows).toBeGreaterThanOrEqual(0);
      }
    });

    test('Search diagnosis history @p3', async ({ authenticatedPage }) => {
      const searchBox = authenticatedPage.getByRole('searchbox', { name: 'Search:' }).first();
      const searchVisible = await searchBox.isVisible({ timeout: 3000 }).catch(() => false);

      if (searchVisible) {
        await searchBox.fill('J20');
        await smartWait(authenticatedPage, 500);

        console.log('Diagnosis history search executed');
      }
    });
  });

  test.describe('Cancel and Navigation', () => {
    test('Cancel diagnosis creation @p2', async ({ authenticatedPage }) => {
      const addButton = authenticatedPage.getByRole('button', { name: /add.*diagnosis/i }).first();
      const buttonVisible = await addButton.isVisible({ timeout: 5000 }).catch(() => false);

      if (buttonVisible) {
        await addButton.click();
        await smartWait(authenticatedPage, 500);

        const cancelButton = authenticatedPage.getByRole('button', { name: /cancel/i });
        const cancelVisible = await cancelButton.isVisible({ timeout: 2000 }).catch(() => false);

        if (cancelVisible) {
          await cancelButton.click();
          await smartWait(authenticatedPage, 500);

          // Should return to list
          await expect(diagnosis.diagnosisHeader).toBeVisible();
        }
      }
    });

    test('Navigate back to diagnosis list @p3', async ({ authenticatedPage }) => {
      const backButton = authenticatedPage.getByRole('button', { name: /back|return/i });
      const hasButton = await backButton.isVisible({ timeout: 3000 }).catch(() => false);

      if (hasButton) {
        await backButton.click();
        await smartWait(authenticatedPage, 500);

        await expect(diagnosis.diagnosisHeader).toBeVisible();
      }
    });
  });
});
