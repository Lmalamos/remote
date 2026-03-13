// ============================================
// PHASE 3 REFACTORED ALLERGIES TEST - EXAMPLE
// Demonstrates all Phase 3 improvements:
// - Authentication fixture with cleanup
// - Type-safe factories
// - Proper wait helpers
// - Utility functions
// - No fixed timeouts
// ============================================
import { test, expect } from '../fixtures/cleanupAuth.fixture';
import { navigationPage } from '../pages/navigationPage';
import { memberSearchPage } from '../pages/memberSearchPage';
import { AllergiesPanelRefactored } from '../pages/memberHub/allergies.refactored';
import { createStandardMemberSearch } from '../factories/memberFactory';
import { TEST_MEMBER } from '../constants';
import { AllergyDetails } from '../types';

test.describe('STAGE - Allergies Testing Suite (Phase 3)', () => {
  test('Complete allergies test flow with cleanup', async ({ authenticatedPage, testDataTracker }) => {
    // Already authenticated via fixture!
    const page = authenticatedPage;

    const nav = new navigationPage(page);
    const memberSearch = new memberSearchPage(page);
    const allergies = new AllergiesPanelRefactored(page);

    await test.step('Navigate to member', async () => {
      await nav.goToDashboard();
      await nav.openSearchMenu();
      await nav.openMemberSearch();

      // Use factory for search criteria
      const searchCriteria = createStandardMemberSearch();
      await memberSearch.searchMember(searchCriteria);
      await memberSearch.verifySearchResults();
      await memberSearch.openMemberHub(TEST_MEMBER.FULL_ID);
    });

    await test.step('Add allergies', async () => {
      // Type-safe allergy details
      const dogAllergy: AllergyDetails = {
        searchTerm: 'dog',
        notes: 'Allergic to dog dander'
      };

      const penicillinAllergy: AllergyDetails = {
        searchTerm: 'penicillin',
        notes: 'Severe reaction'
      };

      await allergies.addAllergy(dogAllergy);
      await allergies.addAllergy(penicillinAllergy);

      // Register for cleanup (if needed)
      // testDataTracker.registerMember(TEST_MEMBER.FULL_ID);
    });

    await test.step('Verify allergies exist', async () => {
      await allergies.verifyAllergiesExist(['dog', 'penicillin']);
    });

    await test.step('Verify non-existent allergies', async () => {
      await allergies.verifyAllergiesDoNotExist(['peanuts', 'shellfish']);
    });

    // Note: Cleanup happens automatically via fixture
  });

  test('Add and delete allergy workflow', async ({ authenticatedPage }) => {
    const page = authenticatedPage;

    const nav = new navigationPage(page);
    const memberSearch = new memberSearchPage(page);
    const allergies = new AllergiesPanelRefactored(page);

    await test.step('Navigate to member', async () => {
      await nav.goToDashboard();
      await nav.openSearchMenu();
      await nav.openMemberSearch();

      await memberSearch.searchMember(createStandardMemberSearch());
      await memberSearch.verifySearchResults();
      await memberSearch.openMemberHub(TEST_MEMBER.FULL_ID);
    });

    await test.step('Add temporary allergy', async () => {
      const tempAllergy: AllergyDetails = {
        searchTerm: 'latex',
        notes: 'Test allergy - will be deleted'
      };

      await allergies.addAllergy(tempAllergy);
      await allergies.verifyAllergiesExist(['latex']);
    });

    await test.step('Delete all allergies', async () => {
      await allergies.deleteAllAllergies();
      // Verify all deleted
      await allergies.verifyAllergiesDoNotExist(['latex']);
    });
  });
});

test.beforeEach(async ({ page }) => {
  // Page is already authenticated via fixture
  // This hook is just for any additional setup if needed
  console.log('Test starting...');
});

test.afterEach(async ({ page }, testInfo) => {
  // Cleanup is automatic via fixture
  // This hook is for additional teardown if needed
  if (testInfo.status === 'failed') {
    console.log(`Test failed: ${testInfo.title}`);
    // Could take screenshot, etc.
  }
});
