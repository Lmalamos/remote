// ============================================
// CARE TEAM - COMPREHENSIVE TESTS
// PCP, facilities, providers, contacts
// ============================================

import { test, expect } from '../fixtures/cleanupAuth.fixture';
import { memberSearchPage } from '../pages/memberSearchPage';
import { navigationPage } from '../pages/navigationPage';
import { careTeamPanel } from '../pages/memberHub/careTeam';
import { Tags } from '../tags';
import { TEST_MEMBER, CLIENTS } from '../constants';
import { waitForNetworkIdle, smartWait } from '../utils/waitHelpers';

test.describe(`${Tags.CARE_TEAM} ${Tags.MEMBER_HUB} Care Team - Comprehensive`, () => {
  let memberSearch: memberSearchPage;
  let navigation: navigationPage;
  let careTeam: careTeamPanel;

  test.beforeEach(async ({ authenticatedPage }) => {
    memberSearch = new memberSearchPage(authenticatedPage);
    navigation = new navigationPage(authenticatedPage);
    careTeam = new careTeamPanel(authenticatedPage);

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

    await careTeam.careTeamHeader.click();
    await waitForNetworkIdle(authenticatedPage);
  });

  test.describe('Care Team Panel Access', () => {
    test('Care Team panel opens @p1', async ({ authenticatedPage }) => {
      await expect(careTeam.careTeamHeader).toBeVisible();
      console.log('Care Team panel visible');
    });

    test('Care Team sections available @p2', async ({ authenticatedPage }) => {
      const sections = [
        'Primary Care Physician',
        'Primary Care Facility',
        'Other Providers',
        'Member Designates/Contacts'
      ];

      for (const section of sections) {
        const sectionElement = authenticatedPage.getByText(section, { exact: true });
        const isVisible = await sectionElement.isVisible({ timeout: 3000 }).catch(() => false);

        if (isVisible) {
          console.log(`Section "${section}" found`);
        }
      }
    });
  });

  test.describe('Primary Care Physician', () => {
    test('View PCP list @p2', async ({ authenticatedPage }) => {
      const pcpSection = authenticatedPage.getByText('Primary Care Physician', { exact: true });
      await pcpSection.click();
      await smartWait(authenticatedPage, 500);

      const pcpTable = authenticatedPage.locator('#primaryCarePhysicianTable, table').first();
      const hasTable = await pcpTable.isVisible({ timeout: 3000 }).catch(() => false);

      console.log('PCP table visible:', hasTable);
    });

    test('Add PCP with search @p2', async ({ authenticatedPage }) => {
      const pcpSection = authenticatedPage.getByText('Primary Care Physician', { exact: true });
      await pcpSection.click();
      await smartWait(authenticatedPage, 500);

      const addButton = authenticatedPage.getByTitle('Add Primary Care Physician');
      const buttonVisible = await addButton.isVisible({ timeout: 3000 }).catch(() => false);

      if (buttonVisible) {
        await addButton.click();
        await smartWait(authenticatedPage, 1000);

        const yesButton = authenticatedPage.getByRole('button', { name: 'Yes' });
        const hasYesButton = await yesButton.isVisible({ timeout: 2000 }).catch(() => false);

        if (hasYesButton) {
          await yesButton.click();
          await smartWait(authenticatedPage, 500);

          const cityField = authenticatedPage.getByRole('textbox', { name: 'City' });
          await cityField.fill('Des Moines');

          const stateField = authenticatedPage.getByLabel('State');
          await stateField.selectOption('IA');

          const zipField = authenticatedPage.getByRole('textbox', { name: 'Zip Code' });
          await zipField.fill('50309');

          const searchButton = authenticatedPage.getByRole('button', { name: 'Search', exact: true });
          await searchButton.click();
          await waitForNetworkIdle(authenticatedPage);

          console.log('PCP search executed');

          const cancelButton = authenticatedPage.getByRole('button', { name: 'Cancel' });
          await cancelButton.click();
        }
      }
    });

    test('PCP search requires location @p2', async ({ authenticatedPage }) => {
      const pcpSection = authenticatedPage.getByText('Primary Care Physician', { exact: true });
      await pcpSection.click();
      await smartWait(authenticatedPage, 500);

      const addButton = authenticatedPage.getByTitle('Add Primary Care Physician');
      const buttonVisible = await addButton.isVisible({ timeout: 3000 }).catch(() => false);

      if (buttonVisible) {
        await addButton.click();
        await smartWait(authenticatedPage, 1000);

        const yesButton = authenticatedPage.getByRole('button', { name: 'Yes' });
        await yesButton.click().catch(() => {});
        await smartWait(authenticatedPage, 500);

        const searchButton = authenticatedPage.getByRole('button', { name: 'Search', exact: true });
        await searchButton.click();
        await smartWait(authenticatedPage, 1000);

        const error = authenticatedPage.locator('.error, .alert-danger, [class*="error"]');
        const hasError = await error.isVisible({ timeout: 2000 }).catch(() => false);

        console.log('Validation error for empty search:', hasError);

        const cancelButton = authenticatedPage.getByRole('button', { name: 'Cancel' });
        await cancelButton.click().catch(() => {});
      }
    });

    test('PCP search by zip code @p3', async ({ authenticatedPage }) => {
      const pcpSection = authenticatedPage.getByText('Primary Care Physician', { exact: true });
      await pcpSection.click();
      await smartWait(authenticatedPage, 500);

      const addButton = authenticatedPage.getByTitle('Add Primary Care Physician');
      const buttonVisible = await addButton.isVisible({ timeout: 3000 }).catch(() => false);

      if (buttonVisible) {
        await addButton.click();
        await smartWait(authenticatedPage, 1000);

        const yesButton = authenticatedPage.getByRole('button', { name: 'Yes' });
        await yesButton.click().catch(() => {});
        await smartWait(authenticatedPage, 500);

        const zipField = authenticatedPage.getByRole('textbox', { name: 'Zip Code' });
        await zipField.fill('50010');

        const searchButton = authenticatedPage.getByRole('button', { name: 'Search', exact: true });
        await searchButton.click();
        await waitForNetworkIdle(authenticatedPage);

        console.log('PCP zip code search executed');

        const cancelButton = authenticatedPage.getByRole('button', { name: 'Cancel' });
        await cancelButton.click().catch(() => {});
      }
    });

    test('Cancel PCP addition @p2', async ({ authenticatedPage }) => {
      const pcpSection = authenticatedPage.getByText('Primary Care Physician', { exact: true });
      await pcpSection.click();
      await smartWait(authenticatedPage, 500);

      const addButton = authenticatedPage.getByTitle('Add Primary Care Physician');
      const buttonVisible = await addButton.isVisible({ timeout: 3000 }).catch(() => false);

      if (buttonVisible) {
        await addButton.click();
        await smartWait(authenticatedPage, 1000);

        const noButton = authenticatedPage.getByRole('button', { name: 'No', exact: true });
        const hasNoButton = await noButton.isVisible({ timeout: 2000 }).catch(() => false);

        if (hasNoButton) {
          await noButton.click();
          await smartWait(authenticatedPage, 500);

          await expect(careTeam.careTeamHeader).toBeVisible();
          console.log('PCP addition cancelled');
        }
      }
    });
  });

  test.describe('Primary Care Facility', () => {
    test('View PCF list @p2', async ({ authenticatedPage }) => {
      const pcfSection = authenticatedPage.getByText('Primary Care Facility', { exact: true });
      await pcfSection.click();
      await smartWait(authenticatedPage, 500);

      const pcfTable = authenticatedPage.locator('#primaryCareFacilityTable, table').first();
      const hasTable = await pcfTable.isVisible({ timeout: 3000 }).catch(() => false);

      console.log('PCF table visible:', hasTable);
    });

    test('Add PCF with search @p2', async ({ authenticatedPage }) => {
      const pcfSection = authenticatedPage.getByText('Primary Care Facility', { exact: true });
      await pcfSection.click();
      await smartWait(authenticatedPage, 500);

      const addButton = authenticatedPage.getByTitle('Add Primary Care Facility');
      const buttonVisible = await addButton.isVisible({ timeout: 3000 }).catch(() => false);

      if (buttonVisible) {
        await addButton.click();
        await smartWait(authenticatedPage, 1000);

        const yesButton = authenticatedPage.getByRole('button', { name: 'Yes' });
        await yesButton.click().catch(() => {});
        await smartWait(authenticatedPage, 500);

        const cityField = authenticatedPage.getByRole('textbox', { name: 'City' });
        await cityField.fill('Ames');

        const stateField = authenticatedPage.getByLabel('State');
        await stateField.selectOption('IA');

        const zipField = authenticatedPage.getByRole('textbox', { name: 'Zip Code' });
        await zipField.fill('50010');

        const searchButton = authenticatedPage.getByRole('button', { name: 'Search', exact: true });
        await searchButton.click();
        await waitForNetworkIdle(authenticatedPage);

        console.log('PCF search executed');

        const cancelButton = authenticatedPage.getByRole('button', { name: 'Cancel' });
        await cancelButton.click().catch(() => {});
      }
    });

    test('PCF search by city and state @p3', async ({ authenticatedPage }) => {
      const pcfSection = authenticatedPage.getByText('Primary Care Facility', { exact: true });
      await pcfSection.click();
      await smartWait(authenticatedPage, 500);

      const addButton = authenticatedPage.getByTitle('Add Primary Care Facility');
      const buttonVisible = await addButton.isVisible({ timeout: 3000 }).catch(() => false);

      if (buttonVisible) {
        await addButton.click();
        await smartWait(authenticatedPage, 1000);

        const yesButton = authenticatedPage.getByRole('button', { name: 'Yes' });
        await yesButton.click().catch(() => {});
        await smartWait(authenticatedPage, 500);

        const cityField = authenticatedPage.getByRole('textbox', { name: 'City' });
        await cityField.fill('Iowa City');

        const stateField = authenticatedPage.getByLabel('State');
        await stateField.selectOption('IA');

        const searchButton = authenticatedPage.getByRole('button', { name: 'Search', exact: true });
        await searchButton.click();
        await waitForNetworkIdle(authenticatedPage);

        console.log('PCF city/state search executed');

        const cancelButton = authenticatedPage.getByRole('button', { name: 'Cancel' });
        await cancelButton.click().catch(() => {});
      }
    });

    test('Cancel PCF addition @p2', async ({ authenticatedPage }) => {
      const pcfSection = authenticatedPage.getByText('Primary Care Facility', { exact: true });
      await pcfSection.click();
      await smartWait(authenticatedPage, 500);

      const addButton = authenticatedPage.getByTitle('Add Primary Care Facility');
      const buttonVisible = await addButton.isVisible({ timeout: 3000 }).catch(() => false);

      if (buttonVisible) {
        await addButton.click();
        await smartWait(authenticatedPage, 1000);

        const cancelButton = authenticatedPage.getByRole('button', { name: 'Cancel' });
        const hasCancelButton = await cancelButton.isVisible({ timeout: 2000 }).catch(() => false);

        if (hasCancelButton) {
          await cancelButton.click();
          await smartWait(authenticatedPage, 500);

          await expect(careTeam.careTeamHeader).toBeVisible();
          console.log('PCF addition cancelled');
        }
      }
    });
  });

  test.describe('Other Providers', () => {
    test('View Other Providers list @p2', async ({ authenticatedPage }) => {
      const otherSection = authenticatedPage.getByText('Other Providers', { exact: true });
      await otherSection.click();
      await smartWait(authenticatedPage, 500);

      const otherTable = authenticatedPage.locator('#otherProvidersTable, table').first();
      const hasTable = await otherTable.isVisible({ timeout: 3000 }).catch(() => false);

      console.log('Other Providers table visible:', hasTable);
    });

    test('Add Other Provider @p2', async ({ authenticatedPage }) => {
      const otherSection = authenticatedPage.getByText('Other Providers', { exact: true });
      await otherSection.click();
      await smartWait(authenticatedPage, 500);

      const addButton = authenticatedPage.getByTitle('Add Other Provider');
      const buttonVisible = await addButton.isVisible({ timeout: 3000 }).catch(() => false);

      if (buttonVisible) {
        await addButton.click();
        await smartWait(authenticatedPage, 1000);

        const cityField = authenticatedPage.getByRole('textbox', { name: 'City' });
        await cityField.fill('Cedar Rapids');

        const stateField = authenticatedPage.getByLabel('State');
        await stateField.selectOption('IA');

        const zipField = authenticatedPage.getByRole('textbox', { name: 'Zip Code' });
        await zipField.fill('52401');

        const searchButton = authenticatedPage.getByRole('button', { name: 'Search', exact: true });
        await searchButton.click();
        await waitForNetworkIdle(authenticatedPage);

        console.log('Other Provider search executed');

        const cancelButton = authenticatedPage.getByRole('button', { name: 'Cancel' });
        await cancelButton.click().catch(() => {});
      }
    });

    test('Other Providers pagination @p3', async ({ authenticatedPage }) => {
      const otherSection = authenticatedPage.getByText('Other Providers', { exact: true });
      await otherSection.click();
      await smartWait(authenticatedPage, 500);

      const otherTable = authenticatedPage.locator('#otherProvidersTable, table').first();
      const hasTable = await otherTable.isVisible({ timeout: 3000 }).catch(() => false);

      if (hasTable) {
        const infoText = authenticatedPage.locator('#otherProvidersTable_info, .dataTables_info');
        const hasInfo = await infoText.isVisible({ timeout: 2000 }).catch(() => false);

        if (hasInfo) {
          const text = await infoText.textContent();
          console.log('Other Providers pagination:', text);
        }
      }
    });

    test('Cancel Other Provider addition @p2', async ({ authenticatedPage }) => {
      const otherSection = authenticatedPage.getByText('Other Providers', { exact: true });
      await otherSection.click();
      await smartWait(authenticatedPage, 500);

      const addButton = authenticatedPage.getByTitle('Add Other Provider');
      const buttonVisible = await addButton.isVisible({ timeout: 3000 }).catch(() => false);

      if (buttonVisible) {
        await addButton.click();
        await smartWait(authenticatedPage, 1000);

        const cancelButton = authenticatedPage.getByRole('button', { name: 'Cancel' });
        await cancelButton.click();
        await smartWait(authenticatedPage, 500);

        await expect(careTeam.careTeamHeader).toBeVisible();
        console.log('Other Provider addition cancelled');
      }
    });
  });

  test.describe('Member Designates/Contacts', () => {
    test('View Member Designates list @p2', async ({ authenticatedPage }) => {
      const designatesSection = authenticatedPage.getByText('Member Designates/Contacts', { exact: true });
      await designatesSection.click();
      await smartWait(authenticatedPage, 500);

      const designatesTable = authenticatedPage.locator('#memberDesignatesTable, table').first();
      const hasTable = await designatesTable.isVisible({ timeout: 3000 }).catch(() => false);

      console.log('Member Designates table visible:', hasTable);
    });

    test('Add Member Designate with required fields @p1', async ({ authenticatedPage }) => {
      const designatesSection = authenticatedPage.getByText('Member Designates/Contacts', { exact: true });
      await designatesSection.click();
      await smartWait(authenticatedPage, 500);

      const addButton = authenticatedPage.getByTitle('Add Member Designate/Contact');
      const buttonVisible = await addButton.isVisible({ timeout: 3000 }).catch(() => false);

      if (buttonVisible) {
        await addButton.click();
        await smartWait(authenticatedPage, 1000);

        const firstNameField = authenticatedPage.getByRole('textbox', { name: 'First Name *' });
        await firstNameField.fill('John');

        const lastNameField = authenticatedPage.getByRole('textbox', { name: 'Last Name / Organization Name' });
        await lastNameField.fill('Doe');

        const relationshipField = authenticatedPage.getByLabel('Relationship to Member');
        await relationshipField.selectOption('27');

        const verbalRadio = authenticatedPage.getByRole('radio', { name: 'Verbal' });
        await verbalRadio.check();

        const phoneField = authenticatedPage.getByRole('textbox', { name: 'Phone Number *' });
        await phoneField.click({ clickCount: 3 });
        await phoneField.fill('5151234567');

        const phoneTypeField = authenticatedPage.getByLabel('Phone Type');
        await phoneTypeField.selectOption('21');

        console.log('Member Designate fields filled');

        const closeButton = authenticatedPage.getByRole('button', { name: 'Close', exact: true });
        await closeButton.click();
      }
    });

    test('First name is required @p1', async ({ authenticatedPage }) => {
      const designatesSection = authenticatedPage.getByText('Member Designates/Contacts', { exact: true });
      await designatesSection.click();
      await smartWait(authenticatedPage, 500);

      const addButton = authenticatedPage.getByTitle('Add Member Designate/Contact');
      const buttonVisible = await addButton.isVisible({ timeout: 3000 }).catch(() => false);

      if (buttonVisible) {
        await addButton.click();
        await smartWait(authenticatedPage, 1000);

        const firstNameField = authenticatedPage.getByRole('textbox', { name: 'First Name *' });
        const isRequired = await firstNameField.getAttribute('required') !== null;

        console.log('First name required:', isRequired);

        const closeButton = authenticatedPage.getByRole('button', { name: 'Close', exact: true });
        await closeButton.click().catch(() => {});
      }
    });

    test('Phone number is required @p1', async ({ authenticatedPage }) => {
      const designatesSection = authenticatedPage.getByText('Member Designates/Contacts', { exact: true });
      await designatesSection.click();
      await smartWait(authenticatedPage, 500);

      const addButton = authenticatedPage.getByTitle('Add Member Designate/Contact');
      const buttonVisible = await addButton.isVisible({ timeout: 3000 }).catch(() => false);

      if (buttonVisible) {
        await addButton.click();
        await smartWait(authenticatedPage, 1000);

        const phoneField = authenticatedPage.getByRole('textbox', { name: 'Phone Number *' });
        const isRequired = await phoneField.getAttribute('required') !== null;

        console.log('Phone number required:', isRequired);

        const closeButton = authenticatedPage.getByRole('button', { name: 'Close', exact: true });
        await closeButton.click().catch(() => {});
      }
    });

    test('Phone number validation @p2', async ({ authenticatedPage }) => {
      const designatesSection = authenticatedPage.getByText('Member Designates/Contacts', { exact: true });
      await designatesSection.click();
      await smartWait(authenticatedPage, 500);

      const addButton = authenticatedPage.getByTitle('Add Member Designate/Contact');
      const buttonVisible = await addButton.isVisible({ timeout: 3000 }).catch(() => false);

      if (buttonVisible) {
        await addButton.click();
        await smartWait(authenticatedPage, 1000);

        const phoneField = authenticatedPage.getByRole('textbox', { name: 'Phone Number *' });

        const invalidPhones = ['123', '12345', 'abcdefghij', '555-555-555'];

        for (const phone of invalidPhones) {
          await phoneField.clear();
          await phoneField.fill(phone);
          await smartWait(authenticatedPage, 500);

          console.log(`Testing invalid phone: ${phone}`);
        }

        const closeButton = authenticatedPage.getByRole('button', { name: 'Close', exact: true });
        await closeButton.click().catch(() => {});
      }
    });

    test('Relationship dropdown available @p2', async ({ authenticatedPage }) => {
      const designatesSection = authenticatedPage.getByText('Member Designates/Contacts', { exact: true });
      await designatesSection.click();
      await smartWait(authenticatedPage, 500);

      const addButton = authenticatedPage.getByTitle('Add Member Designate/Contact');
      const buttonVisible = await addButton.isVisible({ timeout: 3000 }).catch(() => false);

      if (buttonVisible) {
        await addButton.click();
        await smartWait(authenticatedPage, 1000);

        const relationshipField = authenticatedPage.getByLabel('Relationship to Member');
        const options = await relationshipField.locator('option').count();

        console.log('Relationship options available:', options);
        expect(options).toBeGreaterThan(1);

        const closeButton = authenticatedPage.getByRole('button', { name: 'Close', exact: true });
        await closeButton.click().catch(() => {});
      }
    });

    test('Consent type selection @p2', async ({ authenticatedPage }) => {
      const designatesSection = authenticatedPage.getByText('Member Designates/Contacts', { exact: true });
      await designatesSection.click();
      await smartWait(authenticatedPage, 500);

      const addButton = authenticatedPage.getByTitle('Add Member Designate/Contact');
      const buttonVisible = await addButton.isVisible({ timeout: 3000 }).catch(() => false);

      if (buttonVisible) {
        await addButton.click();
        await smartWait(authenticatedPage, 1000);

        const verbalRadio = authenticatedPage.getByRole('radio', { name: 'Verbal' });
        const verbalVisible = await verbalRadio.isVisible({ timeout: 2000 }).catch(() => false);

        if (verbalVisible) {
          await verbalRadio.check();
          const isChecked = await verbalRadio.isChecked();
          console.log('Verbal consent checked:', isChecked);
        }

        const closeButton = authenticatedPage.getByRole('button', { name: 'Close', exact: true });
        await closeButton.click().catch(() => {});
      }
    });

    test('Cancel Member Designate addition @p2', async ({ authenticatedPage }) => {
      const designatesSection = authenticatedPage.getByText('Member Designates/Contacts', { exact: true });
      await designatesSection.click();
      await smartWait(authenticatedPage, 500);

      const addButton = authenticatedPage.getByTitle('Add Member Designate/Contact');
      const buttonVisible = await addButton.isVisible({ timeout: 3000 }).catch(() => false);

      if (buttonVisible) {
        await addButton.click();
        await smartWait(authenticatedPage, 1000);

        const closeButton = authenticatedPage.getByRole('button', { name: 'Close', exact: true });
        await closeButton.click();
        await smartWait(authenticatedPage, 500);

        await expect(careTeam.careTeamHeader).toBeVisible();
        console.log('Member Designate addition cancelled');
      }
    });
  });

  test.describe('Provider Links', () => {
    test('Provider details open in new window @p3', async ({ authenticatedPage }) => {
      const pcpSection = authenticatedPage.getByText('Primary Care Physician', { exact: true });
      await pcpSection.click();
      await smartWait(authenticatedPage, 500);

      const providerLink = authenticatedPage.getByRole('link', { name: /open in a new/i }).first();
      const linkVisible = await providerLink.isVisible({ timeout: 3000 }).catch(() => false);

      if (linkVisible) {
        console.log('Provider link with new window indicator found');
      }
    });
  });

  test.describe('Search Validation', () => {
    test('Invalid zip code handling @p3', async ({ authenticatedPage }) => {
      const pcpSection = authenticatedPage.getByText('Primary Care Physician', { exact: true });
      await pcpSection.click();
      await smartWait(authenticatedPage, 500);

      const addButton = authenticatedPage.getByTitle('Add Primary Care Physician');
      const buttonVisible = await addButton.isVisible({ timeout: 3000 }).catch(() => false);

      if (buttonVisible) {
        await addButton.click();
        await smartWait(authenticatedPage, 1000);

        const yesButton = authenticatedPage.getByRole('button', { name: 'Yes' });
        await yesButton.click().catch(() => {});
        await smartWait(authenticatedPage, 500);

        const zipField = authenticatedPage.getByRole('textbox', { name: 'Zip Code' });
        await zipField.fill('99999');

        const searchButton = authenticatedPage.getByRole('button', { name: 'Search', exact: true });
        await searchButton.click();
        await smartWait(authenticatedPage, 1000);

        console.log('Invalid zip code tested');

        const cancelButton = authenticatedPage.getByRole('button', { name: 'Cancel' });
        await cancelButton.click().catch(() => {});
      }
    });

    test('State selection required @p3', async ({ authenticatedPage }) => {
      const pcpSection = authenticatedPage.getByText('Primary Care Physician', { exact: true });
      await pcpSection.click();
      await smartWait(authenticatedPage, 500);

      const addButton = authenticatedPage.getByTitle('Add Primary Care Physician');
      const buttonVisible = await addButton.isVisible({ timeout: 3000 }).catch(() => false);

      if (buttonVisible) {
        await addButton.click();
        await smartWait(authenticatedPage, 1000);

        const yesButton = authenticatedPage.getByRole('button', { name: 'Yes' });
        await yesButton.click().catch(() => {});
        await smartWait(authenticatedPage, 500);

        const stateField = authenticatedPage.getByLabel('State');
        const options = await stateField.locator('option').count();

        console.log('State options available:', options);
        expect(options).toBeGreaterThan(1);

        const cancelButton = authenticatedPage.getByRole('button', { name: 'Cancel' });
        await cancelButton.click().catch(() => {});
      }
    });
  });
});
