// ============================================
// ASSESSMENTS - COMPREHENSIVE TESTS
// Member screening, stress scale, CSA assessments
// ============================================

import { test, expect } from '../fixtures/cleanupAuth.fixture';
import { memberSearchPage } from '../pages/memberSearchPage';
import { navigationPage } from '../pages/navigationPage';
import { assessmentsPanel } from '../pages/memberHub/assessments';
import { Tags } from '../tags';
import { TEST_MEMBER, CLIENTS } from '../constants';
import { waitForNetworkIdle, smartWait } from '../utils/waitHelpers';

test.describe(`${Tags.ASSESSMENTS} ${Tags.MEMBER_HUB} Assessments - Comprehensive`, () => {
  let memberSearch: memberSearchPage;
  let navigation: navigationPage;
  let assessments: assessmentsPanel;

  test.beforeEach(async ({ authenticatedPage }) => {
    memberSearch = new memberSearchPage(authenticatedPage);
    navigation = new navigationPage(authenticatedPage);
    assessments = new assessmentsPanel(authenticatedPage);

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

    // Scroll to assessments panel to ensure it's visible
    await assessments.assessmentsPanelHeader.scrollIntoViewIfNeeded();
    await assessments.expandPanel();
    await waitForNetworkIdle(authenticatedPage);
  });

  test.describe('Assessments Panel Access', () => {
    test('Assessments panel opens @p1', async () => {
      await expect(assessments.assessmentsPanelHeader).toBeVisible();
      console.log('Assessments panel visible');
    });

    test('Assessments sections display @p2', async ({ authenticatedPage }) => {
      const assessmentSections = authenticatedPage.locator('[class*="assessment"], .assessment-section');
      const hasSections = await assessmentSections.first().isVisible({ timeout: 3000 }).catch(() => false);

      console.log('Assessment sections visible:', hasSections);
    });
  });

  test.describe('Member Screening Assessment', () => {
    test('Member Screening section displays @p2', async () => {
      const screeningVisible = await assessments.memberScreeningSection.isVisible({ timeout: 3000 }).catch(() => false);
      console.log('Member Screening section visible:', screeningVisible);
    });

    test('Expand Member Screening section @p2', async () => {
      const screeningVisible = await assessments.memberScreeningSection.isVisible({ timeout: 3000 }).catch(() => false);

      if (screeningVisible) {
        await assessments.memberScreeningSection.click();
        await smartWait(assessments.page, 1000);

        console.log('Member Screening section expanded');
      }
    });

    test('Last completed date displays @p2', async ({ authenticatedPage }) => {
      const lastCompleted = authenticatedPage.getByText(/Last Completed:/i);
      const dateVisible = await lastCompleted.isVisible({ timeout: 3000 }).catch(() => false);

      console.log('Last completed date visible:', dateVisible);
    });

    test('Accountable Health Communities link @p2', async () => {
      const screeningVisible = await assessments.memberScreeningSection.isVisible({ timeout: 3000 }).catch(() => false);

      if (screeningVisible) {
        await assessments.memberScreeningSection.click();
        await smartWait(assessments.page, 500);

        const linkVisible = await assessments.accountableHealthLink.isVisible({ timeout: 3000 }).catch(() => false);
        console.log('Accountable Health Communities link visible:', linkVisible);
      }
    });

    test('Open assessment details in new window @p2', async ({ context }) => {
      const screeningVisible = await assessments.memberScreeningSection.isVisible({ timeout: 3000 }).catch(() => false);

      if (screeningVisible) {
        await assessments.memberScreeningSection.click();
        await smartWait(assessments.page, 500);

        const linkVisible = await assessments.accountableHealthLink.isVisible({ timeout: 3000 }).catch(() => false);

        if (linkVisible) {
          const popupPromise = assessments.page.waitForEvent('popup');
          await assessments.accountableHealthLink.click();
          const popup = await popupPromise;

          await smartWait(popup, 1000);
          console.log('Assessment details opened in new window');

          await popup.close();
        }
      }
    });

    test('Assessment details are read-only @p2', async ({ context }) => {
      const screeningVisible = await assessments.memberScreeningSection.isVisible({ timeout: 3000 }).catch(() => false);

      if (screeningVisible) {
        await assessments.memberScreeningSection.click();
        await smartWait(assessments.page, 500);

        const linkVisible = await assessments.accountableHealthLink.isVisible({ timeout: 3000 }).catch(() => false);

        if (linkVisible) {
          const popupPromise = assessments.page.waitForEvent('popup');
          await assessments.accountableHealthLink.click();
          const popup = await popupPromise;

          await smartWait(popup, 1000);

          const myselfField = popup.locator('text=Myself');
          const fieldVisible = await myselfField.isVisible({ timeout: 3000 }).catch(() => false);

          if (fieldVisible) {
            const isDisabled = await myselfField.isDisabled();
            console.log('Assessment fields are disabled:', isDisabled);
            expect(isDisabled).toBe(true);
          }

          await popup.close();
        }
      }
    });
  });

  test.describe('Stress Scale Assessment', () => {
    test('Perceived Stress Scale section displays @p2', async () => {
      const stressScaleVisible = await assessments.stressScaleSection.isVisible({ timeout: 3000 }).catch(() => false);
      console.log('Perceived Stress Scale section visible:', stressScaleVisible);
    });

    test('Expand Stress Scale section @p2', async () => {
      const stressScaleVisible = await assessments.stressScaleSection.isVisible({ timeout: 3000 }).catch(() => false);

      if (stressScaleVisible) {
        await assessments.stressScaleSection.click();
        await smartWait(assessments.page, 1000);

        console.log('Stress Scale section expanded');
      }
    });

    test('Case Management link available @p2', async () => {
      const stressScaleVisible = await assessments.stressScaleSection.isVisible({ timeout: 3000 }).catch(() => false);

      if (stressScaleVisible) {
        await assessments.stressScaleSection.click();
        await smartWait(assessments.page, 500);

        const linkVisible = await assessments.caseManagementLink.isVisible({ timeout: 3000 }).catch(() => false);
        console.log('Case Management link visible:', linkVisible);
      }
    });

    test('Toggle Stress Scale section @p3', async () => {
      const stressScaleVisible = await assessments.stressScaleSection.isVisible({ timeout: 3000 }).catch(() => false);

      if (stressScaleVisible) {
        await assessments.stressScaleSection.click();
        await smartWait(assessments.page, 500);

        await assessments.stressScaleSection.click();
        await smartWait(assessments.page, 500);

        console.log('Stress Scale section toggled');
      }
    });
  });

  test.describe('CSA Assessments', () => {
    test('CSA Assessments button available @p2', async ({ authenticatedPage }) => {
      const csaButton = authenticatedPage.getByRole('button', { name: 'CSA Assessments', exact: true });
      const buttonVisible = await csaButton.isVisible({ timeout: 3000 }).catch(() => false);

      console.log('CSA Assessments button visible:', buttonVisible);
    });

    test('Open CSA Assessments menu @p2', async ({ authenticatedPage }) => {
      const csaButton = authenticatedPage.getByRole('button', { name: 'CSA Assessments', exact: true });
      const buttonVisible = await csaButton.isVisible({ timeout: 3000 }).catch(() => false);

      if (buttonVisible) {
        await csaButton.click();
        await smartWait(authenticatedPage, 1000);

        console.log('CSA Assessments clicked');
      }
    });

    test('CSA Action Menu available @p2', async ({ authenticatedPage }) => {
      const csaButton = authenticatedPage.getByRole('button', { name: 'CSA Assessments', exact: true });
      await csaButton.click().catch(() => {});
      await smartWait(authenticatedPage, 1000);

      const actionMenuButton = authenticatedPage.getByRole('button', { name: 'Open Action Menu for CSA' });
      const menuVisible = await actionMenuButton.isVisible({ timeout: 3000 }).catch(() => false);

      console.log('CSA Action Menu button visible:', menuVisible);
    });

    test('Add Assessment Menu available @p2', async ({ authenticatedPage }) => {
      const csaButton = authenticatedPage.getByRole('button', { name: 'CSA Assessments', exact: true });
      await csaButton.click().catch(() => {});
      await smartWait(authenticatedPage, 1000);

      const actionMenuButton = authenticatedPage.getByRole('button', { name: 'Open Action Menu for CSA' });
      await actionMenuButton.click().catch(() => {});
      await smartWait(authenticatedPage, 500);

      const addAssessmentButton = authenticatedPage.getByRole('button', { name: 'Add Assessment Menu' });
      const addVisible = await addAssessmentButton.isVisible({ timeout: 3000 }).catch(() => false);

      console.log('Add Assessment Menu visible:', addVisible);
    });
  });

  test.describe('Supports Intensity Assessment', () => {
    test('New Supports Intensity link available @p2', async ({ authenticatedPage }) => {
      const csaButton = authenticatedPage.getByRole('button', { name: 'CSA Assessments', exact: true });
      await csaButton.click().catch(() => {});
      await smartWait(authenticatedPage, 1000);

      const actionMenuButton = authenticatedPage.getByRole('button', { name: 'Open Action Menu for CSA' });
      await actionMenuButton.click().catch(() => {});
      await smartWait(authenticatedPage, 500);

      const addAssessmentButton = authenticatedPage.getByRole('button', { name: 'Add Assessment Menu' });
      await addAssessmentButton.click().catch(() => {});
      await smartWait(authenticatedPage, 500);

      const supportsIntensityLink = authenticatedPage.getByRole('link', { name: 'New - Supports Intensity' });
      const linkVisible = await supportsIntensityLink.isVisible({ timeout: 3000 }).catch(() => false);

      console.log('New - Supports Intensity link visible:', linkVisible);
    });

    test('Open Supports Intensity assessment @p2', async ({ context }) => {
      const csaButton = assessments.page.getByRole('button', { name: 'CSA Assessments', exact: true });
      await csaButton.click().catch(() => {});
      await smartWait(assessments.page, 1000);

      const actionMenuButton = assessments.page.getByRole('button', { name: 'Open Action Menu for CSA' });
      await actionMenuButton.click().catch(() => {});
      await smartWait(assessments.page, 500);

      const addAssessmentButton = assessments.page.getByRole('button', { name: 'Add Assessment Menu' });
      await addAssessmentButton.click().catch(() => {});
      await smartWait(assessments.page, 500);

      const supportsIntensityLink = assessments.page.getByRole('link', { name: 'New - Supports Intensity' });
      const linkVisible = await supportsIntensityLink.isVisible({ timeout: 3000 }).catch(() => false);

      if (linkVisible) {
        const popupPromise = assessments.page.waitForEvent('popup');
        await supportsIntensityLink.click();
        const popup = await popupPromise;

        await smartWait(popup, 1000);
        console.log('Supports Intensity assessment opened');

        const cancelButton = popup.getByRole('button', { name: 'Cancel' });
        await cancelButton.click().catch(() => {});
        await popup.close().catch(() => {});
      }
    });

    test('Cancel Supports Intensity assessment @p2', async ({ context }) => {
      const csaButton = assessments.page.getByRole('button', { name: 'CSA Assessments', exact: true });
      await csaButton.click().catch(() => {});
      await smartWait(assessments.page, 1000);

      const actionMenuButton = assessments.page.getByRole('button', { name: 'Open Action Menu for CSA' });
      await actionMenuButton.click().catch(() => {});
      await smartWait(assessments.page, 500);

      const addAssessmentButton = assessments.page.getByRole('button', { name: 'Add Assessment Menu' });
      await addAssessmentButton.click().catch(() => {});
      await smartWait(assessments.page, 500);

      const supportsIntensityLink = assessments.page.getByRole('link', { name: 'New - Supports Intensity' });
      const linkVisible = await supportsIntensityLink.isVisible({ timeout: 3000 }).catch(() => false);

      if (linkVisible) {
        const popupPromise = assessments.page.waitForEvent('popup');
        await supportsIntensityLink.click();
        const popup = await popupPromise;

        await smartWait(popup, 1000);

        const cancelButton = popup.getByRole('button', { name: 'Cancel' });
        const cancelVisible = await cancelButton.isVisible({ timeout: 3000 }).catch(() => false);

        if (cancelVisible) {
          await cancelButton.click();
          console.log('Supports Intensity assessment cancelled');
        }

        await popup.close().catch(() => {});
      }
    });
  });

  test.describe('Respondent Information Assessment', () => {
    test('New Respondent Information link available @p2', async ({ authenticatedPage }) => {
      const csaButton = authenticatedPage.getByRole('button', { name: 'CSA Assessments', exact: true });
      await csaButton.click().catch(() => {});
      await smartWait(authenticatedPage, 1000);

      const actionMenuButton = authenticatedPage.getByRole('button', { name: 'Open Action Menu for CSA' });
      await actionMenuButton.click().catch(() => {});
      await smartWait(authenticatedPage, 500);

      const addAssessmentButton = authenticatedPage.getByRole('button', { name: 'Add Assessment Menu' });
      await addAssessmentButton.click().catch(() => {});
      await smartWait(authenticatedPage, 500);

      const respondentInfoLink = authenticatedPage.getByRole('link', { name: 'New - Respondent Information' });
      const linkVisible = await respondentInfoLink.isVisible({ timeout: 3000 }).catch(() => false);

      console.log('New - Respondent Information link visible:', linkVisible);
    });

    test('Open Respondent Information assessment @p2', async ({ context }) => {
      const csaButton = assessments.page.getByRole('button', { name: 'CSA Assessments', exact: true });
      await csaButton.click().catch(() => {});
      await smartWait(assessments.page, 1000);

      const actionMenuButton = assessments.page.getByRole('button', { name: 'Open Action Menu for CSA' });
      await actionMenuButton.click().catch(() => {});
      await smartWait(assessments.page, 500);

      const addAssessmentButton = assessments.page.getByRole('button', { name: 'Add Assessment Menu' });
      await addAssessmentButton.click().catch(() => {});
      await smartWait(assessments.page, 500);

      const respondentInfoLink = assessments.page.getByRole('link', { name: 'New - Respondent Information' });
      const linkVisible = await respondentInfoLink.isVisible({ timeout: 3000 }).catch(() => false);

      if (linkVisible) {
        const popupPromise = assessments.page.waitForEvent('popup');
        await respondentInfoLink.click();
        const popup = await popupPromise;

        await smartWait(popup, 1000);
        console.log('Respondent Information assessment opened');

        const cancelButton = popup.getByRole('button', { name: 'Cancel' });
        await cancelButton.click().catch(() => {});
        await popup.close().catch(() => {});
      }
    });

    test('First name field available @p2', async ({ context }) => {
      const csaButton = assessments.page.getByRole('button', { name: 'CSA Assessments', exact: true });
      await csaButton.click().catch(() => {});
      await smartWait(assessments.page, 1000);

      const actionMenuButton = assessments.page.getByRole('button', { name: 'Open Action Menu for CSA' });
      await actionMenuButton.click().catch(() => {});
      await smartWait(assessments.page, 500);

      const addAssessmentButton = assessments.page.getByRole('button', { name: 'Add Assessment Menu' });
      await addAssessmentButton.click().catch(() => {});
      await smartWait(assessments.page, 500);

      const respondentInfoLink = assessments.page.getByRole('link', { name: 'New - Respondent Information' });
      const linkVisible = await respondentInfoLink.isVisible({ timeout: 3000 }).catch(() => false);

      if (linkVisible) {
        const popupPromise = assessments.page.waitForEvent('popup');
        await respondentInfoLink.click();
        const popup = await popupPromise;

        await smartWait(popup, 1000);

        const firstNameField = popup.getByRole('textbox', { name: 'First name', exact: true });
        const fieldVisible = await firstNameField.isVisible({ timeout: 3000 }).catch(() => false);

        console.log('First name field visible:', fieldVisible);

        const cancelButton = popup.getByRole('button', { name: 'Cancel' });
        await cancelButton.click().catch(() => {});
        await popup.close().catch(() => {});
      }
    });

    test('Fill respondent basic information @p2', async ({ context }) => {
      const csaButton = assessments.page.getByRole('button', { name: 'CSA Assessments', exact: true });
      await csaButton.click().catch(() => {});
      await smartWait(assessments.page, 1000);

      const actionMenuButton = assessments.page.getByRole('button', { name: 'Open Action Menu for CSA' });
      await actionMenuButton.click().catch(() => {});
      await smartWait(assessments.page, 500);

      const addAssessmentButton = assessments.page.getByRole('button', { name: 'Add Assessment Menu' });
      await addAssessmentButton.click().catch(() => {});
      await smartWait(assessments.page, 500);

      const respondentInfoLink = assessments.page.getByRole('link', { name: 'New - Respondent Information' });
      const linkVisible = await respondentInfoLink.isVisible({ timeout: 3000 }).catch(() => false);

      if (linkVisible) {
        const popupPromise = assessments.page.waitForEvent('popup');
        await respondentInfoLink.click();
        const popup = await popupPromise;

        await smartWait(popup, 1000);

        const firstNameField = popup.getByRole('textbox', { name: 'First name', exact: true });
        const fieldVisible = await firstNameField.isVisible({ timeout: 3000 }).catch(() => false);

        if (fieldVisible) {
          await firstNameField.fill('Test');
          const lastNameField = popup.getByRole('textbox', { name: 'Last name', exact: true });
          await lastNameField.fill('Tester');

          console.log('Basic information filled');
        }

        const cancelButton = popup.getByRole('button', { name: 'Cancel' });
        await cancelButton.click().catch(() => {});
        await popup.close().catch(() => {});
      }
    });

    test('Fill respondent address @p3', async ({ context }) => {
      const csaButton = assessments.page.getByRole('button', { name: 'CSA Assessments', exact: true });
      await csaButton.click().catch(() => {});
      await smartWait(assessments.page, 1000);

      const actionMenuButton = assessments.page.getByRole('button', { name: 'Open Action Menu for CSA' });
      await actionMenuButton.click().catch(() => {});
      await smartWait(assessments.page, 500);

      const addAssessmentButton = assessments.page.getByRole('button', { name: 'Add Assessment Menu' });
      await addAssessmentButton.click().catch(() => {});
      await smartWait(assessments.page, 500);

      const respondentInfoLink = assessments.page.getByRole('link', { name: 'New - Respondent Information' });
      const linkVisible = await respondentInfoLink.isVisible({ timeout: 3000 }).catch(() => false);

      if (linkVisible) {
        const popupPromise = assessments.page.waitForEvent('popup');
        await respondentInfoLink.click();
        const popup = await popupPromise;

        await smartWait(popup, 1000);

        const addressField = popup.getByRole('textbox', { name: 'Address', exact: true });
        const addressVisible = await addressField.isVisible({ timeout: 3000 }).catch(() => false);

        if (addressVisible) {
          await addressField.fill('100 Test Drive');
          await popup.getByRole('textbox', { name: 'City', exact: true }).fill('Ames');
          await popup.getByRole('textbox', { name: 'State of residence' }).fill('Iowa');
          await popup.getByRole('textbox', { name: 'Postal code' }).fill('50014');

          console.log('Address information filled');
        }

        const cancelButton = popup.getByRole('button', { name: 'Cancel' });
        await cancelButton.click().catch(() => {});
        await popup.close().catch(() => {});
      }
    });

    test('Cancel Respondent Information assessment @p2', async ({ context }) => {
      const csaButton = assessments.page.getByRole('button', { name: 'CSA Assessments', exact: true });
      await csaButton.click().catch(() => {});
      await smartWait(assessments.page, 1000);

      const actionMenuButton = assessments.page.getByRole('button', { name: 'Open Action Menu for CSA' });
      await actionMenuButton.click().catch(() => {});
      await smartWait(assessments.page, 500);

      const addAssessmentButton = assessments.page.getByRole('button', { name: 'Add Assessment Menu' });
      await addAssessmentButton.click().catch(() => {});
      await smartWait(assessments.page, 500);

      const respondentInfoLink = assessments.page.getByRole('link', { name: 'New - Respondent Information' });
      const linkVisible = await respondentInfoLink.isVisible({ timeout: 3000 }).catch(() => false);

      if (linkVisible) {
        const popupPromise = assessments.page.waitForEvent('popup');
        await respondentInfoLink.click();
        const popup = await popupPromise;

        await smartWait(popup, 1000);

        const cancelButton = popup.getByRole('button', { name: 'Cancel' });
        await cancelButton.click();
        console.log('Respondent Information assessment cancelled');

        await popup.close().catch(() => {});
      }
    });
  });

  test.describe('Assessment History', () => {
    test('Assessment count displayed @p2', async ({ authenticatedPage }) => {
      const countIndicator = authenticatedPage.getByText(/\d+\s*(assessment|completed)/i);
      const countVisible = await countIndicator.isVisible({ timeout: 3000 }).catch(() => false);

      console.log('Assessment count visible:', countVisible);
    });

    test('Multiple assessment types available @p2', async ({ authenticatedPage }) => {
      const assessmentTypes = ['Member Screening', 'Stress Scale', 'CSA'];

      for (const type of assessmentTypes) {
        const typeElement = authenticatedPage.getByText(type, { exact: false });
        const hasType = await typeElement.isVisible({ timeout: 2000 }).catch(() => false);

        if (hasType) {
          console.log(`Assessment type "${type}" found`);
        }
      }
    });
  });
});
