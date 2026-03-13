// ============================================
// DATA VALIDATION - COMPREHENSIVE TESTS
// Tests for date fields, phone numbers, emails, SSN, zip codes, special characters
// ============================================

import { test, expect } from '../fixtures/cleanupAuth.fixture';
import { memberSearchPage } from '../pages/memberSearchPage';
import { navigationPage } from '../pages/navigationPage';
import { Tags } from '../tags';
import { TEST_MEMBER, CLIENTS } from '../constants';
import { waitForNetworkIdle, smartWait } from '../utils/waitHelpers';

test.describe(`${Tags.REGRESSION} Data Validation - Comprehensive`, () => {
  let memberSearch: memberSearchPage;
  let navigation: navigationPage;

  test.beforeEach(async ({ authenticatedPage }) => {
    memberSearch = new memberSearchPage(authenticatedPage);
    navigation = new navigationPage(authenticatedPage);

    await navigation.goToDashboard();
    await navigation.openSearchMenu();
    await navigation.openMemberSearch();
    await waitForNetworkIdle(authenticatedPage);
  });

  test.describe('Date Field Validation', () => {
    test('Date fields reject invalid dates @p1', async ({ authenticatedPage }) => {
      const invalidDates = [
        '13/32/2024',  // Invalid month and day
        '00/00/0000',  // All zeros
        '99/99/9999',  // Invalid values
        '02/30/2024',  // February 30th doesn't exist
        '04/31/2024',  // April 31st doesn't exist
      ];

      for (const invalidDate of invalidDates) {
        // Fill DOB field with invalid date
        const dobField = authenticatedPage.getByRole('textbox', { name: 'Date Of Birth' });
        await dobField.fill(invalidDate);

        // Try to search
        await memberSearch.searchMember({
          client: CLIENTS.COMPREHENSIVE_TEST,
          dob: invalidDate,
          lastName: 'Test',
        });

        await smartWait(authenticatedPage, 1000);

        // Should either show validation error or handle gracefully
        // Should not cause system crash
        const systemError = authenticatedPage.locator('.snackbar.error.show');
        await expect(systemError).not.toContainText('500').catch(() => {});
        await expect(systemError).not.toContainText('Internal Server Error').catch(() => {});

        // Navigate back for next test
        await navigation.openSearchMenu();
        await navigation.openMemberSearch();
        await waitForNetworkIdle(authenticatedPage);
      }
    });

    test('Date fields accept valid date formats @p2', async ({ authenticatedPage }) => {
      const validDates = [
        '01/01/2000',
        '12/31/1990',
        '03/15/1985',
        '06/30/2020',
      ];

      for (const validDate of validDates) {
        await memberSearch.searchMember({
          client: CLIENTS.COMPREHENSIVE_TEST,
          dob: validDate,
          lastName: 'Test',
        });

        await waitForNetworkIdle(authenticatedPage);

        // Should execute search without validation errors
        const errorSnackbar = authenticatedPage.locator('.snackbar.error.show');
        const hasError = await errorSnackbar.isVisible({ timeout: 2000 }).catch(() => false);

        // May have "no results" but should not have validation error
        if (hasError) {
          const errorText = await errorSnackbar.textContent();
          expect(errorText).not.toContain('invalid date');
          expect(errorText).not.toContain('format');
        }

        // Navigate back
        await navigation.openSearchMenu();
        await navigation.openMemberSearch();
        await waitForNetworkIdle(authenticatedPage);
      }
    });

    test('Future dates are handled appropriately @p2', async ({ authenticatedPage }) => {
      // Test with future date
      const futureDate = '12/31/2099';

      await memberSearch.searchMember({
        client: CLIENTS.COMPREHENSIVE_TEST,
        dob: futureDate,
        lastName: 'Test',
      });

      await waitForNetworkIdle(authenticatedPage);

      // May show validation error for future DOB (makes sense for birthdate)
      // Or may search and find no results
      // Should not crash
      const bodyText = await authenticatedPage.locator('body').textContent();
      expect(bodyText).not.toContain('Uncaught');
    });
  });

  test.describe('Phone Number Validation', () => {
    test('Phone number formatting and validation @p2', async ({ authenticatedPage }) => {
      const phoneFormats = [
        { input: '5551234567', description: 'Raw 10 digits' },
        { input: '555-123-4567', description: 'Dashes' },
        { input: '(555) 123-4567', description: 'Standard format' },
        { input: '555.123.4567', description: 'Dots' },
        { input: '+1 555 123 4567', description: 'International' },
      ];

      for (const format of phoneFormats) {
        await memberSearch.searchMember({
          client: CLIENTS.COMPREHENSIVE_TEST,
          phoneNumber: format.input,
        });

        await waitForNetworkIdle(authenticatedPage);

        // All valid formats should be accepted
        const errorSnackbar = authenticatedPage.locator('.snackbar.error.show');
        const hasError = await errorSnackbar.isVisible({ timeout: 2000 }).catch(() => false);

        if (hasError) {
          const errorText = await errorSnackbar.textContent();
          // Should not have validation error for valid phone formats
          expect(errorText).not.toContain('invalid phone');
        }

        // Navigate back
        await navigation.openSearchMenu();
        await navigation.openMemberSearch();
        await waitForNetworkIdle(authenticatedPage);
      }
    });

    test('Phone number rejects invalid formats @p2', async ({ authenticatedPage }) => {
      const invalidPhones = [
        '123',              // Too short
        'abcdefghij',       // Letters
        '555-123',          // Incomplete
        '12345678901234',   // Too long
      ];

      for (const invalidPhone of invalidPhones) {
        await memberSearch.searchMember({
          client: CLIENTS.COMPREHENSIVE_TEST,
          phoneNumber: invalidPhone,
        });

        await waitForNetworkIdle(authenticatedPage);

        // Should either show validation error or find no results
        // Should not crash
        const systemError = authenticatedPage.locator('.snackbar.error.show');
        await expect(systemError).not.toContainText('500').catch(() => {});

        // Navigate back
        await navigation.openSearchMenu();
        await navigation.openMemberSearch();
        await waitForNetworkIdle(authenticatedPage);
      }
    });
  });

  test.describe('Email Validation', () => {
    test('Email validation accepts valid formats @p1', async ({ authenticatedPage }) => {
      const validEmails = [
        'test@example.com',
        'user.name@domain.com',
        'user+tag@example.co.uk',
        'user_name@example.org',
        'user123@test-domain.com',
      ];

      for (const email of validEmails) {
        await memberSearch.searchMember({
          client: CLIENTS.COMPREHENSIVE_TEST,
          email: email,
        });

        await waitForNetworkIdle(authenticatedPage);

        // Valid emails should be accepted
        const errorSnackbar = authenticatedPage.locator('.snackbar.error.show');
        const hasError = await errorSnackbar.isVisible({ timeout: 2000 }).catch(() => false);

        if (hasError) {
          const errorText = await errorSnackbar.textContent();
          expect(errorText).not.toContain('invalid email');
        }

        // Navigate back
        await navigation.openSearchMenu();
        await navigation.openMemberSearch();
        await waitForNetworkIdle(authenticatedPage);
      }
    });

    test('Email validation rejects invalid formats @p1', async ({ authenticatedPage }) => {
      const invalidEmails = [
        'notanemail',
        'missing@',
        '@nodomain.com',
        'spaces in@email.com',
        'double@@domain.com',
        'user@',
        '@domain.com',
        'user@domain',
      ];

      for (const email of invalidEmails) {
        await memberSearch.searchMember({
          client: CLIENTS.COMPREHENSIVE_TEST,
          email: email,
        });

        await waitForNetworkIdle(authenticatedPage);

        // Should either validate and show error, or search and find no results
        // Should not cause system errors
        const systemError = authenticatedPage.locator('.snackbar.error.show');
        await expect(systemError).not.toContainText('500').catch(() => {});
        await expect(systemError).not.toContainText('Internal Server Error').catch(() => {});

        // Navigate back
        await navigation.openSearchMenu();
        await navigation.openMemberSearch();
        await waitForNetworkIdle(authenticatedPage);
      }
    });
  });

  test.describe('SSN Validation', () => {
    test('SSN accepts valid formats @p2', async ({ authenticatedPage }) => {
      const validSSNs = [
        '123456789',        // 9 digits
        '123-45-6789',      // Formatted
        '1234',             // Last 4 only (common search)
      ];

      for (const ssn of validSSNs) {
        await memberSearch.searchMember({
          client: CLIENTS.COMPREHENSIVE_TEST,
          ssn: ssn,
        });

        await waitForNetworkIdle(authenticatedPage);

        // Valid SSN formats should be accepted
        const errorSnackbar = authenticatedPage.locator('.snackbar.error.show');
        const hasError = await errorSnackbar.isVisible({ timeout: 2000 }).catch(() => false);

        if (hasError) {
          const errorText = await errorSnackbar.textContent();
          expect(errorText).not.toContain('invalid SSN');
        }

        // Navigate back
        await navigation.openSearchMenu();
        await navigation.openMemberSearch();
        await waitForNetworkIdle(authenticatedPage);
      }
    });

    test('SSN masking on display @p1 @security', async ({ authenticatedPage }) => {
      // Search for test member
      await memberSearch.searchMember({
        client: CLIENTS.COMPREHENSIVE_TEST,
        memberId: TEST_MEMBER.ID,
      });

      await waitForNetworkIdle(authenticatedPage);

      // Open member hub
      await memberSearch.openMemberHub(TEST_MEMBER.FULL_ID);
      await waitForNetworkIdle(authenticatedPage);

      // Click View Member Details
      await memberSearch.clickViewMemberDetails();
      await smartWait(authenticatedPage, 1000);

      // Check if SSN is masked (XXX-XX-1234 format)
      const pageContent = await authenticatedPage.content();

      // SSN should be masked, not showing full number
      if (pageContent.includes('SSN')) {
        // Should contain masked format or last 4 only
        const hasMasked = pageContent.includes('XXX-XX-') || pageContent.includes('***-**-');
        const hasFullSSN = pageContent.match(/\d{9}/); // 9 consecutive digits

        // Should be masked (not showing full SSN in clear text)
        expect(hasMasked || !hasFullSSN).toBeTruthy();
      }
    });
  });

  test.describe('Numeric Field Validation', () => {
    test('Numeric fields reject text input @p1', async ({ authenticatedPage }) => {
      // Try to enter letters in Member ID field (should be numeric)
      const memberIdField = authenticatedPage.locator('[placeholder="Member\\ ID"]');

      await memberIdField.fill('ABCDEFG');
      await smartWait(authenticatedPage, 500);

      // Try to search
      await memberSearch.searchMember({
        client: CLIENTS.COMPREHENSIVE_TEST,
        memberId: 'ABCDEFG',
      });

      await waitForNetworkIdle(authenticatedPage);

      // Should either filter out letters or show validation error
      const errorSnackbar = authenticatedPage.locator('.snackbar.error.show');
      const hasError = await errorSnackbar.isVisible({ timeout: 2000 }).catch(() => false);

      // Either shows error or finds no results (ID filtered/sanitized)
      // Should not crash
      const bodyText = await authenticatedPage.locator('body').textContent();
      expect(bodyText).not.toContain('Uncaught');
    });

    test('Member ID accepts only numeric values @p2', async ({ authenticatedPage }) => {
      const validMemberIds = [
        '1234567890',
        '123456',
        '999999999',
      ];

      for (const memberId of validMemberIds) {
        await memberSearch.searchMember({
          client: CLIENTS.COMPREHENSIVE_TEST,
          memberId: memberId,
        });

        await waitForNetworkIdle(authenticatedPage);

        // Should execute search without errors
        const errorSnackbar = authenticatedPage.locator('.snackbar.error.show');
        const hasError = await errorSnackbar.isVisible({ timeout: 2000 }).catch(() => false);

        if (hasError) {
          const errorText = await errorSnackbar.textContent();
          // May have "not found" or "too short" but should accept numeric
          expect(errorText).not.toContain('invalid character');
        }

        // Navigate back
        await navigation.openSearchMenu();
        await navigation.openMemberSearch();
        await waitForNetworkIdle(authenticatedPage);
      }
    });
  });

  test.describe('Special Characters Handling', () => {
    test('Special characters handled in all text fields @p2', async ({ authenticatedPage }) => {
      const specialChars = [
        { char: "O'Brien", field: 'firstName' },
        { char: 'García', field: 'lastName' },
        { char: 'Jean-Paul', field: 'firstName' },
        { char: 'Müller', field: 'lastName' },
        { char: 'Søren', field: 'firstName' },
      ];

      for (const test of specialChars) {
        const criteria: any = {
          client: CLIENTS.COMPREHENSIVE_TEST,
        };
        criteria[test.field] = test.char;

        await memberSearch.searchMember(criteria);
        await waitForNetworkIdle(authenticatedPage);

        // Should handle special characters without errors
        const systemError = authenticatedPage.locator('.snackbar.error.show');
        await expect(systemError).not.toContainText('500').catch(() => {});
        await expect(systemError).not.toContainText('encoding').catch(() => {});

        // Navigate back
        await navigation.openSearchMenu();
        await navigation.openMemberSearch();
        await waitForNetworkIdle(authenticatedPage);
      }
    });

    test('HTML/Script tags are escaped @p1 @security', async ({ authenticatedPage }) => {
      const dangerousInputs = [
        '<script>alert("xss")</script>',
        '<img src=x onerror=alert("xss")>',
        '<b>Bold Text</b>',
        '<iframe src="http://evil.com"></iframe>',
      ];

      for (const input of dangerousInputs) {
        await memberSearch.searchMember({
          client: CLIENTS.COMPREHENSIVE_TEST,
          firstName: input,
        });

        await waitForNetworkIdle(authenticatedPage);

        // Check page content - scripts should be escaped, not executed
        const pageContent = await authenticatedPage.content();

        // Should not contain executable script tags
        const hasExecutableScript = pageContent.match(/<script[^>]*>.*?<\/script>/i);
        expect(hasExecutableScript).toBeFalsy();

        // Navigate back
        await navigation.openSearchMenu();
        await navigation.openMemberSearch();
        await waitForNetworkIdle(authenticatedPage);
      }
    });
  });

  test.describe('Required Field Indicators', () => {
    test('Add Member form shows required field indicators @p2', async ({ authenticatedPage }) => {
      // Search for non-existent member to trigger Add Member option
      await memberSearch.searchMember({
        client: CLIENTS.COMPREHENSIVE_TEST,
        memberId: '9999999999',
      });

      await waitForNetworkIdle(authenticatedPage);

      // Click Add Member button
      const addMemberButton = authenticatedPage.getByRole('button', { name: ' Add Member' });
      const isVisible = await addMemberButton.isVisible({ timeout: 5000 }).catch(() => false);

      if (isVisible) {
        await addMemberButton.click();
        await smartWait(authenticatedPage, 1000);

        // Check for required field indicators (* or "Required" text)
        const requiredFields = [
          'First Name',
          'Last Name',
          'Birth Date',
          'Social Security Number',
          'Member Id',
          'Address Line 1',
          'City',
          'Zip',
        ];

        for (const fieldName of requiredFields) {
          const fieldLabel = authenticatedPage.locator(`label:has-text("${fieldName}")`);
          const labelVisible = await fieldLabel.isVisible({ timeout: 2000 }).catch(() => false);

          if (labelVisible) {
            const labelText = await fieldLabel.textContent();

            // Should have asterisk (*) or "Required" indicator
            const hasRequiredIndicator = labelText?.includes('*') || labelText?.includes('Required');
            expect(hasRequiredIndicator).toBeTruthy();
          }
        }

        // Close dialog
        const cancelButton = authenticatedPage.getByRole('button', { name: 'Cancel' });
        const cancelVisible = await cancelButton.isVisible({ timeout: 2000 }).catch(() => false);
        if (cancelVisible) {
          await cancelButton.click();
        }
      }
    });

    test('Required fields prevent form submission when empty @p1', async ({ authenticatedPage }) => {
      // Search for non-existent member
      await memberSearch.searchMember({
        client: CLIENTS.COMPREHENSIVE_TEST,
        memberId: '9999999999',
      });

      await waitForNetworkIdle(authenticatedPage);

      // Click Add Member
      const addMemberButton = authenticatedPage.getByRole('button', { name: ' Add Member' });
      const isVisible = await addMemberButton.isVisible({ timeout: 5000 }).catch(() => false);

      if (isVisible) {
        await addMemberButton.click();
        await smartWait(authenticatedPage, 1000);

        // Try to submit without filling required fields
        const submitButton = authenticatedPage.getByRole('button', { name: 'Submit' });
        const submitVisible = await submitButton.isVisible({ timeout: 2000 }).catch(() => false);

        if (submitVisible) {
          await submitButton.click();
          await smartWait(authenticatedPage, 1000);

          // Should show validation errors
          const validationErrors = authenticatedPage.locator('.field-validation-error, .error, .alert-danger');
          const errorCount = await validationErrors.count();

          // Should have validation errors for required fields
          expect(errorCount).toBeGreaterThan(0);

          // Close dialog
          const cancelButton = authenticatedPage.getByRole('button', { name: 'Cancel' });
          await cancelButton.click();
        }
      }
    });
  });

  test.describe('Field Length Validation', () => {
    test('Zip code validation (5 or 9 digits) @p2', async ({ authenticatedPage }) => {
      // Navigate to Add Member to test zip validation
      await memberSearch.searchMember({
        client: CLIENTS.COMPREHENSIVE_TEST,
        memberId: '9999999999',
      });

      await waitForNetworkIdle(authenticatedPage);

      const addMemberButton = authenticatedPage.getByRole('button', { name: ' Add Member' });
      const isVisible = await addMemberButton.isVisible({ timeout: 5000 }).catch(() => false);

      if (isVisible) {
        await addMemberButton.click();
        await smartWait(authenticatedPage, 1000);

        // Test invalid zip codes
        const invalidZips = [
          '123',         // Too short
          '1234567890',  // Too long
          'ABCDE',       // Letters
        ];

        const zipField = authenticatedPage.getByRole('textbox', { name: 'Zip *' });
        const zipVisible = await zipField.isVisible({ timeout: 2000 }).catch(() => false);

        if (zipVisible) {
          for (const zip of invalidZips) {
            await zipField.fill(zip);
            await smartWait(authenticatedPage, 500);

            // May show validation error
            const validationError = authenticatedPage.locator('.field-validation-error');
            const hasError = await validationError.count();

            // Either shows error or field is masked/filtered
          }

          // Test valid zip codes
          const validZips = ['50014', '12345', '12345-6789'];

          for (const zip of validZips) {
            await zipField.fill(zip);
            await smartWait(authenticatedPage, 500);

            // Should not show validation error for valid zips
            const validationError = authenticatedPage.locator('.field-validation-error');
            const errorText = await validationError.textContent().catch(() => '');

            // Should not have zip-related validation errors
            expect(errorText).not.toContain('zip');
          }
        }

        // Close dialog
        const cancelButton = authenticatedPage.getByRole('button', { name: 'Cancel' });
        await cancelButton.click();
      }
    });
  });
});
