// ============================================
// TYPE DEFINITIONS
// ============================================

/**
 * Member search criteria for searching members in the system
 */
export interface MemberSearchCriteria {
  client: string;
  memberId?: string;
  lastName?: string;
  firstName?: string;
  middleName?: string;
  dob?: string;
  phoneNumber?: string;
  email?: string;
  relationshipStatus?: string;
  gender?: string;
  maritalStatus?: string;
  race?: string;
  ssn?: string;
}

/**
 * Member details for creating a new member
 */
export interface MemberDetails {
  firstName: string;
  lastName: string;
  birthDate: string;
  gender: string;
  ssn: string;
  memberId: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  client: string;
}

/**
 * Provider search criteria
 */
export interface ProviderSearchCriteria {
  client?: string;
  npi?: string;
  otherIdNumber?: string;
  lastOrganizationName?: string;
  firstName?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  taxonomy?: string;
}

/**
 * User profile information
 */
export interface UserProfile {
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
}

/**
 * Medication details
 */
export interface MedicationDetails {
  name: string;
  strength?: string;
  quantity?: string;
  frequency?: string;
  notes?: string;
}

/**
 * Allergy details
 */
export interface AllergyDetails {
  searchTerm: string;
  notes?: string;
  identificationDate?: string;
}

/**
 * DME (Durable Medical Equipment) details
 */
export interface DMEDetails {
  hcpcsCode?: string;
  section?: string;
  category?: string;
  modifier?: string;
  units?: string;
  unitsQualifier?: string;
  frequency?: string;
  frequencyQualifier?: string;
  totalCost?: string;
}

/**
 * Case search criteria
 */
export interface CaseSearchCriteria {
  caseId?: string;
  requestId?: string;
  searchByRequestId?: boolean;
}
