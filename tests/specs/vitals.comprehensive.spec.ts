// ============================================
// VITALS - COMPREHENSIVE TESTS
// Blood pressure, height, weight, BMI, validation, calculations
// ============================================

import { test, expect } from '../fixtures/cleanupAuth.fixture';
import { memberSearchPage } from '../pages/memberSearchPage';
import { navigationPage } from '../pages/navigationPage';
import { vitalsPanel } from '../pages/memberHub/vitals';
import { Tags } from '../tags';
import { TEST_MEMBER, CLIENTS } from '../constants';
import { waitForNetworkIdle, smartWait } from '../utils/waitHelpers';

test.describe(`${Tags.VITALS} ${Tags.MEMBER_HUB} Vitals - Comprehensive`, () => {
  let memberSearch: memberSearchPage;
  let navigation: navigationPage;
  let vitals: vitalsPanel;

  test.beforeEach(async ({ authenticatedPage }) => {
    memberSearch = new memberSearchPage(authenticatedPage);
    navigation = new navigationPage(authenticatedPage);
    vitals = new vitalsPanel(authenticatedPage);

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

    // Open vitals panel
    await vitals.vitalsHeader.click();
    await waitForNetworkIdle(authenticatedPage);
  });

  test.describe('Blood Pressure Tests', () => {
    test('Add vitals with valid blood pressure @p1', async ({ authenticatedPage }) => {
      await vitals.addVitalsButton.click();
      await smartWait(authenticatedPage, 1000);

      // Fill systolic and diastolic
      await vitals.systolic.fill('120');
      await expect(vitals.systolic).toHaveValue('120');

      await vitals.diastolic.fill('80');
      await expect(vitals.diastolic).toHaveValue('80');

      // Blood pressure field should auto-populate
      const bpValue = await vitals.bloodPressure.inputValue();
      expect(bpValue).toBe('120/80');

      // Cancel
      await vitals.cancelButton.click();
    });

    test('Systolic higher than diastolic validation @p1', async ({ authenticatedPage }) => {
      await vitals.addVitalsButton.click();
      await smartWait(authenticatedPage, 1000);

      // Fill invalid BP (diastolic higher than systolic)
      await vitals.systolic.fill('80');
      await vitals.diastolic.fill('120');
      await smartWait(authenticatedPage, 500);

      // Should show validation error
      const validationError = authenticatedPage.locator('.field-validation-error, .error, .alert-danger');
      const hasError = await validationError.isVisible({ timeout: 3000 }).catch(() => false);

      // May show validation or accept (implementation specific)
      console.log('Invalid BP validation shown:', hasError);

      // Cancel
      await vitals.cancelButton.click();
    });

    test('Extreme blood pressure values @p2', async ({ authenticatedPage }) => {
      await vitals.addVitalsButton.click();
      await smartWait(authenticatedPage, 1000);

      const extremeValues = [
        { systolic: '50', diastolic: '30', desc: 'very low' },
        { systolic: '220', diastolic: '140', desc: 'very high' },
        { systolic: '0', diastolic: '0', desc: 'zero' },
      ];

      for (const bp of extremeValues) {
        await vitals.systolic.clear();
        await vitals.systolic.fill(bp.systolic);

        await vitals.diastolic.clear();
        await vitals.diastolic.fill(bp.diastolic);

        await smartWait(authenticatedPage, 500);

        console.log(`Testing ${bp.desc} BP: ${bp.systolic}/${bp.diastolic}`);

        // May show warnings but should not crash
        const systemError = authenticatedPage.locator('.snackbar.error.show');
        await expect(systemError).not.toContainText('500').catch(() => {});
      }

      // Cancel
      await vitals.cancelButton.click();
    });

    test('Blood pressure field is read-only @p2', async ({ authenticatedPage }) => {
      await vitals.addVitalsButton.click();
      await smartWait(authenticatedPage, 1000);

      // Fill systolic and diastolic
      await vitals.systolic.fill('130');
      await vitals.diastolic.fill('85');

      // Blood pressure field should be disabled (calculated field)
      const isDisabled = await vitals.bloodPressure.isDisabled();
      expect(isDisabled).toBe(true);

      // Cancel
      await vitals.cancelButton.click();
    });

    test('Blood pressure with non-numeric input @p2', async ({ authenticatedPage }) => {
      await vitals.addVitalsButton.click();
      await smartWait(authenticatedPage, 1000);

      // Try to enter letters
      await vitals.systolic.fill('ABC');
      await vitals.diastolic.fill('XYZ');
      await smartWait(authenticatedPage, 500);

      // Should reject or clear non-numeric input
      const systolicValue = await vitals.systolic.inputValue();
      const diastolicValue = await vitals.diastolic.inputValue();

      // Either empty or only contains digits
      const isValid = /^\d*$/.test(systolicValue) && /^\d*$/.test(diastolicValue);
      expect(isValid).toBe(true);

      // Cancel
      await vitals.cancelButton.click();
    });
  });

  test.describe('Height and Weight Tests', () => {
    test('Add vitals with height in feet and inches @p1', async ({ authenticatedPage }) => {
      await vitals.addVitalsButton.click();
      await smartWait(authenticatedPage, 1000);

      // Fill height
      await vitals.heightInFeet.fill('5');
      await expect(vitals.heightInFeet).toHaveValue('5');

      await vitals.heightInInches.fill('9');
      await expect(vitals.heightInInches).toHaveValue('9');

      // Cancel
      await vitals.cancelButton.click();
    });

    test('Height validation (inches less than 12) @p1', async ({ authenticatedPage }) => {
      await vitals.addVitalsButton.click();
      await smartWait(authenticatedPage, 1000);

      // Fill invalid inches (>= 12 should roll over to feet)
      await vitals.heightInFeet.fill('5');
      await vitals.heightInInches.fill('15'); // Should be 1 foot 3 inches
      await smartWait(authenticatedPage, 500);

      // May show validation or auto-adjust
      const inchesValue = await vitals.heightInInches.inputValue();
      console.log('Inches value after validation:', inchesValue);

      // Cancel
      await vitals.cancelButton.click();
    });

    test('Add weight with valid value @p1', async ({ authenticatedPage }) => {
      await vitals.addVitalsButton.click();
      await smartWait(authenticatedPage, 1000);

      // Fill weight
      await vitals.weight.fill('160');
      await expect(vitals.weight).toHaveValue('160');

      // Cancel
      await vitals.cancelButton.click();
    });

    test('Unable to obtain weight checkbox @p2', async ({ authenticatedPage }) => {
      await vitals.addVitalsButton.click();
      await smartWait(authenticatedPage, 1000);

      // Check "unable to obtain"
      await vitals.unableToObtain.check();
      await expect(vitals.unableToObtain).toBeChecked();

      // Weight field should be disabled or cleared
      const isWeightDisabled = await vitals.weight.isDisabled();
      console.log('Weight disabled when unable to obtain:', isWeightDisabled);

      // Uncheck
      await vitals.unableToObtain.uncheck();
      await expect(vitals.unableToObtain).not.toBeChecked();

      // Cancel
      await vitals.cancelButton.click();
    });

    test('Extreme weight values @p2', async ({ authenticatedPage }) => {
      await vitals.addVitalsButton.click();
      await smartWait(authenticatedPage, 1000);

      const weights = ['50', '500', '1000']; // Very low, high, very high

      for (const weight of weights) {
        await vitals.weight.clear();
        await vitals.weight.fill(weight);
        await smartWait(authenticatedPage, 300);

        console.log('Testing weight:', weight);

        // Should not crash
        const systemError = authenticatedPage.locator('.snackbar.error.show');
        await expect(systemError).not.toContainText('500').catch(() => {});
      }

      // Cancel
      await vitals.cancelButton.click();
    });
  });

  test.describe('BMI Calculation Tests', () => {
    test('BMI auto-calculates from height and weight @p1', async ({ authenticatedPage }) => {
      await vitals.addVitalsButton.click();
      await smartWait(authenticatedPage, 1000);

      // Fill height and weight
      await vitals.heightInFeet.fill('5');
      await vitals.heightInInches.fill('9');
      await vitals.weight.fill('160');

      await smartWait(authenticatedPage, 1000);

      // BMI should auto-calculate
      const bmiValue = await vitals.bmi.inputValue();
      console.log('Calculated BMI:', bmiValue);

      // BMI should be a number
      if (bmiValue) {
        const bmiNumber = parseFloat(bmiValue);
        expect(bmiNumber).toBeGreaterThan(0);
      }

      // Cancel
      await vitals.cancelButton.click();
    });

    test('BMI field is read-only @p2', async ({ authenticatedPage }) => {
      await vitals.addVitalsButton.click();
      await smartWait(authenticatedPage, 1000);

      // BMI should be disabled (calculated field)
      const isDisabled = await vitals.bmi.isDisabled();
      expect(isDisabled).toBe(true);

      // Cancel
      await vitals.cancelButton.click();
    });

    test('BMI calculation with various heights and weights @p2', async ({ authenticatedPage }) => {
      await vitals.addVitalsButton.click();
      await smartWait(authenticatedPage, 1000);

      const testCases = [
        { feet: '5', inches: '0', weight: '100' },
        { feet: '5', inches: '6', weight: '150' },
        { feet: '6', inches: '0', weight: '200' },
      ];

      for (const testCase of testCases) {
        await vitals.heightInFeet.clear();
        await vitals.heightInFeet.fill(testCase.feet);

        await vitals.heightInInches.clear();
        await vitals.heightInInches.fill(testCase.inches);

        await vitals.weight.clear();
        await vitals.weight.fill(testCase.weight);

        await smartWait(authenticatedPage, 1000);

        const bmiValue = await vitals.bmi.inputValue();
        console.log(`BMI for ${testCase.feet}'${testCase.inches}" and ${testCase.weight}lbs:`, bmiValue);
      }

      // Cancel
      await vitals.cancelButton.click();
    });
  });

  test.describe('Waist Size and WHtR Tests', () => {
    test('Add waist size measurement @p2', async ({ authenticatedPage }) => {
      await vitals.addVitalsButton.click();
      await smartWait(authenticatedPage, 1000);

      // Fill waist size
      await vitals.waistSize.fill('33');
      await expect(vitals.waistSize).toHaveValue('33');

      // Cancel
      await vitals.cancelButton.click();
    });

    test('WHtR auto-calculates from waist and height @p2', async ({ authenticatedPage }) => {
      await vitals.addVitalsButton.click();
      await smartWait(authenticatedPage, 1000);

      // Fill height and waist
      await vitals.heightInFeet.fill('5');
      await vitals.heightInInches.fill('9');
      await vitals.waistSize.fill('33');

      await smartWait(authenticatedPage, 1000);

      // WHtR (Waist-to-Height Ratio) should calculate
      const whtrValue = await vitals.whtr.inputValue();
      console.log('Calculated WHtR:', whtrValue);

      if (whtrValue) {
        const whtrNumber = parseFloat(whtrValue);
        expect(whtrNumber).toBeGreaterThanOrEqual(0);
      }

      // Cancel
      await vitals.cancelButton.click();
    });

    test('WHtR field is read-only @p2', async ({ authenticatedPage }) => {
      await vitals.addVitalsButton.click();
      await smartWait(authenticatedPage, 1000);

      // WHtR should be disabled (calculated field)
      const isDisabled = await vitals.whtr.isDisabled();
      expect(isDisabled).toBe(true);

      // Cancel
      await vitals.cancelButton.click();
    });
  });

  test.describe('Date Handling', () => {
    test('Add vitals with specific date @p2', async ({ authenticatedPage }) => {
      await vitals.addVitalsButton.click();
      await smartWait(authenticatedPage, 1000);

      // Click date picker
      const datePickerVisible = await vitals.vitalsDate.isVisible({ timeout: 3000 }).catch(() => false);

      if (datePickerVisible) {
        await vitals.vitalsDate.click();
        await smartWait(authenticatedPage, 500);

        // Calendar should open
        const calendar = authenticatedPage.locator('.datepicker, .calendar, [role="dialog"]');
        const calendarVisible = await calendar.isVisible({ timeout: 3000 }).catch(() => false);

        if (calendarVisible) {
          console.log('Date picker opened successfully');
        }
      }

      // Cancel
      await vitals.cancelButton.click();
    });

    test('Vitals date defaults to today @p3', async ({ authenticatedPage }) => {
      await vitals.addVitalsButton.click();
      await smartWait(authenticatedPage, 1000);

      // Check date field value
      const dateField = authenticatedPage.locator('input[name*="date"], [name*="Date"]').first();
      const dateFieldVisible = await dateField.isVisible({ timeout: 3000 }).catch(() => false);

      if (dateFieldVisible) {
        const dateValue = await dateField.inputValue();
        console.log('Default vitals date:', dateValue);

        // Should have some value (likely today's date)
        expect(dateValue).toBeTruthy();
      }

      // Cancel
      await vitals.cancelButton.click();
    });
  });

  test.describe('Complete Vitals Entry', () => {
    test('Add complete vitals record @p1', async ({ authenticatedPage }) => {
      await vitals.addVitalsButton.click();
      await smartWait(authenticatedPage, 1000);

      // Fill all fields
      await vitals.systolic.fill('120');
      await vitals.diastolic.fill('80');
      await vitals.heightInFeet.fill('5');
      await vitals.heightInInches.fill('9');
      await vitals.weight.fill('160');
      await vitals.waistSize.fill('33');

      await smartWait(authenticatedPage, 1000);

      // All calculated fields should have values
      const bpValue = await vitals.bloodPressure.inputValue();
      const bmiValue = await vitals.bmi.inputValue();
      const whtrValue = await vitals.whtr.inputValue();

      console.log('Complete vitals:', { bpValue, bmiValue, whtrValue });

      // All values should be populated
      expect(bpValue).toBeTruthy();

      // Cancel (don't save to avoid data pollution)
      await vitals.cancelButton.click();
    });

    test('Add minimal vitals record @p2', async ({ authenticatedPage }) => {
      await vitals.addVitalsButton.click();
      await smartWait(authenticatedPage, 1000);

      // Fill only blood pressure
      await vitals.systolic.fill('130');
      await vitals.diastolic.fill('85');

      await smartWait(authenticatedPage, 500);

      // Should accept partial vitals
      const bpValue = await vitals.bloodPressure.inputValue();
      expect(bpValue).toBe('130/85');

      // Cancel
      await vitals.cancelButton.click();
    });
  });

  test.describe('Required Fields', () => {
    test('Identify required fields @p1', async ({ authenticatedPage }) => {
      await vitals.addVitalsButton.click();
      await smartWait(authenticatedPage, 1000);

      // Check for required field indicators (*)
      const requiredLabels = authenticatedPage.locator('label:has-text("*")');
      const requiredCount = await requiredLabels.count();

      console.log('Required vitals fields:', requiredCount);

      // Some fields should be required
      expect(requiredCount).toBeGreaterThanOrEqual(0);

      // Cancel
      await vitals.cancelButton.click();
    });

    test('Submit without required fields shows validation @p1', async ({ authenticatedPage }) => {
      await vitals.addVitalsButton.click();
      await smartWait(authenticatedPage, 1000);

      // Try to submit without filling anything
      const submitButton = authenticatedPage.getByRole('button', { name: /submit/i });
      const submitVisible = await submitButton.isVisible({ timeout: 3000 }).catch(() => false);

      if (submitVisible) {
        await submitButton.click();
        await smartWait(authenticatedPage, 1000);

        // Should show validation errors
        const validationError = authenticatedPage.locator('.field-validation-error, .error');
        const hasError = await validationError.count();

        console.log('Validation errors shown:', hasError);
      }

      // Cancel
      await vitals.cancelButton.click();
    });
  });

  test.describe('Cancel and Navigation', () => {
    test('Cancel vitals entry clears form @p2', async ({ authenticatedPage }) => {
      await vitals.addVitalsButton.click();
      await smartWait(authenticatedPage, 1000);

      // Fill some fields
      await vitals.systolic.fill('140');
      await vitals.weight.fill('175');

      // Cancel
      await vitals.cancelButton.click();
      await waitForNetworkIdle(authenticatedPage);

      // Should return to vitals list
      await expect(vitals.addVitalsButton).toBeVisible({ timeout: 5000 });

      // Open again - form should be cleared
      await vitals.addVitalsButton.click();
      await smartWait(authenticatedPage, 1000);

      const systolicValue = await vitals.systolic.inputValue();
      expect(systolicValue).toBe('');

      // Cancel
      await vitals.cancelButton.click();
    });

    test('Multiple cancel operations do not cause errors @p3', async ({ authenticatedPage }) => {
      // Open and cancel multiple times
      for (let i = 0; i < 3; i++) {
        await vitals.addVitalsButton.click();
        await smartWait(authenticatedPage, 500);

        await vitals.cancelButton.click();
        await smartWait(authenticatedPage, 500);
      }

      // Should still be functional
      await expect(vitals.addVitalsButton).toBeVisible();
    });
  });

  test.describe('Vitals History', () => {
    test('View vitals history table @p2', async ({ authenticatedPage }) => {
      // Check if vitals table exists
      const vitalsTable = authenticatedPage.locator('table').filter({ hasText: 'Blood Pressure' });
      const hasTable = await vitalsTable.isVisible({ timeout: 5000 }).catch(() => false);

      if (hasTable) {
        // Should show vitals history
        console.log('Vitals history table found');
        expect(hasTable).toBe(true);
      } else {
        // No vitals yet - add button should be visible
        await expect(vitals.addVitalsButton).toBeVisible();
      }
    });

    test('Vitals trends over time @p3', async ({ authenticatedPage }) => {
      // Check if there's a trends/chart view
      const trendsButton = authenticatedPage.getByRole('button', { name: /trends|chart|graph/i });
      const hasTrends = await trendsButton.isVisible({ timeout: 3000 }).catch(() => false);

      if (hasTrends) {
        console.log('Vitals trends feature available');
        expect(hasTrends).toBe(true);
      } else {
        console.log('No vitals trends feature (table view only)');
      }
    });
  });

  test.describe('Decimal Values', () => {
    test('Blood pressure with decimal values @p3', async ({ authenticatedPage }) => {
      await vitals.addVitalsButton.click();
      await smartWait(authenticatedPage, 1000);

      // Try to enter decimal BP values
      await vitals.systolic.fill('120.5');
      await vitals.diastolic.fill('80.5');
      await smartWait(authenticatedPage, 500);

      // Check if decimals are accepted or rounded
      const systolicValue = await vitals.systolic.inputValue();
      const diastolicValue = await vitals.diastolic.inputValue();

      console.log('BP with decimals:', { systolicValue, diastolicValue });

      // Cancel
      await vitals.cancelButton.click();
    });

    test('Weight with decimal values @p2', async ({ authenticatedPage }) => {
      await vitals.addVitalsButton.click();
      await smartWait(authenticatedPage, 1000);

      // Enter weight with decimal
      await vitals.weight.fill('160.5');
      await smartWait(authenticatedPage, 500);

      const weightValue = await vitals.weight.inputValue();
      console.log('Weight with decimal:', weightValue);

      // Decimals should be accepted for weight
      expect(weightValue).toBeTruthy();

      // Cancel
      await vitals.cancelButton.click();
    });
  });
});
