// ============================================
// REFACTORED SMOKE TEST - EXAMPLE
// This shows how the smoke test would look after Phase 2 refactoring
// ============================================
import { test, expect } from '../fixtures/auth.fixture';
import { navigationPage } from '../pages/navigationPage';
import { memberSearchPage } from '../pages/memberSearchPage';
import { profilePage } from '../pages/profilePage';
import { immunizationPanel } from '../pages/memberHub/immunizations';
import { STANDARD_MEMBER_SEARCH } from '../config/testData';
import { TEST_MEMBER } from '../constants';

test.describe('STAGE - Smoke Testing Suite (Refactored)', () => {
    test('Complete smoke test flow', async ({ authenticatedPage }) => {
        // No need for login - authenticatedPage fixture handles it!
        const page = authenticatedPage;

        const nav = new navigationPage(page);
        const memberSearch = new memberSearchPage(page);
        const profile = new profilePage(page);
        const immunization = new immunizationPanel(page);

        await test.step('Navigate to and edit profile', async () => {
            await profile.editProfile({
                firstName: 'Walter',
                middleName: 'Leland',
                lastName: 'Kronkite',
                email: 'bkeyes1@telligen.com',
                phoneNumber: '1111111111'
            });

            await profile.editProfile({
                firstName: 'Bob',
                middleName: 'Thomas',
                lastName: 'Keyes',
                email: 'bkeyes@telligen.com',
                phoneNumber: '4058103238'
            });
        });

        await test.step('Search for member and test Immunizations', async () => {
            await nav.goToDashboard();
            await nav.openSearchMenu();
            await nav.openMemberSearch();

            // Use pre-configured search criteria
            await memberSearch.searchMember(STANDARD_MEMBER_SEARCH);
            await memberSearch.verifySearchResults();
            await memberSearch.openMemberHub(TEST_MEMBER.FULL_ID);

            await immunization.addImmunization('tetanus');
            await immunization.verifyImmunization();
        });
    });
});
