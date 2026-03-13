// ============================================
// TAGGED SMOKE TEST - EXAMPLE
// Shows test organization with tags
// ============================================
import { test, expect } from '../fixtures/cleanupAuth.fixture';
import { navigationPage } from '../pages/navigationPage';
import { memberSearchPage } from '../pages/memberSearchPage';
import { profilePage } from '../pages/profilePage';
import { Tags, combineTags } from '../tags';
import { createStandardMemberSearch, createUserProfile } from '../factories/memberFactory';
import { TEST_MEMBER } from '../constants';

test.describe(combineTags(Tags.SMOKE, Tags.P0, Tags.STABLE), () => {
  test('Login and profile management @auth @fast', async ({ authenticatedPage }) => {
    const page = authenticatedPage;
    const profile = new profilePage(page);

    await test.step('Edit profile', async () => {
      await profile.editProfile(createUserProfile({
        firstName: 'Walter',
        middleName: 'Leland',
        lastName: 'Kronkite'
      }));
    });

    await test.step('Restore profile', async () => {
      await profile.editProfile(createUserProfile({
        firstName: 'Bob',
        middleName: 'Thomas',
        lastName: 'Keyes'
      }));
    });
  });

  test('Member search workflow @member-search @member-hub @fast', async ({ authenticatedPage }) => {
    const page = authenticatedPage;
    const nav = new navigationPage(page);
    const memberSearch = new memberSearchPage(page);

    await test.step('Navigate and search', async () => {
      await nav.goToDashboard();
      await nav.openSearchMenu();
      await nav.openMemberSearch();

      await memberSearch.searchMember(createStandardMemberSearch());
      await memberSearch.verifySearchResults();
    });

    await test.step('Open member hub', async () => {
      await memberSearch.openMemberHub(TEST_MEMBER.FULL_ID);
      await memberSearch.verifyMemberHubLoads();
    });
  });
});

test.describe(combineTags(Tags.REGRESSION, Tags.MEMBER_HUB), () => {
  test('Member details workflow @p1 @stable', async ({ authenticatedPage }) => {
    const page = authenticatedPage;
    const nav = new navigationPage(page);
    const memberSearch = new memberSearchPage(page);

    await nav.goToDashboard();
    await nav.openSearchMenu();
    await nav.openMemberSearch();

    await memberSearch.searchMember(createStandardMemberSearch());
    await memberSearch.openMemberHub(TEST_MEMBER.FULL_ID);
    await memberSearch.clickViewMemberDetails();
  });
});

// Slow tests - useful to filter out in quick runs
test.describe(Tags.SLOW, () => {
  test('Complete end-to-end workflow @e2e @p2', async ({ authenticatedPage }) => {
    test.slow(); // Mark as slow

    // Long-running comprehensive test
    const page = authenticatedPage;
    // ... comprehensive workflow
  });
});
