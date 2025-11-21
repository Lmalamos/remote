// ============================================
// REFACTORED: pages/specs/dme.spec.ts
// ============================================
import { test } from '@playwright/test';
import { loginPage } from '../pages/loginPage';
import { navigationPage } from '../pages/navigationPage';
import { DMEPanel } from '../pages/memberHub/dme';
import { TEST_DATA } from '../config/testData';
import { memberSearchPage } from '../pages/memberSearchPage';
//import { getCurrentEnvironment } from '../config/env';

test.describe('DME Panel Tests', () => {
  let login: loginPage;
  let nav: navigationPage;
  let memberSearch: memberSearchPage;
  let dmePanel: DMEPanel;

  test.beforeEach(async ({ page }) => {
    //const env = getCurrentEnvironment();

    login = new loginPage(page);
    nav = new navigationPage(page);
    memberSearch = new memberSearchPage(page);
    dmePanel = new DMEPanel(page);

    //await loginPage.goto(env.baseUrl);
    //await loginPage.login(env.username, env.password);

    await login.goto();
    await login.login(TEST_DATA.credentials.username, TEST_DATA.credentials.password);
    await nav.goToDashboard();
    await nav.openSearchMenu();
    await nav.openMemberSearch();
    await memberSearch.searchMember(TEST_DATA.testMember.client, TEST_DATA.testMember.id);
    await memberSearch.openMemberHub(TEST_DATA.testMember.id);
  });

  test('Add DME by term', async () => {
    // Assuming you navigate to the DME section
    await dmePanel.addDMEByTerm({
      section: 'Enteral and Parenteral Therapy',
      category: 'Enteral Formulae and Enteral Medical Supplies',
      modifier: 'NU - New equipment',
      units: '1',
      unitsQualifier: 'wk',
      frequency: '1',
      frequencyQualifier: '225761000',
      totalPurchaseCost: '6345'
    });
  });

  test('Add DME by code', async () => {
    await dmePanel.addDMEByCode('99590');
    await dmePanel.verifyNoDataAvailable();
  });

  test('Complete DME workflow', async () => {
    await dmePanel.verifyDMEWorkflow('99590');
  });

  test('Expand and close DME panel', async () => {
    await dmePanel.expandPanel();
    await dmePanel.openAddForm();
    await dmePanel.closeForm();
  });
});

// ============================================
// KEY IMPROVEMENTS EXPLAINED
// ============================================

/*
1. ✅ CLASS NAMING: activitiesPanel → DMEPanel (PascalCase)

2. ✅ LOCATOR ORGANIZATION:
   - Grouped by category (header, search, dropdowns, inputs, results)
   - Makes code easier to navigate
   - Better comments showing purpose

3. ✅ RENAMED CONFUSING LOCATORS:
   - modifier → modifierComboBox (clearer it's a dropdown)
   - units → unitsInput (clearer it's an input)
   - frequency → frequencyInput
   - totalPurchaseCost → totalPurchaseCostInput
   - searchByCode → searchByCodeButton

4. ✅ SIMPLIFIED LOCATORS:
   - Removed redundant "Select DME code B4035" radio button
   - Consolidated similar elements
   - More semantic naming

5. ✅ CREATED FOCUSED METHODS:
   - expandPanel() - just expands
   - openAddForm() - just opens
   - selectSection() - just selects section
   - fillUnits() - fills both units AND qualifier
   - etc.

6. ✅ REDUCED DUPLICATION:
   - searchByTerm() handles both button click and radio check
   - fillUnits() handles both input and dropdown
   - No repeated code

7. ✅ CREATED HIGH-LEVEL METHODS:
   - addDMEByTerm() - one call does entire flow
   - addDMEByCode() - complete search by code flow
   - verifyDMEWorkflow() - complete test scenario

8. ✅ ADDED JSDOC COMMENTS:
   - Clear what each method does
   - Shows parameters and what they do
   - Easy to understand without reading code

9. ✅ SEPARATED CONCERNS:
   - Before: verifyDMEData() did everything
   - Now: Each method has single responsibility
   - Can call methods independently or in combination

10. ✅ MADE TESTS CLEANER:
    - Before: Test file didn't exist
    - Now: Tests are readable and maintainable
    - Can easily add more test scenarios

11. ✅ ADDED CONSOLE LOGS:
    - Helps debugging in CI/CD
    - Shows test progress

12. ✅ BETTER WAITING:
    - page.waitForTimeout(300) after interactions
    - Ensures UI updates complete
    - Prevents flaky tests
*/

// ============================================
// HOW TO USE THE REFACTORED CODE
// ============================================

/*
OLD WAY (One method does everything):
--------------------------------------
test('DME test', async () => {
  const dme = new DMEPanel(page);
  await dme.verifyDMEData();
  // ??? What just happened?
});

NEW WAY (Clear, flexible):
---------------------------
test('Add DME by term', async () => {
  const dme = new DMEPanel(page);
  await dme.addDMEByTerm({
    section: 'Enteral and Parenteral Therapy',
    category: 'Enteral Formulae and Enteral Medical Supplies',
    modifier: 'NU - New equipment',
    units: '1',
    unitsQualifier: 'wk',
    frequency: '1',
    frequencyQualifier: '225761000',
    totalPurchaseCost: '6345'
  });
  // Clear what happened!
});

NEW WAY (Complex workflow):
---------------------------
test('Complete workflow', async () => {
  const dme = new DMEPanel(page);
  
  // Step 1: Add by term
  await dme.expandPanel();
  await dme.openAddForm();
  await dme.selectSection('Enteral and Parenteral Therapy');
  await dme.selectCategory('Enteral Formulae and Enteral Medical Supplies');
  // ... etc
  
  // Step 2: Close and reopen
  await dme.closeForm();
  
  // Step 3: Add by code
  await dme.openAddForm();
  await dme.addDMEByCode('99590');
});
*/

// ============================================
// SUMMARY OF CHANGES
// ============================================

/*
BEFORE:
-------
- Class name: dmePanel (lowercase)
- Long list of similar locators
- One huge verifyDMEData() method
- No organization
- Hard to reuse
- Confusing names (modifier, units, frequency)

AFTER:
------
- Class name: DMEPanel (PascalCase) ✓
- Organized locators by category ✓
- Many focused methods ✓
- Easy to understand ✓
- Highly reusable ✓
- Clear, semantic names ✓
- JSDoc comments ✓
- Usage examples ✓
- Separate test file ✓
*/