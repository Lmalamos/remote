# Remaining Issues - Analysis & Fixes Needed

## Issue #1: Allergy Search Results Not Appearing

### Root Cause
After clicking the search button, tests timeout waiting for radio button with name `'Select (SNOMED)'`.

**Current Selector** (line 34 in allergies.ts):
```typescript
this.newAllergyResult = page.getByRole('radio', { name: 'Select (SNOMED)' });
```

### Problems
1. ❌ Selector is too specific - may not match actual radio button labels
2. ❌ No wait for search results to load after clicking search
3. ❌ May need to wait for network response

### Fixes Needed

#### Fix 1A: Update Radio Button Selector
**Location**: `tests/pages/memberHub/allergies.ts:34`

```typescript
// Option 1: Use first radio button in results
this.newAllergyResult = page.locator('input[type="radio"]').first();

// OR Option 2: More flexible name match
this.newAllergyResult = page.getByRole('radio').first();

// OR Option 3: Use table/container locator
this.newAllergyResult = page.locator('#allergySearchResults input[type="radio"]').first();
```

#### Fix 1B: Add Wait for Results
**Location**: `tests/specs/allergies.comprehensive.spec.ts` - after search button click

```typescript
// After line 52-53:
await allergies.searchButton.click();
await waitForNetworkIdle(authenticatedPage);

// ADD:
await authenticatedPage.waitForSelector('input[type="radio"]', { timeout: 10000 });
// OR
await expect(authenticatedPage.locator('input[type="radio"]')).toBeVisible({ timeout: 10000 });
```

---

## Issue #2: Assessments Panel Not Expanding

### Root Cause
Assessments panel sections not visible after navigation to member hub.

### Problems
1. ❌ Panel may need to be clicked to expand
2. ❌ Sections load dynamically
3. ❌ No wait after clicking panel header

### Fixes Needed

#### Fix 2A: Add Panel Expansion
**Location**: `tests/specs/assessments.comprehensive.spec.ts` - beforeEach

Current:
```typescript
test.beforeEach(async ({ authenticatedPage }) => {
  memberSearch = new memberSearchPage(authenticatedPage);
  navigation = new navigationPage(authenticatedPage);
  assessments = new assessmentsPanel(authenticatedPage);

  await memberSearch.goto();
  await memberSearch.searchByMemberId(TEST_MEMBER.ID);
  await memberSearch.openMemberHub(TEST_MEMBER.FULL_ID);
  await navigation.openMemberSearch();
  // Missing panel expansion!
});
```

Add:
```typescript
test.beforeEach(async ({ authenticatedPage }) => {
  memberSearch = new memberSearchPage(authenticatedPage);
  navigation = new navigationPage(authenticatedPage);
  assessments = new assessmentsPanel(authenticatedPage);

  await memberSearch.goto();
  await memberSearch.searchByMemberId(TEST_MEMBER.ID);
  await memberSearch.openMemberHub(TEST_MEMBER.FULL_ID);
  await navigation.openMemberSearch();

  // ADD: Click to expand assessments panel
  await authenticatedPage.getByRole('button', { name: /assessments/i }).click();
  await waitForNetworkIdle(authenticatedPage);

  // OR: Scroll to assessments panel
  await authenticatedPage.locator('h3:has-text("Assessments")').scrollIntoViewIfNeeded();
});
```

#### Fix 2B: Update expandPanel Method
**Location**: `tests/pages/memberHub/assessments.ts`

Current expandPanel is empty (line 40-41):
```typescript
async expandPanel() {
}
```

Should be:
```typescript
async expandPanel() {
  await this.panelHeader.click();
  await this.page.waitForTimeout(1000); // Wait for sections to load
  // OR
  await this.page.waitForSelector('.assessment-section', { timeout: 5000 });
}
```

---

## Issue #3: Activities Task Completion Modal Blocking Click

### Root Cause
Modal dialog intercepting click on "Done" button.

**Error Message**:
```
<div role="dialog" class="modal fade save in">…</div> intercepts pointer events
```

### Problems
1. ❌ Modal not closing before attempting button click
2. ❌ Button may be disabled
3. ❌ Modal may need explicit dismissal

### Fixes Needed

#### Fix 3A: Close Modal Before Button Click
**Location**: `tests/specs/activities.comprehensive.spec.ts:469`

Around line 485-490, before clicking Done button:
```typescript
// Current:
await authenticatedPage.getByRole('button', { name: /save|submit|complete/i }).click();

// Should be:
// Wait for any open modals to close
await authenticatedPage.waitForSelector('.modal.in', { state: 'hidden', timeout: 5000 }).catch(() => {});

// OR: Explicitly close modal if open
const modal = authenticatedPage.locator('.modal.in');
if (await modal.count() > 0) {
  await authenticatedPage.keyboard.press('Escape');
  await authenticatedPage.waitForTimeout(500);
}

// Then click button
await authenticatedPage.getByRole('button', { name: /save|submit|complete/i }).click();
```

#### Fix 3B: Wait for Button to be Enabled
```typescript
// After closing modal, wait for button to be clickable
const doneButton = authenticatedPage.getByRole('button', { name: /done/i });
await doneButton.waitFor({ state: 'visible', timeout: 5000 });
await expect(doneButton).toBeEnabled({ timeout: 5000 });
await doneButton.click();
```

---

## Priority Order

### 🔴 **HIGH PRIORITY** - Fix These First
1. **Allergy radio button selector** - Affects ~14 tests
2. **Assessments panel expansion** - Affects ~4 tests

### 🟡 **MEDIUM PRIORITY**
3. **Activities modal handling** - Affects ~1 test

### 🟢 **LOW PRIORITY** - Can Skip
4. Accessibility heading structure - UI design issue
5. Accessibility link descriptive text - UI design issue

---

## Implementation Plan

### Step 1: Fix Allergy Tests
1. Update `allergies.ts` line 34 with better selector
2. Add wait for results in test specs after search click
3. Test with single allergy test
4. Verify all 14 tests pass

### Step 2: Fix Assessments Tests
1. Add panel click/expansion in beforeEach
2. Update expandPanel() method
3. Test with single assessment test
4. Verify all 4 tests pass

### Step 3: Fix Activities Modal
1. Add modal close logic before button click
2. Add button enabled check
3. Test single activities test
4. Verify test passes

---

## Expected Results After Fixes
- **Allergy tests**: 20/20 passing (100%)
- **Assessments tests**: 5/5 passing (100%)
- **Activities tests**: 29/29 passing (100%)
- **Overall improvement**: +19 more tests passing

## Total Expected Pass Rate
- **Before all fixes**: 87/1608 (5.4%)
- **After first 4 fixes**: ~1420/1608 (88.3%)
- **After these fixes**: ~1439/1608 (89.5%)
