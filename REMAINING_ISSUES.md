# Remaining Test Issues to Investigate

## Test Run Results (256 tests)
- **Stopped at**: 15 failures (as configured with --max-failures=15)
- **Passing**: ~70 tests visible before stopping
- **Overall**: Most of our fixes are working!

---

## ✅ VERIFIED FIXES (Working Great!)
1. ✅ smartWait fix - 22/24 accessibility tests pass (92%)
2. ✅ Member hub navigation - 28/29 activities tests pass (97%)
3. ✅ Search button fix - Allergies get past search button (no more ambiguous errors)
4. ✅ Admin navigation - Verified in earlier runs

---

## 🔍 REMAINING ISSUES TO INVESTIGATE

### 1. Allergy Workflow Issues (~14 failures)
**Status**: Search button fix worked, but workflow has other problems

**Common Pattern**:
```
Test: Add allergy with no notes @p2
Location: allergies.comprehensive.spec.ts:56

Error: TimeoutError: locator.check: Timeout 30000ms exceeded.
Waiting for: getByRole('radio', { name: 'Select (SNOMED)' })
```

**Investigation Needed**:
- [ ] After clicking search button, no results appear?
- [ ] Radio button selector incorrect?
- [ ] Need to wait for search results to load?
- [ ] Check actual HTML structure of search results

**Affected Tests**:
- Add allergy with no notes
- Add multiple allergies in succession
- Add allergy with very long notes
- Cancel allergy addition
- Search by term
- Search by code
- Add with identification date
- Several others

**Possible Fixes**:
1. Add wait for search results table/list to appear
2. Update radio button selector to match actual result structure
3. Add network idle wait after search

---

### 2. Assessments Panel Issues (~4 failures)
**Status**: Panel not expanding or sections not displaying

**Common Pattern**:
```
Test: Assessments panel opens @p1
Location: assessments.comprehensive.spec.ts:42

Issue: Assessments sections not visible
Expected: Panel to expand and show assessment sections
```

**Investigation Needed**:
- [ ] Does panel expand on click?
- [ ] Are sections loaded dynamically?
- [ ] Need wait after clicking panel?
- [ ] Check if panel click selector is correct

**Affected Tests**:
- Assessments panel opens
- Assessments sections display
- Expand Member Screening section
- Last completed date displays

**Possible Fixes**:
1. Add wait after clicking expand button
2. Verify panel click selector
3. Check if network request needed to load sections

---

### 3. Activities Task Completion (~1 failure)
**Status**: Modal blocking button click

**Pattern**:
```
Test: Task completion requires task type @p1
Location: activities.comprehensive.spec.ts:469

Error: TimeoutError: locator.click: Timeout 30000ms exceeded.
Note: Modal intercepts pointer events
```

**Investigation Needed**:
- [ ] Modal not closing properly?
- [ ] Need to close modal first?
- [ ] Button state not updating?

**Possible Fixes**:
1. Close modal before attempting task completion
2. Wait for modal to disappear
3. Check button disabled state

---

### 4. Accessibility Tests (~2 failures - LOW PRIORITY)
**Status**: Test expectations don't match UI

**Failures**:
1. **Page has proper heading structure** - No H1/H2/H3 tags found
2. **Links have descriptive text** - Some links missing aria-label or text

**Note**: These are UI/design issues, not test framework issues. Low priority.

---

## 📋 INVESTIGATION PLAN

### Priority 1: Allergy Workflow (Highest Impact)
1. Run single allergy test with --headed to see UI
2. Check what happens after clicking search button
3. Verify search results structure
4. Update selectors or add waits as needed

### Priority 2: Assessments Panel
1. Run single assessment test with --headed
2. Check if panel expands on click
3. Verify section loading behavior
4. Add appropriate waits

### Priority 3: Activities Task Completion
1. Check modal closing behavior
2. Verify button selector and state
3. Add modal dismissal if needed

---

## Next Steps
1. Start with allergy tests (biggest issue, most failures)
2. Debug one test at a time with --headed flag
3. Fix root cause and test other similar tests
4. Move to assessments, then activities
