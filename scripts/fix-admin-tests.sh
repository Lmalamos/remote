#!/bin/bash

# Fix all manage*.comprehensive.spec.ts files to use admin auth and open Configuration dropdown

FILES=(
  "tests/specs/manageAssessments.comprehensive.spec.ts"
  "tests/specs/manageBusinessRules.comprehensive.spec.ts"
  "tests/specs/manageCareManagement.comprehensive.spec.ts"
  "tests/specs/manageCaseActionRules.comprehensive.spec.ts"
  "tests/specs/manageCertifiedMail.comprehensive.spec.ts"
  "tests/specs/manageClientHours.comprehensive.spec.ts"
  "tests/specs/manageClientPreferences.comprehensive.spec.ts"
  "tests/specs/manageConfiguration.comprehensive.spec.ts"
  "tests/specs/manageConnect.comprehensive.spec.ts"
  "tests/specs/manageDeviceSync.comprehensive.spec.ts"
  "tests/specs/manageJobs.comprehensive.spec.ts"
  "tests/specs/manageLetterResources.comprehensive.spec.ts"
  "tests/specs/manageLetters.comprehensive.spec.ts"
  "tests/specs/manageMFA.comprehensive.spec.ts"
  "tests/specs/manageNextDayFlags.comprehensive.spec.ts"
  "tests/specs/manageOutcomeReasons.comprehensive.spec.ts"
  "tests/specs/manageRecyclingRules.comprehensive.spec.ts"
  "tests/specs/manageReviewTypes.comprehensive.spec.ts"
  "tests/specs/manageSLARules.comprehensive.spec.ts"
  "tests/specs/manageSystemMessages.comprehensive.spec.ts"
  "tests/specs/manageTimeslots.comprehensive.spec.ts"
  "tests/specs/manageUserPermissions.comprehensive.spec.ts"
  "tests/specs/manageWorkflow.comprehensive.spec.ts"
)

for file in "${FILES[@]}"; do
  echo "Processing $file..."

  # Replace authenticatedPage with adminAuthenticatedPage
  sed -i 's/authenticatedPage/adminAuthenticatedPage/g' "$file"

  # Add openManageDropdown() call after goToDashboard()
  # This looks for the pattern where we click a Manage link and adds the dropdown call before it
  sed -i '/await navigation.goToDashboard();/a\    await navigation.openManageDropdown();' "$file"

done

echo "Done! All manage test files updated."
