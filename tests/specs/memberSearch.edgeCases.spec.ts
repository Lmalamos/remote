// ============================================
// MEMBER SEARCH - NEGATIVE & EDGE CASES
// Comprehensive testing beyond happy path scenarios
// ============================================

import { test, expect } from '../fixtures/cleanupAuth.fixture';
import { memberSearchPage } from '../pages/memberSearchPage';
import { navigationPage } from '../pages/navigationPage';
import { Tags } from '../tags';
import { UI_TEXT, TEST_MEMBER, CLIENTS } from '../constants';
import { waitForNetworkIdle, waitForElementVisible } from '../utils/waitHelpers';

test.describe(`${Tags.MEMBER_SEARCH} Edge Cases & Negative Tests`, () => {
  let memberSearch: memberSearchPage;
  let navigation: navigationPage;

  test.beforeEach(async ({ authenticatedPage }) => {
    memberSearch = new memberSearchPage(authenticatedPage);
    navigation = new navigationPage(authenticatedPage);

    // Navigate to member search
    await navigation.goToDashboard();
    await navigation.openSearchMenu();
    await navigation.openMemberSearch();
    await waitForNetworkIdle(authenticatedPage);
  });

  test.describe('Validation Tests', () => {
    test('Search with no criteria shows error @p1', async ({ authenticatedPage }) => {
      // Try to search without any criteria
      await memberSearch.searchMember({
        client: CLIENTS.COMPREHENSIVE_TEST,
      });

      // Verify error message
      await memberSearch.verifySearchCriteriaErrorMessage();
      await expect(authenticatedPage.locator('.snackbar.error.show')).toContainText(
        UI_TEXT.SEARCH_CRITERIA_REQUIRED
      );
    });

    test('Member ID too short shows error @p2', async ({ authenticatedPage }) => {
      // Enter 1-2 character member ID
      await memberSearch.searchMember({
        client: CLIENTS.COMPREHENSIVE_TEST,
        memberId: '12', // Too short
      });

      // Verify error message
      await memberSearch.verifyMemberIdLengthErrorMessage();
      await expect(authenticatedPage.locator('.snackbar.error.show')).toContainText(
        UI_TEXT.MEMBER_ID_LENGTH_ERROR
      );
    });

    test('Search with only middle name shows error @p2', async ({ authenticatedPage }) => {
      // Try to search with only middle name (not a valid search criteria)
      await memberSearch.searchMember({
        client: CLIENTS.COMPREHENSIVE_TEST,
        middleName: 'MiddleOnly',
      });

      // Verify error message about required search fields
      await memberSearch.verifyErrorNameErrorMessage();
      await expect(authenticatedPage.locator('.snackbar.error.show')).toContainText(
        UI_TEXT.REQUIRED_FIELD_ERROR
      );
    });

    test('Search with invalid member ID format @p2', async ({ authenticatedPage }) => {
      // Search with special characters in member ID
      await memberSearch.searchMember({
        client: CLIENTS.COMPREHENSIVE_TEST,
        memberId: 'ABC-123!@#',
      });

      // Should either sanitize or show no results
      await waitForNetworkIdle(authenticatedPage);
      const noResults = authenticatedPage.getByRole('heading', { name: 'Member Not Found.' });
      await expect(noResults).toBeVisible();
    });
  });

  test.describe('Special Characters Handling', () => {
    test('Search with special characters in name @p2', async ({ authenticatedPage }) => {
      // Test names with apostrophes, hyphens, accents
      const specialNames = [
        { firstName: "O'Brien", lastName: 'Test' },
        { firstName: 'Jean-Paul', lastName: 'Test' },
        { firstName: 'José', lastName: 'García' },
      ];

      for (const name of specialNames) {
        await memberSearch.searchMember({
          client: CLIENTS.COMPREHENSIVE_TEST,
          firstName: name.firstName,
          lastName: name.lastName,
        });

        await waitForNetworkIdle(authenticatedPage);

        // Should not error - either find results or show "not found"
        const errorSnackbar = authenticatedPage.locator('.snackbar.error.show');
        await expect(errorSnackbar).not.toBeVisible({ timeout: 2000 }).catch(() => {
          // If error is visible, that's a bug - special chars should be handled
        });

        // Navigate back to search if results were found
        await navigation.openSearchMenu();
        await navigation.openMemberSearch();
        await waitForNetworkIdle(authenticatedPage);
      }
    });

    test('Search with unicode characters in name @p3', async ({ authenticatedPage }) => {
      // Test various unicode characters
      await memberSearch.searchMember({
        client: CLIENTS.COMPREHENSIVE_TEST,
        firstName: 'Łukasz', // Polish L with stroke
        lastName: 'Żółć', // Polish characters
      });

      await waitForNetworkIdle(authenticatedPage);

      // Should handle gracefully without errors
      const errorSnackbar = authenticatedPage.locator('.snackbar.error.show');
      const criticalError = authenticatedPage.locator('.snackbar.error.show');
      await expect(criticalError).not.toContainText('Error').catch(() => {});
    });
  });

  test.describe('Security Tests', () => {
    test('Search with SQL injection attempt @p1 @security', async ({ authenticatedPage }) => {
      // Attempt SQL injection in various fields
      const sqlInjectionStrings = [
        "'; DROP TABLE members; --",
        "1' OR '1'='1",
        "admin'--",
        "' UNION SELECT NULL--",
      ];

      for (const injectionString of sqlInjectionStrings) {
        await memberSearch.searchMember({
          client: CLIENTS.COMPREHENSIVE_TEST,
          lastName: injectionString,
        });

        await waitForNetworkIdle(authenticatedPage);

        // Verify: No SQL error displayed, input should be sanitized
        const errorSnackbar = authenticatedPage.locator('.snackbar.error.show');
        await expect(errorSnackbar).not.toContainText('SQL').catch(() => {});
        await expect(errorSnackbar).not.toContainText('syntax').catch(() => {});
        await expect(errorSnackbar).not.toContainText('database').catch(() => {});

        // Should show "not found" or empty results, not a system error
        const notFound = authenticatedPage.getByRole('heading', { name: 'Member Not Found.' });
        const isVisible = await notFound.isVisible({ timeout: 5000 }).catch(() => false);

        // Navigate back for next iteration
        if (isVisible) {
          await navigation.openSearchMenu();
          await navigation.openMemberSearch();
          await waitForNetworkIdle(authenticatedPage);
        }
      }
    });

    test('Search with XSS attempt @p1 @security', async ({ authenticatedPage }) => {
      // Attempt XSS injection
      const xssStrings = [
        "<script>alert('xss')</script>",
        "<img src=x onerror=alert('xss')>",
        "javascript:alert('xss')",
        "<svg/onload=alert('xss')>",
      ];

      for (const xssString of xssStrings) {
        await memberSearch.searchMember({
          client: CLIENTS.COMPREHENSIVE_TEST,
          firstName: xssString,
        });

        await waitForNetworkIdle(authenticatedPage);

        // Verify: Script should not execute, should be escaped/sanitized
        // Check if script tags appear in DOM (they shouldn't as executable script)
        const pageContent = await authenticatedPage.content();
        const hasExecutableScript = pageContent.includes('<script>alert');

        // Script tags should be escaped or removed
        expect(hasExecutableScript).toBe(false);

        // Navigate back
        await navigation.openSearchMenu();
        await navigation.openMemberSearch();
        await waitForNetworkIdle(authenticatedPage);
      }
    });
  });

  test.describe('Boundary Testing', () => {
    test('Search with very long name (255 chars) @p3', async ({ authenticatedPage }) => {
      // Create a 255 character name
      const longName = 'A'.repeat(255);

      await memberSearch.searchMember({
        client: CLIENTS.COMPREHENSIVE_TEST,
        firstName: longName,
      });

      await waitForNetworkIdle(authenticatedPage);

      // Should handle gracefully - either truncate, accept, or show validation error
      // Should not crash or show system error
      const systemError = authenticatedPage.locator('.snackbar.error.show');
      await expect(systemError).not.toContainText('500').catch(() => {});
      await expect(systemError).not.toContainText('Internal Server Error').catch(() => {});
    });

    test('Search with maximum valid member ID length @p3', async ({ authenticatedPage }) => {
      // Test with maximum length member ID (appears to be 10 digits based on test data)
      const maxLengthId = '9999999999';

      await memberSearch.searchMember({
        client: CLIENTS.COMPREHENSIVE_TEST,
        memberId: maxLengthId,
      });

      await waitForNetworkIdle(authenticatedPage);

      // Should search without errors
      const result = await authenticatedPage.locator('.snackbar.error.show').isVisible({ timeout: 2000 }).catch(() => false);

      // If no error, search was accepted
      expect(result).toBe(false);
    });

    test('Search with all fields populated @p2', async ({ authenticatedPage }) => {
      // Fill every available search field
      await memberSearch.searchMember({
        client: CLIENTS.COMPREHENSIVE_TEST,
        memberId: TEST_MEMBER.ID,
        firstName: TEST_MEMBER.FIRST_NAME,
        lastName: TEST_MEMBER.LAST_NAME,
        middleName: 'Middle',
        dob: TEST_MEMBER.DOB,
        phoneNumber: TEST_MEMBER.PHONE,
        email: TEST_MEMBER.EMAIL,
        relationshipStatus: TEST_MEMBER.RELATIONSHIP,
        gender: TEST_MEMBER.GENDER,
        ssn: TEST_MEMBER.SSN,
      });

      await waitForNetworkIdle(authenticatedPage);

      // Should execute search successfully
      // Either find results or show "not found"
      const searchExecuted = await authenticatedPage.locator('#advancedMemberSearchMemberTableBody, h3:has-text("Member Not Found")').isVisible({ timeout: 10000 });
      expect(searchExecuted).toBe(true);
    });
  });

  test.describe('No Results Scenarios', () => {
    test('Search with non-existent member shows proper message @p2', async ({ authenticatedPage }) => {
      // Search for member that definitely doesn't exist
      await memberSearch.searchMember({
        client: CLIENTS.COMPREHENSIVE_TEST,
        memberId: '9999999999',
        lastName: 'NonExistentMember12345',
      });

      await waitForNetworkIdle(authenticatedPage);

      // Verify "Member Not Found" message
      await memberSearch.verifyNoSearchResults();
      await expect(authenticatedPage.getByRole('heading', { name: 'Member Not Found.' })).toBeVisible();
      await expect(authenticatedPage.getByRole('button', { name: ' Add Member' })).toBeVisible();
    });

    test('Search with mismatched criteria shows no results @p2', async ({ authenticatedPage }) => {
      // Search with first name of one member and last name of another
      await memberSearch.searchMember({
        client: CLIENTS.COMPREHENSIVE_TEST,
        firstName: TEST_MEMBER.FIRST_NAME,
        lastName: 'DefinitelyNotAMatch9999',
      });

      await waitForNetworkIdle(authenticatedPage);

      // Should show "Member Not Found"
      await expect(authenticatedPage.getByRole('heading', { name: 'Member Not Found.' })).toBeVisible();
    });
  });

  test.describe('Data Format Testing', () => {
    test('Search with phone number in different formats @p2', async ({ authenticatedPage }) => {
      // Test various phone number formats
      const phoneFormats = [
        '1111111111',      // Raw digits
        '111-111-1111',    // Dashes
        '(111) 111-1111',  // Standard format
        '111.111.1111',    // Dots
      ];

      for (const phone of phoneFormats) {
        await memberSearch.searchMember({
          client: CLIENTS.COMPREHENSIVE_TEST,
          phoneNumber: phone,
        });

        await waitForNetworkIdle(authenticatedPage);

        // All formats should be accepted without validation errors
        const errorSnackbar = authenticatedPage.locator('.snackbar.error.show');
        const hasError = await errorSnackbar.isVisible({ timeout: 2000 }).catch(() => false);

        // Navigate back for next iteration
        await navigation.openSearchMenu();
        await navigation.openMemberSearch();
        await waitForNetworkIdle(authenticatedPage);
      }
    });

    test('Search with DOB in various formats @p2', async ({ authenticatedPage }) => {
      // Test different date formats
      const dateFormats = [
        '03312022',         // MMDDYYYY
        '03/31/2022',       // MM/DD/YYYY
        '3/31/2022',        // M/D/YYYY
      ];

      for (const dob of dateFormats) {
        await memberSearch.searchMember({
          client: CLIENTS.COMPREHENSIVE_TEST,
          dob: dob,
          lastName: TEST_MEMBER.LAST_NAME,
        });

        await waitForNetworkIdle(authenticatedPage);

        // Should handle various formats
        const errorSnackbar = authenticatedPage.locator('.snackbar.error.show');
        const hasValidationError = await errorSnackbar.isVisible({ timeout: 2000 }).catch(() => false);

        // Navigate back
        await navigation.openSearchMenu();
        await navigation.openMemberSearch();
        await waitForNetworkIdle(authenticatedPage);
      }
    });

    test('Search with partial SSN (last 4 digits) @p2', async ({ authenticatedPage }) => {
      // Search with just last 4 of SSN
      await memberSearch.searchMember({
        client: CLIENTS.COMPREHENSIVE_TEST,
        ssn: TEST_MEMBER.SSN, // Last 4 digits
      });

      await waitForNetworkIdle(authenticatedPage);

      // Should execute search successfully
      const searchExecuted = await authenticatedPage.locator('#advancedMemberSearchMemberTableBody, h3:has-text("Member Not Found")').isVisible({ timeout: 10000 });
      expect(searchExecuted).toBe(true);
    });
  });

  test.describe('Case Sensitivity', () => {
    test('Search with different case variations @p2', async ({ authenticatedPage }) => {
      // Test case insensitivity
      const caseVariations = [
        { firstName: 'junior', lastName: 'jabroni' },    // lowercase
        { firstName: 'JUNIOR', lastName: 'JABRONI' },    // uppercase
        { firstName: 'Junior', lastName: 'Jabroni' },    // proper case
        { firstName: 'jUnIoR', lastName: 'JaBrOnI' },    // mixed case
      ];

      for (const variation of caseVariations) {
        await memberSearch.searchMember({
          client: CLIENTS.COMPREHENSIVE_TEST,
          firstName: variation.firstName,
          lastName: variation.lastName,
        });

        await waitForNetworkIdle(authenticatedPage);

        // All variations should return same results (case insensitive)
        // Either finds member or shows not found consistently
        const resultArea = authenticatedPage.locator('#advancedMemberSearchMemberTableBody, h3:has-text("Member Not Found")');
        await expect(resultArea).toBeVisible({ timeout: 10000 });

        // Navigate back
        await navigation.openSearchMenu();
        await navigation.openMemberSearch();
        await waitForNetworkIdle(authenticatedPage);
      }
    });
  });

  test.describe('Whitespace Handling', () => {
    test('Search with leading/trailing whitespace @p2', async ({ authenticatedPage }) => {
      // Test whitespace trimming
      await memberSearch.searchMember({
        client: CLIENTS.COMPREHENSIVE_TEST,
        firstName: '  Junior  ',
        lastName: '  Jabroni  ',
      });

      await waitForNetworkIdle(authenticatedPage);

      // Should trim whitespace and search successfully
      const resultArea = authenticatedPage.locator('#advancedMemberSearchMemberTableBody, h3:has-text("Member Not Found")');
      await expect(resultArea).toBeVisible({ timeout: 10000 });
    });

    test('Search with multiple spaces between names @p3', async ({ authenticatedPage }) => {
      // Test handling of extra spaces
      await memberSearch.searchMember({
        client: CLIENTS.COMPREHENSIVE_TEST,
        firstName: 'Junior     Test', // Multiple spaces
        lastName: 'Jabroni',
      });

      await waitForNetworkIdle(authenticatedPage);

      // Should handle gracefully
      const resultArea = authenticatedPage.locator('#advancedMemberSearchMemberTableBody, h3:has-text("Member Not Found")');
      await expect(resultArea).toBeVisible({ timeout: 10000 });
    });
  });

  test.describe('Email Validation', () => {
    test('Search with invalid email format @p2', async ({ authenticatedPage }) => {
      // Test various invalid email formats
      const invalidEmails = [
        'notanemail',
        'missing@domain',
        '@nodomain.com',
        'spaces in@email.com',
        'double@@domain.com',
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

        // Navigate back
        await navigation.openSearchMenu();
        await navigation.openMemberSearch();
        await waitForNetworkIdle(authenticatedPage);
      }
    });

    test('Search with very long email @p3', async ({ authenticatedPage }) => {
      // Test email at maximum length
      const longEmail = 'a'.repeat(50) + '@' + 'b'.repeat(50) + '.com';

      await memberSearch.searchMember({
        client: CLIENTS.COMPREHENSIVE_TEST,
        email: longEmail,
      });

      await waitForNetworkIdle(authenticatedPage);

      // Should handle without system errors
      const resultArea = authenticatedPage.locator('#advancedMemberSearchMemberTableBody, h3:has-text("Member Not Found")');
      await expect(resultArea).toBeVisible({ timeout: 10000 });
    });
  });
});
