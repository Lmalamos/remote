// ============================================
// TEST CONSTANTS
// ============================================

export const TEST_CREDENTIALS = {
  STAGE_USERNAME: 'autosmoke',
  STAGE_PASSWORD: 'Playwright!1',
  ADMIN_USERNAME: 'testaa',
  ADMIN_PASSWORD: 'Password1!',
};

export const TEST_MEMBER = {
  ID: '1234567890',
  FULL_ID: 'COMP1234567890',
  CLIENT: 'Comprehensive - Test Client',
  SSN: '1111',
  FULL_SSN: 'XXX-XX-1111',
  FIRST_NAME: 'Junior',
  LAST_NAME: 'Jabroni',
  DOB: '03312022',
  PHONE: '1111111111',
  EMAIL: 'kgillman@telligen.com',
  RELATIONSHIP: 'Self',
  GENDER: 'Male',
};

export const TEST_DATA_VALUES = {
  // Common test values
  TEST_FIRST_NAME: 'Test',
  TEST_LAST_NAME: 'Tester',
  TEST_DOB: '01012000',
  TEST_SSN: '111111111',
  TEST_MEMBER_ID: '111111111',

  // Address values
  TEST_ADDRESS: '100 Test Drive',
  TEST_CITY: 'Ames',
  TEST_STATE: 'IA',
  TEST_ZIP: '50014',

  // Provider values
  PROVIDER_CITY: 'Ames',
  PROVIDER_STATE: 'IA',
  PROVIDER_ZIP: '50014',

  // Gender options
  GENDER_MALE: '11',
  GENDER_FEMALE: '12',
};

export const TIMEOUTS = {
  SHORT: 1000,
  MEDIUM: 3000,
  LONG: 5000,
  EXTRA_LONG: 10000,
};

export const UI_TEXT = {
  // Error messages
  MEMBER_NOT_FOUND: 'Member Not Found.',
  NO_MATCHING_RECORDS: 'No matching records found',
  UNABLE_TO_SIGN_IN: 'Unable to sign in',
  ERRORS_FOUND: 'We found some errors. Please review the form and make corrections.',
  FIELD_REQUIRED: 'This field cannot be left blank',

  // Success messages
  SHOWING_ENTRIES: 'Showing 1 to 1 of 1 entries',

  // Search criteria messages
  SEARCH_CRITERIA_REQUIRED: 'You must provide search criteria in order to continue',
  MEMBER_ID_LENGTH_ERROR: 'Member Id must carry at least 3 characters',
  REQUIRED_FIELD_ERROR: 'You must provide one of: Member Id, First Name, Last Name, Date of Birth, Phone Number, Email, SSN',

  // Panel names
  ALLERGIES: 'Allergies',
  MEDICATIONS: 'Medications',
  IMMUNIZATIONS: 'Immunizations',
  CARE_MANAGEMENT: 'Care Management',
  ASSESSMENTS: 'Assessments',
  DME: 'Durable Medical Equipment',
};

export const SELECTOR_IDS = {
  // Login page selectors
  USERNAME_INPUT: '#input28',
  PASSWORD_INPUT: '#input36',

  // Client selection
  SELECT_CLIENT: 'select',
};

export const TABLE_SETTINGS = {
  SHOW_ALL_ENTRIES: '100',
  DEFAULT_ENTRIES: '10',
};

export const CLIENTS = {
  ALL: '0',
  COMPREHENSIVE_TEST: 'Comprehensive - Test Client',
  CLIENT_34: '34',
};
